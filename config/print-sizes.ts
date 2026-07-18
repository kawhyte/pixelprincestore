export type ArtRatio = "4:5" | "5:4";

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
  "5:4": [
    { label: '5×4″', cm: "13×10 cm", fits: "Small frames, desk display" },
    { label: '10×8″', cm: "25×20 cm", fits: "The classic frame size" },
    { label: '20×16″', cm: "50×40 cm", fits: "Statement pieces" },
  ],
};

/** Derive ratio from pixel dimensions; null when the crop is off. */
export function deriveRatio(width: number, height: number): ArtRatio | null {
  const r = width / height;
  if (r >= 0.76 && r <= 0.84) return "4:5";
  if (r >= 1.19 && r <= 1.31) return "5:4";
  return null;
}

/** Minimum master resolution: 300dpi at 8×10 (and 150dpi at 16×20). */
export const MIN_MASTER_WIDTH = 2400;
export const MIN_MASTER_HEIGHT = 3000;
