/**
 * Migration Script: Update Existing Products with CM Labels
 *
 * This script updates all existing products in Sanity to use the new size schema:
 * - Adds displayLabel (cm-based)
 * - Adds alternateLabel (inches)
 * - Sets availability status
 * - Adds comingSoonMessage for unavailable sizes
 *
 * Run with: npx tsx scripts/migrate-sizes-to-cm.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Sanity client with write access
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '', // Required for write access
  useCdn: false, // Don't use CDN for mutations
});

// Size mapping: converts old labels to new cm-based format
const SIZE_MIGRATIONS: Record<string, {
  displayLabel: string;
  alternateLabel: string;
  availability: 'available' | 'coming-soon';
  comingSoonMessage?: string;
}> = {
  '4x5': {
    displayLabel: '10×13 cm',
    alternateLabel: '4″×5″',
    availability: 'available',
  },
  '8x10': {
    displayLabel: '20×25 cm',
    alternateLabel: '8″×10″',
    availability: 'available',
  },
  '16x20': {
    displayLabel: '40×50 cm',
    alternateLabel: '16″×20″',
    availability: 'coming-soon',
    comingSoonMessage: 'Premium sizes launching soon!',
  },
  '40x50cm': {
    displayLabel: '40×50 cm',
    alternateLabel: '16″×20″',
    availability: 'coming-soon',
    comingSoonMessage: 'Premium sizes launching soon!',
  },
};

async function migrateProducts() {
  console.log('🚀 Starting migration: Converting sizes to cm labels...\n');

  try {
    // Fetch all products
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        _rev,
        title,
        sizes[]{
          id,
          label,
          displayLabel,
          alternateLabel,
          availability,
          comingSoonMessage,
          dimensions,
          fileName,
          fileSize,
          recommendedFor,
          highResAsset
        }
      }
    `);

    console.log(`📦 Found ${products.length} product(s) to migrate\n`);

    if (products.length === 0) {
      console.log('✅ No products found. Exiting.\n');
      return;
    }

    // Migrate each product
    for (const product of products) {
      console.log(`📝 Migrating: "${product.title}" (${product._id})`);

      // Check if already migrated
      const alreadyMigrated = product.sizes?.every((size: any) =>
        size.displayLabel && size.availability
      );

      if (alreadyMigrated) {
        console.log(`   ⏭️  Already migrated, skipping...\n`);
        continue;
      }

      // Update sizes array
      const updatedSizes = product.sizes?.map((size: any) => {
        const migration = SIZE_MIGRATIONS[size.id];

        if (!migration) {
          console.warn(`   ⚠️  Unknown size ID: ${size.id}, skipping...`);
          return size;
        }

        // Merge existing size data with new fields
        return {
          ...size,
          displayLabel: size.displayLabel || migration.displayLabel,
          alternateLabel: size.alternateLabel || migration.alternateLabel,
          availability: size.availability || migration.availability,
          comingSoonMessage: size.comingSoonMessage || migration.comingSoonMessage,
        };
      });

      // Patch the product in Sanity
      try {
        await client
          .patch(product._id)
          .set({ sizes: updatedSizes })
          .commit();

        console.log(`   ✅ Successfully migrated ${updatedSizes.length} size(s)`);

        // Log what was updated
        updatedSizes.forEach((size: any) => {
          const status = size.availability === 'available' ? '✅ Available' : '🔜 Coming Soon';
          console.log(`      - ${size.displayLabel} (${size.alternateLabel}) - ${status}`);
        });
        console.log('');
      } catch (patchError) {
        console.error(`   ❌ Failed to patch product: ${patchError}`);
        console.log('');
      }
    }

    console.log('🎉 Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Open Sanity Studio to verify changes');
    console.log('2. Check your website to see the new cm labels');
    console.log('3. Test the "Coming Soon" badges on larger sizes\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Error: SANITY_API_TOKEN environment variable is required');
  console.log('\nPlease set your Sanity API token:');
  console.log('1. Go to https://www.sanity.io/manage');
  console.log('2. Select your project');
  console.log('3. Go to API → Tokens');
  console.log('4. Create a token with "Editor" permissions');
  console.log('5. Add to your .env.local file: SANITY_API_TOKEN=your_token_here\n');
  process.exit(1);
}

// Run migration
migrateProducts();
