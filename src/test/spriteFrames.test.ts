import { describe, expect, it } from "vitest";
import { getUnitSpriteFrameSequence } from "../game/renderBattle";
import { getUnitSpriteConfig } from "../game/imageAssets";

describe("unit sprite frame selection", () => {
  it("skips characterless attack frames for player cats", () => {
    expect(getUnitSpriteFrameSequence({ spriteKey: "cat_archer", unitKey: "cat_archer" }, 2, 8)).not.toContain(5);
    expect(getUnitSpriteFrameSequence({ spriteKey: "cat_mage", unitKey: "cat_mage" }, 2, 8)).not.toContain(6);
  });

  it("skips clipped dog soldier attack frames", () => {
    const dogSoldier = { spriteKey: "dog_soldier", unitKey: "dog_soldier" };

    expect(getUnitSpriteFrameSequence(dogSoldier, 1, 6)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(getUnitSpriteFrameSequence(dogSoldier, 2, 6)).toEqual([0, 1, 2, 5]);
    expect(getUnitSpriteFrameSequence(dogSoldier, 2, 6)).not.toContain(3);
    expect(getUnitSpriteFrameSequence(dogSoldier, 2, 6)).not.toContain(4);
  });

  it("uses the original six-frame dog soldier atlas at runtime", () => {
    const config = getUnitSpriteConfig("dog_soldier");

    expect(config?.columns).toBe(6);
    expect(config?.rows).toBe(5);
    expect(config?.url).toContain("26-dog-soldier-recut-atlas.png");
  });

  it("uses only body-safe wolf raider walk and attack frames", () => {
    const dogRaider = { spriteKey: "dog_raider", unitKey: "dog_raider" };

    expect(getUnitSpriteFrameSequence(dogRaider, 0, 7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(getUnitSpriteFrameSequence(dogRaider, 1, 7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(getUnitSpriteFrameSequence(dogRaider, 2, 7)).toEqual([0, 1, 2, 3, 6]);
    expect(getUnitSpriteFrameSequence(dogRaider, 2, 7)).not.toContain(4);
    expect(getUnitSpriteFrameSequence(dogRaider, 2, 7)).not.toContain(5);
  });

  it("uses the original seven-frame wolf raider atlas at runtime", () => {
    const config = getUnitSpriteConfig("dog_raider");

    expect(config?.columns).toBe(7);
    expect(config?.rows).toBe(5);
    expect(config?.url).toContain("35-dog-raider-recut-atlas.png");
  });

  it("uses conservative body frames for newly added cat units", () => {
    expect(getUnitSpriteFrameSequence({ spriteKey: "cat_lancer", unitKey: "cat_lancer" }, 1, 8)).toEqual([0, 1, 2, 3]);
    expect(getUnitSpriteFrameSequence({ spriteKey: "cat_royal_cannon", unitKey: "cat_royal_cannon" }, 2, 8)).toEqual([
      0,
      1,
      2,
      3,
    ]);
  });

  it("uses body-visible attack frames for late-stage dog units", () => {
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_mage", unitKey: "dog_mage" }, 2, 8)).toEqual([
      0,
      1,
      2,
      3,
      6,
      7,
    ]);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_siege_brute", unitKey: "dog_siege_brute" }, 2, 8)).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
    ]);
  });

  it("keeps heavy dog attack loops on body-visible frames", () => {
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 1, 8)).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
    ]);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 1, 8)).not.toContain(6);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 1, 8)).not.toContain(7);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 2, 8)).toEqual([
      0,
      1,
      2,
      7,
    ]);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 2, 8)).not.toContain(3);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 2, 8)).not.toContain(4);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 2, 8)).not.toContain(5);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_guard", unitKey: "dog_guard" }, 2, 8)).not.toContain(6);
    expect(getUnitSpriteFrameSequence({ spriteKey: "dog_captain", unitKey: "dog_captain" }, 2, 8)).toEqual([
      0,
      1,
      2,
      5,
      6,
      7,
    ]);
  });

  it("uses the cleaned guard atlas at runtime", () => {
    const config = getUnitSpriteConfig("dog_guard");

    expect(config?.columns).toBe(8);
    expect(config?.rows).toBe(5);
    expect(config?.url).toContain("36-dog-guard-recut-atlas.png");
  });
});
