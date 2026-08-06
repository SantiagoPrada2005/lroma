import { describe, it, expect } from "vitest";
import { getGlassClass, getGlassClassSafe } from "./glass";

describe("getGlassClass", () => {
  it('returns "glass-sm" for "sm" level', () => {
    expect(getGlassClass("sm")).toBe("glass-sm");
  });

  it('returns "glass-md" for "md" level', () => {
    expect(getGlassClass("md")).toBe("glass-md");
  });

  it('returns "glass-xl" for "xl" level', () => {
    expect(getGlassClass("xl")).toBe("glass-xl");
  });

  it("returns a different class for each level", () => {
    const sm = getGlassClass("sm");
    const md = getGlassClass("md");
    const xl = getGlassClass("xl");

    expect(sm).not.toBe(md);
    expect(md).not.toBe(xl);
    expect(sm).not.toBe(xl);
  });
});

describe("getGlassClassSafe", () => {
  it('includes the base glass class for "sm"', () => {
    const result = getGlassClassSafe("sm");
    expect(result).toContain("glass-sm");
  });

  it('includes motion-safe and motion-reduce classes for "md"', () => {
    const result = getGlassClassSafe("md");
    expect(result).toContain("glass-md");
    expect(result).toContain("motion-safe:backdrop-blur-md");
    expect(result).toContain("motion-reduce:bg-black/60");
  });

  it('includes motion-safe and motion-reduce classes for "xl"', () => {
    const result = getGlassClassSafe("xl");
    expect(result).toContain("glass-xl");
    expect(result).toContain("motion-safe:backdrop-blur-xl");
    expect(result).toContain("motion-reduce:bg-black/70");
  });

  it("returns different fallback backgrounds for each level", () => {
    const sm = getGlassClassSafe("sm");
    const md = getGlassClassSafe("md");
    const xl = getGlassClassSafe("xl");

    expect(sm).toContain("motion-reduce:bg-black/50");
    expect(md).toContain("motion-reduce:bg-black/60");
    expect(xl).toContain("motion-reduce:bg-black/70");
  });
});
