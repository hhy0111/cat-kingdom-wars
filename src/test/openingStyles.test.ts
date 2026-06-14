import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("opening screen styles", () => {
  it("renders fast marching cats fully opaque", () => {
    const css = readFileSync(fileURLToPath(new URL("../styles.css", import.meta.url)), "utf8");
    const match = css.match(/\.marching-cats span\s*\{(?<body>[^}]+)\}/);

    expect(match?.groups?.body).toBeDefined();
    expect(match?.groups?.body).not.toMatch(/opacity:\s*0\.\d+/);
    expect(match?.groups?.body).toMatch(/opacity:\s*1\s*;/);
  });
});
