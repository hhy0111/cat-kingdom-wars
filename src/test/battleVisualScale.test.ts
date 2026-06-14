import { describe, expect, it } from "vitest";
import { battleVisualScale } from "../game/visualScale";

describe("battleVisualScale", () => {
  it("keeps battle sprites readable on mobile without overwhelming the field", () => {
    expect(battleVisualScale.unit).toBeGreaterThanOrEqual(0.82);
    expect(battleVisualScale.unit).toBeLessThanOrEqual(0.95);
    expect(battleVisualScale.superUnit).toBeGreaterThan(battleVisualScale.unit);
    expect(battleVisualScale.superUnit).toBeLessThanOrEqual(1.4);
    expect(battleVisualScale.base).toBeLessThanOrEqual(0.7);
    expect(battleVisualScale.unitHealthBarWidth).toBeLessThanOrEqual(36);
    expect(battleVisualScale.superUnitHealthBarWidth).toBeGreaterThan(battleVisualScale.unitHealthBarWidth);
  });
});
