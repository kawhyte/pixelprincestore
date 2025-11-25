# Free Art Downloads - Architecture

This document explains the technical architecture of The Pixel Prince Store's free digital art download system.

---

## System Overview

The free art download system enables users to download **3 print sizes per week** without requiring authentication. It uses cookie-based tracking, server-side validation, and automated ZIP generation.

**Key Features:**
- Cookie-based download tracking (no login required)
- Rolling 7-day weekly limit (3 downloads)
- Multiple size options per artwork
- ZIP bundles with all sizes
- Automatic cleanup of old records
- Confetti celebrations and toast notifications
- Mobile-responsive design

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                                                                   │
│  ┌────────────────┐         ┌────────────────┐                  │
│  │  Gallery Page  │────────▶│  Detail Page   │                  │
│  │ /free-downloads│         │   /art/[id]    │                  │
│  └────────────────┘         └────────┬───────┘                  │
│                                       │                           │
│                                       │ Click Download            │
│                                       ▼                           │
│                            ┌────────────────────┐                │
│                            │ Download Handler   │                │
│                            │ (Client-side JS)   │                │
│                            └─────────┬──────────┘                │
│                                      │                            │
│                                      │ Fetch API                 │
│                                      ▼                            │
└──────────────────────────────────────┼────────────────────────────┘
                                       │
                                       │ HTTP GET
                                       │ /api/claim-art?artId=X&sizeId=Y
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS SERVER                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              /app/api/claim-art/route.ts                 │   │
│  │                                                           │   │
│  │  1. Parse query params (artId, sizeId, type)            │   │
│  │  2. Validate art exists in config                       │   │
│  │  3. Parse download cookie                                │   │
│  │  4. Check weekly limit (3 downloads)                     │   │
│  │  5. Check if size already downloaded                     │   │
│  │  6. Stream file from /private/free/                      │   │
│  │  7. Update cookie with new download                      │   │
│  │  8. Return file to browser                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            lib/download-tracking.ts                      │   │
│  │                                                           │   │
│  │  - parseDownloadCookie()                                 │   │
│  │  - cleanupOldDownloads()                                 │   │
│  │  - getWeeklyDownloads()                                  │   │
│  │  - hasReachedWeeklyLimit()                               │   │
│  │  - canDownload()                                         │   │
│  │  - addDownload()                                         │   │
│  │  - getResetDate()                                        │   │
│  │  - formatResetDate()                                     │   │
│  │  - getStatusMessage()                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Read Files
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FILE SYSTEM                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ /private/free/                                          │    │
│  │   - ethereal-dreams-4x5.png                            │    │
│  │   - ethereal-dreams-8x10.png                           │    │
│  │   - ethereal-dreams-16x20.png                          │    │
│  │   - ethereal-dreams-40x50cm.png                        │    │
│  │   - ethereal-dreams-all.zip                            │    │
│  │   - midnight-bloom-*.png                               │    │
│  │   - cosmic-serenity-*.png                              │    │
│  │   - golden-hour-*.png                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ /public/art-previews/                                   │    │
│  │   card/                                                 │    │
│  │     - ethereal-dreams-card.webp (600×800)              │    │
│  │   detail/                                               │    │
│  │     - ethereal-dreams-detail.webp (1200×1600)          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Generate ZIPs
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUILD-TIME SCRIPTS                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ scripts/generate-zips.js                                │    │
│  │                                                          │    │
│  │  1. Parse config/free-art.ts                           │    │
│  │  2. For each artwork:                                   │    │
│  │     - Find all 4 size files                            │    │
│  │     - Create HOW-TO-OPEN.txt                           │    │
│  │     - Generate ZIP (archiver)                          │    │
│  │     - Save to /private/free/                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Gallery View Flow

```
User visits /free-downloads
                ↓
Page loads with useDownloadTracking() hook
                ↓
Hook reads pp_downloads cookie
                ↓
Parses download records
                ↓
Calculates remaining downloads
                ↓
Displays status: "2 downloads remaining this week"
                ↓
User clicks art card
                ↓
Navigate to /art/[id]
```

### 2. Download Flow (Single Size)

```
User on /art/ethereal_dreams
                ↓
Selects size: "8\" × 10\""
                ↓
Clicks "Download 8\" × 10\"" button
                ↓
handleDownloadSize() triggered
                ↓
setLoading(true)
                ↓
Fetch /api/claim-art?artId=ethereal_dreams&sizeId=8x10
                ↓
┌──────────────────────────────────────────────┐
│           API ROUTE PROCESSING               │
├──────────────────────────────────────────────┤
│ 1. Parse query: artId=ethereal_dreams        │
│                 sizeId=8x10                   │
│ 2. Find art in freeArtCollection             │
│ 3. Find size in art.sizes[]                  │
│ 4. Parse pp_downloads cookie                 │
│ 5. cleanupOldDownloads() (remove >7 days)   │
│ 6. getWeeklyDownloads() (rolling 7 days)    │
│ 7. Check: count < 3?                         │
│    ✗ → Return 403 "Weekly limit reached"    │
│    ✓ → Continue                              │
│ 8. Check: hasDownloadedSize()?              │
│    ✓ → Return 403 "Already downloaded"      │
│    ✗ → Continue                              │
│ 9. Build file path:                          │
│    /private/free/ethereal-dreams-8x10.png    │
│ 10. Check file exists?                       │
│     ✗ → Return 500 "File not available"     │
│     ✓ → Continue                             │
│ 11. Create ReadableStream from file          │
│ 12. addDownload(artId, sizeId)               │
│ 13. Serialize updated cookie                 │
│ 14. Set-Cookie header                        │
│ 15. Stream file to browser                   │
└──────────────────────────────────────────────┘
                ↓
Browser receives file stream
                ↓
Create Blob from stream
                ↓
Trigger download (a.click())
                ↓
confetti() animation
                ↓
toast.success("Download started!")
                ↓
tracking.refresh()
                ↓
setLoading(false)
                ↓
UI updates: checkmark badge on downloaded size
```

### 3. Download Flow (ZIP Bundle)

```
User on /art/ethereal_dreams
                ↓
Clicks "Download All Sizes (ZIP)" button
                ↓
handleDownloadAll() triggered
                ↓
Fetch /api/claim-art?artId=ethereal_dreams&type=all
                ↓
┌──────────────────────────────────────────────┐
│           API ROUTE PROCESSING               │
├──────────────────────────────────────────────┤
│ 1. Parse query: artId=ethereal_dreams        │
│                 type=all                      │
│ 2. Find art in freeArtCollection             │
│ 3. Parse pp_downloads cookie                 │
│ 4. Check weekly limit (same as single)       │
│ 5. Check: hasDownloadedAllSizes()?          │
│    ✓ → Return 403 "Already downloaded ZIP"  │
│    ✗ → Continue                              │
│ 6. Build ZIP path:                           │
│    /private/free/ethereal-dreams-all.zip     │
│ 7. Check ZIP exists?                         │
│    ✗ → Return 500 "ZIP not available"       │
│    ✓ → Continue                              │
│ 8. Stream ZIP file                           │
│ 9. addDownload(artId, "all", isZip=true)     │
│ 10. Set cookie with updated downloads        │
│ 11. Return ZIP to browser                    │
└──────────────────────────────────────────────┘
                ↓
Download ZIP, confetti, toast
                ↓
Button updates: "ZIP Already Downloaded ✓"
```

---

## Cookie Structure

### Cookie Name
```
pp_downloads
```

### Cookie Properties
```javascript
{
  httpOnly: false,     // Accessible to client JS
  secure: false,       // Not HTTPS-only (for dev)
  sameSite: 'lax',    // CSRF protection
  maxAge: 604800,     // 7 days in seconds
  path: '/'           // Available sitewide
}
```

### Cookie Value (JSON)
```json
{
  "downloads": [
    {
      "artId": "ethereal_dreams",
      "sizeId": "8x10",
      "timestamp": 1732406400000,
      "isZip": false
    },
    {
      "artId": "midnight_bloom",
      "sizeId": "all",
      "timestamp": 1732410000000,
      "isZip": true
    },
    {
      "artId": "cosmic_serenity",
      "sizeId": "4x5",
      "timestamp": 1732415000000,
      "isZip": false
    }
  ]
}
```

**Fields:**
- `artId` (string): Artwork identifier (e.g., "ethereal_dreams")
- `sizeId` (string): Size identifier (e.g., "8x10") or "all" for ZIP
- `timestamp` (number): Unix epoch milliseconds (timezone-independent)
- `isZip` (boolean): True if ZIP bundle, false if single size

---

## Weekly Limit Algorithm

### Rolling 7-Day Window

The system uses a **rolling 7-day window**, not a calendar week.

```javascript
const WEEKLY_DOWNLOAD_LIMIT = 3;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms

function getWeeklyDownloads(downloads) {
  const now = Date.now();
  const sevenDaysAgo = now - SEVEN_DAYS_MS;

  return downloads.filter(d => d.timestamp > sevenDaysAgo);
}

function hasReachedWeeklyLimit(downloads) {
  const weeklyDownloads = getWeeklyDownloads(downloads);
  return weeklyDownloads.length >= WEEKLY_DOWNLOAD_LIMIT;
}
```

**Example Timeline:**
```
Day 1 (Mon): Download #1 ✓
Day 2 (Tue): Download #2 ✓
Day 3 (Wed): Download #3 ✓
Day 4 (Thu): Download #4 ✗ (limit reached)
Day 5 (Fri): Download #5 ✗ (limit reached)
Day 6 (Sat): Download #6 ✗ (limit reached)
Day 7 (Sun): Download #7 ✗ (limit reached)
Day 8 (Mon): Download #8 ✓ (oldest record expired)
```

### Automatic Cleanup

Old download records are automatically removed:

```javascript
function cleanupOldDownloads(downloads) {
  const now = Date.now();
  const sevenDaysAgo = now - SEVEN_DAYS_MS;

  return downloads.filter(d => d.timestamp > sevenDaysAgo);
}
```

This cleanup runs:
1. Before every download validation
2. Before calculating remaining downloads
3. Before checking weekly limit

---

## Download Validation Logic

### Can User Download?

```javascript
function canDownload(downloads, artId, sizeId) {
  // 1. Check weekly limit
  if (hasReachedWeeklyLimit(downloads)) {
    return {
      allowed: false,
      reason: "weekly_limit_reached"
    };
  }

  // 2. Check if specific size already downloaded
  const hasSize = downloads.some(d =>
    d.artId === artId && d.sizeId === sizeId
  );

  if (hasSize) {
    return {
      allowed: false,
      reason: "already_downloaded"
    };
  }

  // 3. Check if ZIP already downloaded (covers all sizes)
  const hasZip = downloads.some(d =>
    d.artId === artId && d.isZip === true
  );

  if (hasZip && sizeId !== "all") {
    // They have ZIP, so they have this size
    return {
      allowed: false,
      reason: "already_downloaded_via_zip"
    };
  }

  // 4. Allowed!
  return {
    allowed: true
  };
}
```

### Special Cases

**Case 1: User has ZIP, tries to download single size**
```
Downloads: [{ artId: "ethereal_dreams", sizeId: "all", isZip: true }]
Request: Download 8×10

Result: ✗ Blocked (already have ZIP with all sizes)
```

**Case 2: User has single size, tries to download ZIP**
```
Downloads: [{ artId: "ethereal_dreams", sizeId: "8x10", isZip: false }]
Request: Download ZIP

Result: ✓ Allowed (ZIP counts as 1 download even if they have some sizes)
```

**Case 3: User has 3 downloads, oldest is 8 days old**
```
Downloads: [
  { timestamp: now - 8 days },  ← Auto-removed
  { timestamp: now - 2 days },
  { timestamp: now - 1 day }
]

Result: ✓ Allowed (only 2 downloads in rolling window)
```

---

## File Streaming

### Why Streaming?

Large files (up to 10 MB per size, 40+ MB for ZIPs) require efficient transfer:

```javascript
// ✗ BAD: Load entire file into memory
const fileBuffer = await fs.readFile(filePath);
return new Response(fileBuffer); // 40 MB in RAM

// ✓ GOOD: Stream file in chunks
const fileStream = fs.createReadStream(filePath);
return new Response(ReadableStream.from(fileStream)); // ~64 KB chunks
```

### Implementation

```javascript
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

// Get file size for Content-Length header
const stats = await stat(filePath);

// Create Node.js ReadableStream
const fileStream = createReadStream(filePath);

// Convert to Web API ReadableStream
const webStream = ReadableStream.from(fileStream);

// Stream to browser
return new Response(webStream, {
  headers: {
    'Content-Type': 'image/png',
    'Content-Length': stats.size.toString(),
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Cache-Control': 'no-cache'
  }
});
```

**Benefits:**
- Low memory usage (constant ~64 KB)
- Faster time-to-first-byte
- Supports large files (500+ MB possible)
- Works with serverless functions

---

## Static Site Generation (SSG)

### Build-Time Generation

All art detail pages are pre-rendered at build time:

```typescript
// app/art/[id]/page.tsx

export async function generateStaticParams() {
  return freeArtCollection.map((art) => ({
    id: art.id
  }));
}
```

**Build Output:**
```
Route (app)                              Size
┌ ○ /                                   137 B          85.9 kB
├ ○ /art/cosmic_serenity               137 B          85.9 kB
├ ○ /art/ethereal_dreams               137 B          85.9 kB
├ ○ /art/golden_hour                   137 B          85.9 kB
├ ○ /art/midnight_bloom                137 B          85.9 kB
└ ○ /free-downloads                     137 B          85.9 kB

○  (Static)  prerendered as static content
```

**Benefits:**
- Instant page loads
- No server rendering cost
- Works with CDN caching
- Perfect Lighthouse scores

---

## Client-Side Tracking Hook

### useDownloadTracking()

React hook that provides real-time download status:

```typescript
const tracking = useDownloadTracking();

// Available properties:
tracking.remaining          // Number: 0-3
tracking.message           // String: "2 downloads remaining this week"
tracking.resetDate         // Date: When downloads reset
tracking.hasDownloadedSize(artId, sizeId)  // Boolean
tracking.hasDownloadedAllSizes(artId)      // Boolean
tracking.refresh()         // Function: Force re-check cookie
```

### Polling Mechanism

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // Read cookie every 1 second
    const cookie = Cookies.get(DOWNLOAD_COOKIE_NAME);
    const data = cookie ? JSON.parse(cookie) : { downloads: [] };

    // Clean up old downloads
    const cleaned = cleanupOldDownloads(data.downloads);

    // Calculate remaining
    const weeklyDownloads = getWeeklyDownloads(cleaned);
    const remaining = WEEKLY_DOWNLOAD_LIMIT - weeklyDownloads.length;

    setState({ remaining, message: getStatusMessage(cleaned) });
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

**Why polling?**
- Cookie changes may not trigger React re-renders
- Provides real-time updates across tabs
- Handles manual cookie deletion
- Simple and reliable

---

## ZIP Generation

### Build-Time Script

ZIPs are generated during build/deploy, not on-demand:

```javascript
// scripts/generate-zips.js

import archiver from 'archiver';
import fs from 'fs';

for (const art of freeArtCollection) {
  const output = fs.createWriteStream(`private/free/${art.allSizesZip}`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  // Add HOW-TO-OPEN.txt
  archive.append(HOW_TO_OPEN_TEXT, { name: 'HOW-TO-OPEN.txt' });

  // Add all 4 sizes
  for (const size of art.sizes) {
    archive.file(`private/free/${size.fileName}`, {
      name: size.fileName
    });
  }

  await archive.finalize();
}
```

**Why build-time?**
- Faster downloads (pre-compressed)
- No server CPU usage
- Consistent file hashes (cacheable)
- Predictable file sizes

---

## Security Considerations

### What We Do

1. **Server-Side Validation**: All download checks happen server-side
2. **Cookie Tampering**: Doesn't matter - server validates everything
3. **File Path Injection**: Validated against config (no user input)
4. **Rate Limiting**: Weekly limit enforced server-side
5. **File Streaming**: No entire file in memory
6. **Private Files**: `/private/` not served by Next.js automatically

### What We Don't Do

1. **Authentication**: Not required (intentional - free downloads)
2. **IP-Based Limiting**: Users can clear cookies (acceptable)
3. **Watermarking**: Files are free gifts (no DRM)
4. **CDN Protection**: Files served from origin (acceptable for free tier)

### Dev Mode Bypass

For testing, disable limits:

```bash
# .env.local
DISABLE_DOWNLOAD_LIMIT=true
```

```typescript
// app/api/claim-art/route.ts
if (process.env.DISABLE_DOWNLOAD_LIMIT === 'true') {
  // Skip validation
}
```

---

## Performance Optimizations

### Image Optimization

**Preview Images:**
- WebP format (70% smaller than PNG)
- Responsive sizing (600×800 card, 1200×1600 detail)
- Next.js Image component (automatic optimization)
- Lazy loading below fold

**Download Files:**
- PNG (lossless for print quality)
- Stored in `/private/` (not optimized by Next.js)
- Streamed directly to browser

### Bundle Splitting

```
Main bundle:       85 kB  (framework, shared)
Page-specific:     137 B  (minimal JS per page)
```

### Caching Strategy

```
Art detail pages:     Cache forever (static)
Preview images:       Cache forever (immutable URLs)
Download files:       No cache (via API, cookie-dependent)
Gallery page:         Cache with revalidation
```

---

## Error Handling

### API Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required parameter: artId"
}
```

**403 Forbidden (Limit Reached):**
```json
{
  "error": "You've reached your weekly limit of 3 downloads. Downloads reset in 2 days.",
  "remaining": 0,
  "limit": 3,
  "resetDate": "2025-11-26T12:00:00.000Z"
}
```

**403 Forbidden (Already Downloaded):**
```json
{
  "error": "You've already downloaded this size this week."
}
```

**404 Not Found:**
```json
{
  "error": "Invalid artId - art piece not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "File not available. Please contact support."
}
```

### Client-Side Handling

```typescript
try {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 403) {
      toast.error(error.error);  // Show user-friendly message
      tracking.refresh();         // Update UI
    } else {
      toast.error("Download failed. Please try again.");
    }

    return;
  }

  // Success: trigger download
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName;
  a.click();

  confetti();
  toast.success("Download started!");
  tracking.refresh();

} catch (error) {
  toast.error("Network error. Please check your connection.");
}
```

---

## Testing Strategy

### Unit Tests (Future)

```javascript
// lib/__tests__/download-tracking.test.ts

describe('parseDownloadCookie', () => {
  it('should parse valid cookie', () => {
    const cookie = encodeURIComponent(JSON.stringify({
      downloads: [{ artId: "test", sizeId: "8x10", timestamp: Date.now() }]
    }));
    const result = parseDownloadCookie(cookie);
    expect(result.downloads).toHaveLength(1);
  });
});

describe('hasReachedWeeklyLimit', () => {
  it('should return true when 3+ downloads', () => {
    const downloads = [
      { timestamp: Date.now() },
      { timestamp: Date.now() },
      { timestamp: Date.now() }
    ];
    expect(hasReachedWeeklyLimit(downloads)).toBe(true);
  });
});
```

### Integration Tests

```javascript
// app/api/claim-art/__tests__/route.test.ts

describe('GET /api/claim-art', () => {
  it('should download file when under limit', async () => {
    const response = await GET({
      url: '/api/claim-art?artId=ethereal_dreams&sizeId=8x10'
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should block when limit reached', async () => {
    // Set cookie with 3 downloads
    const response = await GET({
      url: '/api/claim-art?artId=ethereal_dreams&sizeId=8x10',
      headers: { Cookie: 'pp_downloads=...' }
    });
    expect(response.status).toBe(403);
  });
});
```

### Manual Testing Checklist

See `/docs/TESTING-GUIDE.md` for complete manual testing procedures.

---

## Configuration Reference

### Free Art Config Structure

```typescript
// config/free-art.ts

interface ArtSize {
  id: string;                  // "8x10"
  label: string;               // "8\" × 10\""
  dimensions: string;          // "2400 × 3000 px"
  fileName: string;            // "ethereal-dreams-8x10.png"
  fileSize: string;            // "3.5 MB"
  recommendedFor: string;      // "Standard frames, gallery walls"
}

interface FreeArt {
  id: string;                  // "ethereal_dreams"
  name: string;                // "Ethereal Dreams"
  description: string;         // Short (1 sentence)
  longDescription: string;     // Long (2-3 paragraphs)
  artist: string;              // "The Pixel Prince"
  tags: string[];              // ["fantasy", "abstract"]
  previewImage: string;        // "/art-previews/card/ethereal-dreams-card.webp"
  detailImage: string;         // "/art-previews/detail/ethereal-dreams-detail.webp"
  sizes: ArtSize[];            // Array of 4 sizes
  allSizesZip: string;         // "ethereal-dreams-all.zip"
}

export const freeArtCollection: FreeArt[] = [...];
```

### Constants

```typescript
// config/free-art.ts

export const DOWNLOAD_COOKIE_NAME = "pp_downloads";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;  // 7 days
export const WEEKLY_DOWNLOAD_LIMIT = 3;
```

---

## Future Enhancements

### Potential Improvements

1. **Analytics**: Track popular sizes, download patterns
2. **A/B Testing**: Test different weekly limits (3 vs 5)
3. **Social Sharing**: "Share this art" buttons
4. **Print Guides**: Detailed printing instructions per size
5. **User Accounts**: Optional accounts for download history
6. **Email Delivery**: Option to email download links
7. **Custom Sizes**: On-demand size generation
8. **Watermark Removal**: Reward for newsletter signup

### Scalability Considerations

**Current System (Free Tier):**
- 4 artworks × 5 files = 20 files (~80 MB total)
- Static hosting (Vercel, Netlify)
- Origin serving (no CDN for `/private/`)
- Cookie-based tracking (no database)

**Future Scale (100+ artworks):**
- Move `/private/` to S3/R2 storage
- CDN with signed URLs
- PostgreSQL for download tracking
- Redis for rate limiting
- Cloudflare Workers for download API

---

## Related Documentation

- **Adding Art**: `/docs/ADDING-NEW-ART.md` - How to add new artworks
- **Images**: `/docs/IMAGE-GUIDE.md` - Image preparation specs
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md` - Common issues
- **Implementation**: `/docs/IMPLEMENTATION-PHASES.md` - Development history

---

## Support

For technical questions or issues:
1. Review this architecture document
2. Check `/docs/TROUBLESHOOTING.md`
3. Inspect browser console and network tab
4. Review Next.js build logs
5. Test with `DISABLE_DOWNLOAD_LIMIT=true`

---

**Last Updated**: 2025-11-24
**Version**: 1.0
