/**
 * Swap Size Labels: Inches Primary, CM Secondary
 *
 * This script swaps displayLabel and alternateLabel so that:
 * - displayLabel = inches (4″×5″) - PRIMARY
 * - alternateLabel = cm (10×13 cm) - SECONDARY
 *
 * Run with: npx tsx scripts/swap-size-labels.ts
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

async function swapLabels() {
  console.log('🔄 Starting label swap: Inches → Primary, CM → Secondary\n');

  try {
    // Fetch all products
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        _rev,
        title,
        sizes[]{
          _key,
          id,
          displayLabel,
          alternateLabel,
          dimensions,
          fileName,
          fileSize,
          recommendedFor,
          availability,
          comingSoonMessage,
          highResAsset
        }
      }
    `);

    console.log(`📦 Found ${products.length} product(s) to update\n`);

    if (products.length === 0) {
      console.log('✅ No products found. Exiting.\n');
      return;
    }

    // Swap labels for each product
    for (const product of products) {
      console.log(`📝 Swapping: "${product.title}" (${product._id})`);

      if (!product.sizes || product.sizes.length === 0) {
        console.log(`   ⏭️  No sizes found, skipping...\n`);
        continue;
      }

      // Swap displayLabel ↔ alternateLabel for each size
      const swappedSizes = product.sizes.map((size: any) => {
        // Check if it looks like it's already in the correct format
        const displayIsInches = size.displayLabel?.includes('″') || size.displayLabel?.includes('"');

        if (displayIsInches) {
          console.log(`   ⏭️  Already swapped, skipping...\n`);
          return size;
        }

        // Swap the labels
        return {
          ...size,
          displayLabel: size.alternateLabel, // cm → inches
          alternateLabel: size.displayLabel, // inches → cm
        };
      });

      // Check if anything changed
      const hasChanges = swappedSizes.some((size: any, index: number) =>
        size.displayLabel !== product.sizes[index].displayLabel
      );

      if (!hasChanges) {
        console.log(`   ⏭️  No changes needed\n`);
        continue;
      }

      // Update the product
      try {
        await client
          .patch(product._id)
          .set({ sizes: swappedSizes })
          .commit();

        console.log(`   ✅ Successfully swapped ${swappedSizes.length} size(s)`);
        swappedSizes.forEach((size: any) => {
          const status = size.availability === 'available' ? '✅' : '🔜';
          console.log(`      ${status} ${size.displayLabel} (${size.alternateLabel})`);
        });
        console.log('');
      } catch (patchError) {
        console.error(`   ❌ Failed to patch product: ${patchError}`);
        console.log('');
      }
    }

    console.log('🎉 Label swap completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Reload your website to see inches as primary');
    console.log('2. Reload Sanity Studio to verify changes');
    console.log('3. Sizes will now display as: 4″×5″ (10×13 cm)\n');

  } catch (error) {
    console.error('❌ Swap failed:', error);
    process.exit(1);
  }
}

// Check for token
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Error: SANITY_API_TOKEN not found');
  process.exit(1);
}

// Run the swap
swapLabels();
