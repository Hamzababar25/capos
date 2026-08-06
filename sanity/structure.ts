import type { StructureResolver } from 'sanity/structure';

const SETTINGS_ID = 'siteSettings';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Capos')
    .items([
      S.listItem()
        .title('Event Inquiries')
        .child(
          S.list()
            .title('Event Inquiries')
            .items([
              S.listItem()
                .title('New')
                .child(
                  S.documentList()
                    .title('New inquiries')
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
                .title('All inquiries')
                .child(
                  S.documentList()
                    .title('All inquiries')
                    .filter('_type == "eventInquiry"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Orders')
        .child(
          S.list()
            .title('Article Orders')
            .items([
              S.listItem()
                .title('All orders')
                .child(
                  S.documentList()
                    .title('All orders')
                    .filter('_type == "articleOrder"')
                    .defaultOrdering([{ field: 'paidAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Pending fulfillment')
                .child(
                  S.documentList()
                    .title('Pending fulfillment')
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
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Menu')
        .child(
          S.list()
            .title('Catering Menu')
            .items([
              S.listItem()
                .title('All drinks')
                .child(
                  S.documentList()
                    .title('Menu drinks')
                    .filter('_type == "menuDrink"')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Signatures')
                .child(
                  S.documentList()
                    .title('Signatures')
                    .filter('_type == "menuDrink" && category == "signature"')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Refreshers')
                .child(
                  S.documentList()
                    .title('Refreshers')
                    .filter('_type == "menuDrink" && category == "refresher"')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Site Settings (Marquee)')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId(SETTINGS_ID)
            .title('Marquee · Essentials · Add-ons')
        ),

      S.divider(),

      S.documentTypeListItem('article').title('Articles'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'article',
            'eventInquiry',
            'articleOrder',
            'menuDrink',
            'siteSettings',
          ].includes(item.getId() ?? '')
      ),
    ]);
