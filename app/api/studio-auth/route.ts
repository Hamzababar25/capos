import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COOKIE = 'capos_studio_gate';

function expectedCreds() {
  return {
    user: process.env.STUDIO_USER || 'capos',
    pass: process.env.STUDIO_PASSWORD || '',
  };
}

function tokenFor(user: string, pass: string) {
  // Lightweight gate token — not a substitute for Sanity login
  return Buffer.from(`${user}:${pass}`).toString('base64url');
}

export async function POST(req: NextRequest) {
  const { user, pass } = expectedCreds();
  if (!pass) {
    return NextResponse.json({ error: 'Studio password not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const u = typeof body.user === 'string' ? body.user : '';
  const p = typeof body.password === 'string' ? body.password : '';

  if (u !== user || p !== pass) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, tokenFor(user, pass), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
