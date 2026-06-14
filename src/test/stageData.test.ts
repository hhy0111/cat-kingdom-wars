import { describe, expect, it } from "vitest";
import stages, { STAGES_PER_REGION, TOTAL_STAGE_COUNT } from "../data/stages";
import { skillDefinitions, stageDefinitions, superCatDefinitions, unitDefinitions } from "../data/gameData";
import { BattleEngine } from "../game/BattleEngine";
import { createBattle } from "../game/createBattle";

describe("stage data", () => {
  it("prepares two hundred playable stages across ten regions", () => {
    expect(stages).toHaveLength(200);
    expect(stageDefinitions).toHaveLength(TOTAL_STAGE_COUNT);
    expect(TOTAL_STAGE_COUNT / STAGES_PER_REGION).toBe(10);
    expect(stages[0].id).toBe("stage_001");
    expect(stages[199].id).toBe("stage_200");
  });

  it("scales rewards and enemy pools into later stages", () => {
    const first = stages[0];
    const last = stages[199];

    expect(last.rewards.gold).toBeGreaterThan(first.rewards.gold);
    expect(last.rewards.fish).toBeGreaterThan(first.rewards.fish);
    expect(last.enemyBase.hp).toBeGreaterThan(first.enemyBase.hp);
    expect(last.enemyBase.unitPool).toContain("dog_captain");
  });

  it("can create and step the final stage without missing unit definitions", () => {
    const battle = createBattle({
      stageId: "stage_200",
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });
    const engine = new BattleEngine(battle);

    engine.step(1200);

    expect(engine.getSnapshot().stageId).toBe("stage_200");
    expect(engine.getSnapshot().units.length).toBeGreaterThan(0);
  });
});
