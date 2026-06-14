import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { audioAssetManifest } from "../game/audio";

describe("audioAssetManifest", () => {
  it("maps every BGM and SFX key to an existing local sound file", () => {
    const urls = [...Object.values(audioAssetManifest.bgm), ...Object.values(audioAssetManifest.sfx)];

    expect(Object.keys(audioAssetManifest.bgm)).toHaveLength(3);
    expect(Object.keys(audioAssetManifest.sfx)).toHaveLength(33);

    for (const url of urls) {
      expect(url).toMatch(/\.(ogg|wav)$/);
      expect(existsSync(fileURLToPath(url))).toBe(true);
    }
  });
});
