import { defineType, defineField } from 'sanity'

export const blogImage = defineType({
  name: 'blogImage',
  title: 'Photo',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Photo credit (leave blank if this is your own photo)',
      type: 'object',
      fields: [
        defineField({
          name: 'credit',
          title: 'Credit text',
          type: 'string',
          description: 'e.g. "Photo by Jane Doe / Unsplash"',
        }),
        defineField({ name: 'sourceUrl', title: 'Source link', type: 'url' }),
      ],
    }),
  ],
})
