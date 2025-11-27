import { defineType, defineField } from 'sanity'

export const artSize = defineType({
  name: 'artSize',
  title: 'Art Size',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Size ID',
      type: 'string',
      description: 'Unique identifier for this size (e.g., "4x5", "8x10")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Display label (e.g., "4" × 5"", "8" × 10"")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Pixel dimensions (e.g., "1200 × 1500 px")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileName',
      title: 'File Name',
      type: 'string',
      description: 'Exact filename in private/free/ folder (e.g., "moon-4x5.png")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size',
      type: 'string',
      description: 'Human-readable file size (e.g., "1.2 MB")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recommendedFor',
      title: 'Recommended For',
      type: 'string',
      description: 'Usage recommendation (e.g., "Small frames, desk display")',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'dimensions',
    },
  },
})
