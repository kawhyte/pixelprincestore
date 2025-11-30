/**
 * Fix Missing Keys in Sizes Array
 *
 * This script adds the required _key property to all size items in the array.
 * Sanity requires all array items to have a unique _key for proper editing.
 *
 * Run with: npx tsx scripts/fix-missing-keys.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
  useCdn: false,
});

// Generate a unique key (same format Sanity uses)
function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

async function fixMissingKeys() {
  console.log('🔧 Starting fix: Adding missing _key properties...\n');

  try {
    // Fetch all products with their sizes
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        _rev,
        title,
        sizes
      }
    `);

    console.log(`📦 Found ${products.length} product(s) to check\n`);

    if (products.length === 0) {
      console.log('✅ No products found. Exiting.\n');
      return;
    }

    let fixedCount = 0;

    // Fix each product
    for (const product of products) {
      console.log(`📝 Checking: "${product.title}" (${product._id})`);

      if (!product.sizes || product.sizes.length === 0) {
        console.log(`   ⏭️  No sizes found, skipping...\n`);
        continue;
      }

      // Check if any size is missing _key
      const hasMissingKeys = product.sizes.some((size: any) => !size._key);

      if (!hasMissingKeys) {
        console.log(`   ✅ All sizes have keys, skipping...\n`);
        continue;
      }

      // Add _key to sizes that don't have one
      const fixedSizes = product.sizes.map((size: any) => ({
        ...size,
        _key: size._key || generateKey(),
      }));

      // Update the product
      try {
        await client
          .patch(product._id)
          .set({ sizes: fixedSizes })
          .commit();

        console.log(`   ✅ Fixed ${fixedSizes.length} size(s)`);
        fixedSizes.forEach((size: any) => {
          console.log(`      - ${size.displayLabel || size.label} (key: ${size._key})`);
        });
        console.log('');
        fixedCount++;
      } catch (patchError) {
        console.error(`   ❌ Failed to patch product: ${patchError}`);
        console.log('');
      }
    }

    console.log(`🎉 Fix completed! Updated ${fixedCount} product(s)\n`);
    console.log('Next steps:');
    console.log('1. Reload Sanity Studio (Ctrl+R or Cmd+R)');
    console.log('2. Try editing your products again');
    console.log('3. The "Missing keys" error should be gone\n');

  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

// Check for token
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Error: SANITY_API_TOKEN not found');
  process.exit(1);
}

// Run the fix
fixMissingKeys();
