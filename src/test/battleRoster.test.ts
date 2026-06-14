import { describe, expect, it } from "vitest";
import stages from "../data/stages";
import { allCharacterIds, getBattlePlayerUnitPool } from "../store/gameStore";

describe("battle roster balance", () => {
  it("caps mid-game battles so owning every character does not flood the field", () => {
    const stage26 = stages[25];
    const roster = getBattlePlayerUnitPool(stage26.playerBase.unitPool, [...allCharacterIds], 26);

    expect(roster).toEqual(["cat_swordsman", "cat_archer", "cat_tank", "cat_mage"]);
    expect(roster).not.toContain("cat_royal_cannon");
    expect(roster).not.toContain("cat_star_knight");
  });

  it("opens more roster slots only in later regions", () => {
    const stage90 = stages[89];
    const stage150 = stages[149];

    expect(getBattlePlayerUnitPool(stage90.playerBase.unitPool, [...allCharacterIds], 90)).toHaveLength(5);
    expect(getBattlePlayerUnitPool(stage150.playerBase.unitPool, [...allCharacterIds], 150)).toHaveLength(6);
  });
});
