import { NextResponse } from 'next/server';
import { getCateringMenu } from '@/lib/menu';

export const dynamic = 'force-dynamic';

export async function GET() {
  const menu = await getCateringMenu();
  return NextResponse.json(menu, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
