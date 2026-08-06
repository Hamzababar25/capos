import { NextResponse } from 'next/server';
import { getMarqueeItems } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  const marqueeItems = await getMarqueeItems();
  return NextResponse.json(
    { marqueeItems },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
