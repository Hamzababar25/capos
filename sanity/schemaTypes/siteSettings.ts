import { defineArrayMember, defineField, defineType } from 'sanity';

/** Singleton — marquee + menu extras (essentials / add-ons). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'marqueeItems',
      title: 'Marquee line (above About)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Each item scrolls in the ticker between Hero and About.',
    }),
    defineField({
      name: 'essentialFlavors',
      title: 'Essential flavors',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'addOns',
      title: 'Customize / add-ons',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Marquee · Essentials · Add-ons' };
    },
  },
});
