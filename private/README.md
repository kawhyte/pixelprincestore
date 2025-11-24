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

| Size | Dimensions | DPI | File Format |
|------|-----------|-----|-------------|
| 4" × 5" | 1200 × 1500 px | 300 | PNG |
| 8" × 10" | 2400 × 3000 px | 300 | PNG |
| 16" × 20" | 4800 × 6000 px | 300 | PNG |
| 40 × 50 cm | 4724 × 5906 px | 300 | PNG |
