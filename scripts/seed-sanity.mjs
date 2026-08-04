/**
 * Seed Capos articles into Sanity.
 *
 * Usage:
 *   1. Create project at https://www.sanity.io/manage → copy project ID
 *   2. Add to .env.local:
 *        NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
 *        NEXT_PUBLIC_SANITY_DATASET=production
 *        SANITY_API_WRITE_TOKEN=sk...   (Editor token with write)
 *   3. node --env-file=.env.local scripts/seed-sanity.mjs
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in env.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const ARTICLES = [
  {
    _id: 'article.art_wedding_morning',
    articleId: 'art_wedding_morning',
    slug: 'wedding-morning-ritual',
    title: 'The Wedding Morning Ritual',
    subtitle: "How Capo's turns the quietest hour into the most memorable.",
    excerpt:
      'A field guide to pouring for bridal parties — timing, menu pairing, and the rose saffron latte that guests still talk about.',
    body: [
      'Weddings ask for more than coffee. They ask for presence — a station that feels like a gift, not a vendor table.',
      "In this guide we walk through the Capo's wedding morning flow: load-in windows, guest-facing rituals, and the drinks that photograph as beautifully as they taste.",
      "You'll get our sample run-of-show, pairing notes for South Asian and Italian menus, and the small details hosts always thank us for.",
    ],
    eventType: 'Wedding',
    eventLabel: 'Long Island · May 2026',
    priceCents: 1800,
    currency: 'usd',
    coverImage: '/capos1.PNG',
    gallery: ['/capos1.PNG', '/capos4.jpg', '/capos-3.PNG'],
    pages: 28,
    format: 'Digital PDF',
    featured: true,
    publishedAt: '2026-05-12',
    active: true,
  },
  {
    _id: 'article.art_corporate_playbook',
    articleId: 'art_corporate_playbook',
    slug: 'corporate-activation-playbook',
    title: 'Corporate Activation Playbook',
    subtitle: 'From lobby pours to loft launches — a cart that works the room.',
    excerpt:
      'Layouts, staffing ratios, and brand-safe menus for product launches and conferences across Manhattan and Jersey City.',
    body: [
      'Corporate events move fast. The coffee has to keep up — without looking rushed.',
      'This playbook covers floor plans for 50–500 guests, white-glove vs. high-volume service modes, and how we brand a cart without drowning the espresso.',
      'Includes checklists for AV teams, catering captains, and the “one more latte” moment every founder requests.',
    ],
    eventType: 'Corporate',
    eventLabel: 'Studio 47 · April 2026',
    priceCents: 2400,
    currency: 'usd',
    coverImage: '/capos-2.PNG',
    gallery: ['/capos-2.PNG', '/capos3.PNG', '/cup.PNG'],
    pages: 36,
    format: 'Digital Guide',
    featured: true,
    publishedAt: '2026-04-18',
    active: true,
  },
  {
    _id: 'article.art_popup_notes',
    articleId: 'art_popup_notes',
    slug: 'popup-cart-field-notes',
    title: 'Pop-up Cart Field Notes',
    subtitle: "Cars N' Coffee, collabs, and the art of a morning crowd.",
    excerpt:
      'Lessons from the Namkeen collab — line flow, weather contingencies, and drinks built for outdoor mornings.',
    body: [
      "A pop-up is a living organism. Weather shifts, lines swell, and the playlist matters more than you'd think.",
      'These field notes capture what we learned pouring beside Namkeen — from cold-foam logistics to keeping the cart beautiful under a Jersey sun.',
      'Use it for markets, openings, and any morning where hospitality has to feel effortless.',
    ],
    eventType: 'Pop-up',
    eventLabel: 'Lake Hiawatha · May 2026',
    priceCents: 1400,
    currency: 'usd',
    coverImage: '/collab.jpeg',
    gallery: ['/collab.jpeg', '/capos2.PNG', '/nigge.jpg'],
    pages: 18,
    format: 'Digital PDF',
    featured: false,
    publishedAt: '2026-05-10',
    active: true,
  },
  {
    _id: 'article.art_cultures_essay',
    articleId: 'art_cultures_essay',
    slug: 'marriage-of-cultures',
    title: 'A Marriage of Cultures',
    subtitle: 'Yemeni, Italian, South Asian — the essay behind the cup.',
    excerpt:
      "An editorial piece on heritage, flavour, and why Capo's refuses to pick a single origin story.",
    body: [
      "Capo's was never meant to be one culture in a cup. It was meant to be a conversation.",
      'This essay traces the flavours we carry — Yemeni coffee tradition, Italian espresso craft, and the bold sweetness of South Asian hospitality — and how they meet on a cart in New Jersey.',
      'Part manifesto, part tasting journal. For hosts, collaborators, and anyone who asks where the rose comes from.',
    ],
    eventType: 'Essay',
    eventLabel: 'Editorial · Est. 2025',
    priceCents: 1200,
    currency: 'usd',
    coverImage: '/capos.PNG',
    gallery: ['/capos.PNG', '/capos-3.PNG', '/logo.png'],
    pages: 22,
    format: 'Digital PDF',
    featured: false,
    publishedAt: '2026-03-01',
    active: true,
  },
];

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles → ${projectId}/${dataset}`);

  for (const a of ARTICLES) {
    const doc = {
      _id: a._id,
      _type: 'article',
      articleId: a.articleId,
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      subtitle: a.subtitle,
      excerpt: a.excerpt,
      body: a.body,
      coverImage: a.coverImage,
      gallery: a.gallery,
      eventType: a.eventType,
      eventLabel: a.eventLabel,
      priceCents: a.priceCents,
      currency: a.currency,
      pages: a.pages,
      format: a.format,
      featured: a.featured,
      publishedAt: a.publishedAt,
      active: a.active,
    };

    await client.createOrReplace(doc);
    console.log('  ✓', a.articleId, a.slug);
  }

  console.log('Done. Open /studio to edit.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
