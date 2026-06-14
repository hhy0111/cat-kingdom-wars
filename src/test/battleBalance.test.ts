import { describe, expect, it } from "vitest";
import { skillDefinitions, stageDefinitions, superCatDefinitions, unitDefinitions } from "../data/gameData";
import { BattleEngine } from "../game/BattleEngine";
import { createBattle } from "../game/createBattle";
import { allCharacterIds, getBattlePlayerUnitPool } from "../store/gameStore";

describe("battle balance", () => {
  it("keeps stage 27 from auto-clearing without in-battle upgrades", () => {
    const battle = createBattle({
      stageId: "stage_027",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const playerBase = battle.bases.find((base) => base.factionId === battle.playerFactionId);
    expect(playerBase).toBeDefined();
    playerBase!.unitPool = getBattlePlayerUnitPool(playerBase!.unitPool, [...allCharacterIds], 27);
    battle.upgrades.production = 1;
    battle.upgrades.attack = 0;
    battle.upgrades.health = 9;
    const engine = new BattleEngine(battle);

    engine.step(150_000);

    const snapshot = engine.getSnapshot();
    expect(snapshot.result?.winnerFactionId).not.toBe("cat_kingdom");
    expect(snapshot.bases.find((base) => base.factionId === snapshot.enemyFactionId)?.hp ?? 0).toBeGreaterThan(0);
    expect(snapshot.battleMoney).toBeGreaterThanOrEqual(snapshot.upgradeCosts.attack);
  });

  it("lets stage 27 recover when battle money is invested into upgrades", () => {
    const battle = createBattle({
      stageId: "stage_027",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const playerBase = battle.bases.find((base) => base.factionId === battle.playerFactionId);
    expect(playerBase).toBeDefined();
    playerBase!.unitPool = getBattlePlayerUnitPool(playerBase!.unitPool, [...allCharacterIds], 27);
    battle.upgrades.production = 1;
    battle.upgrades.attack = 0;
    battle.upgrades.health = 9;
    const engine = new BattleEngine(battle);

    for (let second = 0; second < 180; second += 1) {
      engine.step(1000);
      const snapshot = engine.getSnapshot();
      for (const kind of ["production", "attack", "health"] as const) {
        if (snapshot.upgrades[kind] >= (kind === "production" ? 3 : kind === "attack" ? 4 : 11)) {
          continue;
        }
        if (engine.getSnapshot().battleMoney >= engine.getSnapshot().upgradeCosts[kind]) {
          engine.upgrade(kind);
        }
      }
      if (engine.getSnapshot().result) {
        break;
      }
    }

    expect(engine.getSnapshot().result?.winnerFactionId).toBe("cat_kingdom");
  });
});
