import type { StageDefinition } from "../game/types";

type RegionPlan = {
  title: string;
  nodes: string[];
};

const regions: RegionPlan[] = [
  {
    title: "새벽 국경",
    nodes: ["초소", "언덕", "숲길", "강가", "감시탑", "고개", "마을 입구", "돌다리", "야영지", "성문"],
  },
  {
    title: "황금 들판",
    nodes: ["밀밭", "풍차", "농장", "물길", "곡물 창고", "햇살길", "벌판", "수확지", "상단길", "곡창"],
  },
  {
    title: "마법 숲길",
    nodes: ["이끼길", "버섯숲", "요정 샘", "나무다리", "별빛길", "고목", "룬 제단", "안개숲", "수정굴", "숲 심장"],
  },
  {
    title: "불꽃 협곡",
    nodes: ["화산길", "붉은 절벽", "용암다리", "연기굴", "재 언덕", "불씨 초소", "갈라진 길", "열기 계곡", "폭발암", "협곡 끝"],
  },
  {
    title: "멍멍 전초지",
    nodes: ["외곽", "감시소", "훈련장", "보급로", "깃발 언덕", "병영", "철문", "포대", "장교 막사", "전초기지"],
  },
  {
    title: "수정 해안",
    nodes: ["부두", "등대", "조개길", "물빛 다리", "파도 절벽", "해적 창고", "진주굴", "물안개", "파란 요새", "해안 성채"],
  },
  {
    title: "폭풍 고원",
    nodes: ["바람길", "구름다리", "번개봉", "비탈", "매의 둥지", "폭풍문", "회오리길", "천둥대", "고원 성벽", "폭풍 정상"],
  },
  {
    title: "달빛 사막",
    nodes: ["모래길", "오아시스", "달 그림자", "유적문", "낙타길", "별 모래", "고대 탑", "사막 성벽", "신기루", "달빛 궁전"],
  },
  {
    title: "그림자 성역",
    nodes: ["검은 숲", "무너진 길", "저주 우물", "어둠문", "망령 언덕", "감옥탑", "검은 다리", "침묵 회랑", "암흑 제단", "그림자 성문"],
  },
  {
    title: "황제 요새",
    nodes: ["철문", "외성", "왕실 정원", "기사단길", "중앙 계단", "황금 회랑", "제국 병영", "황제 탑", "최후 성문", "황제 알현실"],
  },
];

export const STAGES_PER_REGION = 20;
export const TOTAL_STAGE_COUNT = regions.length * STAGES_PER_REGION;

export const stageDefinitions: StageDefinition[] = Array.from({ length: TOTAL_STAGE_COUNT }, (_, index) => {
  const stageNumber = index + 1;
  const regionIndex = Math.floor(index / STAGES_PER_REGION);
  const regionStage = (index % STAGES_PER_REGION) + 1;
  const region = regions[regionIndex];
  const node = region.nodes[(regionStage - 1) % region.nodes.length];
  const isMidBoss = regionStage === 10;
  const isBoss = regionStage === 20;
  const chapterDifficulty = regionIndex * 0.46;
  const stageDifficulty = index * 0.024;
  const enemyHpBase = 860 + Math.round(index * 42 + regionIndex * 230);
  const playerHpBase = 900 + Math.round(index * 8 + regionIndex * 36);
  const enemyHp = Math.round(enemyHpBase * (isBoss ? 1.38 : isMidBoss ? 1.18 : 1));
  const playerHp = Math.round(playerHpBase);
  const rewardScale = 1 + chapterDifficulty + stageDifficulty;

  return {
    id: `stage_${String(stageNumber).padStart(3, "0")}`,
    name: `${region.title} ${node}`,
    mapSize: 1000,
    playerFactionId: "cat_kingdom",
    enemyFactionId: "dog_empire",
    playerBase: {
      id: "base_player",
      factionId: "cat_kingdom",
      x: 180,
      y: 820,
      level: getPlayerBaseLevel(stageNumber),
      hp: playerHp,
      unitPool: getPlayerUnitPool(stageNumber),
    },
    enemyBase: {
      id: "base_enemy",
      factionId: "dog_empire",
      x: 820,
      y: 180,
      level: getEnemyBaseLevel(stageNumber),
      hp: enemyHp,
      unitPool: getEnemyUnitPool(stageNumber, isMidBoss || isBoss),
    },
    rewards: {
      gold: roundToTen(110 + stageNumber * 8 * rewardScale + (isBoss ? 120 : isMidBoss ? 50 : 0)),
      fish: Math.round(7 + regionIndex * 2 + regionStage * 0.55 + (isBoss ? 5 : isMidBoss ? 2 : 0)),
    },
  };
});

export default stageDefinitions;

function getPlayerBaseLevel(stageNumber: number): number {
  return Math.min(3, 1 + Math.floor((stageNumber - 1) / 90));
}

function getEnemyBaseLevel(stageNumber: number): number {
  return Math.min(4, 1 + Math.floor((stageNumber - 1) / 32));
}

function getPlayerUnitPool(stageNumber: number): string[] {
  if (stageNumber >= 31) {
    return ["cat_swordsman", "cat_archer", "cat_tank", "cat_mage"];
  }
  if (stageNumber >= 11) {
    return ["cat_swordsman", "cat_archer", "cat_tank"];
  }
  return ["cat_swordsman", "cat_archer"];
}

function getEnemyUnitPool(stageNumber: number, isBossStage: boolean): string[] {
  if (stageNumber >= 181) {
    return isBossStage
      ? ["dog_guard", "dog_siege_brute", "dog_captain", "dog_mage"]
      : ["dog_soldier", "dog_raider", "dog_guard", "dog_mage", "dog_siege_brute"];
  }
  if (stageNumber >= 141) {
    return isBossStage
      ? ["dog_guard", "dog_captain", "dog_mage", "dog_captain"]
      : ["dog_soldier", "dog_raider", "dog_guard", "dog_captain", "dog_mage"];
  }
  if (stageNumber >= 121) {
    return isBossStage
      ? ["dog_guard", "dog_captain", "dog_raider", "dog_captain"]
      : ["dog_soldier", "dog_raider", "dog_guard", "dog_captain"];
  }
  if (stageNumber >= 61) {
    return isBossStage
      ? ["dog_guard", "dog_captain", "dog_raider"]
      : ["dog_soldier", "dog_raider", "dog_guard"];
  }
  if (stageNumber >= 21) {
    return ["dog_soldier", "dog_raider", "dog_guard"];
  }
  if (stageNumber >= 11) {
    return ["dog_soldier", "dog_raider"];
  }
  return ["dog_soldier"];
}

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}
