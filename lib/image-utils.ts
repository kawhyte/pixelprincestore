/**
 * Image Orientation Utilities
 *
 * Helper functions for detecting image orientation from dimensions
 * and applying appropriate aspect ratios to gallery cards.
 */

export interface ImageOrientation {
  orientation: 'portrait' | 'landscape' | 'square';
  aspectRatio: number;
  width: number;
  height: number;
}

/**
 * Detect image orientation from dimensions
 *
 * Uses thresholds to categorize images:
 * - Landscape: width > height (aspect ratio > 1.05)
 * - Portrait: height > width (aspect ratio < 0.95)
 * - Square: approximately equal dimensions (0.95 ≤ aspect ratio ≤ 1.05)
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns ImageOrientation object with detected orientation and metadata
 */
export function getImageOrientation(width: number, height: number): ImageOrientation {
  const aspectRatio = width / height;

  let orientation: 'portrait' | 'landscape' | 'square';
  if (aspectRatio > 1.05) {
    orientation = 'landscape';
  } else if (aspectRatio < 0.95) {
    orientation = 'portrait';
  } else {
    orientation = 'square';
  }

  return { orientation, aspectRatio, width, height };
}

/**
 * Get Tailwind CSS aspect ratio class for card container
 *
 * Maps orientation to appropriate Tailwind aspect ratio utilities:
 * - Portrait → aspect-[3/4] (vertical cards, 600×800)
 * - Landscape → aspect-[4/3] (horizontal cards, 800×600)
 * - Square → aspect-square (1:1 ratio, 600×600)
 *
 * @param orientation - Image orientation ('portrait' | 'landscape' | 'square')
 * @returns Tailwind CSS class string for aspect ratio
 */
export function getCardAspectClass(orientation: ImageOrientation['orientation']): string {
  switch (orientation) {
    case 'landscape':
      return 'aspect-[4/3]';
    case 'portrait':
      return 'aspect-[3/4]';
    case 'square':
      return 'aspect-square';
    default:
      return 'aspect-[3/4]'; // Fallback to portrait for safety
  }
}

/**
 * Calculate optimal image transform dimensions based on orientation
 *
 * Maintains original aspect ratio while constraining to maximum dimension.
 * This ensures efficient Sanity CDN transforms without quality loss.
 *
 * Examples:
 * - Landscape 1600×1200 → 800×600 (constrained by width)
 * - Portrait 1200×1600 → 600×800 (constrained by height)
 * - Square 1000×1000 → 800×800
 *
 * @param originalWidth - Original image width in pixels
 * @param originalHeight - Original image height in pixels
 * @param orientation - Detected orientation
 * @param maxDimension - Maximum dimension for longest side (default: 800)
 * @returns Object with optimized { width, height } for Sanity image transforms
 */
export function getOptimalImageDimensions(
  originalWidth: number,
  originalHeight: number,
  orientation: 'portrait' | 'landscape' | 'square',
  maxDimension: number = 800
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (orientation === 'landscape') {
    // Constrain width to maxDimension, calculate height to maintain aspect ratio
    const width = maxDimension;
    const height = Math.round(width / aspectRatio);
    return { width, height };
  } else if (orientation === 'portrait') {
    // Constrain height to maxDimension, calculate width to maintain aspect ratio
    const height = maxDimension;
    const width = Math.round(height * aspectRatio);
    return { width, height };
  } else {
    // Square: both dimensions equal to maxDimension
    return { width: maxDimension, height: maxDimension };
  }
}
