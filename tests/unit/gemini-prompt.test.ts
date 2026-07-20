import { describe, it, expect } from 'vitest'
import { buildDescriptionPrompt } from '@/lib/gemini-prompt'
import {
  keywordsForCategory,
  CATEGORY_KEYWORDS,
  GLOBAL_KEYWORDS,
} from '@/config/seo-keywords'

// The six category values that exist in sanity/schemaTypes/product.ts.
const SCHEMA_CATEGORIES = [
  'Video Games',
  'Quotes',
  'Maps',
  'Funny',
  'Minimalist',
  'Botanical',
]

// Forward-compatible keys (PLAN-28): keyword sets seeded before their schema
// category exists. keywordsForCategory falls back to globals for unknowns, so
// these are inert until a matching category is added.
const FORWARD_COMPATIBLE_CATEGORIES = ['Basketball']

const LEGACY_PROMPT = `You are an art curator. Write two descriptions for a digital artwork titled 'Test Art'.
1. A 'short' catchy one-liner (max 15 words).
2. A 'long' engaging paragraph (approx 50-80 words) describing the visual style and mood.
Never use em dashes.
Return ONLY valid JSON format: { "short": "...", "long": "..." }`

describe('buildDescriptionPrompt', () => {
  it('includes category, a tag, a keyword, and the JSON contract when all fields present', () => {
    const prompt = buildDescriptionPrompt({
      title: 'Test Art',
      category: 'Maps',
      tags: ['travel', 'world'],
      keywords: ['world map prints', 'free printable wall art'],
    })
    expect(prompt).toContain("'Maps' category")
    expect(prompt).toContain('travel')
    expect(prompt).toContain('world map prints')
    expect(prompt).toContain('{ "short": "...", "long": "..." }')
  })

  it('degrades to the exact legacy baseline with title only', () => {
    const prompt = buildDescriptionPrompt({ title: 'Test Art' })
    expect(prompt).toBe(LEGACY_PROMPT)
    expect(prompt).not.toContain('category')
    expect(prompt).not.toContain('search phrases')
  })

  it('omits the tags clause value gracefully when tags empty', () => {
    const prompt = buildDescriptionPrompt({ title: 'Test Art', category: 'Maps' })
    expect(prompt).toContain('tagged: none')
  })
})

describe('keywordsForCategory', () => {
  it('merges category + global keywords, deduped', () => {
    const result = keywordsForCategory('Maps')
    expect(result).toEqual(Array.from(new Set(result)))
    expect(result).toEqual(expect.arrayContaining(CATEGORY_KEYWORDS['Maps']))
    expect(result).toEqual(expect.arrayContaining(GLOBAL_KEYWORDS))
  })

  it('returns global-only for an unknown category', () => {
    expect(keywordsForCategory('nonsense')).toEqual(GLOBAL_KEYWORDS)
  })

  it('returns global-only for a missing category', () => {
    expect(keywordsForCategory(undefined)).toEqual(GLOBAL_KEYWORDS)
  })
})

describe('CATEGORY_KEYWORDS map keys', () => {
  it('every key is a schema category or a documented forward-compatible key', () => {
    for (const key of Object.keys(CATEGORY_KEYWORDS)) {
      expect([...SCHEMA_CATEGORIES, ...FORWARD_COMPATIBLE_CATEGORIES]).toContain(key)
    }
  })
})
