import { create } from "zustand";
import stages from "../data/stages";
import type { BattleResult } from "../game/types";

type GameScreen = "opening" | "loading" | "lobby" | "battle" | "result";

type LoadingPlan = {
  target: "lobby" | "battle";
  title: string;
  tip: string;
};

export type KingdomUpgradeKind = "training" | "armor" | "supply";
export type KingdomUpgrades = Record<KingdomUpgradeKind, number>;

export const allCharacterIds = [
  "cat_swordsman",
  "cat_archer",
  "cat_tank",
  "cat_mage",
  "cat_lancer",
  "cat_priest",
  "cat_ninja",
  "cat_bomb",
  "cat_engineer",
  "cat_frost",
  "cat_thunder_drummer",
  "cat_royal_cannon",
  "cat_star_knight",
] as const;

export type CharacterId = (typeof allCharacterIds)[number];

type ShopCost = {
  gold?: number;
  fish?: number;
};

export type StageReward = {
  gold: number;
  fish: number;
  replay: boolean;
};

export type CharacterShopItem = {
  id: CharacterId;
  title: string;
  roleLabel: string;
  description: string;
  cost: ShopCost;
  requiredClearedStageNumber: number;
  unlockLabel: string;
};

export type FutureCharacterIdea = {
  title: string;
  unlockLabel: string;
  description: string;
  artClass: string;
};

export type DailyMissionStats = {
  battleParticipations: number;
  skillUses: number;
  stageClears: number;
  dailyRewardClaimed: boolean;
  lastDailyRewardDate: string | null;
};

export type SavedProgress = {
  clearedStageIds: string[];
  gold: number;
  fish: number;
  kingdomUpgrades: KingdomUpgrades;
  ownedCharacterIds: CharacterId[];
  dailyMissionStats: DailyMissionStats;
};

export type PurchaseResult = {
  ok: boolean;
  cost: ShopCost;
  reason?: "not_enough_gold" | "not_enough_fish" | "already_owned" | "locked" | "unknown_item";
};

export type RewardClaimResult = {
  ok: boolean;
  reward: ShopCost;
  reason?: "already_claimed" | "no_reward";
};

type GameStore = {
  screen: GameScreen;
  selectedStageId: string;
  lastResult: BattleResult | null;
  lastBattleRewards: StageReward | null;
  lastBattleRewardBoosted: boolean;
  loadingPlan: LoadingPlan | null;
  progress: SavedProgress;
  enterLobby: () => void;
  startStage: (stageId: string) => void;
  purchaseKingdomUpgrade: (kind: KingdomUpgradeKind) => PurchaseResult;
  purchaseCharacter: (characterId: CharacterId) => PurchaseResult;
  claimDailyReward: () => RewardClaimResult;
  claimDoubleBattleReward: () => RewardClaimResult;
  recordSkillUse: () => void;
  completeLoading: () => void;
  finishBattle: (result: BattleResult) => void;
  retryStage: () => void;
  syncHashRoute: () => void;
};

const STORAGE_KEY = "cat-kingdom-wars-progress";

export const starterCharacterIds: CharacterId[] = ["cat_swordsman", "cat_archer"];

export const kingdomUpgradeDefinitions: Record<
  KingdomUpgradeKind,
  { title: string; description: string; battleUpgradeKey: "production" | "attack" | "health"; bonusLabel: string }
> = {
  supply: {
    title: "보급 훈련",
    description: "시작 생산 속도 증가",
    battleUpgradeKey: "production",
    bonusLabel: "생산 시작 Lv",
  },
  training: {
    title: "검술 훈련",
    description: "기본 공격력 증가",
    battleUpgradeKey: "attack",
    bonusLabel: "공격 시작 Lv",
  },
  armor: {
    title: "방어구 정비",
    description: "시작 체력 증가",
    battleUpgradeKey: "health",
    bonusLabel: "체력 시작 Lv",
  },
};

export const characterShopItems: CharacterShopItem[] = [
  {
    id: "cat_tank",
    title: "방패냥",
    roleLabel: "전방 탱커",
    description: "앞줄을 오래 버텨서 궁수와 마법냥이 공격할 시간을 벌어줍니다.",
    cost: { gold: 650 },
    requiredClearedStageNumber: 5,
    unlockLabel: "5전선 클리어 후 구매",
  },
  {
    id: "cat_mage",
    title: "마법냥",
    roleLabel: "범위 공격",
    description: "뭉친 적을 한 번에 깎습니다. 중반 이후 방패 적을 상대할 때 중요합니다.",
    cost: { gold: 950, fish: 35 },
    requiredClearedStageNumber: 12,
    unlockLabel: "12전선 클리어 후 구매",
  },
  {
    id: "cat_lancer",
    title: "창기병냥",
    roleLabel: "돌파 근접",
    description: "검냥이보다 더 멀리 찌르며 전열을 빠르게 밀어냅니다.",
    cost: { gold: 1180, fish: 25 },
    requiredClearedStageNumber: 18,
    unlockLabel: "18전선 클리어 후 구매",
  },
  {
    id: "cat_priest",
    title: "사제냥",
    roleLabel: "후방 지원",
    description: "안정적인 후방 공격으로 긴 전투에서 라인을 지탱합니다.",
    cost: { gold: 1400, fish: 45 },
    requiredClearedStageNumber: 24,
    unlockLabel: "24전선 클리어 후 구매",
  },
  {
    id: "cat_ninja",
    title: "닌자냥",
    roleLabel: "고속 암살",
    description: "이동이 빠르고 약한 적을 빠르게 정리해 전선을 흔듭니다.",
    cost: { gold: 1800, fish: 55 },
    requiredClearedStageNumber: 32,
    unlockLabel: "32전선 클리어 후 구매",
  },
  {
    id: "cat_bomb",
    title: "폭탄냥",
    roleLabel: "근거리 범위",
    description: "뭉친 적에게 큰 피해를 주지만 전방 보호가 필요합니다.",
    cost: { gold: 2250, fish: 70 },
    requiredClearedStageNumber: 40,
    unlockLabel: "40전선 클리어 후 구매",
  },
  {
    id: "cat_engineer",
    title: "공병냥",
    roleLabel: "중거리 압박",
    description: "안정적인 중거리 화력으로 방패 적을 꾸준히 깎습니다.",
    cost: { gold: 3200, fish: 95 },
    requiredClearedStageNumber: 54,
    unlockLabel: "54전선 클리어 후 구매",
  },
  {
    id: "cat_frost",
    title: "서리냥",
    roleLabel: "광역 제어",
    description: "넓은 범위를 천천히 깎아 후반 대규모 적을 상대합니다.",
    cost: { gold: 4300, fish: 130 },
    requiredClearedStageNumber: 70,
    unlockLabel: "70전선 클리어 후 구매",
  },
  {
    id: "cat_thunder_drummer",
    title: "천둥 북냥",
    roleLabel: "광역 화력",
    description: "느리지만 강한 범위 타격으로 중후반 전선을 밀어냅니다.",
    cost: { gold: 6200, fish: 190 },
    requiredClearedStageNumber: 90,
    unlockLabel: "90전선 클리어 후 구매",
  },
  {
    id: "cat_royal_cannon",
    title: "왕실 포병냥",
    roleLabel: "초장거리 포격",
    description: "전방이 버티는 동안 뒤에서 큰 피해를 누적합니다.",
    cost: { gold: 9000, fish: 260 },
    requiredClearedStageNumber: 120,
    unlockLabel: "120전선 클리어 후 구매",
  },
  {
    id: "cat_star_knight",
    title: "별빛 기사냥",
    roleLabel: "최상급 돌파",
    description: "높은 체력과 공격력으로 후반 점령전을 빠르게 마무리합니다.",
    cost: { gold: 14000, fish: 420 },
    requiredClearedStageNumber: 160,
    unlockLabel: "160전선 클리어 후 구매",
  },
];

export const premiumCharacterIdeas: FutureCharacterIdea[] = [
  {
    title: "햇살 성가냥",
    unlockLabel: "향후 일일 미션 캐릭터",
    description: "치유와 버프를 담당할 지원형 후보입니다.",
    artClass: "future-priest",
  },
  {
    title: "유성 투창냥",
    unlockLabel: "향후 지역 보상 캐릭터",
    description: "긴 사거리 찌르기로 탱커 뒤 적을 견제합니다.",
    artClass: "future-lancer",
  },
  {
    title: "화약 장인냥",
    unlockLabel: "향후 상점 확장 캐릭터",
    description: "폭발 범위와 쿨타임을 다루는 특수 화력 후보입니다.",
    artClass: "future-bomb",
  },
  {
    title: "그림자 척후냥",
    unlockLabel: "향후 도전 과제 캐릭터",
    description: "빠른 이동과 후방 교란에 특화된 암살형 후보입니다.",
    artClass: "future-ninja",
  },
  {
    title: "왕국 기술냥",
    unlockLabel: "향후 연구소 연계 캐릭터",
    description: "전투머니 생산과 포탑 보조를 담당할 후보입니다.",
    artClass: "future-engineer",
  },
  {
    title: "빙결 술사냥",
    unlockLabel: "향후 시즌 전선 캐릭터",
    description: "적 이동을 늦추는 제어형 후보입니다.",
    artClass: "future-frost",
  },
  {
    title: "번개 지휘냥",
    unlockLabel: "향후 패스 보상 캐릭터",
    description: "광역 연쇄 공격으로 큰 무리를 정리하는 후보입니다.",
    artClass: "future-drummer",
  },
  {
    title: "황금 포수냥",
    unlockLabel: "향후 후반 상점 캐릭터",
    description: "느리지만 강력한 장거리 공성 화력 후보입니다.",
    artClass: "future-cannon",
  },
  {
    title: "별자리 수호냥",
    unlockLabel: "향후 보스 지역 캐릭터",
    description: "지역 보스전 전용 고급 전열 후보입니다.",
    artClass: "future-star",
  },
  {
    title: "초승달 도적냥",
    unlockLabel: "향후 이벤트 캐릭터",
    description: "빠른 재출전과 보상 보너스를 가진 후보입니다.",
    artClass: "future-ninja",
  },
  {
    title: "푸른 깃발냥",
    unlockLabel: "향후 길드형 콘텐츠",
    description: "아군 공격 속도를 올리는 지휘형 후보입니다.",
    artClass: "future-drummer",
  },
  {
    title: "진주 치료냥",
    unlockLabel: "향후 출석 보상",
    description: "매일 접속 보상과 연결할 회복형 후보입니다.",
    artClass: "future-priest",
  },
  {
    title: "모래 폭파냥",
    unlockLabel: "향후 사막 지역 보상",
    description: "방어력 높은 적을 녹이는 폭파형 후보입니다.",
    artClass: "future-bomb",
  },
  {
    title: "왕실 수리냥",
    unlockLabel: "향후 기지 강화 캐릭터",
    description: "본진 체력과 전투 중 회복을 보조할 후보입니다.",
    artClass: "future-engineer",
  },
];

const defaultProgress: SavedProgress = {
  clearedStageIds: [],
  gold: 0,
  fish: 0,
  kingdomUpgrades: {
    training: 0,
    armor: 0,
    supply: 0,
  },
  ownedCharacterIds: starterCharacterIds,
  dailyMissionStats: {
    battleParticipations: 0,
    skillUses: 0,
    stageClears: 0,
    dailyRewardClaimed: false,
    lastDailyRewardDate: null,
  },
};

export function getKingdomUpgradeCost(kind: KingdomUpgradeKind, level: number): ShopCost {
  const baseCosts: Record<KingdomUpgradeKind, number> = {
    supply: 120,
    training: 150,
    armor: 140,
  };
  return { gold: Math.ceil((baseCosts[kind] * 1.72 ** level) / 10) * 10 };
}

export function formatCost(cost: ShopCost): string {
  const parts = [];
  if (cost.gold) {
    parts.push(`Gold ${cost.gold}`);
  }
  if (cost.fish) {
    parts.push(`Fish ${cost.fish}`);
  }
  return parts.length > 0 ? parts.join(" / ") : "무료";
}

export function getStageClearReward(baseReward: { gold: number; fish: number }, alreadyCleared: boolean): StageReward {
  if (!alreadyCleared) {
    return { ...baseReward, replay: false };
  }

  return {
    gold: Math.max(1, Math.floor(baseReward.gold * 0.5)),
    fish: Math.max(1, Math.floor(baseReward.fish * 0.5)),
    replay: true,
  };
}

export function getUnlockedStageIndex(progress: SavedProgress): number {
  const cleared = new Set(progress.clearedStageIds);
  const firstUnclearedIndex = stages.findIndex((stage) => !cleared.has(stage.id));

  if (firstUnclearedIndex === -1) {
    return stages.length - 1;
  }

  return Math.max(0, firstUnclearedIndex);
}

export function isStageUnlocked(stageId: string, progress: SavedProgress): boolean {
  const stageIndex = stages.findIndex((stage) => stage.id === stageId);
  return stageIndex >= 0 && stageIndex <= getUnlockedStageIndex(progress);
}

export function getNextPlayableStage(progress: SavedProgress) {
  const normalized = normalizeProgress(progress);
  const nextIndex = getUnlockedStageIndex(normalized);
  return stages[nextIndex] ?? stages[0];
}

export function getHighestClearedStageNumber(progress: SavedProgress): number {
  const cleared = new Set(progress.clearedStageIds);
  let highest = 0;

  for (let index = 0; index < stages.length; index += 1) {
    if (!cleared.has(stages[index].id)) {
      break;
    }
    highest = index + 1;
  }

  return highest;
}

export function getAvailablePlayerUnitIds(progress: SavedProgress): CharacterId[] {
  const normalized = normalizeProgress(progress);
  return Array.from(new Set([...starterCharacterIds, ...normalized.ownedCharacterIds]));
}

export function getBattlePlayerUnitPool(
  stageUnitPool: readonly string[],
  ownedCharacterIds: readonly CharacterId[],
  stageNumber: number,
): CharacterId[] {
  const ownedSet = new Set<CharacterId>([...starterCharacterIds, ...ownedCharacterIds]);
  const stageOwnedPool = stageUnitPool.filter(isCharacterId).filter((unitId) => ownedSet.has(unitId));
  const extraOwnedPool = allCharacterIds.filter((unitId) => ownedSet.has(unitId) && !stageOwnedPool.includes(unitId));
  const roster = [...stageOwnedPool, ...extraOwnedPool].slice(0, getBattleRosterSlotCount(stageNumber));

  return roster.length > 0 ? roster : ["cat_swordsman"];
}

function getBattleRosterSlotCount(stageNumber: number): number {
  if (stageNumber >= 121) {
    return 6;
  }
  if (stageNumber >= 61) {
    return 5;
  }
  if (stageNumber >= 21) {
    return 4;
  }
  if (stageNumber >= 11) {
    return 3;
  }
  return 2;
}

function isCharacterId(unitId: string): unitId is CharacterId {
  return allCharacterIds.includes(unitId as CharacterId);
}

function loadProgress(): SavedProgress {
  if (typeof localStorage === "undefined") {
    return normalizeProgress(defaultProgress);
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return normalizeProgress(defaultProgress);
  }

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return normalizeProgress(defaultProgress);
  }
}

function saveProgress(progress: SavedProgress): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: getInitialScreen(),
  selectedStageId: "stage_001",
  lastResult: null,
  lastBattleRewards: null,
  lastBattleRewardBoosted: false,
  loadingPlan: null,
  progress: loadProgress(),

  enterLobby: () => {
    setHash("loading");
    set({
      screen: "loading",
      loadingPlan: {
        target: "lobby",
        title: "냥이 왕국으로 이동 중",
        tip: "로비에서 다음 전선을 고르고 전투 보상 Gold로 상점 강화를 진행하세요.",
      },
    });
  },

  startStage: (stageId: string) => {
    const progress = normalizeProgress(get().progress);
    const stage = stages.find((candidate) => candidate.id === stageId);

    if (!stage || !isStageUnlocked(stageId, progress)) {
      return;
    }

    setHash("loading");
    set({
      screen: "loading",
      selectedStageId: stageId,
      lastResult: null,
      lastBattleRewards: null,
      lastBattleRewardBoosted: false,
      loadingPlan: {
        target: "battle",
        title: `${stage.name} 준비 중`,
        tip: "전투 중 강화는 전투머니로만 구매하며, 전투가 끝나면 초기화됩니다.",
      },
    });
  },

  purchaseKingdomUpgrade: (kind: KingdomUpgradeKind) => {
    const progress = normalizeProgress(get().progress);
    const level = progress.kingdomUpgrades[kind];
    const cost = getKingdomUpgradeCost(kind, level);

    if ((cost.gold ?? 0) > progress.gold) {
      return { ok: false, cost, reason: "not_enough_gold" };
    }

    const nextProgress = {
      ...progress,
      gold: progress.gold - (cost.gold ?? 0),
      kingdomUpgrades: {
        ...progress.kingdomUpgrades,
        [kind]: level + 1,
      },
    };
    saveProgress(nextProgress);
    set({ progress: nextProgress });
    return { ok: true, cost };
  },

  purchaseCharacter: (characterId: CharacterId) => {
    const progress = normalizeProgress(get().progress);
    const item = characterShopItems.find((candidate) => candidate.id === characterId);

    if (!item) {
      return { ok: false, cost: {}, reason: "unknown_item" };
    }

    if (progress.ownedCharacterIds.includes(characterId)) {
      return { ok: false, cost: item.cost, reason: "already_owned" };
    }

    if (getHighestClearedStageNumber(progress) < item.requiredClearedStageNumber) {
      return { ok: false, cost: item.cost, reason: "locked" };
    }

    if ((item.cost.gold ?? 0) > progress.gold) {
      return { ok: false, cost: item.cost, reason: "not_enough_gold" };
    }

    if ((item.cost.fish ?? 0) > progress.fish) {
      return { ok: false, cost: item.cost, reason: "not_enough_fish" };
    }

    const nextProgress = {
      ...progress,
      gold: progress.gold - (item.cost.gold ?? 0),
      fish: progress.fish - (item.cost.fish ?? 0),
      ownedCharacterIds: Array.from(new Set([...progress.ownedCharacterIds, characterId])),
    };
    saveProgress(nextProgress);
    set({ progress: nextProgress });
    return { ok: true, cost: item.cost };
  },

  claimDailyReward: () => {
    const progress = normalizeProgress(get().progress);
    const reward = { gold: 120, fish: 8 };
    const today = getLocalDateKey();

    if (progress.dailyMissionStats.dailyRewardClaimed) {
      return { ok: false, reward, reason: "already_claimed" };
    }

    const nextProgress = {
      ...progress,
      gold: progress.gold + reward.gold,
      fish: progress.fish + reward.fish,
      dailyMissionStats: {
        ...progress.dailyMissionStats,
        dailyRewardClaimed: true,
        lastDailyRewardDate: today,
      },
    };
    saveProgress(nextProgress);
    set({ progress: nextProgress });
    return { ok: true, reward };
  },

  claimDoubleBattleReward: () => {
    const current = get();

    if (current.lastResult?.winnerFactionId !== "cat_kingdom" || !current.lastBattleRewards) {
      return { ok: false, reward: {}, reason: "no_reward" };
    }

    if (current.lastBattleRewardBoosted) {
      return { ok: false, reward: current.lastBattleRewards, reason: "already_claimed" };
    }

    const progress = normalizeProgress(current.progress);
    const reward = {
      gold: current.lastBattleRewards.gold,
      fish: current.lastBattleRewards.fish,
    };
    const nextProgress = {
      ...progress,
      gold: progress.gold + reward.gold,
      fish: progress.fish + reward.fish,
    };
    saveProgress(nextProgress);
    set({ progress: nextProgress, lastBattleRewardBoosted: true });
    return { ok: true, reward };
  },

  recordSkillUse: () => {
    const progress = normalizeProgress(get().progress);
    const nextProgress = {
      ...progress,
      dailyMissionStats: {
        ...progress.dailyMissionStats,
        skillUses: progress.dailyMissionStats.skillUses + 1,
      },
    };
    saveProgress(nextProgress);
    set({ progress: nextProgress });
  },

  completeLoading: () => {
    const plan = get().loadingPlan;
    const target = plan?.target ?? "lobby";
    setHash(target);
    set({ screen: target, loadingPlan: null });
  },

  finishBattle: (result: BattleResult) => {
    const current = get();
    const stage = stages.find((candidate) => candidate.id === current.selectedStageId);
    const isWin = result.winnerFactionId === "cat_kingdom";
    const progress = normalizeProgress(current.progress);
    let lastBattleRewards: StageReward = { gold: 0, fish: 0, replay: false };
    progress.dailyMissionStats = {
      ...progress.dailyMissionStats,
      battleParticipations: progress.dailyMissionStats.battleParticipations + 1,
    };

    if (isWin && stage) {
      const alreadyCleared = progress.clearedStageIds.includes(stage.id);
      lastBattleRewards = getStageClearReward(stage.rewards, alreadyCleared);
      progress.gold += lastBattleRewards.gold;
      progress.fish += lastBattleRewards.fish;
      progress.clearedStageIds = Array.from(new Set([...progress.clearedStageIds, stage.id]));
      progress.dailyMissionStats = {
        ...progress.dailyMissionStats,
        stageClears: progress.dailyMissionStats.stageClears + 1,
      };
    }
    saveProgress(progress);

    setHash("result");
    set({ screen: "result", lastResult: result, lastBattleRewards, lastBattleRewardBoosted: false, progress });
  },

  retryStage: () => {
    const current = get();
    const progress = normalizeProgress(current.progress);
    const stage = stages.find((candidate) => candidate.id === current.selectedStageId);

    if (!stage || !isStageUnlocked(stage.id, progress)) {
      return;
    }

    setHash("loading");
    set({
      screen: "loading",
      lastResult: null,
      lastBattleRewards: null,
      lastBattleRewardBoosted: false,
      loadingPlan: {
        target: "battle",
        title: `${stage.name} 재정비 중`,
        tip: "막히는 전선은 상점에서 방패냥, 마법냥, 왕국 강화를 준비한 뒤 다시 도전하세요.",
      },
    });
  },

  syncHashRoute: () => {
    const route = getHashRoute();
    if (!route) {
      return;
    }
    if (route === "battle") {
      const progress = normalizeProgress(get().progress);
      const selectedStageId = isStageUnlocked(get().selectedStageId, progress)
        ? get().selectedStageId
        : getNextPlayableStage(progress).id;
      set({ screen: "battle", selectedStageId, loadingPlan: null, lastResult: null, lastBattleRewardBoosted: false });
      return;
    }
    if (route === "lobby") {
      set({ screen: "lobby", loadingPlan: null });
      return;
    }
    if (route === "opening") {
      set({ screen: "opening", loadingPlan: null, lastResult: null, lastBattleRewardBoosted: false });
    }
  },
}));

function normalizeProgress(progress: Partial<SavedProgress> | null | undefined): SavedProgress {
  const rawOwnedIds = progress?.ownedCharacterIds ?? defaultProgress.ownedCharacterIds;
  const ownedCharacterIds = Array.from(
    new Set(
      rawOwnedIds.filter((id): id is CharacterId =>
        allCharacterIds.includes(id as CharacterId),
      ),
    ),
  );
  const today = getLocalDateKey();
  const rawDailyMissionStats = {
    ...defaultProgress.dailyMissionStats,
    ...(progress?.dailyMissionStats ?? {}),
  };
  const lastDailyRewardDate =
    typeof rawDailyMissionStats.lastDailyRewardDate === "string" ? rawDailyMissionStats.lastDailyRewardDate : null;
  const dailyRewardClaimed = lastDailyRewardDate === today ? rawDailyMissionStats.dailyRewardClaimed : false;

  return {
    ...defaultProgress,
    ...(progress ?? {}),
    clearedStageIds: [...(progress?.clearedStageIds ?? defaultProgress.clearedStageIds)],
    kingdomUpgrades: {
      ...defaultProgress.kingdomUpgrades,
      ...(progress?.kingdomUpgrades ?? {}),
    },
    ownedCharacterIds: Array.from(new Set([...starterCharacterIds, ...ownedCharacterIds])),
    dailyMissionStats: {
      ...rawDailyMissionStats,
      dailyRewardClaimed,
      lastDailyRewardDate,
    },
  };
}

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitialScreen(): GameScreen {
  if (typeof window === "undefined") {
    return "opening";
  }

  return getHashRoute() ?? "opening";
}

function setHash(screen: GameScreen): void {
  if (typeof window === "undefined") {
    return;
  }
  window.history.replaceState(null, "", `#${screen}`);
}

function getHashRoute(): "opening" | "lobby" | "battle" | null {
  if (typeof window === "undefined") {
    return null;
  }

  const route = window.location.hash.replace("#", "");
  if (route === "opening" || route === "lobby" || route === "battle") {
    return route;
  }
  return null;
}
