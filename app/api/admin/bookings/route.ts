import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { createServiceClient } from '@/lib/supabase';
import { getSanityWriteClient } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const status = req.nextUrl.searchParams.get('status');
  let q = sb
    .from('event_inquiries')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (status === 'new' || status === 'responded') {
    q = q.eq('status', status);
  }

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : '';
  const status = body.status === 'responded' ? 'responded' : 'new';
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const { data, error } = await sb
    .from('event_inquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Best-effort Sanity mirror
  const sanity = getSanityWriteClient();
  if (sanity && data) {
    try {
      const docs = await sanity.fetch<{ _id: string }[]>(
        `*[_type=="eventInquiry" && supabaseId==$id]{_id}`,
        { id }
      );
      for (const d of docs) {
        await sanity.patch(d._id).set({ status }).commit();
      }
    } catch (err) {
      console.warn('[admin/bookings] sanity sync', err);
    }
  }

  return NextResponse.json({ booking: data });
}
