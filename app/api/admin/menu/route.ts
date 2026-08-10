import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { getSanityClient, getSanityWriteClient } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const client = getSanityClient();
  if (!client) return NextResponse.json({ error: 'Sanity unavailable' }, { status: 503 });

  const drinks = await client.fetch(
    `*[_type=="menuDrink"]|order(sortOrder asc){
      _id, name, category, desc, origin, ingredients, image, featured, sortOrder, active
    }`
  );
  return NextResponse.json({ drinks: drinks ?? [] });
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
    'name',
    'category',
    'desc',
    'origin',
    'ingredients',
    'image',
    'featured',
    'sortOrder',
    'active',
  ]) {
    if (body[key] !== undefined) patch[key] = body[key];
  }

  const doc = await sanity.patch(id).set(patch).commit();
  return NextResponse.json({ drink: doc });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sanity = getSanityWriteClient();
  if (!sanity) return NextResponse.json({ error: 'Sanity write unavailable' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const doc = await sanity.create({
    _type: 'menuDrink',
    name,
    category: body.category === 'refresher' ? 'refresher' : 'signature',
    desc: body.desc || '',
    origin: body.origin || '',
    ingredients: body.ingredients || '',
    image: body.image || '',
    featured: Boolean(body.featured),
    sortOrder: Number(body.sortOrder ?? 99),
    active: body.active !== false,
  });

  return NextResponse.json({ drink: doc });
}
