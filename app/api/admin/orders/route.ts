import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { createServiceClient } from '@/lib/supabase';
import { getSanityWriteClient } from '@/lib/sanity';
import { getArticleById } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const filter = req.nextUrl.searchParams.get('filter');
  let q = sb
    .from('article_purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'pending') {
    q = q.or('fulfillment_status.eq.pending,fulfillment_status.is.null');
  } else if (filter === 'fulfilled') {
    q = q.eq('fulfillment_status', 'fulfilled');
  }

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const enriched = await Promise.all(
    rows.map(async (row) => {
      const article = await getArticleById(row.article_id);
      return {
        ...row,
        article_title: article?.title ?? row.article_id,
        fulfillment_status: row.fulfillment_status ?? 'pending',
      };
    })
  );

  return NextResponse.json({ orders: enriched });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : '';
  const fulfillment =
    body.fulfillment_status === 'fulfilled' ? 'fulfilled' : 'pending';
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const { data, error } = await sb
    .from('article_purchases')
    .update({ fulfillment_status: fulfillment })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sanity = getSanityWriteClient();
  if (sanity && data?.stripe_session_id) {
    try {
      await sanity
        .patch(`order.${data.stripe_session_id}`)
        .set({ fulfillmentStatus: fulfillment })
        .commit();
    } catch (err) {
      console.warn('[admin/orders] sanity sync', err);
    }
  }

  return NextResponse.json({ order: data });
}
