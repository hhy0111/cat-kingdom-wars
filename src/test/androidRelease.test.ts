import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const androidAppId = "com.hhy0111.catkingdomwars";
const adMobAppId = "ca-app-pub-4402708884038037~4420529687";

describe("Android release packaging", () => {
  it("keeps Capacitor configured for the Play Store app identity", () => {
    const config = readFileSync("capacitor.config.ts", "utf8");

    expect(config).toContain(`appId: "${androidAppId}"`);
    expect(config).toContain('appName: "냥이 왕국 전쟁"');
    expect(config).toContain('webDir: "dist"');
  });

  it("configures the Android app for a signed release bundle", () => {
    const buildGradle = readFileSync("android/app/build.gradle", "utf8");
    const manifest = readFileSync("android/app/src/main/AndroidManifest.xml", "utf8");
    const strings = readFileSync("android/app/src/main/res/values/strings.xml", "utf8");
    const mainActivity = readFileSync("android/app/src/main/java/com/hhy0111/catkingdomwars/MainActivity.java", "utf8");
    const billingPlugin = readFileSync("android/app/src/main/java/com/hhy0111/catkingdomwars/PlayBillingPlugin.java", "utf8");

    expect(buildGradle).toContain(`namespace "${androidAppId}"`);
    expect(buildGradle).toContain(`applicationId "${androidAppId}"`);
    expect(buildGradle).toContain("versionCode 2");
    expect(buildGradle).toContain('versionName "1.0.1"');
    expect(buildGradle).toContain("com.android.billingclient:billing:9.0.0");
    expect(buildGradle).toContain("signingConfig signingConfigs.release");
    expect(manifest).toContain("android.permission.INTERNET");
    expect(manifest).toContain("com.android.vending.BILLING");
    expect(manifest).toContain("com.google.android.gms.ads.APPLICATION_ID");
    expect(manifest).toContain("@string/admob_app_id");
    expect(strings).toContain(`<string name="admob_app_id">${adMobAppId}</string>`);
    expect(mainActivity).toContain("registerPlugin(PlayBillingPlugin.class)");
    expect(billingPlugin).toContain('@CapacitorPlugin(name = "PlayBilling")');
    expect(billingPlugin).toContain("consumeAsync");
  });

  it("includes Play Store and Android launcher assets", () => {
    expect(existsSync("store-assets/play-icon-512.png")).toBe(true);
    expect(existsSync("store-assets/play-feature-graphic-1024x500.png")).toBe(true);
    expect(existsSync("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png")).toBe(true);
    expect(existsSync("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")).toBe(true);
  });
});
