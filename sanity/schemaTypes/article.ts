import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Capos article catalog — edited by client in /studio.
 * `articleId` stays stable for Stripe + Supabase purchases.
 */
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'commerce', title: 'Price & Meta' },
  ],
  fields: [
    defineField({
      name: 'articleId',
      title: 'Stable ID',
      type: 'string',
      group: 'commerce',
      description: 'Never change after first publish (used for Stripe / purchases).',
      validation: (r) => r.required().regex(/^art_[a-z0-9_]+$/, {
        name: 'articleId',
        invert: false,
      }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: 'body',
      title: 'Body paragraphs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image path or URL',
      type: 'string',
      group: 'media',
      description: 'Site path (e.g. /capos1.PNG) or full https URL.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'string', title: 'Image path/URL' })],
    }),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      group: 'commerce',
      options: {
        list: [
          { title: 'Wedding', value: 'Wedding' },
          { title: 'Corporate', value: 'Corporate' },
          { title: 'Pop-up', value: 'Pop-up' },
          { title: 'Essay', value: 'Essay' },
          { title: 'Private', value: 'Private' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eventLabel',
      title: 'Event label',
      type: 'string',
      group: 'commerce',
      description: 'e.g. Long Island · May 2026',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'priceCents',
      title: 'Price (cents)',
      type: 'number',
      group: 'commerce',
      description: '1800 = $18.00',
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      group: 'commerce',
      initialValue: 'usd',
      options: { list: [{ title: 'USD', value: 'usd' }] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
      type: 'number',
      group: 'commerce',
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      group: 'commerce',
      options: {
        list: [
          { title: 'Digital PDF', value: 'Digital PDF' },
          { title: 'Digital Guide', value: 'Digital Guide' },
        ],
      },
      initialValue: 'Digital PDF',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'commerce',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'date',
      group: 'commerce',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active (visible on site)',
      type: 'boolean',
      group: 'commerce',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eventType',
      featured: 'featured',
      active: 'active',
    },
    prepare({ title, subtitle, featured, active }) {
      const flags = [
        featured ? '★' : '',
        active === false ? '(hidden)' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return {
        title: title || 'Untitled',
        subtitle: [subtitle, flags].filter(Boolean).join(' · '),
      };
    },
  },
  orderings: [
    {
      title: 'Published (newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
