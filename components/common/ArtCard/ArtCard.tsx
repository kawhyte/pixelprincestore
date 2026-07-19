import Image from "next/image";
import Link from "next/link";

import { getCardAspectClass } from "@/lib/image-utils";
import type { ImageOrientation } from "@/lib/image-utils";

/**
 * ArtCard — the single Juniqe-style gallery card used across home, free-downloads,
 * collections, and the related grid (PLAN-14 Phase C).
 *
 * Small-radius corners, artwork-dominant, one <Link> wrapping the card body.
 * Optional `footer` renders a sibling interactive slot OUTSIDE the link
 * (collections' Etsy CTA) so we never nest anchors.
 */

/** Minimal art shape every caller can satisfy. */
export interface ArtCardArt {
  title: string;
  previewImage: string;
  previewImageOrientation?: ImageOrientation;
}

const variantStyles = {
  neutral: "bg-card hover:bg-card",
  sage: "bg-sage-50 hover:bg-sage-100",
  clay: "bg-clay-50 hover:bg-clay-100",
  lavender: "bg-lavender-50 hover:bg-lavender-100",
} as const;

export interface ArtCardProps {
  art: ArtCardArt;
  href: string;
  /** next/image sizes attr — required; callers pass values matching their grid. */
  sizes: string;
  variant?: keyof typeof variantStyles;
  /** quiet subtitle line under the title (e.g. category). */
  subtitle?: string;
  /** small chip over the image's top-left (Juniqe-style). */
  badge?: string;
  /** decorative hover-overlay label (e.g. "View details"). */
  overlayLabel?: string;
  /** interactive slot rendered below the card body, outside the link. */
  footer?: React.ReactNode;
}

export default function ArtCard({
  art,
  href,
  sizes,
  variant = "neutral",
  subtitle,
  badge,
  overlayLabel,
  footer,
}: ArtCardProps) {
  const aspectClass = art.previewImageOrientation
    ? getCardAspectClass(art.previewImageOrientation.orientation)
    : "aspect-[3/4]";

  return (
    <div
      className={`group overflow-hidden rounded-md transition-all duration-300 hover:shadow-md ${variantStyles[variant]}`}
    >
      <Link
        href={href}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
      >
        <div className={`relative ${aspectClass} overflow-hidden rounded-md bg-muted`}>
          <Image
            src={art.previewImage}
            alt={art.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={sizes}
          />

          {badge && (
            <span className="absolute left-2 top-2 rounded-md bg-sage-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              {badge}
            </span>
          )}

          {overlayLabel && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="mb-4 rounded-md bg-white/95 px-4 py-2 text-sm font-medium text-charcoal shadow-sm">
                {overlayLabel}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1 p-4">
          <h3 className="line-clamp-2 text-base font-medium leading-snug text-charcoal">
            {art.title}
          </h3>
          {subtitle && (
            <p className="text-sm text-soft-charcoal">{subtitle}</p>
          )}
        </div>
      </Link>

      {footer && <div className="px-4 pb-4">{footer}</div>}
    </div>
  );
}
