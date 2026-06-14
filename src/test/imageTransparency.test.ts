import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const transparentUiAssets = [
  "../assets/generated/02-opening-hero-parade-foreground.png",
  "../assets/generated/03-opening-reward-crest.png",
  "../assets/generated/43-region-clear-celebration-vfx.png",
] as const;

const dogRaiderRecutAtlas = "../assets/generated/atlas/35-dog-raider-recut-atlas.png";
const dogSoldierRecutAtlas = "../assets/generated/atlas/26-dog-soldier-recut-atlas.png";
const dogGuardRecutAtlas = "../assets/generated/atlas/36-dog-guard-recut-atlas.png";
const battleEffectAtlases = [
  "../assets/generated/atlas/31-fire-bombardment-vfx-atlas.png",
  "../assets/generated/atlas/33-healing-light-vfx-atlas.png",
  "../assets/generated/atlas/34-summon-portal-vfx-atlas.png",
  "../assets/generated/atlas/35-impact-spark-vfx-atlas.png",
  "../assets/generated/atlas/36-base-explosion-vfx-atlas.png",
] as const;

describe("transparent UI image assets", () => {
  it("keeps opening and result overlay PNGs in an alpha-capable format", () => {
    for (const asset of transparentUiAssets) {
      const bytes = readFileSync(fileURLToPath(new URL(asset, import.meta.url)));

      expect(bytes.toString("ascii", 1, 4)).toBe("PNG");
      expect(bytes[24]).toBe(8);
      expect([4, 6]).toContain(bytes[25]);
    }
  });

  it("keeps the wolf raider recut atlas on seven original columns", () => {
    const bytes = readFileSync(fileURLToPath(new URL(dogRaiderRecutAtlas, import.meta.url)));

    expect(readPngUInt32(bytes, 16)).toBe(1120);
    expect(readPngUInt32(bytes, 20)).toBe(1280);
    expect(bytes[24]).toBe(8);
    expect([4, 6]).toContain(bytes[25]);
  });

  it("keeps stage 26 enemy recut atlases on their original frame columns", () => {
    const dogSoldierBytes = readFileSync(fileURLToPath(new URL(dogSoldierRecutAtlas, import.meta.url)));
    const dogGuardBytes = readFileSync(fileURLToPath(new URL(dogGuardRecutAtlas, import.meta.url)));

    expect(readPngUInt32(dogSoldierBytes, 16)).toBe(960);
    expect(readPngUInt32(dogSoldierBytes, 20)).toBe(1280);
    expect([4, 6]).toContain(dogSoldierBytes[25]);

    expect(readPngUInt32(dogGuardBytes, 16)).toBe(1280);
    expect(readPngUInt32(dogGuardBytes, 20)).toBe(1280);
    expect([4, 6]).toContain(dogGuardBytes[25]);
  });

  it("keeps battle effect atlases on square 6 by 4 frame grids", () => {
    for (const asset of battleEffectAtlases) {
      const bytes = readFileSync(fileURLToPath(new URL(asset, import.meta.url)));

      expect(readPngUInt32(bytes, 16)).toBe(1884);
      expect(readPngUInt32(bytes, 20)).toBe(1256);
      expect([4, 6]).toContain(bytes[25]);
    }
  });
});

function readPngUInt32(bytes: Buffer, offset: number): number {
  return bytes.readUInt32BE(offset);
}
