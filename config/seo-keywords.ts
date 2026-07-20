// Single source of truth for SEO keyword phrases used by Studio AI-assist.
// Category keys MUST match the product schema's `category` values exactly
// (sanity/schemaTypes/product.ts): they are the join key.

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Video Games': [
    'gamer wall art',
    'game room decor',
    'retro gaming prints',
    'man cave art',
    'gaming room decor',
  ],
  Quotes: [
    'motivational wall art',
    'inspirational quote prints',
    'typography wall art',
    'quote poster',
  ],
  Maps: [
    'world map prints',
    'map wall art',
    'travel map poster',
    'city map print',
  ],
  Funny: [
    'funny wall art',
    'meme poster',
    'humorous prints',
    'funny office decor',
  ],
  Minimalist: [
    'minimalist wall art',
    'minimalist prints',
    'modern wall decor',
    'abstract line art',
  ],
  Botanical: [
    'botanical wall art',
    'botanical prints',
    'plant wall decor',
    'floral art print',
  ],
  // No Basketball category exists in the product schema yet; this entry
  // activates when one is added. keywordsForCategory falls back to globals for
  // unknown categories, so this is forward-compatible plumbing, not dead code.
  Basketball: [
    'basketball wall art',
    'basketball man cave ideas',
    'basketball room decor for adults',
    'basketball court blueprint art',
    'sports man cave wall decor',
  ],
}

export const GLOBAL_KEYWORDS: string[] = [
  'free printable wall art',
  'instant download art',
  'high resolution prints',
]

// Returns category-specific + global keywords, deduped.
// Unknown/missing category → global keywords only.
export function keywordsForCategory(category?: string): string[] {
  const categoryKeywords = category ? CATEGORY_KEYWORDS[category] ?? [] : []
  return Array.from(new Set([...categoryKeywords, ...GLOBAL_KEYWORDS]))
}
