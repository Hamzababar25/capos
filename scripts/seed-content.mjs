/**
 * Seed menu drinks, site settings (marquee), and sync existing orders → Sanity.
 * node --env-file=.env.local scripts/seed-content.mjs
 */

import { createClient } from '@sanity/client';
import { createClient as createSb } from '@supabase/supabase-js';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing Sanity project ID or write token');
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const signatures = [
  {
    name: 'Crème Brûlée Latte',
    desc: 'Rich espresso blended with velvety milk, layered with a cloud of golden caramel custard, tucked under a decadent hard-top of candied caramelised sugar.',
    origin: 'French pâtisserie meets Italian espresso',
    ingredients: 'Espresso · Milk · Caramel custard · Torched sugar',
    image: '/creme-blu.jpg',
    featured: false,
    sortOrder: 1,
  },
  {
    name: 'Rose Saffron Latte',
    desc: 'A luxurious floral blend of fragrant rose syrup and warm cardamom, finished with a cloud of sweet cold foam and topped with rose petals and saffron threads.',
    origin: 'A quiet nod to Persian tearooms',
    ingredients: 'Espresso · Rose syrup · Cardamom · Cold foam · Saffron',
    image: '/rose-saf.jpg',
    featured: true,
    sortOrder: 2,
  },
  {
    name: 'Latte España',
    desc: 'A creamy Spanish latte made with bold espresso and silky oat milk, subtly sweetened with condensed milk and cold foam for a smooth indulgence.',
    origin: "Inspired by Madrid's café con leche",
    ingredients: 'Espresso · Oat milk · Condensed milk · Cold foam',
    image: '/esp.png',
    featured: false,
    sortOrder: 3,
  },
  {
    name: 'Tiramisu Latte',
    desc: 'A dessert-style latte featuring bold espresso, soft vanilla notes, and a luxurious mascarpone cold foam. Topped with cocoa powder and Swiss chocolate.',
    origin: 'Inspired by the classic Italian dessert of the same name',
    ingredients:
      'Espresso · Vanilla · Mascarpone cold foam · Cocoa powder · Swiss chocolate',
    image: '/tira.png',
    featured: false,
    sortOrder: 4,
  },
  {
    name: 'La Dolce Latte',
    desc: 'A silky iced latte crafted with golden espresso and a blend of brown sugar and honey/caramel for rich sweetness. Finished with smooth cold foam for a creamy, luxurious sip that lives up to its name, "The Sweet Latte."',
    origin: 'A nod to "la dolce vita"  the sweet life',
    ingredients: 'Espresso · Brown sugar · Honey caramel · Cold foam',
    image: '/ladoche.png',
    featured: false,
    sortOrder: 5,
  },
];

const refreshers = [
  {
    name: "Tony's Cup",
    desc: 'Dark cherry and vanilla Italian soda topped with a swirl of cream. Bold & unapologetic refreshment',
    origin:
      'Inspired by classic Italian soda shops, with a bold cherry-vanilla twist.',
    ingredients: 'Dark Cherry Syrup · Vanilla Syrup · Soda Water · Cream ',
    image: '/tonycup.png',
    featured: false,
    sortOrder: 1,
  },
  {
    name: 'Elvira',
    desc: 'A mysterious mix of blueberry and lavender syrups with sparkling soda, optionally swirled with cream for a dreamy purple haze',
    origin:
      'A moody blueberry-lavender blend for those who like a little mystery in their cup.',
    ingredients: 'Blueberry Syrup · Lavender Syrup · Soda Water · Cream',
    image: '/elvira.png',
    featured: false,
    sortOrder: 2,
  },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedMenu() {
  console.log('Seeding menu drinks…');
  for (const d of signatures) {
    const id = `menu.signature.${slugify(d.name)}`;
    await sanity.createOrReplace({
      _id: id,
      _type: 'menuDrink',
      category: 'signature',
      active: true,
      ...d,
    });
    console.log('  ✓', d.name);
  }
  for (const d of refreshers) {
    const id = `menu.refresher.${slugify(d.name)}`;
    await sanity.createOrReplace({
      _id: id,
      _type: 'menuDrink',
      category: 'refresher',
      active: true,
      ...d,
    });
    console.log('  ✓', d.name);
  }
}

async function seedSettings() {
  console.log('Seeding site settings (marquee)…');
  await sanity.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    marqueeItems: [
      'Next Event',
      'Pakistan 🇵🇰 Day Parade',
      'Sunday, August 16',
      'Rain Date: August 23',
      'Oak Tree Road, Woodbridge & Edison, NJ',
    ],
    essentialFlavors: [
      'Vanilla',
      'Caramel',
      'Hazelnut',
      'Mocha',
      'White Chocolate',
    ],
    addOns: [
      'Extra shot of espresso',
      'Oat milk',
      'Almond milk',
      'Rose petals / Drizzle',
      'Extra syrup pump',
    ],
  });
  console.log('  ✓ siteSettings');
}

async function syncOrders() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log('Skip orders sync — Supabase not configured');
    return;
  }

  console.log('Syncing article orders from Supabase…');
  const sb = createSb(url, key);
  const { data, error } = await sb
    .from('article_purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('  orders fetch failed', error.message);
    return;
  }

  for (const row of data || []) {
    const article = await sanity.fetch(
      `*[_type=="article" && articleId==$id][0]{title}`,
      { id: row.article_id }
    );
    const docId = `order.${row.stripe_session_id}`;
    const existing = await sanity.fetch(
      `*[_id==$id][0]{fulfillmentStatus}`,
      { id: docId }
    );
    await sanity.createOrReplace({
      _id: docId,
      _type: 'articleOrder',
      stripeSessionId: row.stripe_session_id,
      articleId: row.article_id,
      articleTitle: article?.title || row.article_id,
      buyerEmail: row.buyer_email,
      amountCents: row.amount_cents,
      currency: row.currency || 'usd',
      paymentStatus: row.status || 'paid',
      fulfillmentStatus: existing?.fulfillmentStatus || 'pending',
      paidAt: row.paid_at || row.created_at,
    });
    console.log('  ✓', row.buyer_email, row.article_id);
  }
}

async function main() {
  await seedMenu();
  await seedSettings();
  await syncOrders();
  console.log('Done. Open /studio → Menu / Site Settings / Orders');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
