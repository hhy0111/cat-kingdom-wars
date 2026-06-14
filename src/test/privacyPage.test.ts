import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const privacyPagePath = fileURLToPath(new URL("../../public/privacy.html", import.meta.url));
const openingScreenPath = fileURLToPath(new URL("../screens/OpeningScreen.tsx", import.meta.url));

describe("privacy policy page", () => {
  it("provides a public static privacy policy page for store review", () => {
    expect(existsSync(privacyPagePath)).toBe(true);

    const html = readFileSync(privacyPagePath, "utf8");

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Cat Kingdom Wars");
    expect(html).toContain("개인정보처리방침");
    expect(html).toContain("Google AdMob");
    expect(html).toContain("localStorage");
    expect(html).toContain("https://github.com/hhy0111/cat-kingdom-wars/issues");
    expect(html).not.toMatch(/TBD|TODO|작성 필요|example@example\.com/i);
  });

  it("links the privacy policy from the opening screen", () => {
    const source = readFileSync(openingScreenPath, "utf8");

    expect(source).toContain('href="/privacy.html"');
    expect(source).toContain("개인정보처리방침");
  });
});
