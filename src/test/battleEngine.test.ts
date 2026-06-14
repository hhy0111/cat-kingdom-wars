import { describe, expect, it } from "vitest";
import { skillDefinitions, stageDefinitions, superCatDefinitions, unitDefinitions } from "../data/gameData";
import { BattleEngine } from "../game/BattleEngine";
import { createBattle } from "../game/createBattle";

describe("BattleEngine", () => {
  it("spawns player and enemy units from base production over time", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(1000);

    const snapshot = engine.getSnapshot();
    expect(snapshot.units.some((unit) => unit.factionId === "cat_kingdom")).toBe(true);
    expect(snapshot.units.some((unit) => unit.factionId === "dog_empire")).toBe(true);
  });

  it("moves spawned units toward the opposing base", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(1000);
    const before = engine.getSnapshot().units.find((unit) => unit.factionId === "cat_kingdom");
    expect(before).toBeDefined();

    engine.step(1000);
    const after = engine.getSnapshot().units.find((unit) => unit.id === before?.id);
    expect(after).toBeDefined();
    expect(after!.x).toBeGreaterThan(before!.x);
    expect(after!.y).toBeLessThan(before!.y);
  });

  it("spreads units across a broad frontline instead of one narrow lane", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(9000);

    const playerUnits = engine.getSnapshot().units.filter((unit) => unit.factionId === "cat_kingdom");
    const perpendicularPositions = playerUnits.map((unit) => (unit.x + unit.y) / Math.SQRT2);
    const spread = Math.max(...perpendicularPositions) - Math.min(...perpendicularPositions);

    expect(playerUnits.length).toBeGreaterThanOrEqual(6);
    expect(spread).toBeGreaterThan(160);
  });

  it("fire bombardment damages enemies and creates a visible effect event", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(1000);
    const enemy = engine.getSnapshot().units.find((unit) => unit.factionId === "dog_empire");
    expect(enemy).toBeDefined();

    const result = engine.castSkill("fire_bombardment", { x: enemy!.x, y: enemy!.y });
    const damaged = engine.getSnapshot().units.find((unit) => unit.id === enemy!.id);

    expect(result.ok).toBe(true);
    expect(damaged!.hp).toBeLessThan(enemy!.hp);
    expect(engine.getSnapshot().events.some((event) => event.effectId === "fx_fire_bombardment")).toBe(true);
  });

  it("requires battle-earned money before buying battle upgrades", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    const blocked = engine.upgrade("production");
    expect(blocked).toEqual({ ok: false, cost: 50, reason: "not_enough_money" });
    expect(engine.getSnapshot().upgrades.production).toBe(0);

    engine.step(7000);
    const funded = engine.getSnapshot();
    expect(funded.battleMoney).toBeGreaterThanOrEqual(funded.upgradeCosts.production);

    const purchased = engine.upgrade("production");
    const upgraded = engine.getSnapshot();

    expect(purchased.ok).toBe(true);
    expect(upgraded.upgrades.production).toBe(1);
    expect(upgraded.battleMoney).toBe(funded.battleMoney - funded.upgradeCosts.production);
    expect(upgraded.upgradeCosts.production).toBeGreaterThan(funded.upgradeCosts.production);
  });

  it("awards battle money when enemy units are defeated", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(1000);
    const before = engine.getSnapshot();
    const enemy = before.units.find((unit) => unit.factionId === "dog_empire");
    expect(enemy).toBeDefined();

    engine.castSkill("fire_bombardment", { x: enemy!.x, y: enemy!.y });
    engine.step(16);
    const after = engine.getSnapshot();

    expect(after.battleMoneyEarned).toBeGreaterThan(before.battleMoneyEarned);
    expect(after.events.some((event) => event.kind === "money" && event.value && event.value > 0)).toBe(true);
  });

  it("summons a temporary super knight cat with high combat power", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    const result = engine.summonSuperCat("super_knight_cat");
    const superUnit = engine.getSnapshot().units.find((unit) => unit.unitKey === "super_knight_cat");

    expect(result.ok).toBe(true);
    expect(superUnit).toBeDefined();
    expect(superUnit!.attack).toBeGreaterThan(120);
    expect(engine.getSnapshot().events.some((event) => event.effectId === "fx_summon_portal")).toBe(true);
  });

  it("declares victory when the enemy base is destroyed", () => {
    const battle = createBattle({
      stageId: "stage_001",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.castSkill("fire_bombardment", { x: 820, y: 180 });
    engine.castSkill("debug_base_breaker", { x: 820, y: 180 });
    engine.step(16);

    expect(engine.getSnapshot().result).toEqual({ winnerFactionId: "cat_kingdom", reason: "base_destroyed" });
  });
});
