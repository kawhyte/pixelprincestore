# Private Art Files

This folder contains the high-resolution digital art files that are served through the `/api/download` endpoint.

## Important Notes

- Files in this folder are **NOT publicly accessible** via the web
- They can only be downloaded through the secure API route
- Users can download **3 sizes per week** (tracked via cookies, resets every 7 days)

## File Structure

```
private/
├── free/                                  # Free downloads
│   ├── ethereal-dreams-4x5.png
│   ├── ethereal-dreams-8x10.png
│   ├── ethereal-dreams-16x20.png
│   ├── ethereal-dreams-40x50cm.png
│   ├── ethereal-dreams-all.zip           # Contains all 4 sizes
│   ├── vintage-map-4x5.png
│   ├── vintage-map-8x10.png
│   └── ...
└── paid/                                  # Future paid products (empty for now)
```

## File Naming Convention

**Individual Sizes:**
```
{art-slug}-{size}.png

Examples:
- ethereal-dreams-4x5.png
- vintage-map-8x10.png
- zen-garden-16x20.png
- botanical-study-40x50cm.png
```

**ZIP Files (All Sizes):**
```
{art-slug}-all.zip

Examples:
- ethereal-dreams-all.zip
- vintage-map-all.zip
```

## Adding New Art

1. **Prepare Files:**
   - Create 4 size variants (4x5, 8x10, 16x20, 40x50cm)
   - Name files following convention above
   - Recommended format: PNG at 300 DPI
   - Add files to `private/free/` folder

2. **Generate ZIP:**
   ```bash
   npm run generate-zips
   ```
   This auto-creates ZIPs with all sizes + HOW-TO-OPEN.txt

3. **Update Config:**
   - Edit `config/free-art.ts`
   - Add new entry to `freeArtCollection`
   - Include all 4 sizes and ZIP reference

4. **Add Preview Images:**
   - Card preview: `public/art-previews/card/{art-slug}.webp` (600x800)
   - Detail preview: `public/art-previews/detail/{art-slug}.webp` (1200x1600)

## Recommended Specifications

| Size | Dimensions | DPI | File Format | Target File Size | Best For |
|------|-----------|-----|-------------|------------------|----------|
| 4" × 5" | 1200 × 1500 px | 300 | PNG | 1-2 MB | Small frames, desk display |
| 8" × 10" | 2400 × 3000 px | 300 | PNG | 2-4 MB | Medium frames, home decor |
| 16" × 20" | 4800 × 6000 px | 300 | PNG | 7-10 MB | Large frames, statement pieces |
| 40 × 50 cm | 4724 × 5906 px | 300 | PNG | 7-10 MB | Gallery-quality, professional display |

### Image Quality Requirements

✅ **Do**:
- Use PNG format (lossless, supports transparency)
- Export at 300 DPI minimum for print quality
- Use sRGB color space for consistent printing
- Include full bleed if designing for frames
- Test print quality at smallest size (4"×5")

❌ **Don't**:
- Use JPEG (lossy compression, no transparency)
- Use less than 300 DPI (will look pixelated when printed)
- Include watermarks or logos
- Use CMYK color space (convert to sRGB)
- Upscale from lower resolution sources

### Preview Images

**Card Preview** (Gallery thumbnails):
- Location: `public/art-previews/card/{art-slug}.webp`
- Dimensions: 600 × 800 pixels (3:4 aspect ratio)
- Format: WebP (for optimal web performance)
- Quality: 80-90%
- Target File Size: 50-150 KB

**Detail Image** (Product page):
- Location: `public/art-previews/detail/{art-slug}.webp`
- Dimensions: 1200 × 1600 pixels (3:4 aspect ratio)
- Format: WebP
- Quality: 85-95%
- Target File Size: 200-400 KB

### ZIP Files

ZIP files are **auto-generated** by running:
```bash
npm run generate-zips
```

Each ZIP contains:
- All 4 size PNGs
- HOW-TO-OPEN.txt with Mac/PC instructions
- Maximum compression (level 9)

## Complete Workflow Example

### Adding "Midnight Bloom" Artwork

1. **Create download files** (save to `private/free/`):
   ```
   midnight-bloom-4x5.png      (1200 × 1500 px, 300 DPI)
   midnight-bloom-8x10.png     (2400 × 3000 px, 300 DPI)
   midnight-bloom-16x20.png    (4800 × 6000 px, 300 DPI)
   midnight-bloom-40x50cm.png  (4724 × 5906 px, 300 DPI)
   ```

2. **Create preview images** (save to `public/art-previews/`):
   ```
   card/midnight-bloom.webp    (600 × 800 px, 85% quality)
   detail/midnight-bloom.webp  (1200 × 1600 px, 90% quality)
   ```

3. **Generate ZIP bundle**:
   ```bash
   npm run generate-zips
   # Creates: private/free/midnight-bloom-all.zip
   ```

4. **Update config** (`config/free-art.ts`):
   ```typescript
   {
     id: "art_5",
     title: "Midnight Bloom",
     artist: "The Pixel Prince",
     description: "Short description...",
     longDescription: "Longer description for detail page...",
     previewImage: "/art-previews/card/midnight-bloom.webp",
     detailImage: "/art-previews/detail/midnight-bloom.webp",
     allSizesZip: "midnight-bloom-all.zip",
     tags: ["Nature", "Dark", "Abstract"],
     category: "Nature",
     sizes: [
       {
         id: "4x5",
         label: "4\" × 5\"",
         dimensions: "1200 × 1500 px",
         fileName: "midnight-bloom-4x5.png",
         fileSize: "1.2 MB",
         recommendedFor: "Small frames, desk display"
       },
       // ... add all 4 sizes
     ]
   }
   ```

5. **Test in browser**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/free-downloads
   # Click card → test downloads
   ```

6. **Deploy**:
   ```bash
   npm run build
   # Verify build succeeds
   # Deploy to production
   ```

## Troubleshooting

### Issue: "File not found" errors

**Solutions**:
- Verify file names exactly match config (`fileName` field)
- Check files are in correct directory (`private/free/`)
- Ensure no extra spaces or capital letters in filenames
- Run `ls -la private/free/` to confirm files exist

### Issue: Downloads work but images too large/small

**Solutions**:
- Verify DPI is set to 300 in export settings
- Check actual pixel dimensions match specifications
- Test print at smallest size to verify quality
- Use ImageMagick to verify: `identify -verbose file.png`

### Issue: ZIP generation fails

**Solutions**:
- Ensure all 4 size files exist before running script
- Check console output for specific missing files
- Verify filenames match config exactly
- Install/update archiver: `npm install archiver`

---

## Additional Resources

For comprehensive image preparation guidance, see:
- [docs/IMAGE-GUIDE.md](../docs/IMAGE-GUIDE.md) - Complete image specifications and workflows
- [docs/IMPLEMENTATION-PHASES.md](../docs/IMPLEMENTATION-PHASES.md) - Implementation status and phases

For questions or support:
- Email: hello@thepixelprince.store
- Visit: https://thepixelprince.store/support
