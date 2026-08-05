import { NextRequest, NextResponse } from 'next/server';
import {
  deactivateArticleInSupabase,
  ensureArticleInSupabase,
  type Article,
} from '@/lib/articles';
import { getSanityClient } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

type SanityDoc = {
  _type?: string;
  _id?: string;
  operation?: 'create' | 'update' | 'delete';
  articleId?: string;
  slug?: string | { current?: string };
  title?: string;
  subtitle?: string;
  excerpt?: string;
  body?: string[];
  eventType?: string;
  eventLabel?: string;
  priceCents?: number;
  currency?: string;
  coverImage?: string;
  gallery?: string[];
  pages?: number;
  format?: string;
  featured?: boolean;
  publishedAt?: string;
  active?: boolean;
};

function authorize(req: NextRequest): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return true;

  const header =
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    req.headers.get('x-sanity-webhook-secret') ||
    req.nextUrl.searchParams.get('secret');

  return header === secret;
}

function slugOf(value: SanityDoc['slug']): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.current ?? '';
}

function articleIdFromSanityId(id: string): string | null {
  const clean = id.replace(/^drafts\./, '');
  const match = clean.match(/art_[a-z0-9_]+/);
  return match?.[0] ?? null;
}

function mapPayload(body: SanityDoc): Article | null {
  const id = body.articleId;
  const slug = slugOf(body.slug);
  if (!id || !slug || !body.title) return null;

  return {
    id,
    slug,
    title: body.title,
    subtitle: body.subtitle ?? '',
    excerpt: body.excerpt ?? '',
    body: body.body ?? [],
    eventType: body.eventType ?? 'Essay',
    eventLabel: body.eventLabel ?? '',
    priceCents: Number(body.priceCents ?? 0),
    currency: 'usd',
    coverImage: body.coverImage ?? '/logo.png',
    gallery: body.gallery ?? [],
    pages: Number(body.pages ?? 1),
    format: (body.format as Article['format']) || 'Digital PDF',
    featured: Boolean(body.featured),
    publishedAt: body.publishedAt ?? new Date().toISOString().slice(0, 10),
  };
}

async function fetchArticleBySanityId(id: string): Promise<Article | null> {
  const client = getSanityClient();
  if (!client) return null;

  const cleanId = id.replace(/^drafts\./, '');
  const doc = await client.fetch<SanityDoc | null>(
    `*[_type == "article" && (_id == $id || articleId == $articleId)][0]{
      articleId,
      "slug": slug.current,
      title, subtitle, excerpt, body,
      eventType, eventLabel, priceCents, currency,
      coverImage, gallery, pages, format, featured, publishedAt, active
    }`,
    {
      id: cleanId,
      articleId: articleIdFromSanityId(cleanId) ?? cleanId.replace(/^article\./, ''),
    }
  );

  return doc ? mapPayload(doc) : null;
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as SanityDoc & {
      ids?: { created?: string[]; updated?: string[]; deleted?: string[] };
    };

    // Shape A: Sanity "IDs" webhook
    if (body.ids) {
      let deleted = 0;
      for (const id of body.ids.deleted ?? []) {
        const articleId = articleIdFromSanityId(id);
        if (!articleId) continue;
        const result = await deactivateArticleInSupabase(articleId);
        if (result.ok) deleted += 1;
      }

      const upsertIds = [...(body.ids.created ?? []), ...(body.ids.updated ?? [])];
      let synced = 0;
      for (const id of upsertIds) {
        if (id.startsWith('drafts.')) continue;
        const article = await fetchArticleBySanityId(id);
        if (!article) continue;
        const result = await ensureArticleInSupabase(article, { active: true });
        if (result.ok) synced += 1;
      }

      return NextResponse.json({ ok: true, mode: 'ids', synced, deleted });
    }

    // Shape B: GROQ projection / document body
    if (body._id?.startsWith('drafts.')) {
      return NextResponse.json({ ok: true, skipped: 'draft' });
    }

    if (body.operation === 'delete' || body.active === false) {
      const id =
        body.articleId ||
        (body._id ? articleIdFromSanityId(body._id) : null);
      if (id) await deactivateArticleInSupabase(id);
      return NextResponse.json({ ok: true, mode: 'delete', id });
    }

    if (body._type && body._type !== 'article') {
      return NextResponse.json({ ok: true, skipped: 'not-article' });
    }

    let article = mapPayload(body);
    if (!article && body._id) {
      article = await fetchArticleBySanityId(body._id);
    }

    if (!article) {
      return NextResponse.json({ error: 'Unrecognized payload' }, { status: 400 });
    }

    // Earlier branch already handled active === false (soft-delete)
    const result = await ensureArticleInSupabase(article, { active: true });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mode: 'document',
      id: article.id,
      slug: article.slug,
      priceCents: article.priceCents,
    });
  } catch (err) {
    console.error('[/api/webhooks/sanity]', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
