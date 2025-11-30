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
      description: 'Card preview image (600x800 recommended)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
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
          label: '4" × 5"',
          dimensions: '1200 × 1500 px',
          fileName: '', // User must fill this in
          fileSize: '1.2 MB',
          recommendedFor: 'Small frames, desk display',
        },
        {
          id: '8x10',
          label: '8" × 10"',
          dimensions: '2400 × 3000 px',
          fileName: '', // User must fill this in
          fileSize: '2.8 MB',
          recommendedFor: 'Medium frames, home decor',
        },
        {
          id: '16x20',
          label: '16" × 20"',
          dimensions: '4800 × 6000 px',
          fileName: '', // User must fill this in
          fileSize: '8.5 MB',
          recommendedFor: 'Large frames, statement pieces',
        },
        {
          id: '40x50cm',
          label: '40 × 50 cm',
          dimensions: '4724 × 5906 px',
          fileName: '', // User must fill this in
          fileSize: '8.2 MB',
          recommendedFor: 'Gallery-quality, professional display',
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
      type: 'string',
      description: 'Direct URL to the ZIP file on Cloudinary or Google Drive containing all sizes',
      validation: (Rule) => Rule.uri({
        allowRelative: false,
        scheme: ['https', 'http']
      }),
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
          { title: 'Abstract', value: 'Abstract' },
          { title: 'Nature', value: 'Nature' },
          { title: 'Maps', value: 'Maps' },
          { title: 'Vintage', value: 'Vintage' },
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
