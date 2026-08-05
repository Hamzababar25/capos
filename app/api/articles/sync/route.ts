import { NextRequest, NextResponse } from 'next/server';
import { syncAllArticlesToSupabase } from '@/lib/articles';

export const dynamic = 'force-dynamic';

/**
 * Manual catch-up: Sanity → Supabase for all articles.
 * POST /api/articles/sync
 * Header: Authorization: Bearer <SANITY_WEBHOOK_SECRET or SYNC_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret =
    process.env.SANITY_WEBHOOK_SECRET || process.env.SYNC_SECRET || '';
  const auth =
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    req.nextUrl.searchParams.get('secret') ||
    '';

  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  if (!secret) {
    if (isProd) {
      return NextResponse.json({ error: 'Sync secret not configured' }, { status: 503 });
    }
  } else if (auth !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncAllArticlesToSupabase();

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
