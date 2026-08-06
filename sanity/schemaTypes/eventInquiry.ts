import { defineField, defineType } from 'sanity';

/**
 * Event / catering booking inquiries from the website form.
 * Status: new → responded (after team calls / replies).
 */
export const eventInquiry = defineType({
  name: 'eventInquiry',
  title: 'Event Inquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Responded', value: 'responded' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event date',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue / location',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guests',
      title: 'Expected guests',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'budget',
      title: 'Estimated budget',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'supabaseId',
      title: 'Supabase row ID',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      eventType: 'eventType',
      eventDate: 'eventDate',
      status: 'status',
    },
    prepare({ title, eventType, eventDate, status }) {
      const badge = status === 'responded' ? '✓' : '●';
      return {
        title: `${badge} ${title || 'Inquiry'}`,
        subtitle: [eventType, eventDate].filter(Boolean).join(' · '),
      };
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
});
