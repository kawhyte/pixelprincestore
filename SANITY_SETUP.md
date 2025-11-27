# Sanity.io Setup Guide for The Pixel Prince

This guide will walk you through setting up Sanity.io as the backend for your free art downloads.

## Prerequisites

- Node.js 18+ installed
- A Sanity.io account (free tier is sufficient)

## Step 1: Initialize Sanity Project

Run the following command to create a new Sanity project:

```bash
npx sanity init --env
```

This will:
1. Prompt you to log in to Sanity (or create an account)
2. Create a new project (or select an existing one)
3. Generate a `.env.local` file with your project credentials

**Important:** Choose the following options when prompted:
- **Dataset name:** `production`
- **Output path:** Use the default (current directory)

## Step 2: Verify Environment Variables

After running `sanity init`, check your `.env.local` file. It should contain:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
```

If any variables are missing, copy them from `.env.example` and fill in the values.

## Step 3: Access Sanity Studio

Start your Next.js development server:

```bash
npm run dev
```

Navigate to:
```
http://localhost:3000/studio
```

You should see the Sanity Studio interface. Log in with your Sanity credentials.

## Step 4: Understanding the Schema

The project uses the following schema for free art products:

### Product Schema (`product`)

Each product has the following fields:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `title` | String | The name of the art piece | Yes |
| `slug` | Slug | URL-friendly identifier (auto-generated) | Yes |
| `artist` | String | Artist name (defaults to "The Pixel Prince") | Yes |
| `description` | Text | Brief description (max 200 chars) | Yes |
| `longDescription` | Text | Detailed description for detail page | No |
| `previewImage` | Image | Card preview (600x800 recommended) | Yes |
| `detailImage` | Image | High-res detail image (1200x1600) | No |
| `sizes` | Array | Available size options | Yes |
| `allSizesZip` | String | Filename of ZIP with all sizes | Yes |
| `tags` | Array | Tags for categorization | No |
| `category` | String | Primary category | No |

### Art Size Object

Each size in the `sizes` array has:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Size identifier | "4x5", "8x10" |
| `label` | String | Display label | "4" × 5"" |
| `dimensions` | String | Pixel dimensions | "1200 × 1500 px" |
| `fileName` | String | Exact filename in `private/free/` | "moon-4x5.png" |
| `fileSize` | String | Human-readable size | "1.2 MB" |
| `recommendedFor` | String | Usage recommendation | "Small frames" |

## Step 5: Creating Your First Product

1. Go to `http://localhost:3000/studio`
2. Click "Free Art Product" (or the "+" button)
3. Fill in the required fields:
   - **Title:** e.g., "Moon Dreams"
   - **Artist:** "The Pixel Prince" (or your name)
   - **Short Description:** A brief, engaging description
   - **Preview Image:** Upload your card preview image

4. Click "Generate" next to the Slug field (it will auto-generate from the title)

5. Add sizes by clicking "Add item" under "Available Sizes":
   ```
   ID: 4x5
   Label: 4" × 5"
   Dimensions: 1200 × 1500 px
   File Name: moon-4x5.png
   File Size: 1.2 MB
   Recommended For: Small frames, desk display
   ```

6. **Important:** Set the `allSizesZip` field to the ZIP filename (e.g., "moon.zip")

7. Add tags (e.g., "Abstract", "Digital", "Nature")

8. Click "Publish" in the bottom right

## Step 6: File Organization

Your downloadable files must be placed in the `private/free/` directory:

```
private/
└── free/
    ├── moon-4x5.png
    ├── moon-8x10.png
    ├── moon-16x20.png
    ├── moon-40x50cm.png
    └── moon.zip
```

**Critical:** The `fileName` values in Sanity must **exactly match** the files in this directory.

## Step 7: Testing

1. Navigate to `http://localhost:3000/free-downloads`
2. You should see your newly created product
3. Click on the product to view details
4. Test the download functionality

## Migrating Existing Data

If you have existing free art data in `config/free-art.ts`, you can:

1. Manually create each product in Sanity Studio (recommended for accuracy)
2. Use the Sanity CLI to import data (advanced)

### Manual Migration Steps:

For each item in `freeArtCollection`:

1. Create a new Product in Sanity Studio
2. Upload the preview image (the file from the `previewImage` path)
3. Copy the title, artist, description, and longDescription
4. For each size in the `sizes` array, add a new Art Size object
5. Set the `allSizesZip` to the value from the array
6. Add the tags
7. Publish the product

## Troubleshooting

### Error: "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"

**Solution:** Run `npx sanity init --env` to generate your `.env.local` file.

### Error: "File not available"

**Solution:** Ensure the file exists in `private/free/` and the `fileName` in Sanity matches exactly (case-sensitive).

### Images not loading in Sanity Studio

**Solution:** Check your network connection and ensure you've published the product.

### No products showing on the frontend

**Solution:**
1. Verify products are published in Sanity Studio
2. Check browser console for errors
3. Ensure environment variables are set correctly

## Development Tips

### Bypass Download Limits

Set in `.env.local`:
```env
DISABLE_DOWNLOAD_LIMIT=true
```

This allows unlimited downloads during testing.

### Revalidation

The frontend uses ISR (Incremental Static Regeneration) with a 60-second revalidation period. Changes in Sanity will appear within 60 seconds.

### Using Sanity Vision

The Vision plugin is enabled in your Studio. Access it at:
```
http://localhost:3000/studio/vision
```

This allows you to test GROQ queries directly.

Example query to see all products:
```groq
*[_type == "product"] {
  title,
  slug,
  artist,
  sizes
}
```

## Next Steps

1. **Content Strategy:** Plan which free art pieces to offer
2. **Image Optimization:** Prepare high-quality preview images (600x800)
3. **File Preparation:** Create downloadable files in various sizes
4. **SEO:** Add metadata to your products (use `longDescription`)
5. **Analytics:** Track which products are most popular

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs-app-router)

## Support

If you encounter issues:
1. Check the Sanity project dashboard: https://www.sanity.io/manage
2. Review the Next.js console for errors
3. Verify all environment variables are set correctly
