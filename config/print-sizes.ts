export type ArtRatio = "4:5";

export interface PrintSize {
  label: string; // e.g. '4×5″'
  cm: string; // e.g. '10×13 cm'
  fits: string; // e.g. 'Small frames, desk display'
}

export const PRINT_SIZES: Record<ArtRatio, PrintSize[]> = {
  "4:5": [
    { label: '4×5″', cm: "10×13 cm", fits: "Small frames, desk display" },
    { label: '8×10″', cm: "20×25 cm", fits: "The classic frame size" },
    { label: '16×20″', cm: "40×50 cm", fits: "Statement pieces" },
  ],
};

/** Derive ratio from pixel dimensions; null when the crop isn't 4:5 portrait. */
export function deriveRatio(width: number, height: number): ArtRatio | null {
  const r = width / height;
  if (r >= 0.76 && r <= 0.84) return "4:5";
  return null;
}

/** Minimum master resolution: 300dpi at 16×20 (the largest print size). */
export const MIN_MASTER_WIDTH = 4800;
export const MIN_MASTER_HEIGHT = 6000;
