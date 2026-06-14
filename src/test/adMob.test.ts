import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const appSourcePath = fileURLToPath(new URL("../App.tsx", import.meta.url));
const resultScreenSourcePath = fileURLToPath(new URL("../screens/ResultScreen.tsx", import.meta.url));

const testWindow = globalThis as typeof globalThis & {
  CatKingdomWarsAdMob?: unknown;
};

describe("AdMob integration", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("window", testWindow);
    delete testWindow.CatKingdomWarsAdMob;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock("@capacitor/core");
    vi.doUnmock("@capacitor-community/admob");
    delete testWindow.CatKingdomWarsAdMob;
    vi.unstubAllGlobals();
  });

  it("keeps the production Android app id and all requested ad unit ids", async () => {
    const { ADMOB_AD_UNITS, ADMOB_APP_ID } = await import("../game/adMob");

    expect(ADMOB_APP_ID).toBe("ca-app-pub-4402708884038037~4420529687");
    expect(ADMOB_AD_UNITS.appOpenReturn).toMatchObject({
      name: "CKW_Android_AppOpen_Return",
      id: "ca-app-pub-4402708884038037/9285843556",
      format: "app_open",
    });
    expect(ADMOB_AD_UNITS.interstitialStageBreak).toMatchObject({
      name: "CKW_Android_Interstitial_StageBreak",
      id: "ca-app-pub-4402708884038037/3654242921",
      format: "interstitial",
    });
    expect(ADMOB_AD_UNITS.rewardedResultBonus).toMatchObject({
      name: "CKW_Android_Rewarded_ResultBonus",
      id: "ca-app-pub-4402708884038037/6280406266",
      format: "rewarded",
    });
  });

  it("initializes a native bridge with the app id and ad unit metadata", async () => {
    const initialize = vi.fn();
    testWindow.CatKingdomWarsAdMob = { initialize };
    const { ADMOB_AD_UNITS, ADMOB_APP_ID, initializeAdMob } = await import("../game/adMob");

    await initializeAdMob();

    expect(initialize).toHaveBeenCalledWith({
      appId: ADMOB_APP_ID,
      adUnits: ADMOB_AD_UNITS,
    });
  });

  it("shows the rewarded result bonus through the native rewarded ad unit", async () => {
    const showRewarded = vi.fn().mockResolvedValue({ rewarded: true });
    testWindow.CatKingdomWarsAdMob = { showRewarded };
    const { showResultBonusRewardedAd } = await import("../game/adMob");

    const result = await showResultBonusRewardedAd();

    expect(showRewarded).toHaveBeenCalledWith("ca-app-pub-4402708884038037/6280406266", "rewardedResultBonus");
    expect(result).toEqual({ shown: true, rewarded: true, source: "native" });
  });

  it("uses the stage-break interstitial ad unit when returning from battle flow", async () => {
    const showInterstitial = vi.fn().mockResolvedValue(true);
    testWindow.CatKingdomWarsAdMob = { showInterstitial };
    const { showStageBreakInterstitial } = await import("../game/adMob");

    const result = await showStageBreakInterstitial();

    expect(showInterstitial).toHaveBeenCalledWith("ca-app-pub-4402708884038037/3654242921", "interstitialStageBreak");
    expect(result).toEqual({ shown: true, source: "native" });
  });

  it("uses the app-open return ad unit through the native bridge", async () => {
    const showAppOpen = vi.fn().mockResolvedValue(true);
    testWindow.CatKingdomWarsAdMob = { showAppOpen };
    const { showAppOpenReturnAd } = await import("../game/adMob");

    const result = await showAppOpenReturnAd();

    expect(showAppOpen).toHaveBeenCalledWith("ca-app-pub-4402708884038037/9285843556", "appOpenReturn");
    expect(result).toEqual({ shown: true, source: "native" });
  });

  it("keeps browser development usable by simulating only the rewarded bonus", async () => {
    const { showAppOpenReturnAd, showResultBonusRewardedAd, showStageBreakInterstitial } = await import("../game/adMob");

    await expect(showAppOpenReturnAd()).resolves.toEqual({ shown: false, source: "web-simulation" });
    await expect(showStageBreakInterstitial()).resolves.toEqual({ shown: false, source: "web-simulation" });

    const rewarded = showResultBonusRewardedAd();
    await vi.advanceTimersByTimeAsync(1000);

    await expect(rewarded).resolves.toEqual({ shown: true, rewarded: true, source: "web-simulation" });
  });

  it("shows the rewarded result bonus through the Capacitor AdMob plugin on native runtimes", async () => {
    const initialize = vi.fn().mockResolvedValue(undefined);
    const prepareRewardVideoAd = vi.fn().mockResolvedValue({});
    const showRewardVideoAd = vi.fn().mockResolvedValue({ type: "coins", amount: 1 });

    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => true,
      },
    }));
    vi.doMock("@capacitor-community/admob", () => ({
      AdMob: {
        initialize,
        prepareRewardVideoAd,
        showRewardVideoAd,
      },
    }));

    const { showResultBonusRewardedAd } = await import("../game/adMob");

    const result = await showResultBonusRewardedAd();

    expect(initialize).toHaveBeenCalledTimes(1);
    expect(prepareRewardVideoAd).toHaveBeenCalledWith({
      adId: "ca-app-pub-4402708884038037/6280406266",
      immersiveMode: true,
    });
    expect(showRewardVideoAd).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ shown: true, rewarded: true, source: "native" });
  });

  it("shows the stage-break interstitial through the Capacitor AdMob plugin on native runtimes", async () => {
    const initialize = vi.fn().mockResolvedValue(undefined);
    const prepareInterstitial = vi.fn().mockResolvedValue({});
    const showInterstitial = vi.fn().mockResolvedValue(undefined);

    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => true,
      },
    }));
    vi.doMock("@capacitor-community/admob", () => ({
      AdMob: {
        initialize,
        prepareInterstitial,
        showInterstitial,
      },
    }));

    const { showStageBreakInterstitial } = await import("../game/adMob");

    const result = await showStageBreakInterstitial();

    expect(initialize).toHaveBeenCalledTimes(1);
    expect(prepareInterstitial).toHaveBeenCalledWith({
      adId: "ca-app-pub-4402708884038037/3654242921",
      immersiveMode: true,
    });
    expect(showInterstitial).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ shown: true, source: "native" });
  });

  it("does not grant simulated rewarded ads when the native AdMob plugin is unavailable", async () => {
    const initialize = vi.fn().mockRejectedValue(new Error("Native plugin unavailable"));

    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => true,
      },
    }));
    vi.doMock("@capacitor-community/admob", () => ({
      AdMob: {
        initialize,
      },
    }));

    const { showResultBonusRewardedAd } = await import("../game/adMob");

    const rewarded = showResultBonusRewardedAd();
    await vi.advanceTimersByTimeAsync(1000);

    await expect(rewarded).resolves.toEqual({
      shown: false,
      rewarded: false,
      source: "native",
      error: "Native plugin unavailable",
    });
  });

  it("wires app-open ads into the app lifecycle", () => {
    const source = readFileSync(appSourcePath, "utf8");

    expect(source).toContain("initializeAdMob");
    expect(source).toContain("showAppOpenReturnAd");
    expect(source).toContain("visibilitychange");
  });

  it("wires rewarded and interstitial ads into the result screen", () => {
    const source = readFileSync(resultScreenSourcePath, "utf8");

    expect(source).toContain("showResultBonusRewardedAd");
    expect(source).toContain("showStageBreakInterstitial");
    expect(source).not.toContain("mockRewardAd");
  });
});
