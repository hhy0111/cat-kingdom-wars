import type {
  BattleState,
  SkillDefinition,
  StageBaseDefinition,
  StageDefinition,
  SuperCatDefinition,
  UnitDefinition,
} from "./types";

type CreateBattleInput = {
  stageId: string;
  stages: StageDefinition[];
  units: UnitDefinition[];
  skills: SkillDefinition[];
  superCats: SuperCatDefinition[];
};

function indexById<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function createBase(base: StageBaseDefinition) {
  return {
    id: base.id,
    factionId: base.factionId,
    x: base.x,
    y: base.y,
    level: base.level,
    hp: base.hp,
    maxHp: base.hp,
    unitPool: [...base.unitPool],
    spawnAccumulator: 0,
    nextUnitIndex: 0,
  };
}

export function createBattle(input: CreateBattleInput): BattleState {
  const stage = input.stages.find((candidate) => candidate.id === input.stageId);

  if (!stage) {
    throw new Error(`Unknown stage: ${input.stageId}`);
  }

  return {
    stageId: stage.id,
    stageName: stage.name,
    mapSize: stage.mapSize,
    playerFactionId: stage.playerFactionId,
    enemyFactionId: stage.enemyFactionId,
    timeMs: 0,
    bases: [createBase(stage.playerBase), createBase(stage.enemyBase)],
    units: [],
    unitDefinitions: indexById(input.units),
    skillDefinitions: indexById(input.skills),
    superCatDefinitions: indexById(input.superCats),
    skillReadyAtMs: {},
    superCatReadyAtMs: {},
    events: [],
    result: null,
    nextUnitSerial: 1,
    nextEventSerial: 1,
    battleMoney: 0,
    battleMoneyEarned: 0,
    battleMoneyRemainder: 0,
    upgrades: {
      production: 0,
      attack: 0,
      health: 0,
    },
  };
}
