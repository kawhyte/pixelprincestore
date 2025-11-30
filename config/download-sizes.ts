/**
 * Download Size Availability Configuration
 *
 * This file controls which digital download sizes are available to users.
 * Modify these arrays to enable/disable sizes without changing Sanity schemas.
 */

/**
 * Size IDs that are currently available for free download
 * These sizes will be fully functional with download buttons
 */
export const AVAILABLE_FREE_SIZES = ['4x5', '8x10'] as const;

/**
 * Size IDs that are marked as "coming soon"
 * These sizes will be displayed but disabled with a "Coming Soon" badge
 */
export const COMING_SOON_SIZES = ['16x20', '40x50cm'] as const;

/**
 * Message displayed for coming soon sizes
 */
export const COMING_SOON_MESSAGE = 'Premium sizes launching soon!';

/**
 * All valid size IDs (for type checking)
 */
export const ALL_SIZE_IDS = [
  ...AVAILABLE_FREE_SIZES,
  ...COMING_SOON_SIZES,
] as const;

export type SizeId = typeof ALL_SIZE_IDS[number];
export type AvailableStatus = 'available' | 'coming-soon';

/**
 * Check if a size is currently available for download
 */
export function isSizeAvailable(sizeId: string): boolean {
  return AVAILABLE_FREE_SIZES.includes(sizeId as any);
}

/**
 * Check if a size is marked as coming soon
 */
export function isSizeComingSoon(sizeId: string): boolean {
  return COMING_SOON_SIZES.includes(sizeId as any);
}

/**
 * Get the availability status of a size
 */
export function getSizeAvailability(sizeId: string): AvailableStatus | null {
  if (isSizeAvailable(sizeId)) return 'available';
  if (isSizeComingSoon(sizeId)) return 'coming-soon';
  return null;
}
