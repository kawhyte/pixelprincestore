#!/usr/bin/env node

/**
 * Remove ONLY the white square background from Lottie animation
 *
 * This script specifically targets the outermost square background layer
 * while preserving character elements (face, hands, etc.)
 */

const fs = require('fs');
const path = require('path');

const LOTTIE_FILE = path.join(__dirname, '../public/animations/hero-art.json');
const BACKUP_FILE = path.join(__dirname, '../public/animations/hero-art.backup.json');

console.log('🎨 Lottie Background Fixer (Smart Version)\n');

// Check if file exists
if (!fs.existsSync(LOTTIE_FILE)) {
  console.error('❌ Error: hero-art.json not found at', LOTTIE_FILE);
  process.exit(1);
}

// Create backup
console.log('📦 Creating backup...');
fs.copyFileSync(LOTTIE_FILE, BACKUP_FILE);
console.log('✅ Backup created:', BACKUP_FILE);

// Read and parse JSON
console.log('\n📖 Reading Lottie file...');
const data = JSON.parse(fs.readFileSync(LOTTIE_FILE, 'utf8'));

console.log(`Found ${data.layers?.length || 0} layers`);

// Function to check if a shape is a large square (background)
function isSquareBackground(layer) {
  if (!layer.shapes || layer.shapes.length === 0) return false;

  for (const shape of layer.shapes) {
    if (!shape.it) continue;

    for (const item of shape.it) {
      // Check for fill
      if (item.ty === 'fl' && item.c && item.c.k) {
        const [r, g, b] = item.c.k;

        // Only process white fills
        if (r >= 0.95 && g >= 0.95 && b >= 0.95) {
          // Now check if it's a square shape
          for (const pathItem of shape.it) {
            if (pathItem.ty === 'sh' && pathItem.ks && pathItem.ks.k) {
              const vertices = pathItem.ks.k.v;

              // A square background typically has 4 vertices forming a rectangle
              // that covers the entire canvas (750x750 based on your animation)
              if (vertices && vertices.length === 4) {
                // Check if vertices form a large square
                // Background squares typically have vertices at canvas edges
                const isLargeSquare = vertices.some(v =>
                  Math.abs(v[0]) > 300 || Math.abs(v[1]) > 300
                );

                if (isLargeSquare) {
                  console.log(`  📐 Found square shape with vertices:`, vertices);
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }

  return false;
}

// Find and analyze layers
console.log('\n🔍 Analyzing layers...');
let removedCount = 0;

data.layers.forEach((layer, index) => {
  const name = layer.nm || 'Unnamed';
  const hasWhite = layer.shapes && layer.shapes.some(shape =>
    shape.it && shape.it.some(item => {
      if (item.ty === 'fl' && item.c && item.c.k) {
        const [r, g, b] = item.c.k;
        return r >= 0.95 && g >= 0.95 && b >= 0.95;
      }
      return false;
    })
  );

  console.log(`  Layer ${index}: "${name}" ${hasWhite ? '(has white)' : ''}`);
});

// Remove only the square background layer
const originalLength = data.layers.length;

data.layers = data.layers.filter((layer, index) => {
  const isBackground = isSquareBackground(layer);

  if (isBackground) {
    console.log(`\n  ❌ Removing layer ${index}: "${layer.nm || 'Unnamed'}" (square background)`);
    removedCount++;
    return false;
  }

  return true;
});

if (removedCount === 0) {
  console.log('\n⚠️  No square background found!');
  console.log('\nTrying alternative approach: Remove only the FIRST layer if it has white fill...');

  // Alternative: Just remove the very first layer (usually the background)
  if (data.layers[0]) {
    const firstLayer = data.layers[0];
    const hasWhite = firstLayer.shapes && firstLayer.shapes.some(shape =>
      shape.it && shape.it.some(item => {
        if (item.ty === 'fl' && item.c && item.c.k) {
          const [r, g, b] = item.c.k;
          return r >= 0.95 && g >= 0.95 && b >= 0.95;
        }
        return false;
      })
    );

    if (hasWhite) {
      console.log(`  ❌ Removing first layer: "${firstLayer.nm || 'Unnamed'}"`);
      data.layers.shift();
      removedCount = 1;
    }
  }
}

if (removedCount === 0) {
  console.log('\n✅ No background to remove. Animation looks clean!');
  process.exit(0);
}

// Save the modified file
console.log(`\n💾 Saving changes... (removed ${removedCount} layer(s))`);
fs.writeFileSync(LOTTIE_FILE, JSON.stringify(data, null, 2));

console.log('\n✅ Success!');
console.log(`   Original layers: ${originalLength}`);
console.log(`   Removed layers: ${removedCount}`);
console.log(`   Final layers: ${data.layers.length}`);
console.log('\n📝 Next steps:');
console.log('   1. Refresh your browser (hard refresh: Cmd+Shift+R)');
console.log('   2. Check if character is intact with no white square');
console.log('\n   To restore: cp', BACKUP_FILE, LOTTIE_FILE);
