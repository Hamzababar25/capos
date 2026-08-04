import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';
import { isSanityConfigured } from '@/lib/sanity';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await getArticles();

  const source = isSanityConfigured()
    ? 'sanity'
    : isSupabaseConfigured()
      ? 'supabase'
      : 'seed';

  return NextResponse.json(
    { source, articles },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
