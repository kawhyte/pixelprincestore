# Adding New Art to Free Downloads

This guide walks you through adding a new digital art print to The Pixel Prince Store using **Sanity CMS** and **cloud storage** (Cloudinary/Google Drive).

---

## Overview

Each art piece requires:
- **2 high-resolution PNG files** (4″×5″, 8″×10″) - **REQUIRED FOR LAUNCH**
  - These are the free download sizes
- **2 larger sizes** (16″×20″) - **OPTIONAL "Coming Soon"**
  - No files needed until you're ready to make them available
  - Just set availability to "coming-soon" in Sanity
- **2 preview images** (card and detail) - uploaded to Sanity
- **1 ZIP bundle** (available sizes only)
- **Sanity Studio entry** - all metadata managed in CMS

**Storage:**
- ✅ **Cloudinary** for files under 10MB (recommended)
- ✅ **Google Drive** for larger files
- ❌ No local file storage - everything is cloud-based

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

Create **at minimum 2 PNG files** for the available sizes:

#### Size 1: 4″×5″ (10×13 cm) - **REQUIRED** ✅
```bash
# Dimensions: 1200 × 1500 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 1-2 MB
# Status: Available for free download
# File needed: YES
```

#### Size 2: 8″×10″ (20×25 cm) - **REQUIRED** ✅
```bash
# Dimensions: 2400 × 3000 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 2-4 MB
# Status: Available for free download
# File needed: YES
```

#### Size 3: 16″×20″ (40×50 cm) - **OPTIONAL** 🔜
```bash
# Dimensions: 4800 × 6000 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 7-10 MB
# Status: Coming soon (premium)
# File needed: NO (upload later when ready)
```

#### Size 4: 16″×20″ (40×50 cm) - **OPTIONAL** 🔜
```bash
# Dimensions: 4724 × 5906 px
# DPI: 300
# Format: PNG (lossless)
# Target size: 7-10 MB
# Status: Coming soon (premium)
# File needed: NO (upload later when ready)
```

**File Naming Convention:**
```
{artwork-name}-{size-id}.png

Examples:
- midnight-bloom-4x5.png
- midnight-bloom-8x10.png
- midnight-bloom-16x20.png
- midnight-bloom-40x50cm.png
```

---

### Step 3: Upload Files to Cloud Storage

You have two options depending on file size:

#### Option A: Cloudinary (Files < 10MB) ✅ Recommended

1. Open **Sanity Studio** at `http://localhost:3333`
2. Create a new **Free Art Product** (Step 4)
3. Use the built-in **High-Res Asset Upload** for each size
4. Files are automatically uploaded to Cloudinary
5. URLs are saved automatically

#### Option B: Google Drive (Files > 10MB)

**Upload Files:**
1. Go to [Google Drive](https://drive.google.com)
2. Create a folder (e.g., "Midnight Bloom - High Res")
3. Upload all 4 PNG files
4. **For each file:**
   - Right-click → Share → "Anyone with the link"
   - Copy the share link
   - Convert to direct download link:

   **Original:** `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   **Direct Download:** `https://drive.google.com/uc?export=download&id=FILE_ID`

**Upload ZIP:**
1. Create ZIP with all 4 sizes + instructions
2. Upload to Google Drive
3. Share and get direct download link (same process)

---

### Step 4: Create Product in Sanity Studio

#### 4a. Open Sanity Studio
```bash
cd pixelprincestore
npm run sanity
# Opens at http://localhost:3333
```

#### 4b. Create New Product

1. Click **"Free Art Product"** in sidebar
2. Click **"+ Create"** button
3. Fill in the following fields:

**Basic Information:**
- **Title**: `Midnight Bloom`
- **Slug**: Auto-generated from title (`midnight-bloom`)
- **Artist**: `The Pixel Prince` (pre-filled)

**Descriptions:**
- **Short Description**: One compelling sentence (max 200 chars)
  - Example: "A mystical garden awakens under moonlight with ethereal purples and blues."
- **Long Description**: 2-3 paragraphs about the artwork
  - Describe the visual elements
  - Mention emotional impact
  - Suggest use cases (bedroom, meditation space, etc.)

**Preview Images:**
- **Preview Image**: Upload card preview (600×800 recommended)
  - This appears in the gallery grid
  - Automatically served from Sanity CDN

- **Detail Image**: Upload detail image (1200×1600 recommended)
  - This appears on the product page
  - Higher quality for closer viewing

**Tags & Category:**
- **Tags**: Add relevant tags (e.g., "Abstract", "Nature", "Night")
- **Category**: Select primary category

---

### Step 5: Add Available Sizes

For each of the 4 sizes, you'll see pre-filled fields. Update them:

#### For Each Size (4x5, 8x10, 16x20, 40x50cm):

1. **Display Label (Primary)**: Already filled with cm (e.g., "10×13 cm")
2. **Alternate Label (Inches)**: Already filled (e.g., "4″×5″")
3. **Availability Status**: Pre-set based on current availability
   - 10×13 cm (4x5): **Available** ✅
   - 20×25 cm (8x10): **Available** ✅
   - 40×50 cm (16x20): **Coming Soon** 🔜
   - 40×50 cm (40x50cm): **Coming Soon** 🔜
4. **Coming Soon Message**: For coming-soon sizes, displays "Premium sizes launching soon!"
5. **Dimensions**: Already filled (e.g., "1200 × 1500 px")
6. **File Size**: Update with actual size (e.g., "1.2 MB")
7. **Recommended For**: Already filled (e.g., "Small frames, desk display")

8. **High Resolution Asset**: Click to expand
   - **Asset Type**: Choose "Cloudinary" or "External Link"

   **If Cloudinary:**
   - Click **"Choose File to Upload"**
   - Select your PNG file
   - Upload happens automatically
   - URL is saved

   **If Google Drive:**
   - Choose "External Link"
   - Paste your direct download URL
   - Enter filename (e.g., "midnight-bloom-4x5.png")

**Note:** Even for "Coming Soon" sizes, you can upload the files now. They will be displayed to users with a "Coming Soon" badge but won't be downloadable until you change their availability status to "Available".

---

### Step 6: Add ZIP Download

Scroll to **"ZIP Download URL"** field:

1. Upload your ZIP to Google Drive or Cloudinary
2. Get direct download link
3. Paste URL into **"ZIP Download URL"** field

**ZIP Contents Should Include:**
- All 4 PNG files
- `HOW-TO-OPEN.txt` with instructions for Mac/Windows
- Optionally: License information, usage tips

---

### Step 7: Save & Publish

1. Click **"Publish"** button (top right)
2. Verify all required fields are filled
3. Product is now live!

**Your new artwork is immediately available at:**
```
https://your-domain.com/art/midnight-bloom
```

---

### Step 8: Test Your New Art

#### 8a. View in Gallery
1. Navigate to `http://localhost:3000/free-downloads`
2. Verify new card appears
3. Check preview image loads
4. Hover to see overlay effect

#### 8b. Test Detail Page
1. Click card to open product page
2. Verify detail image displays
3. Check all 4 sizes appear:
   - Available sizes (10×13 cm, 20×25 cm) show "High-Res PNG" badges
   - Coming soon sizes (40×50 cm) show "Coming Soon" badges
4. Verify size labels show both cm and inches (e.g., "10×13 cm" with "4″×5″" below)
5. Verify descriptions display correctly
6. Check tags render
7. Verify coming-soon sizes are disabled (cannot be selected)

#### 8c. Test Downloads
1. **Select a size** (e.g., 8"×10")
2. Click **"Download Selected Size"**
3. Verify:
   - File downloads correctly
   - Confetti animation plays
   - Success toast appears
   - Size shows "Downloaded ✓"

#### 8d. Test ZIP Download
1. Click **"Download All Sizes (ZIP)"**
2. Verify ZIP downloads
3. Extract and check all files present
4. Verify files open correctly

#### 8e. Test Download Tracking
1. Download 3 different sizes
2. Verify count decreases: "2 remaining" → "1 remaining" → "0 remaining"
3. Try downloading 4th size
4. Verify blocked with error message
5. Check reset date displays

---

## Quality Checklist

Before marking complete, verify:

### Content ✓
- [ ] Title is compelling and clear
- [ ] Short description is concise (under 200 chars)
- [ ] Long description is detailed (2-3 paragraphs)
- [ ] Tags are relevant and searchable
- [ ] Artist name is correct

### Images ✓
- [ ] Preview image uploaded to Sanity (600×800 recommended)
- [ ] Detail image uploaded to Sanity (1200×1600 recommended)
- [ ] Images are sharp and clear
- [ ] Colors are vibrant and accurate
- [ ] No visible compression artifacts

### Files ✓
- [ ] All 4 sizes uploaded to Cloudinary/Google Drive
- [ ] All files are 300 DPI PNG format
- [ ] File sizes are accurate in Sanity
- [ ] ZIP includes all 4 files + instructions
- [ ] ZIP URL is direct download link

### Functionality ✓
- [ ] Card appears in gallery
- [ ] Detail page loads correctly
- [ ] All 4 sizes downloadable
- [ ] ZIP downloads successfully
- [ ] Confetti animation works
- [ ] Toast notifications appear
- [ ] Download tracking works
- [ ] Weekly limit enforced

### URLs ✓
- [ ] All Cloudinary URLs are HTTPS
- [ ] Google Drive links are direct download format
- [ ] No URLs are broken (test each one)

---

## File Size Guidelines

### Preview Images (Sanity)
- **Card Preview**: 600×800px, 50-150 KB
- **Detail Image**: 1200×1600px, 200-400 KB
- **Format**: JPEG or WebP (Sanity auto-optimizes)

### Print Files (Cloudinary/Drive)
- **10×13 cm (4″×5″)**: 1-2 MB - **Available**
- **20×25 cm (8″×10″)**: 2-4 MB - **Available**
- **40×50 cm (16″×20″)**: 7-10 MB - **Coming Soon**
- **40×50 cm (16″×20″)**: 7-10 MB - **Coming Soon**
- **Format**: PNG (lossless)

### ZIP Bundle
- **Total Size**: 15-25 MB (all 4 files + instructions)
- **Compression**: Maximum (use ZIP format)

---

## Google Drive Direct Download URL Format

**Important:** Google Drive share links don't work for direct downloads. You must convert them:

**Wrong (Share Link):**
```
https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
```

**Correct (Direct Download):**
```
https://drive.google.com/uc?export=download&id=1ABC123XYZ
```

Just copy the `FILE_ID` from the share link and use the format above.

---

## Sanity Studio Tips

### Using the AI Description Generator
1. Fill in the **Title** field first
2. Click **"AI Description Generator"** field
3. Wait for AI to generate suggestions
4. Copy good suggestions to **Short Description** and **Long Description**
5. Edit and refine as needed

### High-Res Asset Upload
- **For Cloudinary**: Just click and upload - it handles everything
- **For External**: Make sure you test the URL before saving
- **Filename**: Must match actual file (e.g., "midnight-bloom-4x5.png")

### Saving Work
- **Save**: Saves draft (not public)
- **Publish**: Makes live on website
- **Unpublish**: Removes from website (keeps draft)

---

## Troubleshooting

### Issue: "File URL not configured"

**Solution:**
1. Check that **High Resolution Asset** is filled for each size
2. Verify URLs are direct download links (not share links)
3. Test URLs in browser (should trigger download)
4. Save and re-publish product

---

### Issue: Download fails with 404

**Solution:**
1. Check Cloudinary URL is valid (should start with `https://res.cloudinary.com/`)
2. For Google Drive, verify direct download format
3. Test URL in incognito/private browser
4. Check file permissions in Google Drive ("Anyone with link")

---

### Issue: Images not loading

**Solution:**
1. Verify images uploaded to Sanity (not local files)
2. Check Sanity Studio shows image preview
3. Re-publish product
4. Clear browser cache
5. Restart dev server

---

### Issue: Product doesn't appear in gallery

**Solution:**
1. Check product is **Published** (not just saved)
2. Verify all required fields filled
3. Restart dev server: `npm run dev`
4. Check browser console for errors

---

## Batch Operations

### Converting Images for Sanity Upload

**Create Card Previews (600×800):**
```bash
magick convert "midnight-bloom-8x10.png" \
  -resize 600x800 \
  -quality 85 \
  "midnight-bloom-card.jpg"
```

**Create Detail Images (1200×1600):**
```bash
magick convert "midnight-bloom-8x10.png" \
  -resize 1200x1600 \
  -quality 90 \
  "midnight-bloom-detail.jpg"
```

### Creating ZIP Bundle

**Mac/Linux:**
```bash
zip -9 midnight-bloom-all.zip \
  midnight-bloom-4x5.png \
  midnight-bloom-8x10.png \
  midnight-bloom-16x20.png \
  midnight-bloom-40x50cm.png \
  HOW-TO-OPEN.txt
```

**Windows:**
```powershell
Compress-Archive -Path *.png,HOW-TO-OPEN.txt -DestinationPath midnight-bloom-all.zip
```

---

## Quick Reference

### Sanity Studio
```bash
npm run sanity
# Opens: http://localhost:3333
```

### Dev Server
```bash
npm run dev
# Opens: http://localhost:3000
```

### Test URLs
- Gallery: `http://localhost:3000/free-downloads`
- Product: `http://localhost:3000/art/midnight-bloom`
- API: `http://localhost:3000/api/claim-art?artId=midnight-bloom&sizeId=8x10`

---

## Additional Resources

- **Sanity Setup**: `/docs/SANITY_SETUP.md` - CMS configuration
- **Architecture**: `/docs/ARCHITECTURE.md` - How the system works
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md` - Common issues
- **Image Guide**: `/docs/IMAGE-GUIDE.md` - Image specs

---

## Migration from Old System

If you have existing art in the old system:

1. **Files are already ready** - just need to upload to cloud
2. **Upload to Cloudinary** or Google Drive
3. **Create Sanity product** with all metadata
4. **Copy descriptions** from old `config/free-art.ts`
5. **Test thoroughly** before removing old config

**Old files locations (now deleted):**
- ~~`/private/free/`~~ → Cloudinary/Google Drive
- ~~`/public/art-previews/`~~ → Sanity CDN
- ~~`config/free-art.ts` (FREE_ART array)~~ → Sanity Studio

---

## Support

If you encounter issues:

1. Check Sanity Studio console for errors
2. Verify all URLs are direct download format
3. Test URLs in browser incognito mode
4. Check Network tab in browser DevTools
5. Review `/docs/TROUBLESHOOTING.md`

---

**Last Updated**: 2025-11-30
**Version**: 2.0 (Cloud-based with Sanity CMS)
