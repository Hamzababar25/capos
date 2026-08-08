import { defineField, defineType } from 'sanity';

export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'email', status: 'status', subscribedAt: 'subscribedAt' },
    prepare({ title, status, subscribedAt }) {
      const when = subscribedAt
        ? new Date(subscribedAt).toLocaleDateString()
        : '';
      return {
        title: title || 'Subscriber',
        subtitle: [status, when].filter(Boolean).join(' · '),
      };
    },
  },
});
