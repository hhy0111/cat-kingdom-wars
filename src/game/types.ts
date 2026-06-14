export type FactionId = "cat_kingdom" | "dog_empire" | string;

export type UnitRole = "melee" | "ranged" | "aoe" | "tank";
export type UpgradeKind = "production" | "attack" | "health";

export type Vec2 = {
  x: number;
  y: number;
};

export type UnitStats = {
  hp: number;
  attack: number;
  attackRange: number;
  attackSpeed: number;
  moveSpeed: number;
  defense: number;
  aoeRadius: number;
};

export type UnitDefinition = {
  id: string;
  name: string;
  role: UnitRole;
  factionId: FactionId;
  spriteKey: string;
  animationSetKey: string;
  stats: UnitStats;
};

export type StageBaseDefinition = {
  id: string;
  factionId: FactionId;
  x: number;
  y: number;
  level: number;
  hp: number;
  unitPool: string[];
};

export type StageDefinition = {
  id: string;
  name: string;
  mapSize: number;
  playerFactionId: FactionId;
  enemyFactionId: FactionId;
  playerBase: StageBaseDefinition;
  enemyBase: StageBaseDefinition;
  rewards: {
    gold: number;
    fish: number;
  };
};

export type SkillDefinition = {
  id: string;
  name: string;
  type: "damage" | "heal";
  cooldown: number;
  targetType: "area";
  effectType: "damage" | "heal" | "damageBase";
  value: number;
  duration: number;
  range: number;
  description: string;
  iconKey: string;
  effectKey: string;
};

export type SuperCatDefinition = {
  id: string;
  name: string;
  factionId: FactionId;
  spriteKey: string;
  animationSetKey: string;
  cooldown: number;
  duration: number;
  spawnEffectKey: string;
  stats: UnitStats;
};

export type RuntimeBase = {
  id: string;
  factionId: FactionId;
  x: number;
  y: number;
  level: number;
  hp: number;
  maxHp: number;
  unitPool: string[];
  spawnAccumulator: number;
  nextUnitIndex: number;
};

export type RuntimeUnit = UnitStats & {
  id: string;
  unitKey: string;
  name: string;
  role: UnitRole;
  factionId: FactionId;
  spriteKey: string;
  animationSetKey: string;
  x: number;
  y: number;
  maxHp: number;
  state: "idle" | "walk" | "attack" | "hit" | "death";
  attackCooldownMs: number;
  facing: 1 | -1;
  laneOffset: number;
  expiresAtMs?: number;
  hitFlashMs: number;
};

export type BattleEvent = {
  id: string;
  effectId: string;
  x: number;
  y: number;
  createdAtMs: number;
  durationMs: number;
  radius: number;
  color?: string;
  value?: number;
  label?: string;
  kind: "skill" | "hit" | "summon" | "death" | "base" | "money" | "upgrade" | "warning";
};

export type BattleResult = {
  winnerFactionId: FactionId;
  reason: "base_destroyed";
};

export type BattleState = {
  stageId: string;
  stageName: string;
  mapSize: number;
  playerFactionId: FactionId;
  enemyFactionId: FactionId;
  timeMs: number;
  bases: RuntimeBase[];
  units: RuntimeUnit[];
  unitDefinitions: Record<string, UnitDefinition>;
  skillDefinitions: Record<string, SkillDefinition>;
  superCatDefinitions: Record<string, SuperCatDefinition>;
  skillReadyAtMs: Record<string, number>;
  superCatReadyAtMs: Record<string, number>;
  events: BattleEvent[];
  result: BattleResult | null;
  nextUnitSerial: number;
  nextEventSerial: number;
  battleMoney: number;
  battleMoneyEarned: number;
  battleMoneyRemainder: number;
  upgrades: Record<UpgradeKind, number>;
};

export type BattleSnapshot = Pick<
  BattleState,
  | "stageId"
  | "stageName"
  | "mapSize"
  | "playerFactionId"
  | "enemyFactionId"
  | "timeMs"
  | "bases"
  | "units"
  | "events"
  | "result"
  | "battleMoney"
  | "battleMoneyEarned"
  | "skillReadyAtMs"
  | "superCatReadyAtMs"
  | "upgrades"
> & {
  upgradeCosts: Record<UpgradeKind, number>;
};

export type CastResult = {
  ok: boolean;
  reason?: "unknown_skill" | "cooldown" | "battle_finished" | "unknown_super_cat";
};

export type UpgradeResult = {
  ok: boolean;
  cost: number;
  reason?: "battle_finished" | "not_enough_money";
};

export type EffectDefinition = {
  id: string;
  type: "sprite" | "particle" | "screenShake" | "flash" | "trail";
  durationMs: number;
  blendMode: string;
  scale: number;
  colorTint: string;
  attachTo: "world" | "unit" | "base" | "screen";
  soundKey: string;
};

export type AnimationDefinition = {
  id: string;
  states: RuntimeUnit["state"][];
  frameMs: number;
  palette: string[];
};
