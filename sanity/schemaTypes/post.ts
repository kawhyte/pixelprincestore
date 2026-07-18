import { defineType, defineField, defineArrayMember } from 'sanity'
import { Newspaper } from 'lucide-react'

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
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
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
