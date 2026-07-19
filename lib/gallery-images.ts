/**
 * Pure mapping for optional `galleryImages` on a product.
 * Kept framework-free so it can be unit-tested without Sanity/env config.
 */

export interface RawGalleryImage {
  alt?: string
  asset?: unknown
  [key: string]: unknown
}

export interface GalleryImage {
  url: string
  alt: string
}

/**
 * Map raw Sanity gallery items into `{ url, alt }[]`.
 * - Drops items with no `asset` (draft slots the editor added but never filled).
 * - Falls back to `fallbackAlt` when alt text is missing/blank.
 */
export function mapGalleryImages(
  raw: RawGalleryImage[] | undefined | null,
  toUrl: (img: RawGalleryImage) => string,
  fallbackAlt: string,
): GalleryImage[] {
  if (!raw) return []
  return raw
    .filter((img): img is RawGalleryImage => !!img && !!img.asset)
    .map((img) => ({
      url: toUrl(img),
      alt: img.alt?.trim() || fallbackAlt,
    }))
}
