import type { ImageAttribution } from "@/sanity/lib/blog";

// Full class names so Tailwind's static scanner can see them.
// Dynamically concatenated `md:grid-cols-${n}` strings compile to NO CSS.
const MD_GRID_COLS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/** Map a photo count (clamped 2–4) to its desktop grid-cols class. */
export function gridColsClass(count: number): string {
  const clamped = Math.min(Math.max(count, 2), 4);
  return MD_GRID_COLS[clamped];
}

/**
 * The credit string to render, or null when there's nothing to show.
 * Sanity may persist an empty `attribution` object with blank fields:
 * only render when `credit` is a non-empty string.
 */
export function attributionCredit(attribution?: ImageAttribution): string | null {
  const credit = attribution?.credit?.trim();
  return credit ? credit : null;
}
