import { defineType, defineField } from 'sanity'
import { Gift } from 'lucide-react'

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
      description: 'Different size options for this art piece',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'allSizesZip',
      title: 'All Sizes ZIP Filename',
      type: 'string',
      description: 'Filename for the ZIP containing all sizes (e.g., "moon.zip")',
      validation: (Rule) => Rule.required(),
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
