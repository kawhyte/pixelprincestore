# Scripts Directory

This folder contains utility scripts for managing The Pixel Prince Store.

## Available Scripts

### `generate-zips.js`

Automatically generates ZIP files for all free art downloads.

**Purpose**: Creates ZIP bundles containing all 4 sizes of each artwork plus HOW-TO-OPEN.txt instructions for users.

**Usage**:
```bash
npm run generate-zips
```

**Requirements**:
- All size files must exist in `private/free/` directory
- File names must match those defined in `config/free-art.ts`
- Node.js and the `archiver` package must be installed

**What it does**:
1. Reads the art collection from `config/free-art.ts`
2. For each artwork:
   - Validates that all 4 size files exist
   - Creates a ZIP file containing:
     - 4"×5" size PNG
     - 8"×10" size PNG
     - 16"×20" size PNG
     - 40×50cm size PNG
     - HOW-TO-OPEN.txt with Mac/PC instructions
   - Saves ZIP to `private/free/[artwork-id]-all.zip`
3. Displays a summary of successful/failed operations

**Example Output**:
```
🎨 The Pixel Prince Store - ZIP Generation Script

═══════════════════════════════════════════════════════════════

📁 Working directory: /path/to/private/free
📋 Found 4 artworks to process

📦 Creating ethereal-dreams-all.zip...
   ✓ Added: HOW-TO-OPEN.txt
   ✓ Added: ethereal-dreams-4x5.png
   ✓ Added: ethereal-dreams-8x10.png
   ✓ Added: ethereal-dreams-16x20.png
   ✓ Added: ethereal-dreams-40x50cm.png
✅ ethereal-dreams-all.zip created successfully
   Size: 20.7 MB
   Files: 5

📦 Creating vintage-map-all.zip...
   ✓ Added: HOW-TO-OPEN.txt
   ✓ Added: vintage-map-4x5.png
   ✓ Added: vintage-map-8x10.png
   ✓ Added: vintage-map-16x20.png
   ✓ Added: vintage-map-40x50cm.png
✅ vintage-map-all.zip created successfully
   Size: 22.6 MB
   Files: 5

... (etc)

═══════════════════════════════════════════════════════════════

📊 Summary:
   ✅ Successful: 4

✨ Done!
```

**Troubleshooting**:

**Problem**: "Could not parse freeArtCollection from config/free-art.ts"
- **Solution**: Ensure `config/free-art.ts` exports `freeArtCollection` array correctly

**Problem**: "❌ Missing file: artwork-size.png"
- **Solution**: Add the missing PNG files to `private/free/` directory
- The script will continue and create ZIPs for available files only

**Problem**: "Directory not found: private/free"
- **Solution**: Create the directory structure:
  ```bash
  mkdir -p private/free
  ```

**Problem**: "archiver not installed"
- **Solution**: Install dependencies:
  ```bash
  npm install
  ```

**When to run this script**:
- After adding new artwork files to `private/free/`
- After updating artwork configurations in `config/free-art.ts`
- Before deploying to production
- When preparing bulk downloads for the first time

**Important Notes**:
- ZIP files use maximum compression (level 9)
- HOW-TO-OPEN.txt is automatically included in every ZIP
- Script validates file existence before creating archives
- Existing ZIP files will be overwritten without warning
- Script exits with error code 1 if any ZIP creation fails

---

## Future Scripts

Additional utility scripts will be added here as needed:
- `optimize-images.js` - Optimize preview images
- `validate-config.js` - Validate config/free-art.ts structure
- `test-downloads.js` - Test download endpoints
