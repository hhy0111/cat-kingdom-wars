import type {
  BattleEvent,
  BattleSnapshot,
  BattleState,
  CastResult,
  FactionId,
  RuntimeBase,
  RuntimeUnit,
  SkillDefinition,
  UnitDefinition,
  UnitStats,
  UpgradeKind,
  UpgradeResult,
  Vec2,
} from "./types";

const PRODUCTION_BY_LEVEL: Record<number, number> = {
  1: 1,
  2: 1.45,
  3: 2.1,
  4: 2.8,
};
const MAX_PRODUCTION_LEVEL = 4;

const BASE_ATTACK_RANGE = 34;
const BASE_CONTACT_DAMAGE_SCALE = 0.7;
const BASE_APPROACH_DISTANCE = 92;
const SPAWN_FORWARD_DISTANCE = 78;
const LANE_ENGAGE_WIDTH = 136;
const BATTLE_MONEY_PER_SECOND = 8;
const UPGRADE_COST_GROWTH = 1.55;
const ENEMY_SCALING_START_STAGE = 11;
const UPGRADE_BASE_COST: Record<UpgradeKind, number> = {
  production: 50,
  attack: 65,
  health: 60,
};
const EVENT_DURATION = {
  hit: 280,
  death: 520,
  base: 1400,
};

export function getUpgradeCost(kind: UpgradeKind, level: number): number {
  const rawCost = UPGRADE_BASE_COST[kind] * UPGRADE_COST_GROWTH ** level;
  return Math.ceil(rawCost / 5) * 5;
}

export class BattleEngine {
  private state: BattleState;

  constructor(initialState: BattleState) {
    this.state = initialState;
  }

  step(ms: number): void {
    if (ms <= 0) {
      return;
    }

    const frameMs = Math.min(ms, 100);
    let remainingMs = ms;

    while (remainingMs > 0) {
      const dt = Math.min(frameMs, remainingMs);
      this.state.timeMs += dt;

      if (!this.state.result) {
        this.produceBattleMoney(dt);
        this.produceUnits(dt);
        this.updateUnits(dt);
        this.removeExpiredUnits();
        this.removeDeadUnits();
        this.checkVictory();
      }

      this.pruneEvents();
      remainingMs -= dt;
    }
  }

  castSkill(skillId: string, target: Vec2): CastResult {
    if (this.state.result) {
      return { ok: false, reason: "battle_finished" };
    }

    const skill = this.state.skillDefinitions[skillId];
    if (!skill) {
      return { ok: false, reason: "unknown_skill" };
    }

    const readyAt = this.state.skillReadyAtMs[skill.id] ?? 0;
    if (this.state.timeMs < readyAt) {
      return { ok: false, reason: "cooldown" };
    }

    if (skill.effectType === "damage") {
      this.applyAreaDamage(skill, target, this.state.enemyFactionId);
    }

    if (skill.effectType === "heal") {
      this.applyAreaHeal(skill, target, this.state.playerFactionId);
    }

    if (skill.effectType === "damageBase") {
      this.applyBaseDamage(skill, target, this.state.enemyFactionId);
    }

    this.state.skillReadyAtMs[skill.id] = this.state.timeMs + skill.cooldown;
    this.addEvent({
      effectId: skill.effectKey,
      x: target.x,
      y: target.y,
      durationMs: skill.duration,
      radius: skill.range,
      kind: skill.effectType === "damageBase" ? "base" : "skill",
      value: skill.value,
    });
    this.checkVictory();

    return { ok: true };
  }

  summonSuperCat(superCatId: string): CastResult {
    if (this.state.result) {
      return { ok: false, reason: "battle_finished" };
    }

    const definition = this.state.superCatDefinitions[superCatId];
    if (!definition) {
      return { ok: false, reason: "unknown_super_cat" };
    }

    const readyAt = this.state.superCatReadyAtMs[definition.id] ?? 0;
    if (this.state.timeMs < readyAt) {
      return { ok: false, reason: "cooldown" };
    }

    const base = this.getBaseByFaction(this.state.playerFactionId);
    const laneOffset = this.getNextLaneOffset(base);
    const spawnPoint = this.getFormationSpawnPoint(base, laneOffset);
    const unit = this.createUnitFromStats({
      unitKey: definition.id,
      name: definition.name,
      role: "melee",
      factionId: definition.factionId,
      spriteKey: definition.spriteKey,
      animationSetKey: definition.animationSetKey,
      stats: definition.stats,
      x: spawnPoint.x,
      y: spawnPoint.y,
      laneOffset,
      expiresAtMs: this.state.timeMs + definition.duration,
    });

    this.state.units.push(unit);
    this.state.superCatReadyAtMs[definition.id] = this.state.timeMs + definition.cooldown;
    this.addEvent({
      effectId: definition.spawnEffectKey,
      x: unit.x,
      y: unit.y,
      durationMs: 1200,
      radius: 95,
      kind: "summon",
      value: definition.stats.attack,
    });

    return { ok: true };
  }

  upgrade(kind: UpgradeKind): UpgradeResult {
    const cost = getUpgradeCost(kind, this.state.upgrades[kind]);

    if (this.state.result) {
      return { ok: false, cost, reason: "battle_finished" };
    }

    if (this.state.battleMoney < cost) {
      const base = this.getBaseByFaction(this.state.playerFactionId);
      this.addEvent({
        effectId: "fx_impact_spark",
        x: base.x,
        y: base.y - 70,
        durationMs: 760,
        radius: 34,
        color: "#ff8a4e",
        kind: "warning",
        label: "전투머니 부족",
      });
      return { ok: false, cost, reason: "not_enough_money" };
    }

    this.state.battleMoney -= cost;
    this.state.upgrades[kind] += 1;
    const base = this.getBaseByFaction(this.state.playerFactionId);
    this.addEvent({
      effectId: "fx_summon_portal",
      x: base.x,
      y: base.y - 54,
      durationMs: 900,
      radius: 52,
      color: "#fff7b0",
      kind: "upgrade",
      value: cost,
      label: `-${cost} / Lv ${this.state.upgrades[kind]}`,
    });

    return { ok: true, cost };
  }

  getSnapshot(): BattleSnapshot {
    return {
      stageId: this.state.stageId,
      stageName: this.state.stageName,
      mapSize: this.state.mapSize,
      playerFactionId: this.state.playerFactionId,
      enemyFactionId: this.state.enemyFactionId,
      timeMs: this.state.timeMs,
      bases: this.state.bases.map((base) => ({ ...base, unitPool: [...base.unitPool] })),
      units: this.state.units.map((unit) => ({ ...unit })),
      events: this.state.events.map((event) => ({ ...event })),
      result: this.state.result ? { ...this.state.result } : null,
      battleMoney: this.state.battleMoney,
      battleMoneyEarned: this.state.battleMoneyEarned,
      skillReadyAtMs: { ...this.state.skillReadyAtMs },
      superCatReadyAtMs: { ...this.state.superCatReadyAtMs },
      upgrades: { ...this.state.upgrades },
      upgradeCosts: {
        production: getUpgradeCost("production", this.state.upgrades.production),
        attack: getUpgradeCost("attack", this.state.upgrades.attack),
        health: getUpgradeCost("health", this.state.upgrades.health),
      },
    };
  }

  private produceBattleMoney(ms: number): void {
    this.state.battleMoneyRemainder += (ms / 1000) * BATTLE_MONEY_PER_SECOND;
    const gained = Math.floor(this.state.battleMoneyRemainder);

    if (gained <= 0) {
      return;
    }

    this.state.battleMoney += gained;
    this.state.battleMoneyEarned += gained;
    this.state.battleMoneyRemainder -= gained;
  }

  private produceUnits(ms: number): void {
    const dtSec = ms / 1000;

    for (const base of this.state.bases) {
      const levelRate = getProductionRate(base.level);
      const factionBoost =
        base.factionId === this.state.playerFactionId
          ? 1 + this.state.upgrades.production * 0.16
          : getEnemyProductionPressure(this.state.stageId);
      base.spawnAccumulator += levelRate * factionBoost * dtSec;

      while (base.spawnAccumulator + Number.EPSILON * 10 >= 1) {
        this.spawnFromBase(base);
        base.spawnAccumulator -= 1;
      }
    }
  }

  private spawnFromBase(base: RuntimeBase): void {
    const unitKey = base.unitPool[base.nextUnitIndex % base.unitPool.length];
    base.nextUnitIndex += 1;

    const definition = this.state.unitDefinitions[unitKey];
    if (!definition) {
      throw new Error(`Unknown unit in ${base.id}: ${unitKey}`);
    }

    const laneOffset = this.getNextLaneOffset(base);
    const unit = this.createUnitFromDefinition(definition, this.getFormationSpawnPoint(base, laneOffset), laneOffset);

    if (base.factionId === this.state.playerFactionId) {
      unit.attack *= 1 + this.state.upgrades.attack * 0.14;
      unit.maxHp *= 1 + this.state.upgrades.health * 0.14;
      unit.hp = unit.maxHp;
    } else {
      const enemyScale = getEnemyUnitScale(this.state.stageId);
      unit.attack *= enemyScale.attack;
      unit.maxHp *= enemyScale.hp;
      unit.hp = unit.maxHp;
      unit.defense += enemyScale.defense;
    }

    this.state.units.push(unit);
  }

  private createUnitFromDefinition(definition: UnitDefinition, position: Vec2, laneOffset: number): RuntimeUnit {
    return this.createUnitFromStats({
      unitKey: definition.id,
      name: definition.name,
      role: definition.role,
      factionId: definition.factionId,
      spriteKey: definition.spriteKey,
      animationSetKey: definition.animationSetKey,
      stats: definition.stats,
      x: position.x,
      y: position.y,
      laneOffset,
    });
  }

  private createUnitFromStats(input: {
    unitKey: string;
    name: string;
    role: RuntimeUnit["role"];
    factionId: FactionId;
    spriteKey: string;
    animationSetKey: string;
    stats: UnitStats;
    x: number;
    y: number;
    laneOffset: number;
    expiresAtMs?: number;
  }): RuntimeUnit {
    const id = `unit_${this.state.nextUnitSerial++}`;

    return {
      id,
      unitKey: input.unitKey,
      name: input.name,
      role: input.role,
      factionId: input.factionId,
      spriteKey: input.spriteKey,
      animationSetKey: input.animationSetKey,
      x: input.x,
      y: input.y,
      hp: input.stats.hp,
      maxHp: input.stats.hp,
      attack: input.stats.attack,
      attackRange: input.stats.attackRange,
      attackSpeed: input.stats.attackSpeed,
      moveSpeed: input.stats.moveSpeed,
      defense: input.stats.defense,
      aoeRadius: input.stats.aoeRadius,
      state: "idle",
      attackCooldownMs: 0,
      facing: input.factionId === this.state.playerFactionId ? 1 : -1,
      laneOffset: input.laneOffset,
      expiresAtMs: input.expiresAtMs,
      hitFlashMs: 0,
    };
  }

  private updateUnits(ms: number): void {
    const dtSec = ms / 1000;

    for (const unit of this.state.units) {
      unit.attackCooldownMs = Math.max(0, unit.attackCooldownMs - ms);
      unit.hitFlashMs = Math.max(0, unit.hitFlashMs - ms);

      if (unit.hp <= 0) {
        continue;
      }

      const target = this.findTargetFor(unit);
      if (!target) {
        unit.state = "idle";
        continue;
      }

      const distance = distanceBetween(unit, target);
      const range = isRuntimeUnit(target) ? unit.attackRange : Math.max(unit.attackRange, BASE_ATTACK_RANGE);

      if (distance <= range) {
        unit.facing = target.x >= unit.x ? 1 : -1;
        unit.state = "attack";
        if (unit.attackCooldownMs <= 0) {
          this.attack(unit, target);
          unit.attackCooldownMs = 1000 / Math.max(0.1, unit.attackSpeed);
        }
        continue;
      }

      unit.state = "walk";
      const destination = isRuntimeUnit(target) ? target : this.getFormationApproachPoint(unit, target);
      const dx = destination.x - unit.x;
      const dy = destination.y - unit.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      unit.facing = dx >= 0 ? 1 : -1;
      unit.x += (dx / length) * unit.moveSpeed * dtSec;
      unit.y += (dy / length) * unit.moveSpeed * dtSec;
    }
  }

  private findTargetFor(unit: RuntimeUnit): RuntimeUnit | RuntimeBase | null {
    const enemyUnits = this.state.units
      .filter((candidate) => candidate.factionId !== unit.factionId && candidate.hp > 0)
      .sort((a, b) => distanceBetween(unit, a) - distanceBetween(unit, b));

    const nearbyEnemy = enemyUnits.find(
      (candidate) => distanceBetween(unit, candidate) < 260 && Math.abs(candidate.laneOffset - unit.laneOffset) <= LANE_ENGAGE_WIDTH,
    );
    if (nearbyEnemy) {
      return nearbyEnemy;
    }

    return this.state.bases.find((base) => base.factionId !== unit.factionId && base.hp > 0) ?? null;
  }

  private attack(attacker: RuntimeUnit, target: RuntimeUnit | RuntimeBase): void {
    const damage = isRuntimeUnit(target)
      ? Math.max(1, attacker.attack - target.defense)
      : Math.max(1, attacker.attack * BASE_CONTACT_DAMAGE_SCALE);

    target.hp = Math.max(0, target.hp - damage);

    if (isRuntimeUnit(target)) {
      target.state = target.hp <= 0 ? "death" : "hit";
      target.hitFlashMs = 180;
      this.addEvent({
        effectId: "fx_impact_spark",
        x: target.x,
        y: target.y,
        durationMs: EVENT_DURATION.hit,
        radius: 32,
        kind: "hit",
        value: Math.round(damage),
        label: `-${Math.round(damage)}`,
      });

      if (attacker.aoeRadius > 0) {
        this.applySplashDamage(attacker, target);
      }
    } else {
      this.addEvent({
        effectId: "fx_base_hit",
        x: target.x,
        y: target.y,
        durationMs: EVENT_DURATION.hit,
        radius: 46,
        kind: "base",
        value: Math.round(damage),
        label: `-${Math.round(damage)}`,
      });
    }
  }

  private applySplashDamage(attacker: RuntimeUnit, primaryTarget: RuntimeUnit): void {
    const splashDamage = attacker.attack * 0.45;

    for (const unit of this.state.units) {
      if (unit.id === primaryTarget.id || unit.factionId === attacker.factionId || unit.hp <= 0) {
        continue;
      }

      if (distanceBetween(primaryTarget, unit) <= attacker.aoeRadius) {
        unit.hp = Math.max(0, unit.hp - splashDamage);
        unit.hitFlashMs = 160;
      }
    }
  }

  private applyAreaDamage(skill: SkillDefinition, target: Vec2, enemyFactionId: FactionId): void {
    for (const unit of this.state.units) {
      if (unit.factionId === enemyFactionId && distanceBetween(unit, target) <= skill.range) {
        unit.hp = Math.max(0, unit.hp - skill.value);
        unit.state = unit.hp <= 0 ? "death" : "hit";
        unit.hitFlashMs = 240;
      }
    }
  }

  private applyAreaHeal(skill: SkillDefinition, target: Vec2, playerFactionId: FactionId): void {
    for (const unit of this.state.units) {
      if (unit.factionId === playerFactionId && distanceBetween(unit, target) <= skill.range) {
        unit.hp = Math.min(unit.maxHp, unit.hp + skill.value);
        unit.state = "hit";
        unit.hitFlashMs = 180;
      }
    }
  }

  private applyBaseDamage(skill: SkillDefinition, target: Vec2, enemyFactionId: FactionId): void {
    for (const base of this.state.bases) {
      if (base.factionId === enemyFactionId && distanceBetween(base, target) <= skill.range) {
        base.hp = Math.max(0, base.hp - skill.value);
      }
    }
  }

  private removeExpiredUnits(): void {
    for (const unit of this.state.units) {
      if (unit.expiresAtMs && this.state.timeMs >= unit.expiresAtMs) {
        unit.hp = 0;
        unit.state = "death";
      }
    }
  }

  private removeDeadUnits(): void {
    const deadUnits = this.state.units.filter((unit) => unit.hp <= 0);
    for (const unit of deadUnits) {
      if (unit.factionId === this.state.enemyFactionId) {
        this.awardBattleMoney(getUnitBounty(unit), unit.x, unit.y);
      }

      this.addEvent({
        effectId: "fx_unit_poof",
        x: unit.x,
        y: unit.y,
        durationMs: EVENT_DURATION.death,
        radius: 38,
        kind: "death",
      });
    }
    this.state.units = this.state.units.filter((unit) => unit.hp > 0);
  }

  private awardBattleMoney(amount: number, x: number, y: number): void {
    this.state.battleMoney += amount;
    this.state.battleMoneyEarned += amount;
    this.addEvent({
      effectId: "fx_impact_spark",
      x,
      y: y - 16,
      durationMs: 760,
      radius: 32,
      color: "#fff7b0",
      kind: "money",
      value: amount,
      label: `+${amount}`,
    });
  }

  private checkVictory(): void {
    if (this.state.result) {
      return;
    }

    const playerBase = this.getBaseByFaction(this.state.playerFactionId);
    const enemyBase = this.getBaseByFaction(this.state.enemyFactionId);

    if (enemyBase.hp <= 0) {
      this.state.result = {
        winnerFactionId: this.state.playerFactionId,
        reason: "base_destroyed",
      };
      this.addEvent({
        effectId: "fx_base_explosion",
        x: enemyBase.x,
        y: enemyBase.y,
        durationMs: EVENT_DURATION.base,
        radius: 120,
        kind: "base",
      });
    }

    if (playerBase.hp <= 0) {
      this.state.result = {
        winnerFactionId: this.state.enemyFactionId,
        reason: "base_destroyed",
      };
      this.addEvent({
        effectId: "fx_base_explosion",
        x: playerBase.x,
        y: playerBase.y,
        durationMs: EVENT_DURATION.base,
        radius: 120,
        kind: "base",
      });
    }
  }

  private getBaseByFaction(factionId: FactionId): RuntimeBase {
    const base = this.state.bases.find((candidate) => candidate.factionId === factionId);
    if (!base) {
      throw new Error(`Missing base for faction: ${factionId}`);
    }
    return base;
  }

  private getNextLaneOffset(base: RuntimeBase): number {
    const lanePattern = [0, -72, 72, -144, 144, -216, 216, -108, 108, -180, 180];
    return lanePattern[base.nextUnitIndex % lanePattern.length];
  }

  private getFormationSpawnPoint(base: RuntimeBase, laneOffset: number): Vec2 {
    const axis = this.getBattleAxis();
    const sign = base.factionId === this.state.playerFactionId ? 1 : -1;

    return this.clampToMap({
      x: base.x + axis.forward.x * sign * SPAWN_FORWARD_DISTANCE + axis.perpendicular.x * laneOffset,
      y: base.y + axis.forward.y * sign * SPAWN_FORWARD_DISTANCE + axis.perpendicular.y * laneOffset,
    });
  }

  private getFormationApproachPoint(unit: RuntimeUnit, targetBase: RuntimeBase): Vec2 {
    const axis = this.getBattleAxis();
    const sign = unit.factionId === this.state.playerFactionId ? 1 : -1;

    return this.clampToMap({
      x: targetBase.x - axis.forward.x * sign * BASE_APPROACH_DISTANCE + axis.perpendicular.x * unit.laneOffset,
      y: targetBase.y - axis.forward.y * sign * BASE_APPROACH_DISTANCE + axis.perpendicular.y * unit.laneOffset,
    });
  }

  private getBattleAxis(): { forward: Vec2; perpendicular: Vec2 } {
    const playerBase = this.getBaseByFaction(this.state.playerFactionId);
    const enemyBase = this.getBaseByFaction(this.state.enemyFactionId);
    const dx = enemyBase.x - playerBase.x;
    const dy = enemyBase.y - playerBase.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const forward = {
      x: dx / length,
      y: dy / length,
    };

    return {
      forward,
      perpendicular: {
        x: -forward.y,
        y: forward.x,
      },
    };
  }

  private clampToMap(point: Vec2): Vec2 {
    const margin = 58;
    return {
      x: Math.min(this.state.mapSize - margin, Math.max(margin, point.x)),
      y: Math.min(this.state.mapSize - margin, Math.max(margin, point.y)),
    };
  }

  private addEvent(input: Omit<BattleEvent, "id" | "createdAtMs">): void {
    this.state.events.push({
      id: `event_${this.state.nextEventSerial++}`,
      createdAtMs: this.state.timeMs,
      ...input,
    });
  }

  private pruneEvents(): void {
    this.state.events = this.state.events.filter((event) => this.state.timeMs - event.createdAtMs <= event.durationMs);
  }
}

function getProductionRate(level: number): number {
  const clampedLevel = Math.max(1, Math.min(MAX_PRODUCTION_LEVEL, Math.floor(level)));
  return PRODUCTION_BY_LEVEL[clampedLevel];
}

function getEnemyProductionPressure(stageId: string): number {
  const pressure = Math.max(0, getStageNumber(stageId) - ENEMY_SCALING_START_STAGE + 1);
  return 1 + Math.min(1.35, pressure * 0.035);
}

function getEnemyUnitScale(stageId: string): { hp: number; attack: number; defense: number } {
  const stageNumber = getStageNumber(stageId);
  const pressure = Math.max(0, stageNumber - ENEMY_SCALING_START_STAGE + 1);
  const regionIndex = Math.max(0, Math.floor((stageNumber - 1) / 20));

  return {
    hp: 1 + Math.min(2.4, pressure * 0.05 + regionIndex * 0.15),
    attack: 1 + Math.min(1.9, pressure * 0.035 + regionIndex * 0.1),
    defense: Math.floor(pressure / 8),
  };
}

function getStageNumber(stageId: string): number {
  const match = /(\d+)$/.exec(stageId);
  return match ? Number(match[1]) : 1;
}

function distanceBetween(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isRuntimeUnit(target: RuntimeUnit | RuntimeBase): target is RuntimeUnit {
  return "unitKey" in target;
}

function getUnitBounty(unit: RuntimeUnit): number {
  const rawBounty = unit.maxHp / 12 + unit.attack / 16 + (unit.role === "tank" ? 8 : 0);
  return Math.max(14, Math.round(rawBounty));
}
