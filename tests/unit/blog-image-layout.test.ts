import { describe, it, expect } from "vitest";
import { gridColsClass, attributionCredit } from "@/lib/blog-image-layout";

describe("gridColsClass", () => {
  it("maps 2/3/4 photos to full Tailwind class names", () => {
    expect(gridColsClass(2)).toBe("md:grid-cols-2");
    expect(gridColsClass(3)).toBe("md:grid-cols-3");
    expect(gridColsClass(4)).toBe("md:grid-cols-4");
  });

  it("clamps out-of-range counts to 2..4", () => {
    expect(gridColsClass(1)).toBe("md:grid-cols-2");
    expect(gridColsClass(0)).toBe("md:grid-cols-2");
    expect(gridColsClass(5)).toBe("md:grid-cols-4");
  });
});

describe("attributionCredit", () => {
  it("returns null when attribution is absent", () => {
    expect(attributionCredit(undefined)).toBeNull();
  });

  it("returns null for an empty object Sanity may persist", () => {
    expect(attributionCredit({})).toBeNull();
    expect(attributionCredit({ credit: "" })).toBeNull();
    expect(attributionCredit({ credit: "   " })).toBeNull();
  });

  it("returns the trimmed credit when present", () => {
    expect(attributionCredit({ credit: "  Photo by Jane / Unsplash " })).toBe(
      "Photo by Jane / Unsplash"
    );
  });
});
