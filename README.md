# The Pixel Prince Store

A Next.js-powered digital art store featuring free downloadable art prints with an intelligent weekly limit system.

## Overview

The Pixel Prince Store enables users to download high-quality digital art prints without requiring authentication. The system uses cookie-based tracking to enforce a fair weekly download limit while providing a delightful user experience with confetti celebrations, toast notifications, and responsive design.

**Key Features:**
- **3 Downloads Per Week**: Rolling 7-day window limit
- **Multiple Print Sizes**: 4"×5", 8"×10", 16"×20", 40×50cm per artwork
- **ZIP Bundles**: Download all sizes at once
- **No Login Required**: Cookie-based tracking
- **Automatic Cleanup**: Old download records auto-removed after 7 days
- **Beautiful UI**: Confetti animations, toast notifications, earth-tone design
- **Mobile Responsive**: Optimized for all devices

---

## Free Art Downloads Feature

### For Users

Browse the collection at `/free-downloads` and download up to **3 print sizes per week** — completely free!

Each artwork offers:
- **4 print-ready sizes** (PNG, 300 DPI)
- **Individual downloads** or complete **ZIP bundle**
- **High-quality previews** before downloading
- **Usage recommendations** for each size
- **HOW-TO-OPEN.txt** instructions included in ZIPs

### For Developers

The download system is built with:
- **Server-side validation** (cookie-based limits)
- **File streaming** (efficient large file transfer)
- **Static site generation** (blazing fast pages)
- **Real-time tracking** (React hooks with polling)
- **Automated ZIP generation** (build-time script)

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Cookie-based state management
- Node.js file streaming
- Archiver (ZIP generation)
- Canvas Confetti (celebrations)
- Sonner (toast notifications)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone repository
git clone <repository-url>
cd pixelprincestore

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Key URLs

- **Home**: `/`
- **Free Downloads Gallery**: `/free-downloads`
- **Art Detail Page**: `/art/[id]` (e.g., `/art/ethereal_dreams`)
- **Download API**: `/api/claim-art`

---

## Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Utilities
npm run generate-zips    # Generate ZIP bundles for all artworks
npm run lint             # Run ESLint

# Type Checking
npx tsc --noEmit         # Check TypeScript types
```

---

## Project Structure

```
pixelprincestore/
├── app/
│   ├── art/
│   │   └── [id]/
│   │       ├── page.tsx          # Detail page with size selection
│   │       └── not-found.tsx     # Custom 404
│   ├── free-downloads/
│   │   └── page.tsx              # Gallery page
│   ├── api/
│   │   └── claim-art/
│   │       └── route.ts          # Download API endpoint
│   └── layout.tsx                # Root layout
├── config/
│   └── free-art.ts               # Art collection config
├── lib/
│   ├── download-tracking.ts      # Server-side tracking utility
│   └── use-download-tracking.ts  # Client-side React hook
├── private/
│   └── free/                     # Download files (not public)
│       ├── ethereal-dreams-4x5.png
│       ├── ethereal-dreams-8x10.png
│       ├── ethereal-dreams-16x20.png
│       ├── ethereal-dreams-40x50cm.png
│       ├── ethereal-dreams-all.zip
│       └── ... (other artworks)
├── public/
│   ├── art-previews/
│   │   ├── card/                 # 600×800 gallery previews
│   │   └── detail/               # 1200×1600 detail images
│   └── size-guides/              # Size comparison visuals
├── scripts/
│   └── generate-zips.js          # ZIP generation script
└── docs/
    ├── IMPLEMENTATION-PHASES.md  # Development history
    ├── ADDING-NEW-ART.md         # How to add new art
    ├── ARCHITECTURE.md           # System architecture
    ├── TROUBLESHOOTING.md        # Common issues
    └── IMAGE-GUIDE.md            # Image specifications
```

---

## Documentation

Comprehensive documentation is available in the `/docs` folder:

### User Guides
- **[Adding New Art](docs/ADDING-NEW-ART.md)**: Complete step-by-step guide for adding new artworks to the collection
- **[Image Guide](docs/IMAGE-GUIDE.md)**: Image specifications, optimization, and preparation workflows

### Technical Documentation
- **[Architecture](docs/ARCHITECTURE.md)**: System overview, data flow, and technical decisions
- **[Implementation Phases](docs/IMPLEMENTATION-PHASES.md)**: Development history and completed features
- **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Common issues and solutions

### Quick Links

**Adding a New Artwork:**
1. Prepare 4 print sizes (see [Image Guide](docs/IMAGE-GUIDE.md))
2. Create preview images (card + detail)
3. Update `config/free-art.ts`
4. Run `npm run generate-zips`
5. Test locally

**How the Download System Works:**
- User visits `/free-downloads` → Sees gallery
- Clicks artwork → Opens `/art/[id]` detail page
- Selects size → Clicks download button
- API validates weekly limit → Streams file
- Cookie updated → Confetti plays → Toast notification

**Weekly Limit Algorithm:**
- Rolling 7-day window (not calendar week)
- Max 3 downloads per 7 days
- Old records auto-cleaned after 7 days
- ZIP bundle counts as 1 download
- Individual sizes count as 1 download each

---

## Configuration

### Environment Variables

Create `.env.local` for development:

```bash
# Optional: Disable download limit for testing
DISABLE_DOWNLOAD_LIMIT=true
```

### Download Limits

Configured in `config/free-art.ts`:

```typescript
export const WEEKLY_DOWNLOAD_LIMIT = 3;        // Downloads per week
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const DOWNLOAD_COOKIE_NAME = "pp_downloads";
```

### Art Collection

All artwork metadata is defined in `config/free-art.ts`:

```typescript
{
  id: "ethereal_dreams",
  name: "Ethereal Dreams",
  description: "A mesmerizing blend of soft purples and blues",
  longDescription: "...",
  artist: "The Pixel Prince",
  tags: ["fantasy", "abstract", "dreamy"],
  previewImage: "/art-previews/card/ethereal-dreams-card.webp",
  detailImage: "/art-previews/detail/ethereal-dreams-detail.webp",
  sizes: [
    {
      id: "4x5",
      label: "4\" × 5\"",
      dimensions: "1200 × 1500 px",
      fileName: "ethereal-dreams-4x5.png",
      fileSize: "1.2 MB",
      recommendedFor: "Small frames, desk displays"
    },
    // ... 3 more sizes
  ],
  allSizesZip: "ethereal-dreams-all.zip"
}
```

---

## Development Workflow

### Adding New Art

```bash
# 1. Prepare files (see docs/IMAGE-GUIDE.md)
# 2. Add to config
vim config/free-art.ts

# 3. Generate ZIPs
npm run generate-zips

# 4. Test locally
npm run dev
# Visit http://localhost:3000/free-downloads

# 5. Build & verify
npm run build

# 6. Commit
git add .
git commit -m "feat: add [artwork-name] free art download"

# 7. Deploy
vercel --prod
```

### Testing Download Limits

```bash
# Method 1: Enable dev mode bypass
echo "DISABLE_DOWNLOAD_LIMIT=true" >> .env.local
npm run dev

# Method 2: Manually set cookie (browser console)
document.cookie = "pp_downloads=...; path=/";
```

### Debugging

```typescript
// Enable logging in app/api/claim-art/route.ts
console.log('Cookie:', request.headers.get('cookie'));
console.log('Downloads:', downloads);
console.log('Remaining:', WEEKLY_DOWNLOAD_LIMIT - weeklyDownloads.length);
```

**Browser DevTools:**
- Console: Check for errors
- Network: Monitor API requests (`/api/claim-art`)
- Application → Cookies: Inspect `pp_downloads` cookie

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**Vercel Configuration:**
```json
{
  "functions": {
    "app/api/claim-art/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### Other Platforms

**Requirements:**
- Node.js 18+ runtime
- Support for Next.js App Router
- File system access for `/private/` folder
- 1GB+ storage for artwork files

**Compatible Platforms:**
- Vercel ✅
- Netlify ✅ (with next-runtime)
- Railway ✅
- Render ✅
- Self-hosted ✅

---

## Architecture Highlights

### Cookie-Based Tracking

```javascript
// Cookie structure
{
  downloads: [
    {
      artId: "ethereal_dreams",
      sizeId: "8x10",
      timestamp: 1732406400000,
      isZip: false
    }
  ]
}
```

- **httpOnly: false** (client must read)
- **maxAge: 7 days** (auto-expire)
- **sameSite: lax** (CSRF protection)

### File Streaming

```typescript
// Efficient large file transfer
const fileStream = createReadStream(filePath);
const webStream = ReadableStream.from(fileStream);
return new Response(webStream, { headers: {...} });
```

- **Low memory usage** (~64 KB chunks)
- **Supports large files** (40+ MB ZIPs)
- **Works with serverless** (Vercel, Netlify)

### Static Generation

All art detail pages pre-rendered at build time:

```typescript
export async function generateStaticParams() {
  return freeArtCollection.map(art => ({ id: art.id }));
}
```

- **Instant page loads**
- **Perfect Lighthouse scores**
- **CDN-friendly**

---

## Performance

### Build Output

```
Route (app)                   Size       First Load JS
├ ○ /                        137 B           85.9 kB
├ ○ /art/cosmic_serenity     137 B           85.9 kB
├ ○ /art/ethereal_dreams     137 B           85.9 kB
├ ○ /art/golden_hour         137 B           85.9 kB
├ ○ /art/midnight_bloom      137 B           85.9 kB
└ ○ /free-downloads          137 B           85.9 kB

○  (Static)  prerendered as static content
```

### Image Optimization

- **Card previews**: 600×800 WebP, 50-150 KB
- **Detail images**: 1200×1600 WebP, 200-400 KB
- **Download files**: PNG (lossless), 1-10 MB each

### Caching Strategy

- Static pages: Cache forever
- Preview images: Cache forever (immutable URLs)
- Download files: No cache (cookie-dependent)

---

## Security Considerations

**What We Do:**
- Server-side download validation
- Cookie tampering protection
- File path injection prevention
- Rate limiting (weekly limit)
- Private file storage (`/private/` not served by Next.js)

**What We Don't Do:**
- Authentication (intentional — free downloads)
- IP-based limiting (users can clear cookies)
- Watermarking (files are free gifts)

---

## Contributing

### Code Style

- TypeScript strict mode
- ESLint configured
- Tailwind CSS for styling
- React Server Components where possible
- 'use client' only when necessary

### Commit Messages

Follow conventional commits:

```bash
feat: add new art download feature
fix: resolve cookie expiration issue
docs: update architecture guide
refactor: simplify download tracking logic
test: add unit tests for cookie parsing
```

---

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Downloads not working | Check `/docs/TROUBLESHOOTING.md` → Downloads Not Working |
| Images not loading | Verify files in `/public/art-previews/` |
| Weekly limit not enforcing | Check cookies enabled, disable dev mode |
| ZIP generation fails | Ensure all 4 sizes exist before running script |
| Build fails | Check TypeScript errors, clear `.next` cache |

**For detailed troubleshooting**, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Feedback and contributions welcome

### Project Resources

- [Image Guide](docs/IMAGE-GUIDE.md) - Image specifications
- [Architecture](docs/ARCHITECTURE.md) - System design
- [Implementation Phases](docs/IMPLEMENTATION-PHASES.md) - Development history

---

## License

[Add your license here]

---

## Support

For issues or questions:
1. Check `/docs/TROUBLESHOOTING.md`
2. Review browser console for errors
3. Enable debug logging (see Development Workflow)
4. Open an issue on GitHub

---

**Last Updated**: 2025-11-24
**Version**: 1.0
**Built with**: Next.js 15, TypeScript, Tailwind CSS
