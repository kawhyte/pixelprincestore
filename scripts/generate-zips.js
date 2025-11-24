#!/usr/bin/env node

/**
 * ZIP Generation Script for Free Art Downloads
 *
 * This script automatically generates ZIP files containing all sizes
 * of each artwork plus a HOW-TO-OPEN.txt with instructions for Mac/PC users.
 *
 * Usage:
 *   npm run generate-zips
 *
 * Requirements:
 *   - All size files must exist in private/free/
 *   - Config must be up to date in config/free-art.ts
 */

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Import art collection config (using require for CommonJS compatibility)
const configPath = path.join(__dirname, '../config/free-art.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract the freeArtCollection array from the TypeScript file
// This is a simple parse - for production you might want to use ts-node
const collectionMatch = configContent.match(/export const freeArtCollection: FreeArt\[\] = (\[[\s\S]*?\n\]);/);

if (!collectionMatch) {
  console.error('❌ Could not parse freeArtCollection from config/free-art.ts');
  process.exit(1);
}

// Evaluate the array (safe since we control the source)
const freeArtCollection = eval(collectionMatch[1]);

const privateDir = path.join(__dirname, '../private/free');

// HOW-TO-OPEN.txt content
const HOW_TO_OPEN_CONTENT = `🎨 How to Open Your Digital Art Files

Thank you for downloading from The Pixel Prince Store!

This ZIP file contains your artwork in 4 print-ready sizes:
• 4" × 5" (1200 × 1500 px) - Small frames, desk display
• 8" × 10" (2400 × 3000 px) - Medium frames, home decor
• 16" × 20" (4800 × 6000 px) - Large frames, statement pieces
• 40 × 50 cm (4724 × 5906 px) - Gallery-quality, professional display

═══════════════════════════════════════════════════════════════

📂 OPENING ON MAC (macOS)

1. Double-click the ZIP file - it will automatically extract
2. A folder will appear with the same name as the ZIP file
3. Open the folder to see all your PNG files
4. Choose the size you want to print
5. Right-click → "Open With" → Preview or Photos app

Troubleshooting:
• If double-clicking doesn't work, right-click → "Open With" → Archive Utility
• Files stuck in iCloud? Right-click → "Download Now"
• Can't find files? Check your Downloads folder

═══════════════════════════════════════════════════════════════

🪟 OPENING ON WINDOWS (Windows 10/11)

1. Right-click the ZIP file
2. Select "Extract All..."
3. Choose where to save the files (or use default location)
4. Click "Extract"
5. A folder will open showing all your PNG files
6. Choose the size you want to print
7. Double-click to open in Photos app

Troubleshooting:
• No "Extract All" option? Install 7-Zip (free) or WinRAR
• Files won't open? Right-click → "Open With" → Photos
• Corrupted download? Try downloading again

═══════════════════════════════════════════════════════════════

🖨️ PRINTING TIPS

• Choose the size that best fits your frame
• Use high-quality print settings (300 DPI recommended)
• Print on matte or glossy photo paper for best results
• For large prints (16"×20"+), consider professional printing services
• Avoid stretching or resizing - use the exact size provided

═══════════════════════════════════════════════════════════════

❓ NEED HELP?

Visit: https://thepixelprince.store/support
Email: hello@thepixelprince.store

Enjoy your art! 🎨✨

─────────────────────────────────────────────────────────────
© The Pixel Prince Store • All Rights Reserved
For personal use only • Commercial use prohibited
`;

/**
 * Create a ZIP file for a single artwork
 */
async function createZipForArtwork(artwork) {
  return new Promise((resolve, reject) => {
    const zipFilename = artwork.allSizesZip;
    const zipPath = path.join(privateDir, zipFilename);

    console.log(`\n📦 Creating ${zipFilename}...`);

    // Create write stream
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Error handling
    output.on('error', (err) => {
      console.error(`❌ Error writing ${zipFilename}:`, err);
      reject(err);
    });

    archive.on('error', (err) => {
      console.error(`❌ Error creating archive for ${zipFilename}:`, err);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(`⚠️  Warning: ${err.message}`);
      } else {
        reject(err);
      }
    });

    // Track progress
    let filesAdded = 0;

    archive.on('entry', (entry) => {
      filesAdded++;
      console.log(`   ✓ Added: ${entry.name}`);
    });

    // Finalize on close
    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ ${zipFilename} created successfully`);
      console.log(`   Size: ${sizeInMB} MB`);
      console.log(`   Files: ${filesAdded}`);
      resolve();
    });

    // Pipe archive data to file
    archive.pipe(output);

    // Add HOW-TO-OPEN.txt
    archive.append(HOW_TO_OPEN_CONTENT, { name: 'HOW-TO-OPEN.txt' });

    // Validate and add each size file
    let allFilesExist = true;

    for (const size of artwork.sizes) {
      const filePath = path.join(privateDir, size.fileName);

      if (!fs.existsSync(filePath)) {
        console.error(`   ❌ Missing file: ${size.fileName}`);
        allFilesExist = false;
        continue;
      }

      // Add file to archive
      archive.file(filePath, { name: size.fileName });
    }

    if (!allFilesExist) {
      console.warn(`   ⚠️  Some files are missing for ${artwork.title}`);
      console.warn(`   ⚠️  ZIP will be created with available files only`);
    }

    // Finalize the archive
    archive.finalize();
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 The Pixel Prince Store - ZIP Generation Script\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Check if private/free directory exists
  if (!fs.existsSync(privateDir)) {
    console.error(`❌ Directory not found: ${privateDir}`);
    console.error('   Please create the directory and add your art files first.');
    process.exit(1);
  }

  console.log(`📁 Working directory: ${privateDir}`);
  console.log(`📋 Found ${freeArtCollection.length} artworks to process\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process each artwork
  for (const artwork of freeArtCollection) {
    try {
      await createZipForArtwork(artwork);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ZIP for ${artwork.title}:`, error.message);
      errorCount++;
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('\n📊 Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount}`);
  }
  console.log('\n✨ Done!\n');

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
