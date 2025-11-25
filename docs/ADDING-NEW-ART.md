# Adding New Art to Free Downloads

This guide walks you through adding a new digital art print to The Pixel Prince Store's free download system.

---

## Overview

Each art piece requires:
- **4 print-ready files** (4"×5", 8"×10", 16"×20", 40×50cm)
- **2 preview images** (card and detail)
- **1 ZIP bundle** (generated automatically)
- **Config entry** in `config/free-art.ts`

---

## Step-by-Step Process

### Step 1: Prepare Your Artwork

Before starting, ensure you have:
- Original high-resolution artwork (recommended: 6000×7500px minimum)
- 3:4 aspect ratio maintained across all sizes
- 300 DPI for print quality
- Clean, professional appearance

---

### Step 2: Export Print-Ready Files

Create 4 PNG files at these exact specifications:

#### Size 1: 4"×5" (Small)
```bash
# Dimensions: 1200 × 1500 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 1-2 MB
```

#### Size 2: 8"×10" (Medium)
```bash
# Dimensions: 2400 × 3000 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 2-4 MB
```

#### Size 3: 16"×20" (Large)
```bash
# Dimensions: 4800 × 6000 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 7-10 MB
```

#### Size 4: 40×50cm (European)
```bash
# Dimensions: 4724 × 5906 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 7-10 MB
```

**File Naming Convention:**
```
{artwork-id}-{size-id}.png

Examples:
- midnight-bloom-4x5.png
- midnight-bloom-8x10.png
- midnight-bloom-16x20.png
- midnight-bloom-40x50cm.png
```

**Save Location:**
```
/private/free/
```

---

### Step 3: Create Preview Images

#### 3a. Card Preview (Gallery View)

```bash
# Dimensions: 600 × 800 px
# Format: WebP
# Quality: 80-90%
# Target size: 50-150 KB
# Naming: {artwork-id}-card.webp
# Location: /public/art-previews/card/
```

**Example ImageMagick Command:**
```bash
magick convert "midnight-bloom-8x10.png" \
  -resize 600x800 \
  -quality 85 \
  "/public/art-previews/card/midnight-bloom-card.webp"
```

#### 3b. Detail Preview (Product Page)

```bash
# Dimensions: 1200 × 1600 px
# Format: WebP
# Quality: 85-95%
# Target size: 200-400 KB
# Naming: {artwork-id}-detail.webp
# Location: /public/art-previews/detail/
```

**Example ImageMagick Command:**
```bash
magick convert "midnight-bloom-8x10.png" \
  -resize 1200x1600 \
  -quality 90 \
  "/public/art-previews/detail/midnight-bloom-detail.webp"
```

---

### Step 4: Update Config File

Open `/config/free-art.ts` and add your new art piece to `freeArtCollection`:

```typescript
{
  id: "midnight_bloom",  // Use underscores for IDs
  name: "Midnight Bloom",  // Display name
  description: "A mystical garden awakens under moonlight",  // Short description
  longDescription: `Midnight Bloom captures the enchanting moment when a secret garden comes alive under the full moon. Deep purples and midnight blues blend with ethereal silver highlights, creating a dreamlike atmosphere. Perfect for bedrooms, meditation spaces, or anywhere you want to add a touch of nocturnal magic.`,  // Detailed description for product page

  artist: "The Pixel Prince",
  tags: ["nature", "fantasy", "night"],  // For filtering/search

  // Preview images
  previewImage: "/art-previews/card/midnight-bloom-card.webp",
  detailImage: "/art-previews/detail/midnight-bloom-detail.webp",

  // Print sizes
  sizes: [
    {
      id: "4x5",
      label: "4\" × 5\"",
      dimensions: "1200 × 1500 px",
      fileName: "midnight-bloom-4x5.png",
      fileSize: "1.2 MB",
      recommendedFor: "Small frames, desk displays"
    },
    {
      id: "8x10",
      label: "8\" × 10\"",
      dimensions: "2400 × 3000 px",
      fileName: "midnight-bloom-8x10.png",
      fileSize: "3.5 MB",
      recommendedFor: "Standard frames, gallery walls"
    },
    {
      id: "16x20",
      label: "16\" × 20\"",
      dimensions: "4800 × 6000 px",
      fileName: "midnight-bloom-16x20.png",
      fileSize: "8.7 MB",
      recommendedFor: "Large wall art, focal points"
    },
    {
      id: "40x50cm",
      label: "40 × 50 cm",
      dimensions: "4724 × 5906 px",
      fileName: "midnight-bloom-40x50cm.png",
      fileSize: "8.4 MB",
      recommendedFor: "European standard frames"
    }
  ],

  // ZIP bundle (will be generated in Step 5)
  allSizesZip: "midnight-bloom-all.zip"
},
```

**Important Config Notes:**
- Use **underscores** in `id` (becomes URL: `/art/midnight_bloom`)
- Use **spaces** in `name` (display title)
- Use **hyphens** in file names (`midnight-bloom-8x10.png`)
- List sizes in ascending order (small to large)
- Provide accurate `fileSize` (helps users with bandwidth decisions)

---

### Step 5: Generate ZIP Bundle

Run the automated ZIP generation script:

```bash
npm run generate-zips
```

This will:
1. Find all 4 size files in `/private/free/`
2. Create a HOW-TO-OPEN.txt with Mac/PC instructions
3. Generate `midnight-bloom-all.zip` with maximum compression
4. Save to `/private/free/`
5. Display file count and size

**Expected Output:**
```
📦 Creating midnight-bloom-all.zip...
   ✓ Added: HOW-TO-OPEN.txt
   ✓ Added: midnight-bloom-4x5.png
   ✓ Added: midnight-bloom-8x10.png
   ✓ Added: midnight-bloom-16x20.png
   ✓ Added: midnight-bloom-40x50cm.png
✅ midnight-bloom-all.zip created successfully
   Size: 18.2 MB
   Files: 5
```

---

### Step 6: Verify File Structure

Check that all files are in place:

```
pixelprincestore/
├── private/
│   └── free/
│       ├── midnight-bloom-4x5.png          ✓
│       ├── midnight-bloom-8x10.png         ✓
│       ├── midnight-bloom-16x20.png        ✓
│       ├── midnight-bloom-40x50cm.png      ✓
│       └── midnight-bloom-all.zip          ✓
│
└── public/
    └── art-previews/
        ├── card/
        │   └── midnight-bloom-card.webp    ✓
        └── detail/
            └── midnight-bloom-detail.webp  ✓
```

---

### Step 7: Test Locally

#### 7a. Start Dev Server
```bash
npm run dev
```

#### 7b. Test Gallery Page
1. Navigate to `http://localhost:3000/free-downloads`
2. Verify new card appears
3. Check image loads correctly
4. Hover to see "View Details" overlay

#### 7c. Test Detail Page
1. Click card to open `/art/midnight_bloom`
2. Verify detail image loads
3. Check all 4 sizes appear in selector
4. Verify long description displays
5. Verify tags appear

#### 7d. Test Downloads
1. Select a size (e.g., 8"×10")
2. Click "Download 8\" × 10\"" button
3. Verify file downloads
4. Check confetti animation plays
5. Verify toast notification appears
6. Confirm downloaded size shows checkmark badge

#### 7e. Test ZIP Download
1. Click "Download All Sizes (ZIP)" button
2. Verify ZIP file downloads
3. Extract ZIP locally
4. Verify all 4 files + HOW-TO-OPEN.txt present
5. Check file integrity (can open images)

#### 7f. Test Weekly Limit
1. Download 3 different sizes
2. Verify status shows "0 downloads remaining"
3. Try downloading 4th size
4. Verify blocked with error toast
5. Check reset date displays correctly

---

### Step 8: Quality Checklist

Before committing, verify:

**Files:**
- [ ] All 4 print sizes exist in `/private/free/`
- [ ] All files use correct naming convention
- [ ] Card preview exists in `/public/art-previews/card/`
- [ ] Detail image exists in `/public/art-previews/detail/`
- [ ] ZIP bundle generated successfully

**Config:**
- [ ] ID uses underscores (`midnight_bloom`)
- [ ] Name is display-ready ("Midnight Bloom")
- [ ] Short description is 1 sentence
- [ ] Long description is 2-3 paragraphs
- [ ] All file paths are correct
- [ ] File sizes are accurate
- [ ] Tags are relevant
- [ ] Artist name correct

**Image Quality:**
- [ ] Card preview: 600×800, WebP, under 150 KB
- [ ] Detail image: 1200×1600, WebP, under 400 KB
- [ ] Print files: Correct dimensions and DPI
- [ ] No visible compression artifacts
- [ ] Colors accurate and vibrant
- [ ] Images sharp and clear

**Functionality:**
- [ ] Card appears in gallery
- [ ] Detail page loads correctly
- [ ] All sizes downloadable
- [ ] ZIP downloads successfully
- [ ] Confetti animation works
- [ ] Toast notifications appear
- [ ] Weekly limit enforced
- [ ] Downloaded sizes marked

**SEO & Accessibility:**
- [ ] Images have meaningful alt text (Next.js Image)
- [ ] Page title uses artwork name
- [ ] Meta description compelling
- [ ] Links accessible via keyboard
- [ ] Contrast ratios sufficient

---

### Step 9: Build & Deploy

#### 9a. Production Build Test
```bash
npm run build
```

Verify:
- No TypeScript errors
- All pages build successfully
- Static generation works for new art ID

#### 9b. Commit Changes
```bash
git add config/free-art.ts
git add private/free/midnight-bloom-*
git add public/art-previews/card/midnight-bloom-card.webp
git add public/art-previews/detail/midnight-bloom-detail.webp

git commit -m "feat: add Midnight Bloom free art download

- Add 4 print sizes (4x5, 8x10, 16x20, 40x50cm)
- Add card and detail preview images
- Generate ZIP bundle with all sizes
- Update config with full metadata"
```

#### 9c. Deploy
```bash
# Your deployment command (e.g., Vercel)
vercel --prod
```

#### 9d. Post-Deploy Testing
1. Test on production URL
2. Verify all images load via CDN
3. Test downloads work
4. Check mobile responsiveness
5. Verify weekly limit persists

---

## Quick Reference Commands

### Batch Convert Multiple Artworks

**Create All Preview Images:**
```bash
# Card previews (600×800 WebP)
for file in private/free/*-8x10.png; do
  basename=$(basename "$file" -8x10.png)
  magick convert "$file" \
    -resize 600x800 \
    -quality 85 \
    "public/art-previews/card/${basename}-card.webp"
done

# Detail images (1200×1600 WebP)
for file in private/free/*-8x10.png; do
  basename=$(basename "$file" -8x10.png)
  magick convert "$file" \
    -resize 1200x1600 \
    -quality 90 \
    "public/art-previews/detail/${basename}-detail.webp"
done
```

**Check File Sizes:**
```bash
# List all files with sizes
ls -lh private/free/*.png
ls -lh private/free/*.zip
ls -lh public/art-previews/card/*.webp
ls -lh public/art-previews/detail/*.webp
```

**Verify Dimensions:**
```bash
# Check image dimensions
magick identify private/free/midnight-bloom-*.png
```

---

## Troubleshooting

### Issue: ZIP Generation Fails

**Error:** `File not found: midnight-bloom-4x5.png`

**Solution:**
1. Check file exists: `ls private/free/midnight-bloom-*.png`
2. Verify naming matches config exactly (case-sensitive)
3. Ensure all 4 sizes present before running script

---

### Issue: Images Not Loading

**Error:** 404 on preview images

**Solution:**
1. Verify files in correct directories:
   - Cards: `/public/art-previews/card/`
   - Details: `/public/art-previews/detail/`
2. Check file names match config exactly
3. Restart dev server: `npm run dev`
4. Clear Next.js cache: `rm -rf .next`

---

### Issue: Downloads Fail

**Error:** "File not available"

**Solution:**
1. Check `/private/free/` contains actual files
2. Verify file names in config match exactly
3. Check file permissions: `ls -la private/free/`
4. Look at API logs: `/app/api/claim-art/route.ts`

---

### Issue: Detail Page 404

**Error:** Page not found for new art

**Solution:**
1. Rebuild app: `npm run build`
2. Check `id` in config uses underscores (`midnight_bloom`)
3. Verify ID added to `freeArtCollection` array
4. Clear `.next` folder and rebuild

---

### Issue: Download Limit Not Working

**Error:** Can download unlimited times

**Solution:**
1. Check cookies enabled in browser
2. Clear cookies and try again
3. Verify `DISABLE_DOWNLOAD_LIMIT` not set in `.env.local`
4. Check browser console for errors

---

## Tips for Success

### Content Quality
- Write compelling descriptions that highlight unique features
- Use evocative language that matches the art style
- Include practical use cases ("perfect for bedrooms")
- Keep tags relevant and searchable

### Technical Quality
- Always use 300 DPI for print files
- Maintain 3:4 aspect ratio across all sizes
- Optimize preview images aggressively (users on mobile)
- Keep print files lossless (PNG)

### File Organization
- Use consistent naming (kebab-case for files)
- Group related files together
- Document any special considerations
- Keep backups of original high-res files

### Testing Thoroughness
- Test on multiple browsers
- Test on mobile devices
- Test with slow internet (preview loading)
- Test download limits thoroughly

---

## Additional Resources

- **Image Guide**: `/docs/IMAGE-GUIDE.md` - Complete image preparation specs
- **Architecture**: `/docs/ARCHITECTURE.md` - How the system works
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md` - Common issues
- **Implementation**: `/docs/IMPLEMENTATION-PHASES.md` - Development history

---

## Support

If you encounter issues not covered here:

1. Check `/docs/TROUBLESHOOTING.md`
2. Review browser console for errors
3. Check Next.js build logs
4. Verify file paths and naming conventions
5. Test with dev mode bypass: `DISABLE_DOWNLOAD_LIMIT=true`

---

**Last Updated**: 2025-11-24
**Version**: 1.0
