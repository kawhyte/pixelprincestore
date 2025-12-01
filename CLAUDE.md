# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Pixel Prince Store is a Next.js 16 (App Router) digital art store powered by Sanity CMS. The core feature is a free art download system with a rolling 7-day download limit (3 downloads per week) enforced via cookie-based tracking. Content is managed through Sanity CMS, with high-resolution assets hosted on Cloudinary or external URLs (Google Drive/Dropbox).

**Tech Stack:**
- Next.js 16 (App Router, React 19, TypeScript)
- Sanity CMS (content management, v4)
- Cloudinary (asset hosting)
- Tailwind CSS v4 (styling)
- Cookie-based state management (download tracking)
- Google Gemini AI (description generation in Sanity Studio)

## Key Commands

### Development
```bash
npm run dev              # Start dev server on http://localhost:3000
npx tsc --noEmit         # Type check without building
npm run lint             # Run ESLint
```

### Build & Deploy
```bash
npm run build            # Build for production (includes sitemap generation)
npm start                # Start production server
```

### Sanity CMS
```bash
npx sanity start         # Start Sanity Studio (standalone, not needed - use /studio route)
npx sanity deploy        # Deploy Sanity Studio
npx sanity dataset import <file> <dataset>  # Import data
npx sanity dataset export <dataset> <file>  # Export data
```

### Utilities
```bash
npm run generate-zips    # [DEPRECATED] Generate ZIP bundles (not used with Cloudinary)
```

**Note:** The `generate-zips` script is deprecated and not used in the current Cloudinary-based architecture. ZIP files are now hosted directly on Cloudinary or external services.

## Architecture

### Content Flow

1. **Sanity CMS** (`/studio` route at `/app/studio/[[...tool]]/page.tsx`)
   - Content editors create/edit art products
   - Upload preview images (600×800) and detail images (1200×1600) to Sanity
   - Upload high-res download files to Cloudinary via custom input component
   - Use AI generator to create descriptions (Gemini API)

2. **Data Layer** (`sanity/lib/client.ts`)
   - `getAllProducts()`: Fetch all products for gallery
   - `getProductBySlug(slug)`: Fetch single product for detail page
   - Transforms Sanity data to `FreeArt` interface
   - Uses `urlFor()` helper for image URLs

3. **Frontend Pages**
   - `/free-downloads` → Gallery of all free art (`app/free-downloads/page.tsx`)
   - `/art/[id]` → Art detail page with size selection (`app/art/[id]/page.tsx`)
   - Static generation at build time via `generateStaticParams()`

4. **Download API** (`app/api/claim-art/route.ts`)
   - Validates download limits (server-side)
   - Fetches files from Cloudinary/external URLs
   - Streams file to user
   - Updates cookie with download record

### Download Tracking System

**Server-Side:** `lib/download-tracking.ts`
- `parseDownloadCookie()`: Parse cookie JSON
- `canDownload()`: Validate if download allowed (weekly limit, duplicate check)
- `addDownload()`: Add download record to cookie
- `cleanupOldDownloads()`: Remove records older than 7 days
- `getStatusMessage()`: Generate user-facing status message

**Client-Side:** `lib/use-download-tracking.ts`
- `useDownloadTracking()` hook for React components
- Polls cookie every 1 second for real-time updates
- Provides: `remaining`, `limit`, `resetDate`, `message`
- Helper methods: `hasDownloadedSize()`, `hasDownloadedAllSizes()`

**Cookie Structure:**
```json
{
  "downloads": [
    {
      "artId": "ethereal-dreams",
      "sizeId": "8x10",
      "timestamp": 1732406400000,
      "isZip": false
    }
  ]
}
```

**Cookie Settings:**
- Name: `pp_downloads`
- httpOnly: `true` (server-only modification)
- secure: `true` in production
- sameSite: `lax`
- maxAge: 7 days

### High-Resolution Asset Management

**Asset Types:**
1. **Cloudinary** (`assetType: 'cloudinary'`)
   - Uploaded via custom Sanity input component (`sanity/components/HighResAssetInput.tsx`)
   - Stored fields: `cloudinaryUrl`, `cloudinaryPublicId`, `filename`, `uploadedAt`
   - Can be deleted from Cloudinary via `/test-cloudinary-delete` page

2. **External URL** (`assetType: 'external'`)
   - Google Drive or Dropbox direct download links
   - Stored fields: `externalUrl`, `filename`, `uploadedAt`

**Download Flow:**
- API route fetches file from URL (Cloudinary or external)
- Streams response to user via `Response(webStream)`
- Efficient for large files (10+ MB ZIPs)

### Sanity Schema

**Product Schema** (`sanity/schemaTypes/product.ts`)
```typescript
{
  title: string
  slug: slug
  artist: string (default: "The Pixel Prince")
  previewImage: image (600×800 for gallery cards)
  detailImage: image (1200×1600 for detail page)
  description: text (max 200 chars)
  longDescription: text
  sizes: artSize[] (pre-filled with 4 standard sizes)
  zipUrl: url (Cloudinary or Google Drive ZIP URL)
  tags: string[]
  category: string (Abstract, Nature, Maps, etc.)
}
```

**Art Size Schema** (`sanity/schemaTypes/artSize.ts`)
```typescript
{
  id: string (e.g., "4x5", "8x10")
  displayLabel: string (primary label in cm/inches)
  alternateLabel: string (secondary label)
  dimensions: string (pixel dimensions)
  fileName: string
  fileSize: string
  recommendedFor: string
  availability: "available" | "coming-soon"
  comingSoonMessage: string (if coming-soon)
  highResAsset: {
    assetType: "cloudinary" | "external"
    cloudinaryUrl?: string
    cloudinaryPublicId?: string
    externalUrl?: string
    filename: string
    uploadedAt?: string
  }
}
```

### Environment Variables

**Required for Production:**
```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
SANITY_API_TOKEN=<token-with-editor-permissions>

# Cloudinary (for high-res asset uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<unsigned-preset>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Google Gemini (for AI description generator)
GOOGLE_API_KEY=<api-key>
```

**Development Only:**
```bash
# Bypass download limits for testing
DISABLE_DOWNLOAD_LIMIT=true
```

**Setup:** Copy `.env.example` to `.env.local` and fill in values.

## Common Workflows

### Adding New Art to Sanity

1. Access Sanity Studio at `http://localhost:3000/studio`
2. Click "Free Art Product" → Create new
3. Fill in title, artist, descriptions (use AI generator if needed)
4. Upload preview image (600×800) and detail image (1200×1600)
5. For each size in the "Available Sizes" array:
   - Set availability to "available" or "coming-soon"
   - Upload high-res file via Cloudinary uploader component
   - Or paste external URL (Google Drive/Dropbox)
6. Upload ZIP of all sizes to Cloudinary or get external URL → paste in "ZIP Download URL"
7. Add tags and category
8. Publish

### Testing Download Limits

**Option 1: Disable limits**
```bash
echo "DISABLE_DOWNLOAD_LIMIT=true" >> .env.local
npm run dev
```

**Option 2: Manual cookie manipulation**
```javascript
// Browser console
document.cookie = "pp_downloads=...; path=/; max-age=604800";
```

**Option 3: Clear cookie**
```javascript
// Browser console
document.cookie = "pp_downloads=; path=/; max-age=0";
```

### Debugging Download Issues

1. Check browser console for errors
2. Check Network tab → `/api/claim-art` request
3. Inspect cookie: Application → Cookies → `pp_downloads`
4. Check server logs for `[CLAIM-ART]` prefix
5. Verify file URL is accessible (Cloudinary or external)

**Common Issues:**
- 403 error: Download limit reached or duplicate download
- 404 error: Missing `zipUrl` or `highResAsset` in Sanity
- 500 error: File URL unreachable or invalid

### TypeScript Path Aliases

The project uses `@/*` alias for imports:
```typescript
import { getAllProducts } from '@/sanity/lib/client'
import { DOWNLOAD_COOKIE_NAME } from '@/config/free-art'
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Styling Conventions

- **Tailwind CSS v4** for all styling
- Use `lucide-react` for icons (NOT emojis)
- Earth-tone color palette (defined in CSS)
- Responsive design: mobile-first approach
- Component library: shadcn/ui patterns in `components/ui/`

### Static Generation

All art detail pages are statically generated at build time:

```typescript
// app/art/[id]/page.tsx
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(art => ({ id: art.id }))
}
```

This provides:
- Instant page loads
- Perfect Lighthouse scores
- CDN-friendly deployment

## Important Notes

### Cookie-Based Tracking Limitations
- Users can clear cookies to bypass limits (this is acceptable - it's a free gift)
- No authentication required (intentional design)
- Weekly limit is a "soft" limit to prevent abuse, not absolute security

### Deprecated Features
- `generate-zips.js` script (now use Cloudinary/external URLs)
- `allSizesZip` field (replaced by `zipUrl`)
- Local file storage in `/private/free/` (migrated to Cloudinary)

### API Routes
- `/api/claim-art` → Download handler (GET with query params)
- `/api/gemini/generate` → AI description generator (POST)
- `/api/cloudinary/delete` → Delete Cloudinary assets (DELETE)
- `/api/debug-sanity` → Debug Sanity data (GET)

### File Streaming
The download API uses Node.js streams for efficient large file transfer:
```typescript
const fileResponse = await fetch(downloadUrl)
const fileStream = fileResponse.body
return new NextResponse(fileStream, { headers: {...} })
```

This approach:
- Works with serverless (Vercel/Netlify)
- Handles 10+ MB files efficiently
- Low memory footprint

## Development Tips

- Always use Server Components unless client interactivity is needed (`'use client'`)
- Use `urlFor()` helper from `sanity/lib/image.ts` for Sanity images
- Cookie polling interval is 1 second (adjust in `lib/use-download-tracking.ts` if needed)
- Test download limits in incognito mode to simulate new users
- Sanity Studio is accessible at `/studio` (no separate deployment needed)
