import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { COLLECTIONS } from '@/config/collections'

// Guard: the hardcoded collection list in next-sitemap.config.js (CommonJS,
// cannot import the TS source) must stay in sync with COLLECTIONS. Adding a
// slug to config/collections.ts without updating the sitemap fails here.
describe('next-sitemap collection slugs', () => {
  it('matches config/collections.ts COLLECTIONS', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'next-sitemap.config.js'),
      'utf8'
    )
    const block = source.match(/const collectionSlugs = \[([\s\S]*?)\]/)
    expect(block).not.toBeNull()
    const sitemapSlugs = Array.from(
      block![1].matchAll(/['"]([^'"]+)['"]/g),
      (m) => m[1]
    )
    expect(new Set(sitemapSlugs)).toEqual(new Set(COLLECTIONS.map((c) => c.slug)))
  })
})
