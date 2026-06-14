import type { BattleEvent } from "./types";

export const audioAssetManifest = {
  bgm: {
    opening: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/01-bgm_opening_loop.ogg", import.meta.url).href,
    lobby: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/02-bgm_lobby_loop.ogg", import.meta.url).href,
    battle: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/03-bgm_battle_loop.ogg", import.meta.url).href,
  },
  sfx: {
    victory: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/04-bgm_victory_stinger.ogg", import.meta.url).href,
    defeat: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/05-bgm_defeat_stinger.ogg", import.meta.url).href,
    catMelee: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/06-sfx_unit_cat_melee_01.wav", import.meta.url).href,
    catLancer: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/07-sfx_unit_cat_lancer_01.wav", import.meta.url).href,
    catArcher: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/08-sfx_unit_cat_archer_01.wav", import.meta.url).href,
    catMage: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/09-sfx_unit_cat_mage_01.wav", import.meta.url).href,
    catTank: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/10-sfx_unit_cat_tank_01.wav", import.meta.url).href,
    catBomb: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/11-sfx_unit_cat_bomb_01.wav", import.meta.url).href,
    catFrost: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/12-sfx_unit_cat_frost_01.wav", import.meta.url).href,
    catCannon: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/13-sfx_unit_cat_cannon_01.wav", import.meta.url).href,
    dogAttack: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/14-sfx_unit_dog_attack_01.wav", import.meta.url).href,
    dogHeavy: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/15-sfx_unit_dog_heavy_01.wav", import.meta.url).href,
    skillFireCast: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/16-sfx_skill_fire_cast.wav", import.meta.url).href,
    skillFireImpact: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/17-sfx_skill_fire_impact.wav", import.meta.url).href,
    skillHealCast: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/18-sfx_skill_heal_cast.wav", import.meta.url).href,
    skillHealTick: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/19-sfx_skill_heal_tick.wav", import.meta.url).href,
    skillSuperSummon: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/20-sfx_skill_super_summon.wav", import.meta.url).href,
    baseHitLight: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/21-sfx_base_hit_light.wav", import.meta.url).href,
    baseHitHeavy: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/22-sfx_base_hit_heavy.wav", import.meta.url).href,
    baseDestroyed: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/23-sfx_base_destroyed.wav", import.meta.url).href,
    occupationSpeedup: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/24-sfx_occupation_speedup.wav", import.meta.url).href,
    uiTap: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/25-ui_button_tap.wav", import.meta.url).href,
    uiDisabled: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/26-ui_button_disabled.wav", import.meta.url).href,
    stageSelect: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/27-ui_stage_select.wav", import.meta.url).href,
    shopOpen: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/28-ui_shop_open.wav", import.meta.url).href,
    shopPurchase: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/29-ui_shop_purchase_success.wav", import.meta.url).href,
    shopNotEnough: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/30-ui_shop_not_enough.wav", import.meta.url).href,
    dailyReward: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/31-ui_daily_reward_claim.wav", import.meta.url).href,
    adRewardReady: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/32-ui_ad_reward_ready.wav", import.meta.url).href,
    adRewardClaimed: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/33-ui_ad_reward_claimed.wav", import.meta.url).href,
    goldCount: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/34-sfx_gold_count_up.ogg", import.meta.url).href,
    fishCount: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/35-sfx_fish_count_up.ogg", import.meta.url).href,
    upgradeSpend: new URL("../../sound/SOUND_PROMPTS_READY_TO_COPY_20260608/36-sfx_upgrade_spend.wav", import.meta.url).href,
  },
} as const;

export type BgmKey = keyof typeof audioAssetManifest.bgm;
export type SfxKey = keyof typeof audioAssetManifest.sfx;

const bgmVolume: Record<BgmKey, number> = {
  opening: 0.28,
  lobby: 0.24,
  battle: 0.2,
};

const sfxVolume: Partial<Record<SfxKey, number>> = {
  victory: 0.56,
  defeat: 0.5,
  baseDestroyed: 0.58,
  baseHitHeavy: 0.42,
  shopOpen: 0.42,
  shopPurchase: 0.48,
  shopNotEnough: 0.44,
  goldCount: 0.38,
  fishCount: 0.38,
  uiTap: 0.38,
  uiDisabled: 0.36,
};

const sfxCooldownMs: Partial<Record<SfxKey, number>> = {
  catMelee: 120,
  catLancer: 130,
  catArcher: 120,
  catMage: 180,
  dogAttack: 115,
  dogHeavy: 180,
  skillHealTick: 220,
  baseHitLight: 220,
  baseHitHeavy: 360,
  goldCount: 180,
  fishCount: 180,
};

let desiredBgm: BgmKey | null = null;
let activeBgm: HTMLAudioElement | null = null;
let activeBgmKey: BgmKey | null = null;
let audioUnlocked = false;
let audioMuted = false;
let listenerCleanup: (() => void) | null = null;

const lastPlayedAt = new Map<SfxKey, number>();
const sfxPool = new Map<SfxKey, HTMLAudioElement[]>();

function canUseAudio(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

function makeAudio(src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

function getSfxAudio(key: SfxKey): HTMLAudioElement {
  const existingPool = sfxPool.get(key) ?? [];
  const reusable = existingPool.find((audio) => audio.paused || audio.ended);
  if (reusable) {
    return reusable;
  }

  const next = makeAudio(audioAssetManifest.sfx[key]);
  existingPool.push(next);
  if (existingPool.length > 5) {
    existingPool.shift();
  }
  sfxPool.set(key, existingPool);
  return next;
}

async function applyDesiredBgm(): Promise<void> {
  if (!canUseAudio() || audioMuted || !audioUnlocked) {
    return;
  }

  if (!desiredBgm) {
    activeBgm?.pause();
    activeBgm = null;
    activeBgmKey = null;
    return;
  }

  if (activeBgmKey !== desiredBgm) {
    activeBgm?.pause();
    activeBgm = makeAudio(audioAssetManifest.bgm[desiredBgm]);
    activeBgm.loop = true;
    activeBgm.volume = bgmVolume[desiredBgm];
    activeBgmKey = desiredBgm;
  }

  try {
    await activeBgm?.play();
  } catch {
    // Browser autoplay policy can reject until the next direct user gesture.
  }
}

export function unlockGameAudio(): void {
  if (!canUseAudio()) {
    return;
  }
  audioUnlocked = true;
  void applyDesiredBgm();
}

export function installAudioUnlockListeners(): () => void {
  if (!canUseAudio()) {
    return () => undefined;
  }

  if (listenerCleanup) {
    return listenerCleanup;
  }

  const unlock = () => unlockGameAudio();
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });

  listenerCleanup = () => {
    window.removeEventListener("pointerdown", unlock, { capture: true });
    window.removeEventListener("keydown", unlock, { capture: true });
    listenerCleanup = null;
  };

  return listenerCleanup;
}

export function setGameBgm(key: BgmKey | null): void {
  desiredBgm = key;
  void applyDesiredBgm();
}

export function playSfx(key: SfxKey, options: { volume?: number; force?: boolean } = {}): void {
  if (!canUseAudio() || audioMuted) {
    return;
  }

  const now = performance.now();
  const minInterval = sfxCooldownMs[key] ?? 70;
  const previous = lastPlayedAt.get(key) ?? 0;
  if (!options.force && now - previous < minInterval) {
    return;
  }
  lastPlayedAt.set(key, now);

  const audio = getSfxAudio(key);
  audio.currentTime = 0;
  audio.volume = options.volume ?? sfxVolume[key] ?? 0.34;
  void audio.play().catch(() => undefined);
}

export function playBattleEventSfx(event: BattleEvent): void {
  if (event.effectId === "fx_fire_bombardment") {
    playSfx("skillFireImpact");
    return;
  }

  if (event.effectId === "fx_healing_light") {
    playSfx("skillHealTick");
    return;
  }

  if (event.effectId === "fx_summon_portal") {
    playSfx(event.kind === "upgrade" ? "upgradeSpend" : "skillSuperSummon");
    return;
  }

  if (event.effectId === "fx_base_explosion") {
    playSfx("baseDestroyed", { force: true });
    return;
  }

  if (event.effectId === "fx_base_hit") {
    playSfx((event.value ?? 0) >= 22 ? "baseHitHeavy" : "baseHitLight");
    return;
  }

  if (event.kind === "warning") {
    playSfx("shopNotEnough");
    return;
  }

  if (event.kind === "money") {
    playSfx("goldCount");
    return;
  }

  if (event.kind === "hit") {
    playSfx((event.value ?? 0) >= 18 ? "dogHeavy" : "dogAttack");
  }
}

export function playBattleResultSfx(winnerFactionId: string | undefined): void {
  if (!winnerFactionId) {
    return;
  }
  playSfx(winnerFactionId === "cat_kingdom" ? "victory" : "defeat", { force: true });
}

export function setAudioMuted(muted: boolean): void {
  audioMuted = muted;
  if (audioMuted) {
    activeBgm?.pause();
    return;
  }
  void applyDesiredBgm();
}
