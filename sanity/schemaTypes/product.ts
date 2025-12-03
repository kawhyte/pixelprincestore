import { defineType, defineField } from 'sanity'
import { Gift } from 'lucide-react'
import { GeminiGenerator } from '../components/GeminiGenerator'

export const product = defineType({
  name: 'product',
  title: 'Free Art Product',
  type: 'document',
  icon: Gift,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the art piece',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
      description: 'Artist name',
      initialValue: 'The Pixel Prince',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      description: 'Card preview image (600x800 recommended for portrait, 800x600 for landscape)',
      options: {
        hotspot: true,
      },
      validation: (Rule) =>
        Rule.required()
          .custom((image: any) => {
            // Validate aspect ratio - warn if unusual
            if (image?.asset?.metadata?.dimensions) {
              const { width, height } = image.asset.metadata.dimensions;
              const aspectRatio = width / height;

              // Check for standard aspect ratios (with tolerance)
              const isPortrait = aspectRatio >= 0.70 && aspectRatio <= 0.85; // ~3:4
              const isLandscape = aspectRatio >= 1.25 && aspectRatio <= 1.40; // ~4:3
              const isSquare = aspectRatio >= 0.95 && aspectRatio <= 1.05; // ~1:1

              if (!isPortrait && !isLandscape && !isSquare) {
                return {
                  message: `⚠️ Unusual aspect ratio detected (${aspectRatio.toFixed(2)}). Consider using portrait (3:4), landscape (4:3), or square (1:1) for best card display.`,
                  level: 'warning',
                };
              }
            }
            return true;
          }),
    }),
    defineField({
      name: 'aiHelper',
      title: 'AI Description Generator',
      type: 'string',
      description: 'Generate descriptions using AI',
      components: {
        input: GeminiGenerator,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description shown on cards',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      description: 'Detailed description for the detail page',
      rows: 5,
    }),
    defineField({
      name: 'detailImage',
      title: 'Detail Image',
      type: 'image',
      description: 'High-resolution detail page image (1200x1600 recommended)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'artSize' }],
      description: 'Different size options for this art piece (pre-filled with standard sizes)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: [
        {
          id: '4x5',
          displayLabel: '4″×5″',
          alternateLabel: '10×13 cm',
          dimensions: '1200 × 1500 px',
          fileName: '', // User must fill this in
          fileSize: '1.2 MB',
          recommendedFor: 'Small frames, desk display',
          availability: 'available',
        },
        {
          id: '8x10',
          displayLabel: '8″×10″',
          alternateLabel: '20×25 cm',
          dimensions: '2400 × 3000 px',
          fileName: '', // User must fill this in
          fileSize: '2.8 MB',
          recommendedFor: 'Medium frames, home decor',
          availability: 'available',
        },
        {
          id: '16x20',
          displayLabel: '16″×20″',
          alternateLabel: '40×50 cm',
          dimensions: '4800 × 6000 px',
          fileName: '', // User must fill this in
          fileSize: '8.5 MB',
          recommendedFor: 'Large frames, statement pieces',
          availability: 'coming-soon',
          comingSoonMessage: 'Premium sizes launching soon!',
        },
        {
          id: '40x50cm',
          displayLabel: '16″×20″',
          alternateLabel: '40×50 cm',
          dimensions: '4724 × 5906 px',
          fileName: '', // User must fill this in
          fileSize: '8.2 MB',
          recommendedFor: 'Gallery-quality, professional display',
          availability: 'coming-soon',
          comingSoonMessage: 'Premium sizes launching soon!',
        },
      ],
    }),
    defineField({
      name: 'allSizesZip',
      title: 'All Sizes ZIP Filename (Deprecated)',
      type: 'string',
      description: '[DEPRECATED] Use zipUrl instead. Old filename for local storage.',
      hidden: true,
    }),
    defineField({
      name: 'zipUrl',
      title: 'ZIP Download URL',
      type: 'url',
      description: 'Direct URL to the ZIP file on Cloudinary or Google Drive containing all sizes',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for categorization and search',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Primary category',
      options: {
        list: [
          { title: 'Video Games + Man Cave ', value: 'Video Games' },
          { title: 'Motivational + Quotes ', value: 'Quotes ' },
          { title: 'Maps + Travel Poster', value: 'Maps' },
          { title: 'Funny + Meme', value: 'Funny' },
          { title: 'Minimalist', value: 'Minimalist' },
          { title: 'Botanical', value: 'Botanical' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artist: 'artist',
      media: 'previewImage',
    },
    prepare({ title, artist, media }) {
      return {
        title: title,
        subtitle: `by ${artist}`,
        media: media,
      }
    },
  },
})
