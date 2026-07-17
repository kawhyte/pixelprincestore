import { describe, it, expect } from "vitest";
import {
  getImageOrientation,
  getCardAspectClass,
  getOptimalImageDimensions,
} from "@/lib/image-utils";

describe("getImageOrientation", () => {
  it("detects portrait", () => {
    expect(getImageOrientation(600, 800).orientation).toBe("portrait");
  });
  it("detects landscape", () => {
    expect(getImageOrientation(800, 600).orientation).toBe("landscape");
  });
  it("detects square", () => {
    expect(getImageOrientation(600, 600).orientation).toBe("square");
  });
});

describe("getCardAspectClass", () => {
  it("returns a non-empty class for each orientation", () => {
    expect(getCardAspectClass("portrait")).toBe("aspect-[3/4]");
    expect(getCardAspectClass("landscape")).toBe("aspect-[4/3]");
    expect(getCardAspectClass("square")).toBe("aspect-square");
  });
});

describe("getOptimalImageDimensions", () => {
  it("constrains landscape by width, preserves ratio", () => {
    const { width, height } = getOptimalImageDimensions(1600, 1200, "landscape", 800);
    expect(width).toBe(800);
    expect(height).toBe(600);
  });
  it("constrains portrait by height, preserves ratio", () => {
    const { width, height } = getOptimalImageDimensions(1200, 1600, "portrait", 800);
    expect(height).toBe(800);
    expect(width).toBe(600);
  });
  it("square uses maxDimension for both sides", () => {
    expect(getOptimalImageDimensions(1000, 1000, "square", 800)).toEqual({
      width: 800,
      height: 800,
    });
  });
});
