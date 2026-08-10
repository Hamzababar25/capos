import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_guard';
import { getSanityClient, getSanityWriteClient } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

const ID = 'siteSettings';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const client = getSanityClient();
  if (!client) return NextResponse.json({ error: 'Sanity unavailable' }, { status: 503 });

  const settings = await client.fetch(
    `*[_id==$id][0]{marqueeItems, essentialFlavors, addOns}`,
    { id: ID }
  );

  return NextResponse.json({
    settings: settings ?? { marqueeItems: [], essentialFlavors: [], addOns: [] },
  });
}

export async function PUT(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const sanity = getSanityWriteClient();
  if (!sanity) return NextResponse.json({ error: 'Sanity write unavailable' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const marqueeItems = Array.isArray(body.marqueeItems)
    ? body.marqueeItems.map(String).filter(Boolean)
    : [];
  const essentialFlavors = Array.isArray(body.essentialFlavors)
    ? body.essentialFlavors.map(String).filter(Boolean)
    : [];
  const addOns = Array.isArray(body.addOns)
    ? body.addOns.map(String).filter(Boolean)
    : [];

  const doc = await sanity.createOrReplace({
    _id: ID,
    _type: 'siteSettings',
    marqueeItems,
    essentialFlavors,
    addOns,
  });

  return NextResponse.json({ settings: doc });
}
