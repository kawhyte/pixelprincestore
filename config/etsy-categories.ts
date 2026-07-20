import { ETSY_MAIN_SHOP, ETSY_PRINTABLES_SHOP } from "./links";

export interface EtsyCategoryLink {
  printed?: string; // Etsy search/section URL in the main shop
  printable?: string; // Etsy search/section URL in the printables shop
  styleLabel?: string; // used in CTA copy: "map" -> "Shop map prints"
}

// Keyed by the Sanity `category` value (see sanity/schemaTypes/product.ts).
// Any category not listed here (new, renamed, or blank) falls back to the
// shop home automatically: safe to leave partially filled.
export const ETSY_CATEGORY_LINKS: Record<string, EtsyCategoryLink> = {
  Maps: { printed: `${ETSY_MAIN_SHOP}/search?q=map`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=map`, styleLabel: "map" },
  "Video Games": { printed: `${ETSY_MAIN_SHOP}/search?q=game+room`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=game+room`, styleLabel: "game room" },
  Quotes: { printed: `${ETSY_MAIN_SHOP}/search?q=quote`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=quote`, styleLabel: "quote" },
  Funny: { printed: `${ETSY_MAIN_SHOP}/search?q=funny`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=funny`, styleLabel: "funny" },
  Minimalist: { printed: `${ETSY_MAIN_SHOP}/search?q=minimalist`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=minimalist`, styleLabel: "minimalist" },
  Botanical: { printed: `${ETSY_MAIN_SHOP}/search?q=botanical`, printable: `${ETSY_PRINTABLES_SHOP}/search?q=botanical`, styleLabel: "botanical" },
};

export interface ResolvedEtsyLinks {
  printed: string;
  printable: string;
  styleLabel?: string;
}

// Priority: exact per-artwork listing (rare) -> category link -> shop home.
export function resolveEtsyLinks(art: {
  category?: string;
  etsyListingUrl?: string;
  etsyPrintableUrl?: string;
}): ResolvedEtsyLinks {
  // Some Sanity category values carry a trailing space (e.g. "Quotes "): trim to match keys.
  const key = art.category?.trim();
  const cat = key ? ETSY_CATEGORY_LINKS[key] : undefined;
  return {
    printed: art.etsyListingUrl || cat?.printed || ETSY_MAIN_SHOP,
    printable: art.etsyPrintableUrl || cat?.printable || ETSY_PRINTABLES_SHOP,
    styleLabel: cat?.styleLabel,
  };
}
