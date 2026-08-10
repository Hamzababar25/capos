import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const [bookings, bookingsNew, subscribers, orders, ordersPending] = await Promise.all([
    sb.from('event_inquiries').select('id', { count: 'exact', head: true }),
    sb.from('event_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    sb.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    sb.from('article_purchases').select('id', { count: 'exact', head: true }),
    sb
      .from('article_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'paid')
      .or('fulfillment_status.eq.pending,fulfillment_status.is.null'),
  ]);

  return NextResponse.json({
    bookingsTotal: bookings.count ?? 0,
    bookingsNew: bookingsNew.count ?? 0,
    newsletter: subscribers.count ?? 0,
    ordersTotal: orders.count ?? 0,
    ordersPending: ordersPending.count ?? 0,
  });
}
