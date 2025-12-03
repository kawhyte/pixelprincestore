# Part 5: Home & Detail Page Improvements
*Status: In Progress*

## Phase 1: Product Schema (SEO) ✅
- [x] Update `app/art/[id]/page.tsx` to generate JSON-LD Structured Data
- [x] Verify `urlFor` import and usage for schema images
- [x] **Success Criteria:** Page source contains valid `<script type="application/ld+json">` with "Product" type.

**Implementation Notes:**
- Added Product schema with @type "Product"
- Included name, description, image, brand, and offers fields
- Price set to "0.00" USD with "InStock" availability
- Schema injected server-side for optimal SEO crawling

## Phase 2: "You Might Also Like" Section (Engagement) ✅
- [x] Update `sanity/lib/client.ts`: Add `getRelatedProducts(category, currentSlug)` function.
- [x] Update `app/art/[id]/page.tsx`: Fetch related products server-side.
- [x] Update `app/art/[id]/art-detail-client.tsx`: Accept `relatedArt` prop and render a grid of 3 related items at the bottom.
- [x] **Success Criteria:** Detail pages show 3 other art pieces from the same category.

**Implementation Notes:**
- Added `getRelatedProducts()` function with GROQ query to fetch up to 3 products from same category
- Excludes current product from results using `slug.current != $currentSlug`
- Server-side fetch for optimal performance and SEO
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Hover effects: scale transform, shadow elevation, color transitions
- Only displays section when related products exist (conditional rendering)
- Uses same image orientation detection as gallery cards for consistent UI

## Phase 3: Hero Performance (LCP)
- [ ] Create/Identify a fallback static image for the Hero.
- [ ] Update `components/ui/Hero/Hero.tsx`: Implement `next/image` as a priority loaded fallback that swaps to Lottie only after hydration/loading.
- [ ] **Success Criteria:** LCP score improves; no layout shift when animation loads.
