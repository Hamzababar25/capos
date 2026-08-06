import { defineField, defineType } from 'sanity';

/** Mirrored from Supabase / Stripe — view & mark fulfilled in Studio. */
export const articleOrder = defineType({
  name: 'articleOrder',
  title: 'Article Order',
  type: 'document',
  fields: [
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe session ID',
      type: 'string',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'articleId',
      title: 'Article ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'articleTitle',
      title: 'Article',
      type: 'string',
    }),
    defineField({
      name: 'buyerEmail',
      title: 'Buyer email',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'amountCents',
      title: 'Amount (cents)',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'usd',
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'fulfillmentStatus',
      title: 'Fulfillment',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Fulfilled', value: 'fulfilled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'buyerEmail',
      article: 'articleTitle',
      payment: 'paymentStatus',
      fulfillment: 'fulfillmentStatus',
      amount: 'amountCents',
    },
    prepare({ title, article, payment, fulfillment, amount }) {
      const dollars =
        typeof amount === 'number' ? `$${(amount / 100).toFixed(0)}` : '';
      return {
        title: title || 'Order',
        subtitle: [article, dollars, payment, fulfillment]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
