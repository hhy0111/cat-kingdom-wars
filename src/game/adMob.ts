import { AdMob } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

export const ADMOB_APP_ID = "ca-app-pub-4402708884038037~4420529687";

export type AdMobPlacement = "appOpenReturn" | "interstitialStageBreak" | "rewardedResultBonus";
export type AdMobFormat = "app_open" | "interstitial" | "rewarded";

export type AdMobAdUnit = {
  name: string;
  id: string;
  format: AdMobFormat;
};

export const ADMOB_AD_UNITS: Record<AdMobPlacement, AdMobAdUnit> = {
  appOpenReturn: {
    name: "CKW_Android_AppOpen_Return",
    id: "ca-app-pub-4402708884038037/9285843556",
    format: "app_open",
  },
  interstitialStageBreak: {
    name: "CKW_Android_Interstitial_StageBreak",
    id: "ca-app-pub-4402708884038037/3654242921",
    format: "interstitial",
  },
  rewardedResultBonus: {
    name: "CKW_Android_Rewarded_ResultBonus",
    id: "ca-app-pub-4402708884038037/6280406266",
    format: "rewarded",
  },
};

export type AdMobShowResult = {
  shown: boolean;
  rewarded?: boolean;
  source: "native" | "web-simulation";
  error?: string;
};

type NativeAdMobBridge = {
  initialize?: (config: { appId: string; adUnits: typeof ADMOB_AD_UNITS }) => void | Promise<void>;
  showAppOpen?: (adUnitId: string, placement: AdMobPlacement) => boolean | AdMobShowResult | Promise<boolean | AdMobShowResult>;
  showInterstitial?: (adUnitId: string, placement: AdMobPlacement) => boolean | AdMobShowResult | Promise<boolean | AdMobShowResult>;
  showRewarded?: (adUnitId: string, placement: AdMobPlacement) => boolean | AdMobShowResult | Promise<boolean | AdMobShowResult>;
};

declare global {
  interface Window {
    CatKingdomWarsAdMob?: NativeAdMobBridge;
  }
}

const REWARDED_WEB_SIMULATION_MS = 1000;

let initializedBridge: NativeAdMobBridge | null = null;
let nativePluginInitialization: Promise<void> | null = null;
let nativePluginInitialized = false;

export async function initializeAdMob(): Promise<void> {
  const bridge = getBridge();
  if (!bridge) {
    if (isNativeRuntime()) {
      await initializeNativePlugin();
    }

    return;
  }

  if (initializedBridge === bridge) {
    return;
  }

  initializedBridge = bridge;
  await bridge.initialize?.({
    appId: ADMOB_APP_ID,
    adUnits: ADMOB_AD_UNITS,
  });
}

export async function showAppOpenReturnAd(): Promise<AdMobShowResult> {
  const bridge = getBridge();
  if (!bridge?.showAppOpen) {
    if (isNativeRuntime()) {
      return missingNativeBridgeResult(false);
    }

    return { shown: false, source: "web-simulation" };
  }

  return showNativeAd(() => bridge.showAppOpen!(ADMOB_AD_UNITS.appOpenReturn.id, "appOpenReturn"), false);
}

export async function showStageBreakInterstitial(): Promise<AdMobShowResult> {
  const bridge = getBridge();
  if (!bridge?.showInterstitial) {
    if (isNativeRuntime()) {
      return showNativeAd(async () => {
        await initializeNativePlugin();
        await AdMob.prepareInterstitial({
          adId: ADMOB_AD_UNITS.interstitialStageBreak.id,
          immersiveMode: true,
        });
        await AdMob.showInterstitial();
        return true;
      }, false);
    }

    return { shown: false, source: "web-simulation" };
  }

  return showNativeAd(
    () => bridge.showInterstitial!(ADMOB_AD_UNITS.interstitialStageBreak.id, "interstitialStageBreak"),
    false,
  );
}

export async function showResultBonusRewardedAd(): Promise<AdMobShowResult> {
  const bridge = getBridge();
  if (!bridge?.showRewarded) {
    if (isNativeRuntime()) {
      return showNativeAd(async () => {
        await initializeNativePlugin();
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_AD_UNITS.rewardedResultBonus.id,
          immersiveMode: true,
        });
        await AdMob.showRewardVideoAd();
        return true;
      }, true);
    }

    await wait(REWARDED_WEB_SIMULATION_MS);
    return { shown: true, rewarded: true, source: "web-simulation" };
  }

  return showNativeAd(() => bridge.showRewarded!(ADMOB_AD_UNITS.rewardedResultBonus.id, "rewardedResultBonus"), true);
}

function getBridge(): NativeAdMobBridge | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.CatKingdomWarsAdMob;
}

function isNativeRuntime(): boolean {
  return Capacitor.isNativePlatform();
}

async function initializeNativePlugin(): Promise<void> {
  if (nativePluginInitialized) {
    return;
  }

  nativePluginInitialization ??= AdMob.initialize();

  try {
    await nativePluginInitialization;
    nativePluginInitialized = true;
  } catch (error) {
    nativePluginInitialization = null;
    throw error;
  }
}

function missingNativeBridgeResult(expectsReward: boolean): AdMobShowResult {
  return {
    shown: false,
    rewarded: expectsReward ? false : undefined,
    source: "native",
    error: "Native AdMob bridge is not installed",
  };
}

async function showNativeAd(
  show: () => boolean | AdMobShowResult | Promise<boolean | AdMobShowResult>,
  expectsReward: boolean,
): Promise<AdMobShowResult> {
  try {
    const result = await show();
    if (typeof result === "boolean") {
      return expectsReward
        ? { shown: result, rewarded: result, source: "native" }
        : { shown: result, source: "native" };
    }

    const normalized: AdMobShowResult = {
      shown: typeof result.shown === "boolean" ? result.shown : expectsReward ? Boolean(result.rewarded) : false,
      source: "native",
    };

    if (expectsReward || typeof result.rewarded === "boolean") {
      normalized.rewarded = Boolean(result.rewarded);
    }

    if (result.error) {
      normalized.error = result.error;
    }

    return normalized;
  } catch (error) {
    return {
      shown: false,
      rewarded: expectsReward ? false : undefined,
      source: "native",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export {};
