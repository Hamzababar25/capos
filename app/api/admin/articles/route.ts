import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { getSanityClient, getSanityWriteClient } from '@/lib/sanity';
import { ensureArticleInSupabase, type Article } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const client = getSanityClient();
  if (!client) return NextResponse.json({ error: 'Sanity unavailable' }, { status: 503 });

  const articles = await client.fetch(
    `*[_type=="article"]|order(publishedAt desc){
      _id, articleId, title, subtitle, excerpt,
      "slug": slug.current, priceCents, featured, active, publishedAt,
      eventType, eventLabel, pages, format, coverImage
    }`
  );
  return NextResponse.json({ articles: articles ?? [] });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sanity = getSanityWriteClient();
  if (!sanity) return NextResponse.json({ error: 'Sanity write unavailable' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const id = typeof body._id === 'string' ? body._id : '';
  if (!id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  for (const key of [
    'title',
    'subtitle',
    'excerpt',
    'priceCents',
    'featured',
    'active',
    'eventType',
    'eventLabel',
    'pages',
    'format',
    'coverImage',
    'publishedAt',
  ]) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  if (typeof body.slug === 'string' && body.slug) {
    patch.slug = { _type: 'slug', current: body.slug };
  }

  const doc = await sanity.patch(id).set(patch).commit();

  // Keep Supabase catalog in sync for purchases
  const mapped: Article = {
    id: doc.articleId,
    slug: doc.slug?.current ?? body.slug ?? '',
    title: doc.title,
    subtitle: doc.subtitle ?? '',
    excerpt: doc.excerpt ?? '',
    body: doc.body ?? [],
    eventType: doc.eventType ?? '',
    eventLabel: doc.eventLabel ?? '',
    priceCents: doc.priceCents ?? 0,
    currency: 'usd',
    coverImage: doc.coverImage ?? '/logo.png',
    gallery: doc.gallery ?? [],
    pages: doc.pages ?? 1,
    format: doc.format || 'Digital PDF',
    featured: Boolean(doc.featured),
    publishedAt: doc.publishedAt ?? new Date().toISOString().slice(0, 10),
  };
  if (mapped.id && mapped.slug) {
    await ensureArticleInSupabase(mapped, { active: doc.active !== false });
  }

  return NextResponse.json({ article: doc });
}
