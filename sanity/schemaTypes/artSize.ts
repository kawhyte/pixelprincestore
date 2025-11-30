import { defineType, defineField } from 'sanity'
import { HighResAssetInput } from '../components/HighResAssetInput'

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
      title: 'File Name (Deprecated)',
      type: 'string',
      description: '[DEPRECATED] Legacy field - use highResAsset instead. Reference filename only.',
      hidden: true,
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
    defineField({
      name: 'highResAsset',
      title: 'High Resolution Asset',
      type: 'object',
      description: 'High-res downloadable file (Cloudinary or external link)',
      components: {
        input: HighResAssetInput,
      },
      fields: [
        defineField({
          name: 'assetType',
          title: 'Asset Type',
          type: 'string',
          description: 'How is this file provided?',
          options: {
            list: [
              { title: 'Upload to Cloudinary (< 10MB)', value: 'cloudinary' },
              { title: 'External Link (Google Drive/Dropbox)', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'cloudinary',
        }),
        defineField({
          name: 'cloudinaryUrl',
          title: 'Cloudinary URL',
          type: 'url',
          description: 'Secure URL from Cloudinary upload',
          hidden: ({ parent }) => parent?.assetType !== 'cloudinary',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { assetType?: string };
              if (parent?.assetType === 'cloudinary' && !value) {
                return 'Cloudinary URL is required when using Cloudinary upload';
              }
              return true;
            }),
        }),
        defineField({
          name: 'externalUrl',
          title: 'External Link',
          type: 'url',
          description: 'Shareable link from Google Drive, Dropbox, etc.',
          hidden: ({ parent }) => parent?.assetType !== 'external',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { assetType?: string };
              if (parent?.assetType === 'external' && !value) {
                return 'External link is required when using external storage';
              }
              return true;
            }),
        }),
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
          description: 'Original filename for download (e.g., "moon-4x5.png")',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'uploadedAt',
          title: 'Uploaded At',
          type: 'datetime',
          description: 'When was this asset uploaded?',
          initialValue: () => new Date().toISOString(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'dimensions',
    },
  },
})
