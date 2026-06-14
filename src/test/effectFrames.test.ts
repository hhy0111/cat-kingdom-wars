import { describe, expect, it } from "vitest";
import { getEffectSpriteConfig } from "../game/imageAssets";
import { getEffectSpriteCell } from "../game/renderBattle";

describe("effect sprite frame selection", () => {
  it("plays effect atlases in row-major order instead of jumping between partial rows", () => {
    const config = { key: "fireVfx" as const, columns: 6, rows: 4, startRow: 0 };

    expect(getEffectSpriteCell(config, 0)).toEqual({ column: 0, row: 0 });
    expect(getEffectSpriteCell(config, 0.2)).toEqual({ column: 4, row: 0 });
    expect(getEffectSpriteCell(config, 0.5)).toEqual({ column: 0, row: 2 });
    expect(getEffectSpriteCell(config, 0.99)).toEqual({ column: 5, row: 3 });
  });

  it("uses the full timeline for primary battle VFX sheets", () => {
    expect(getEffectSpriteConfig("fx_fire_bombardment")?.startRow).toBe(0);
    expect(getEffectSpriteConfig("fx_healing_light")?.startRow).toBe(0);
    expect(getEffectSpriteConfig("fx_summon_portal")?.startRow).toBe(0);
    expect(getEffectSpriteConfig("fx_base_explosion")?.startRow).toBe(0);
  });

  it("keeps hit sparks on the compact first-row impact frames", () => {
    const config = getEffectSpriteConfig("fx_impact_spark");

    expect(config?.frames).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 0, column: 3 },
      { row: 0, column: 4 },
      { row: 0, column: 5 },
    ]);
  });

  it("uses smoke and debris frames for unit poof instead of the red impact burst", () => {
    expect(getEffectSpriteConfig("fx_unit_poof")?.frames).toEqual([
      { row: 3, column: 3 },
      { row: 3, column: 4 },
      { row: 3, column: 5 },
    ]);
  });
});
