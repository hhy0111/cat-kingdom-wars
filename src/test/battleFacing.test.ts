import { describe, expect, it } from "vitest";
import { getUnitVisualFacing } from "../game/renderBattle";

describe("battle sprite facing", () => {
  it("draws sprites in the unit's current movement or target direction", () => {
    expect(
      getUnitVisualFacing({
        spriteKey: "cat_swordsman",
        unitKey: "cat_swordsman",
        facing: 1,
      }),
    ).toBe(1);
    expect(
      getUnitVisualFacing({
        spriteKey: "cat_swordsman",
        unitKey: "cat_swordsman",
        facing: -1,
      }),
    ).toBe(-1);
    expect(
      getUnitVisualFacing({
        spriteKey: "dog_soldier",
        unitKey: "dog_soldier",
        facing: -1,
      }),
    ).toBe(-1);
    expect(
      getUnitVisualFacing({
        spriteKey: "dog_soldier",
        unitKey: "dog_soldier",
        facing: 1,
      }),
    ).toBe(1);
    expect(
      getUnitVisualFacing({
        spriteKey: "dog_guard",
        unitKey: "dog_guard",
        facing: -1,
      }),
    ).toBe(1);
  });
});
