import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const { data, error } = await sb
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscribers: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : '';
  const status = body.status === 'unsubscribed' ? 'unsubscribed' : 'active';
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const { data, error } = await sb
    .from('newsletter_subscribers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscriber: data });
}
