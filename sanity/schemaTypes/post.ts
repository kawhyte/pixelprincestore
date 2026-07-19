import { defineType, defineField, defineArrayMember } from 'sanity'
import { Newspaper, Images, LayoutGrid } from 'lucide-react'

const attributionField = {
  name: 'attribution',
  title: 'Photo credit (leave blank if this is your own photo)',
  type: 'object',
  fields: [
    { name: 'credit', type: 'string', title: 'Credit text', description: 'e.g. "Photo by Jane Doe / Unsplash"' },
    { name: 'sourceUrl', type: 'url', title: 'Source link' },
  ],
}

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: Newspaper,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Meta description + card teaser. ≤155 chars ideal.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'targetKeyword',
      title: 'Target Keyword',
      type: 'string',
      description: 'Primary SEO keyword this post targets.',
    }),
    defineField({
      name: 'hero',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }, attributionField],
        }),
        defineArrayMember({
          name: 'imageRow',
          type: 'object',
          title: 'Two photos side by side',
          icon: Images,
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Photos',
              of: [{ type: 'blogImage' }],
              validation: (Rule) => Rule.length(2).error('Add exactly 2 photos'),
            },
          ],
          preview: {
            select: { alt: 'images.0.alt' },
            prepare: ({ alt }) => ({ title: 'Two photos side by side', subtitle: alt || '' }),
          },
        }),
        defineArrayMember({
          name: 'imageGrid',
          type: 'object',
          title: 'Photo grid (2–4)',
          icon: LayoutGrid,
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Photos',
              of: [{ type: 'blogImage' }],
              validation: (Rule) => Rule.min(2).max(4).error('Add 2 to 4 photos'),
            },
          ],
          preview: {
            select: { alt: 'images.0.alt' },
            prepare: ({ alt }) => ({ title: 'Photo grid (2–4)', subtitle: alt || '' }),
          },
        }),
        defineArrayMember({
          name: 'productEmbed',
          type: 'object',
          title: 'Product Embed',
          fields: [
            { name: 'product', type: 'reference', to: [{ type: 'product' }] },
            { name: 'note', type: 'string', title: 'One-line pitch (optional)' },
          ],
          preview: { select: { title: 'product.title' } },
        }),
        defineArrayMember({
          name: 'emailCapture',
          type: 'object',
          title: 'Email Capture Block',
          fields: [
            {
              name: 'heading',
              type: 'string',
              initialValue: 'Get a new free print every month',
            },
          ],
          preview: { prepare: () => ({ title: '📧 Email capture block' }) },
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ (for snippet capture)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'q', type: 'string', title: 'Question' },
            { name: 'a', type: 'text', rows: 3, title: 'Answer' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      // Default to now so a hand-created post can't be "published" in Studio
      // yet stay invisible on the site (blog queries filter publishedAt < now()).
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'targetKeyword', media: 'hero' },
  },
})
