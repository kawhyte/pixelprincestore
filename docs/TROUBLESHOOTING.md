# Free Art Downloads - Troubleshooting Guide

This guide helps you diagnose and fix common issues with The Pixel Prince Store's free download system.

---

## Quick Diagnostics

Before diving into specific issues, run these quick checks:

```bash
# 1. Check Node.js version (requires 18+)
node --version

# 2. Verify all dependencies installed
npm install

# 3. Clear Next.js cache
rm -rf .next

# 4. Rebuild application
npm run build

# 5. Check file structure
ls -la private/free/
ls -la public/art-previews/card/
ls -la public/art-previews/detail/
```

---

## Downloads Not Working

### Symptom: "Download failed" toast appears

**Possible Causes:**

1. **File doesn't exist**
2. **Incorrect file path in config**
3. **File permissions issue**
4. **Weekly limit reached**

**Diagnosis:**

```bash
# Check if file exists
ls -l private/free/ethereal-dreams-8x10.png

# Check file permissions
ls -la private/free/*.png

# Check API response in browser console
# Network tab → claim-art → Response
```

**Solutions:**

```bash
# 1. Verify file exists
if [ ! -f "private/free/ethereal-dreams-8x10.png" ]; then
  echo "File missing! Add the file or update config."
fi

# 2. Fix permissions (make readable)
chmod 644 private/free/*.png

# 3. Verify config matches actual files
cat config/free-art.ts | grep fileName
ls private/free/*.png
```

**Enable Dev Mode to Bypass Limit:**
```bash
# .env.local
DISABLE_DOWNLOAD_LIMIT=true
```

Restart dev server:
```bash
npm run dev
```

---

### Symptom: "File not available" error

**Cause:** File missing from `/private/free/` directory.

**Diagnosis:**

1. Open browser console (F12)
2. Check Network tab → `/api/claim-art` response
3. Look for file path in error details (dev mode only)

**Solution:**

```bash
# Check what files exist
ls -la private/free/

# Expected files for each artwork:
# - {artwork-id}-4x5.png
# - {artwork-id}-8x10.png
# - {artwork-id}-16x20.png
# - {artwork-id}-40x50cm.png
# - {artwork-id}-all.zip
```

Add missing files according to `/docs/ADDING-NEW-ART.md`.

---

### Symptom: Download starts but file is corrupted

**Possible Causes:**

1. **File corrupted on server**
2. **Incomplete file transfer**
3. **Incorrect MIME type**

**Diagnosis:**

```bash
# Check file integrity
file private/free/ethereal-dreams-8x10.png
# Should output: PNG image data, 2400 x 3000, 8-bit/color RGBA

# Check file size
ls -lh private/free/ethereal-dreams-8x10.png
# Should match config (e.g., 3.5 MB)

# Try opening file locally
open private/free/ethereal-dreams-8x10.png  # Mac
xdg-open private/free/ethereal-dreams-8x10.png  # Linux
```

**Solutions:**

```bash
# Re-export the file from original source
# Ensure proper PNG format (not JPEG renamed to .png)

# Verify with ImageMagick
magick identify -verbose private/free/ethereal-dreams-8x10.png

# Check for errors in output
```

---

## Weekly Limit Issues

### Symptom: Can download unlimited times

**Cause:** Download limit not enforcing.

**Diagnosis:**

```bash
# Check if dev mode bypass is enabled
cat .env.local | grep DISABLE_DOWNLOAD_LIMIT

# Check browser cookies (F12 → Application → Cookies)
# Look for: pp_downloads
```

**Solutions:**

1. **Remove dev mode bypass:**
```bash
# .env.local
# Remove or comment out:
# DISABLE_DOWNLOAD_LIMIT=true
```

2. **Clear and restart:**
```bash
# Clear .env.local
# Restart dev server
npm run dev
```

3. **Check browser cookies:**
- Open DevTools (F12)
- Application tab → Cookies → http://localhost:3000
- Verify `pp_downloads` cookie exists after first download

4. **Verify cookie in code:**
```typescript
// Add temporary logging in app/api/claim-art/route.ts
console.log('Cookie:', request.headers.get('cookie'));
console.log('Parsed:', parseDownloadCookie(cookie));
```

---

### Symptom: Limit reached but shouldn't be

**Cause:** Old download records not cleaned up.

**Diagnosis:**

```javascript
// Browser console:
const cookie = document.cookie.split(';').find(c => c.trim().startsWith('pp_downloads='));
const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
console.log(data.downloads);

// Check timestamps - should be within 7 days
data.downloads.forEach(d => {
  const age = (Date.now() - d.timestamp) / (1000 * 60 * 60 * 24);
  console.log(`${d.artId} - ${age.toFixed(1)} days old`);
});
```

**Solutions:**

1. **Manual cookie cleanup:**
```javascript
// Browser console:
document.cookie = "pp_downloads=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

2. **Wait for automatic cleanup:**
   - Cleanup runs on every request
   - Downloads older than 7 days auto-removed

3. **Force refresh tracking:**
```typescript
// On detail page
const tracking = useDownloadTracking();
tracking.refresh(); // Force re-read cookie
```

---

### Symptom: "Already downloaded" but I haven't

**Cause:** Cookie persisted from previous session or ZIP download.

**Diagnosis:**

```javascript
// Browser console:
const cookie = document.cookie.split(';').find(c => c.trim().startsWith('pp_downloads='));
const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));

// Check if you have the ZIP
const hasZip = data.downloads.some(d =>
  d.artId === "ethereal_dreams" && d.isZip === true
);
console.log('Has ZIP:', hasZip);

// Check specific size
const hasSize = data.downloads.some(d =>
  d.artId === "ethereal_dreams" && d.sizeId === "8x10"
);
console.log('Has 8x10:', hasSize);
```

**Solutions:**

**If you have the ZIP:**
- This is correct behavior
- ZIP includes all sizes, so individual sizes are blocked
- You can download a different artwork

**If you don't have the ZIP:**
```javascript
// Clear cookie and try again
document.cookie = "pp_downloads=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
location.reload();
```

---

## Preview Images Not Loading

### Symptom: Broken image icons on gallery page

**Cause:** Preview images missing or incorrect paths.

**Diagnosis:**

```bash
# Check if images exist
ls -la public/art-previews/card/
ls -la public/art-previews/detail/

# Check paths in config
cat config/free-art.ts | grep -A 2 previewImage
```

**Solutions:**

1. **Verify files exist:**
```bash
# Card previews
ls public/art-previews/card/*.webp

# Detail images
ls public/art-previews/detail/*.webp
```

2. **Check file names match config:**
```bash
# Config says: /art-previews/card/ethereal-dreams-card.webp
# File should be: public/art-previews/card/ethereal-dreams-card.webp
```

3. **Create missing images:**

Follow `/docs/IMAGE-GUIDE.md` to create proper WebP previews:

```bash
# Card preview (600×800)
magick convert "private/free/ethereal-dreams-8x10.png" \
  -resize 600x800 \
  -quality 85 \
  "public/art-previews/card/ethereal-dreams-card.webp"

# Detail image (1200×1600)
magick convert "private/free/ethereal-dreams-8x10.png" \
  -resize 1200x1600 \
  -quality 90 \
  "public/art-previews/detail/ethereal-dreams-detail.webp"
```

4. **Restart Next.js:**
```bash
# Stop dev server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

---

### Symptom: Images load slowly

**Cause:** Images too large or not optimized.

**Diagnosis:**

```bash
# Check file sizes
ls -lh public/art-previews/card/*.webp
ls -lh public/art-previews/detail/*.webp

# Card previews should be: 50-150 KB
# Detail images should be: 200-400 KB
```

**Solutions:**

1. **Re-optimize with lower quality:**
```bash
# Card preview (target: 100 KB)
magick convert "ethereal-dreams-card.webp" \
  -quality 80 \
  "ethereal-dreams-card-optimized.webp"

# Check new size
ls -lh ethereal-dreams-card-optimized.webp
```

2. **Use online tools:**
- Squoosh: https://squoosh.app/
- TinyPNG: https://tinypng.com/
- ImageOptim: https://imageoptim.com/ (Mac)

3. **Batch optimize:**
```bash
# Install sharp-cli
npm install -g sharp-cli

# Optimize all cards
sharp -i "public/art-previews/card/*.webp" \
  -o "public/art-previews/card/" \
  -f webp \
  -q 85
```

---

## ZIP Generation Issues

### Symptom: `npm run generate-zips` fails

**Error:** `"File not found: ethereal-dreams-4x5.png"`

**Cause:** Missing print size files.

**Diagnosis:**

```bash
# Check which files exist
ls -la private/free/ethereal-dreams-*.png

# Expected:
# - ethereal-dreams-4x5.png
# - ethereal-dreams-8x10.png
# - ethereal-dreams-16x20.png
# - ethereal-dreams-40x50cm.png
```

**Solution:**

Add all 4 size files before running ZIP generation:

```bash
# Verify all 4 sizes exist
count=$(ls private/free/ethereal-dreams-*.png 2>/dev/null | wc -l)
if [ "$count" -lt 4 ]; then
  echo "Missing size files! Need all 4 sizes."
  exit 1
fi

# Then run ZIP generation
npm run generate-zips
```

---

### Symptom: ZIP downloads but can't open

**Error:** "Archive is corrupted" or "Cannot extract"

**Cause:** ZIP file corrupted or incomplete.

**Diagnosis:**

```bash
# Test ZIP integrity
unzip -t private/free/ethereal-dreams-all.zip

# Should output:
# Archive:  private/free/ethereal-dreams-all.zip
#     testing: HOW-TO-OPEN.txt         OK
#     testing: ethereal-dreams-4x5.png OK
#     testing: ethereal-dreams-8x10.png OK
#     testing: ethereal-dreams-16x20.png OK
#     testing: ethereal-dreams-40x50cm.png OK
# No errors detected.
```

**Solution:**

1. **Delete corrupted ZIP:**
```bash
rm private/free/ethereal-dreams-all.zip
```

2. **Regenerate:**
```bash
npm run generate-zips
```

3. **Test again:**
```bash
unzip -t private/free/ethereal-dreams-all.zip
```

4. **Extract locally to verify:**
```bash
unzip private/free/ethereal-dreams-all.zip -d /tmp/test-extract
ls -la /tmp/test-extract/
```

---

### Symptom: ZIP missing HOW-TO-OPEN.txt

**Cause:** Script error during generation.

**Diagnosis:**

```bash
# Extract and check contents
unzip -l private/free/ethereal-dreams-all.zip

# Expected files:
# - HOW-TO-OPEN.txt
# - ethereal-dreams-4x5.png
# - ethereal-dreams-8x10.png
# - ethereal-dreams-16x20.png
# - ethereal-dreams-40x50cm.png
```

**Solution:**

1. **Check script for errors:**
```bash
# Run with verbose output
node scripts/generate-zips.js 2>&1 | tee zip-generation.log
```

2. **Regenerate all ZIPs:**
```bash
# Delete all existing ZIPs
rm private/free/*-all.zip

# Regenerate
npm run generate-zips
```

---

## Page Routing Issues

### Symptom: `/art/midnight_bloom` shows 404

**Cause:** Page not statically generated.

**Diagnosis:**

```bash
# Check if art exists in config
cat config/free-art.ts | grep "id: \"midnight_bloom\""

# Check build output
npm run build | grep /art/
```

**Solutions:**

1. **Verify ID in config:**
```typescript
// config/free-art.ts
{
  id: "midnight_bloom",  // Must use underscores
  // ...
}
```

2. **Rebuild application:**
```bash
rm -rf .next
npm run build
npm run dev
```

3. **Check `generateStaticParams`:**
```typescript
// app/art/[id]/page.tsx
export async function generateStaticParams() {
  return freeArtCollection.map((art) => ({
    id: art.id  // Must match config
  }));
}
```

---

### Symptom: Detail page shows wrong artwork

**Cause:** Multiple artworks with same ID.

**Diagnosis:**

```bash
# Check for duplicate IDs
cat config/free-art.ts | grep "id:" | sort | uniq -d
```

**Solution:**

Ensure all artwork IDs are unique:

```typescript
// config/free-art.ts
[
  { id: "ethereal_dreams", ... },
  { id: "midnight_bloom", ... },    // ✓ Unique
  { id: "midnight_bloom", ... },    // ✗ Duplicate!
]
```

---

## Cookie Issues

### Symptom: Downloads reset unexpectedly

**Cause:** Cookies cleared or expired.

**Diagnosis:**

```javascript
// Browser console:
console.log(document.cookie);
// Should include: pp_downloads=...
```

**Possible Reasons:**

1. **Browser privacy settings** (Safari Private Browsing, Incognito)
2. **Cookie blocker extensions** (Privacy Badger, uBlock Origin)
3. **Browser cleared cookies manually**
4. **Cookie expired** (7 days)

**Solutions:**

1. **Check browser settings:**
   - Ensure cookies enabled
   - Disable cookie blockers for localhost
   - Use regular browsing mode (not private/incognito)

2. **Verify cookie is being set:**
```typescript
// app/api/claim-art/route.ts
// Add temporary logging:
console.log('Setting cookie:', cookieHeader);
```

3. **Check cookie attributes:**
```typescript
// Should be:
{
  httpOnly: false,  // Accessible to JavaScript
  secure: false,    // Not HTTPS-only (for dev)
  sameSite: 'lax',  // CSRF protection
  maxAge: 604800,   // 7 days
  path: '/'         // Available sitewide
}
```

---

### Symptom: Cookie not readable by client

**Cause:** `httpOnly: true` set incorrectly.

**Diagnosis:**

```javascript
// Browser console:
const cookie = document.cookie;
console.log(cookie.includes('pp_downloads')); // Should be true
```

**Solution:**

Check API route cookie settings:

```typescript
// app/api/claim-art/route.ts
const cookieHeader = serialize(DOWNLOAD_COOKIE_NAME, cookieValue, {
  httpOnly: false,  // ← Must be false for client access
  secure: false,
  sameSite: 'lax',
  maxAge: COOKIE_MAX_AGE,
  path: '/'
});
```

---

## UI/UX Issues

### Symptom: Confetti not appearing

**Cause:** `canvas-confetti` not installed or imported.

**Diagnosis:**

```bash
# Check if installed
npm list canvas-confetti

# Check import in file
cat app/art/[id]/page.tsx | grep confetti
```

**Solutions:**

1. **Install dependency:**
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

2. **Verify import:**
```typescript
// app/art/[id]/page.tsx
import confetti from 'canvas-confetti';

// In download handler:
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
});
```

3. **Test in browser console:**
```javascript
// Should work if imported correctly
confetti();
```

---

### Symptom: Toast notifications not showing

**Cause:** `sonner` not installed or Toaster not rendered.

**Diagnosis:**

```bash
# Check if installed
npm list sonner

# Check Toaster in layout
cat app/layout.tsx | grep Toaster
```

**Solutions:**

1. **Install dependency:**
```bash
npm install sonner
```

2. **Add Toaster to layout:**
```typescript
// app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
```

3. **Import toast in page:**
```typescript
// app/art/[id]/page.tsx
import { toast } from 'sonner';

toast.success("Download started!");
toast.error("Download failed");
```

---

### Symptom: Downloaded sizes not showing checkmark

**Cause:** Tracking hook not detecting downloads.

**Diagnosis:**

```javascript
// Browser console on detail page:
const tracking = useDownloadTracking();
console.log('Has 8x10:', tracking.hasDownloadedSize('ethereal_dreams', '8x10'));
```

**Solutions:**

1. **Force refresh tracking:**
```typescript
// After download completes:
tracking.refresh();
```

2. **Check cookie structure:**
```javascript
// Browser console:
const cookie = document.cookie.split(';').find(c => c.trim().startsWith('pp_downloads='));
const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
console.log(data);

// Should show:
// { downloads: [{ artId: "...", sizeId: "...", timestamp: ..., isZip: false }] }
```

3. **Verify polling interval:**
```typescript
// lib/use-download-tracking.ts
useEffect(() => {
  const interval = setInterval(() => {
    // Re-read cookie every 1 second
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

---

## Build & Deploy Issues

### Symptom: Build fails with TypeScript errors

**Error:** `Property 'sizes' does not exist on type 'FreeArt'`

**Cause:** Config types don't match usage.

**Diagnosis:**

```bash
# Check TypeScript errors
npm run build 2>&1 | grep error

# Run type check
npx tsc --noEmit
```

**Solutions:**

1. **Verify types match:**
```typescript
// config/free-art.ts
export interface FreeArt {
  id: string;
  name: string;
  // ... all required fields
  sizes: ArtSize[];  // ← Must be defined
}
```

2. **Check all usages:**
```bash
# Find all references to FreeArt
grep -r "FreeArt" app/
```

3. **Clear type cache:**
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

---

### Symptom: Deploy fails on Vercel/Netlify

**Error:** "Cannot read file from /private/"

**Cause:** `/private/` folder not included in deployment.

**Solutions:**

1. **Verify folder structure:**
```bash
# Ensure private/ exists at root
ls -la private/

# Check .gitignore doesn't exclude it
cat .gitignore | grep private
```

2. **For Vercel:**
```json
// vercel.json
{
  "functions": {
    "app/api/claim-art/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

3. **For large files:**
   - Consider moving to S3/R2
   - Use signed URLs
   - Separate storage from application

---

### Symptom: Static generation fails

**Error:** `Error occurred prerendering page "/art/midnight_bloom"`

**Cause:** Runtime code executed during build.

**Diagnosis:**

```bash
# Check build logs
npm run build 2>&1 | grep -A 5 "Error"
```

**Solutions:**

1. **Move client-only code:**
```typescript
// app/art/[id]/page.tsx

// ✗ BAD: Runs during build
const tracking = useDownloadTracking(); // Error!

export default function ArtDetailPage() {
  // ✓ GOOD: Runs in browser only
  const tracking = useDownloadTracking();
}
```

2. **Use 'use client' directive:**
```typescript
// app/art/[id]/page.tsx
'use client';  // ← Add this

import { useDownloadTracking } from '@/lib/use-download-tracking';
```

3. **Check for browser APIs:**
```typescript
// Avoid during SSG:
const cookies = document.cookie;  // ✗ No `document` during build

// Use instead:
'use client';
const cookies = document.cookie;  // ✓ OK with 'use client'
```

---

## Performance Issues

### Symptom: Downloads are slow

**Cause:** Large files, slow network, or inefficient streaming.

**Diagnosis:**

```bash
# Check file sizes
ls -lh private/free/*.png
ls -lh private/free/*.zip

# Monitor download in browser:
# Network tab → claim-art → Size/Time
```

**Solutions:**

1. **Optimize file sizes:**
```bash
# PNGs should be:
# 4x5:     1-2 MB
# 8x10:    2-4 MB
# 16x20:   7-10 MB
# 40x50cm: 7-10 MB
```

2. **Check streaming implementation:**
```typescript
// app/api/claim-art/route.ts
const fileStream = createReadStream(filePath);
const webStream = ReadableStream.from(fileStream);

// Should stream, not load entire file:
// ✗ const buffer = await fs.readFile(filePath);
// ✓ const stream = createReadStream(filePath);
```

3. **Add Content-Length header:**
```typescript
const stats = await stat(filePath);

return new Response(stream, {
  headers: {
    'Content-Length': stats.size.toString(),  // ← Important for progress
  }
});
```

---

### Symptom: Page loads slowly

**Cause:** Unoptimized images or excessive JavaScript.

**Diagnosis:**

```bash
# Check bundle size
npm run build | grep "Route (app)"

# Each page should be:
# First Load JS: ~85 kB
# Page-specific:  137 B
```

**Solutions:**

1. **Optimize preview images:**
   - Cards: 50-150 KB (WebP)
   - Details: 200-400 KB (WebP)

2. **Use Next.js Image:**
```typescript
import Image from 'next/image';

<Image
  src={art.previewImage}
  alt={art.name}
  width={600}
  height={800}
  loading="lazy"  // ← Lazy load below fold
/>
```

3. **Code split:**
```typescript
// Lazy load confetti
const confetti = dynamic(() => import('canvas-confetti'));
```

---

## Testing Issues

### Symptom: Can't test weekly limit

**Cause:** Need to download 3 times, wait 7 days.

**Solution:** Use dev mode bypass:

```bash
# .env.local
DISABLE_DOWNLOAD_LIMIT=true
```

**Or** manually test limit:

```javascript
// Browser console:
// Set cookie with 3 downloads
const data = {
  downloads: [
    { artId: "test1", sizeId: "8x10", timestamp: Date.now(), isZip: false },
    { artId: "test2", sizeId: "8x10", timestamp: Date.now(), isZip: false },
    { artId: "test3", sizeId: "8x10", timestamp: Date.now(), isZip: false }
  ]
};
document.cookie = `pp_downloads=${encodeURIComponent(JSON.stringify(data))}; path=/`;

// Try downloading 4th - should be blocked
```

---

### Symptom: Reset date not calculating correctly

**Cause:** Timezone or date math issue.

**Diagnosis:**

```javascript
// Browser console:
const tracking = useDownloadTracking();
console.log('Reset date:', tracking.resetDate);
console.log('Days until reset:', Math.ceil((tracking.resetDate - Date.now()) / (1000 * 60 * 60 * 24)));
```

**Solution:**

Check `getResetDate()` function:

```typescript
// lib/download-tracking.ts
export function getResetDate(downloads: DownloadRecord[]): Date {
  const oldestDownload = getWeeklyDownloads(downloads)[0];
  if (!oldestDownload) return new Date();

  // Reset is 7 days after oldest download
  return new Date(oldestDownload.timestamp + SEVEN_DAYS_MS);
}
```

---

## Emergency Fixes

### Reset All Downloads (Dev Only)

```javascript
// Browser console:
document.cookie = "pp_downloads=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
location.reload();
```

### Bypass Weekly Limit (Dev Only)

```bash
# .env.local
DISABLE_DOWNLOAD_LIMIT=true
```

### Force Regenerate All ZIPs

```bash
# Delete all ZIPs
rm private/free/*-all.zip

# Regenerate
npm run generate-zips

# Verify
ls -lh private/free/*.zip
```

### Clear Next.js Cache

```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### Nuclear Option (Start Fresh)

```bash
# Delete everything
rm -rf .next
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Rebuild
npm run build

# Test
npm run dev
```

---

## Getting Help

If issues persist after trying solutions above:

1. **Check Documentation:**
   - `/docs/ARCHITECTURE.md` - How system works
   - `/docs/ADDING-NEW-ART.md` - Adding art guide
   - `/docs/IMAGE-GUIDE.md` - Image specs

2. **Enable Debug Mode:**
```typescript
// Add logging to API route
console.log('Cookie:', request.headers.get('cookie'));
console.log('Downloads:', downloads);
console.log('Weekly limit:', hasReachedWeeklyLimit(downloads));
```

3. **Check Browser Console:**
   - F12 → Console tab
   - Look for errors (red text)
   - Check Network tab for failed requests

4. **Test in Different Browser:**
   - Chrome (primary testing)
   - Safari (secondary)
   - Firefox (tertiary)

5. **Test in Incognito/Private:**
   - Eliminates extension conflicts
   - Fresh cookie state

6. **Review Implementation History:**
   - `/docs/IMPLEMENTATION-PHASES.md`
   - Git commit history
   - Find when issue was introduced

---

## Common Error Codes

| Code | Meaning | Common Cause | Solution |
|------|---------|--------------|----------|
| 400 | Bad Request | Missing artId/sizeId | Check URL params |
| 403 | Forbidden | Weekly limit reached | Wait or clear cookie |
| 403 | Forbidden | Already downloaded | Check cookie, clear if wrong |
| 404 | Not Found | Invalid artId | Check config spelling |
| 500 | Server Error | File not found | Check file exists |
| 500 | Server Error | File read error | Check permissions |

---

## Preventive Measures

### Before Adding New Art

```bash
# Checklist:
✓ All 4 size files exist
✓ File names match config exactly
✓ Preview images created
✓ Config entry added
✓ ZIPs generated
✓ Build succeeds
✓ Download tested
```

### Before Deploying

```bash
# Run checks:
npm run build          # No errors
npm run generate-zips  # All ZIPs created
ls private/free/       # Files exist
git status             # No uncommitted changes
```

### Regular Maintenance

```bash
# Monthly:
- Check file sizes (ensure under limits)
- Test download limits
- Verify all images load
- Check browser compatibility
- Review error logs (if any)
```

---

**Last Updated**: 2025-11-24
**Version**: 1.0
