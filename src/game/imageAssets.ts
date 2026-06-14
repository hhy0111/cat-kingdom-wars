import type { RuntimeUnit } from "./types";

type ImageKey =
  | "battleGrassland"
  | "playerBase"
  | "enemyBase"
  | "neutralBase"
  | "fireVfx"
  | "healVfx"
  | "summonVfx"
  | "impactVfx"
  | "baseExplosionVfx";

type UnitSpriteConfig = {
  url: string;
  columns: number;
  rows: number;
};

type EffectSpriteConfig = {
  key: ImageKey;
  columns: number;
  rows: number;
  startRow: number;
  frames?: EffectSpriteFrame[];
};

type EffectSpriteFrame = {
  row: number;
  column: number;
};

const imageUrls: Record<ImageKey, string> = {
  battleGrassland: new URL("../assets/generated/15-grassland-battle-map.png", import.meta.url).href,
  playerBase: new URL("../assets/generated/18-player-base.png", import.meta.url).href,
  enemyBase: new URL("../assets/generated/19-dog-empire-base.png", import.meta.url).href,
  neutralBase: new URL("../assets/generated/20-neutral-base.png", import.meta.url).href,
  fireVfx: new URL("../assets/generated/atlas/31-fire-bombardment-vfx-atlas.png", import.meta.url).href,
  healVfx: new URL("../assets/generated/atlas/33-healing-light-vfx-atlas.png", import.meta.url).href,
  summonVfx: new URL("../assets/generated/atlas/34-summon-portal-vfx-atlas.png", import.meta.url).href,
  impactVfx: new URL("../assets/generated/atlas/35-impact-spark-vfx-atlas.png", import.meta.url).href,
  baseExplosionVfx: new URL("../assets/generated/atlas/36-base-explosion-vfx-atlas.png", import.meta.url).href,
};

const unitSprites: Record<string, UnitSpriteConfig> = {
  cat_swordsman: {
    url: new URL("../assets/generated/atlas/21-swordsman-cat-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_archer: {
    url: new URL("../assets/generated/atlas/22-archer-cat-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_mage: {
    url: new URL("../assets/generated/atlas/23-mage-cat-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_tank: {
    url: new URL("../assets/generated/atlas/24-tank-cat-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_lancer: {
    url: new URL("../assets/generated/atlas/26-lancer-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_priest: {
    url: new URL("../assets/generated/atlas/25-priest-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_ninja: {
    url: new URL("../assets/generated/atlas/28-ninja-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_bomb: {
    url: new URL("../assets/generated/atlas/27-bomb-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_engineer: {
    url: new URL("../assets/generated/atlas/29-engineer-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_frost: {
    url: new URL("../assets/generated/atlas/30-frost-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_thunder_drummer: {
    url: new URL("../assets/generated/atlas/31-thunder-drummer-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_royal_cannon: {
    url: new URL("../assets/generated/atlas/32-royal-cannon-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  cat_star_knight: {
    url: new URL("../assets/generated/atlas/33-star-knight-cat-transparent-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  super_knight_cat: {
    url: new URL("../assets/generated/atlas/25-super-knight-cat-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  dog_soldier: {
    url: new URL("../assets/generated/atlas/26-dog-soldier-recut-atlas.png", import.meta.url).href,
    columns: 6,
    rows: 5,
  },
  dog_raider: {
    url: new URL("../assets/generated/atlas/35-dog-raider-recut-atlas.png", import.meta.url).href,
    columns: 7,
    rows: 5,
  },
  dog_guard: {
    url: new URL("../assets/generated/atlas/36-dog-guard-recut-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  dog_captain: {
    url: new URL("../assets/generated/atlas/37-dog-captain-repacked-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  dog_mage: {
    url: new URL("../assets/generated/atlas/38-dog-mage-repacked-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
  dog_siege_brute: {
    url: new URL("../assets/generated/atlas/39-dog-siege-brute-repacked-atlas.png", import.meta.url).href,
    columns: 8,
    rows: 5,
  },
};

const effectSprites: Record<string, EffectSpriteConfig> = {
  fx_fire_bombardment: { key: "fireVfx", columns: 6, rows: 4, startRow: 0 },
  fx_healing_light: { key: "healVfx", columns: 6, rows: 4, startRow: 0 },
  fx_summon_portal: { key: "summonVfx", columns: 6, rows: 4, startRow: 0 },
  fx_impact_spark: {
    key: "impactVfx",
    columns: 6,
    rows: 4,
    startRow: 0,
    frames: [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 0, column: 3 },
      { row: 0, column: 4 },
      { row: 0, column: 5 },
    ],
  },
  fx_unit_poof: {
    key: "impactVfx",
    columns: 6,
    rows: 4,
    startRow: 3,
    frames: [
      { row: 3, column: 3 },
      { row: 3, column: 4 },
      { row: 3, column: 5 },
    ],
  },
  fx_base_explosion: { key: "baseExplosionVfx", columns: 6, rows: 4, startRow: 0 },
};

const imageCache = new Map<string, HTMLImageElement>();
const battleSpritePreloadPriority = [
  "cat_swordsman",
  "cat_archer",
  "cat_tank",
  "cat_mage",
  "dog_soldier",
  "dog_raider",
  "dog_guard",
] as const;

export function getAssetImage(key: ImageKey): HTMLImageElement | null {
  return getLoadedImage(imageUrls[key]);
}

export function getUnitSprite(unit: RuntimeUnit): { image: HTMLImageElement; config: UnitSpriteConfig } | null {
  const config = unitSprites[unit.spriteKey] ?? unitSprites[unit.unitKey];
  const image = config ? getLoadedImage(config.url) : null;
  return image && config ? { image, config } : null;
}

export function getUnitSpriteConfig(spriteKey: string): UnitSpriteConfig | undefined {
  return unitSprites[spriteKey];
}

export function getEffectSpriteConfig(effectId: string): EffectSpriteConfig | undefined {
  return effectSprites[effectId];
}

export function getEffectSprite(effectId: string): { image: HTMLImageElement; config: EffectSpriteConfig } | null {
  const config = effectSprites[effectId];
  const image = config ? getAssetImage(config.key) : null;
  return image && config ? { image, config } : null;
}

export function preloadBattleImages(): void {
  for (const url of Object.values(imageUrls)) {
    getLoadedImage(url);
  }

  for (const spriteKey of battleSpritePreloadPriority) {
    getLoadedImage(unitSprites[spriteKey].url);
  }

  const preloadRemainingSprites = () => {
    for (const [spriteKey, sprite] of Object.entries(unitSprites)) {
      if (battleSpritePreloadPriority.includes(spriteKey as (typeof battleSpritePreloadPriority)[number])) {
        continue;
      }
      getLoadedImage(sprite.url);
    }
  };

  const browserWindow =
    typeof window === "undefined"
      ? undefined
      : (window as Window & {
          requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
        });

  if (browserWindow?.requestIdleCallback) {
    browserWindow.requestIdleCallback(preloadRemainingSprites, { timeout: 1200 });
    return;
  }

  if (typeof globalThis.setTimeout === "function") {
    globalThis.setTimeout(preloadRemainingSprites, 0);
    return;
  }

  for (const [spriteKey, sprite] of Object.entries(unitSprites)) {
    if (battleSpritePreloadPriority.includes(spriteKey as (typeof battleSpritePreloadPriority)[number])) {
      continue;
    }
    getLoadedImage(sprite.url);
  }
}

function getLoadedImage(url: string): HTMLImageElement | null {
  if (typeof Image === "undefined") {
    return null;
  }

  const cached = imageCache.get(url);
  if (cached) {
    return cached.complete && cached.naturalWidth > 0 ? cached : null;
  }

  const image = new Image();
  image.decoding = "async";
  image.src = url;
  imageCache.set(url, image);
  return null;
}
