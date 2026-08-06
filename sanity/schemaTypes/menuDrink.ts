import { defineField, defineType } from 'sanity';

export const menuDrink = defineType({
  name: 'menuDrink',
  title: 'Menu Drink',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Signature', value: 'signature' },
          { title: 'Refresher / Collab', value: 'refresher' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'origin', title: 'Origin / story', type: 'string' }),
    defineField({ name: 'ingredients', title: 'Ingredients', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Image path',
      type: 'string',
      description: 'e.g. /rose-saf.jpg',
    }),
    defineField({
      name: 'featured',
      title: 'Featured this season',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active (visible on site)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', category: 'category', featured: 'featured' },
    prepare({ title, category, featured }) {
      return {
        title: `${featured ? '★ ' : ''}${title || 'Drink'}`,
        subtitle: category,
      };
    },
  },
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
});
