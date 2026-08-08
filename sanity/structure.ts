import type { StructureResolver } from 'sanity/structure';

/**
 * Simple admin-style sidebar for Capos client.
 * Clear names, no Vision / clutter — just the lists they need.
 */
const SETTINGS_ID = 'siteSettings';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Capos Admin')
    .items([
      // ── Leads ──────────────────────────────────────────
      S.listItem()
        .title('1. Event Bookings')
        .child(
          S.list()
            .title('Event Bookings')
            .items([
              S.listItem()
                .title('New (need reply)')
                .child(
                  S.documentList()
                    .title('New bookings')
                    .filter('_type == "eventInquiry" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Responded')
                .child(
                  S.documentList()
                    .title('Responded')
                    .filter('_type == "eventInquiry" && status == "responded"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('All bookings')
                .child(
                  S.documentList()
                    .title('All bookings')
                    .filter('_type == "eventInquiry"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('2. Newsletter Emails')
        .child(
          S.documentList()
            .title('Newsletter subscribers')
            .filter('_type == "newsletterSubscriber"')
            .defaultOrdering([{ field: 'subscribedAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('3. Article Orders')
        .child(
          S.list()
            .title('Orders')
            .items([
              S.listItem()
                .title('Need to fulfill')
                .child(
                  S.documentList()
                    .title('Pending')
                    .filter(
                      '_type == "articleOrder" && fulfillmentStatus != "fulfilled"'
                    )
                    .defaultOrdering([{ field: 'paidAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Fulfilled')
                .child(
                  S.documentList()
                    .title('Fulfilled')
                    .filter(
                      '_type == "articleOrder" && fulfillmentStatus == "fulfilled"'
                    )
                    .defaultOrdering([{ field: 'paidAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('All orders')
                .child(
                  S.documentList()
                    .title('All orders')
                    .filter('_type == "articleOrder"')
                    .defaultOrdering([{ field: 'paidAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ── Website content ────────────────────────────────
      S.listItem()
        .title('4. Menu (drinks)')
        .child(
          S.documentList()
            .title('Menu drinks')
            .filter('_type == "menuDrink"')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
        ),

      S.listItem()
        .title('5. Marquee & extras')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId(SETTINGS_ID)
            .title('Marquee · Flavors · Add-ons')
        ),

      S.listItem()
        .title('6. Articles (for sale)')
        .child(
          S.documentList()
            .title('Articles')
            .filter('_type == "article"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
    ]);
