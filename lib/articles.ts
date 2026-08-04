/**
 * Articles catalog priority:
 * 1. Sanity CMS (client-editable at /studio)
 * 2. Supabase (sales DB mirror)
 * 3. In-memory seed (offline / first boot)
 */

import { createServerClient, createServiceClient, isSupabaseConfigured } from './supabase';
import { getSanityClient, isSanityConfigured } from './sanity';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[];
  eventType: string;
  eventLabel: string;
  priceCents: number;
  currency: 'usd';
  coverImage: string;
  gallery: string[];
  pages: number;
  format: 'Digital PDF' | 'Digital Guide';
  featured: boolean;
  publishedAt: string;
}

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[] | null;
  event_type: string;
  event_label: string;
  price_cents: number;
  currency: string;
  cover_image: string;
  gallery: string[] | null;
  pages: number;
  format: string;
  featured: boolean;
  published_at: string;
};

type SanityArticle = {
  articleId: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[] | null;
  eventType: string;
  eventLabel: string;
  priceCents: number;
  currency: string;
  coverImage: string;
  gallery: string[] | null;
  pages: number;
  format: string;
  featured: boolean;
  publishedAt: string;
  active?: boolean;
};

const ARTICLE_PROJECTION = `{
  articleId,
  "slug": slug.current,
  title,
  subtitle,
  excerpt,
  body,
  eventType,
  eventLabel,
  priceCents,
  currency,
  coverImage,
  gallery,
  pages,
  format,
  featured,
  publishedAt,
  active
}`;

/** Seed catalog — 4 event-tied editorial pieces (also used to seed Sanity / DB) */
export const ARTICLES: Article[] = [
  {
    id: 'art_wedding_morning',
    slug: 'wedding-morning-ritual',
    title: 'The Wedding Morning Ritual',
    subtitle: 'How Capo’s turns the quietest hour into the most memorable.',
    excerpt:
      'A field guide to pouring for bridal parties — timing, menu pairing, and the rose saffron latte that guests still talk about.',
    body: [
      'Weddings ask for more than coffee. They ask for presence — a station that feels like a gift, not a vendor table.',
      'In this guide we walk through the Capo’s wedding morning flow: load-in windows, guest-facing rituals, and the drinks that photograph as beautifully as they taste.',
      'You’ll get our sample run-of-show, pairing notes for South Asian and Italian menus, and the small details hosts always thank us for.',
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
  },
  {
    id: 'art_corporate_playbook',
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
  },
  {
    id: 'art_popup_notes',
    slug: 'popup-cart-field-notes',
    title: 'Pop-up Cart Field Notes',
    subtitle: 'Cars N’ Coffee, collabs, and the art of a morning crowd.',
    excerpt:
      'Lessons from the Namkeen collab — line flow, weather contingencies, and drinks built for outdoor mornings.',
    body: [
      'A pop-up is a living organism. Weather shifts, lines swell, and the playlist matters more than you’d think.',
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
  },
  {
    id: 'art_cultures_essay',
    slug: 'marriage-of-cultures',
    title: 'A Marriage of Cultures',
    subtitle: 'Yemeni, Italian, South Asian — the essay behind the cup.',
    excerpt:
      'An editorial piece on heritage, flavour, and why Capo’s refuses to pick a single origin story.',
    body: [
      'Capo’s was never meant to be one culture in a cup. It was meant to be a conversation.',
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
  },
];

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    body: row.body ?? [],
    eventType: row.event_type,
    eventLabel: row.event_label,
    priceCents: row.price_cents,
    currency: (row.currency as 'usd') || 'usd',
    coverImage: row.cover_image,
    gallery: row.gallery ?? [],
    pages: row.pages,
    format: (row.format as Article['format']) || 'Digital PDF',
    featured: row.featured,
    publishedAt: row.published_at,
  };
}

function mapSanity(doc: SanityArticle): Article {
  return {
    id: doc.articleId,
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    excerpt: doc.excerpt,
    body: doc.body ?? [],
    eventType: doc.eventType,
    eventLabel: doc.eventLabel,
    priceCents: doc.priceCents,
    currency: (doc.currency as 'usd') || 'usd',
    coverImage: doc.coverImage,
    gallery: doc.gallery ?? [],
    pages: doc.pages,
    format: (doc.format as Article['format']) || 'Digital PDF',
    featured: Boolean(doc.featured),
    publishedAt: doc.publishedAt,
  };
}

export function formatPrice(cents: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

async function fetchFromSanity(): Promise<Article[] | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    const docs = await client.fetch<SanityArticle[]>(
      `*[_type == "article" && active != false] | order(publishedAt desc) ${ARTICLE_PROJECTION}`
    );
    if (!docs?.length) return null;
    return docs.map(mapSanity);
  } catch (err) {
    console.warn('[articles] sanity fetch failed:', err);
    return null;
  }
}

async function fetchFromSupabase(): Promise<Article[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('active', true)
    .order('published_at', { ascending: false });

  if (error || !data?.length) {
    if (error) console.warn('[articles] supabase fallback:', error.message);
    return null;
  }

  return (data as ArticleRow[]).map(mapRow);
}

export async function getArticles(): Promise<Article[]> {
  if (isSanityConfigured()) {
    const fromSanity = await fetchFromSanity();
    if (fromSanity?.length) return fromSanity;
  }

  const fromSupabase = await fetchFromSupabase();
  if (fromSupabase?.length) return fromSupabase;

  return ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSanityConfigured()) {
    const client = getSanityClient();
    if (client) {
      try {
        const doc = await client.fetch<SanityArticle | null>(
          `*[_type == "article" && slug.current == $slug && active != false][0] ${ARTICLE_PROJECTION}`,
          { slug }
        );
        if (doc) return mapSanity(doc);
      } catch (err) {
        console.warn('[articles] sanity slug failed:', err);
      }
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) return mapRow(data as ArticleRow);
      if (error) console.warn('[articles] supabase slug fallback:', error.message);
    }
  }

  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (isSanityConfigured()) {
    const client = getSanityClient();
    if (client) {
      try {
        const doc = await client.fetch<SanityArticle | null>(
          `*[_type == "article" && articleId == $id && active != false][0] ${ARTICLE_PROJECTION}`,
          { id }
        );
        if (doc) return mapSanity(doc);
      } catch (err) {
        console.warn('[articles] sanity id failed:', err);
      }
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) return mapRow(data as ArticleRow);
    }
  }

  return ARTICLES.find((a) => a.id === id) ?? null;
}

/**
 * Mirror article into Supabase so purchase FK stays valid when Sanity is source of truth.
 */
export async function ensureArticleInSupabase(article: Article): Promise<void> {
  const supabase = createServiceClient();
  if (!supabase) return;

  const { error } = await supabase.from('articles').upsert(
    {
      id: article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      body: article.body,
      event_type: article.eventType,
      event_label: article.eventLabel,
      price_cents: article.priceCents,
      currency: article.currency,
      cover_image: article.coverImage,
      gallery: article.gallery,
      pages: article.pages,
      format: article.format,
      featured: article.featured,
      published_at: article.publishedAt,
      active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.warn('[articles] supabase mirror failed:', error.message);
  }
}
