import { describe, it, expect } from "vitest";
import { mapGalleryImages, type RawGalleryImage } from "@/lib/gallery-images";

const toUrl = (img: RawGalleryImage) => `https://cdn/${(img.asset as { ref: string }).ref}`;

describe("mapGalleryImages", () => {
  it("returns [] when undefined/null", () => {
    expect(mapGalleryImages(undefined, toUrl, "fallback")).toEqual([]);
    expect(mapGalleryImages(null, toUrl, "fallback")).toEqual([]);
  });

  it("returns [] for an empty array", () => {
    expect(mapGalleryImages([], toUrl, "fallback")).toEqual([]);
  });

  it("maps items to { url, alt }", () => {
    const raw: RawGalleryImage[] = [
      { asset: { ref: "a" }, alt: "In a bright kitchen" },
      { asset: { ref: "b" }, alt: "Framed on a wall" },
    ];
    expect(mapGalleryImages(raw, toUrl, "My Art")).toEqual([
      { url: "https://cdn/a", alt: "In a bright kitchen" },
      { url: "https://cdn/b", alt: "Framed on a wall" },
    ]);
  });

  it("drops draft items with no asset", () => {
    const raw: RawGalleryImage[] = [
      { asset: { ref: "a" }, alt: "real" },
      { alt: "no asset yet" },
      { asset: undefined },
    ];
    expect(mapGalleryImages(raw, toUrl, "My Art")).toEqual([
      { url: "https://cdn/a", alt: "real" },
    ]);
  });

  it("falls back to title when alt is missing or blank", () => {
    const raw: RawGalleryImage[] = [
      { asset: { ref: "a" } },
      { asset: { ref: "b" }, alt: "   " },
    ];
    expect(mapGalleryImages(raw, toUrl, "My Art")).toEqual([
      { url: "https://cdn/a", alt: "My Art" },
      { url: "https://cdn/b", alt: "My Art" },
    ]);
  });
});
