import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, getAdminCreds } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { user: expectedUser, pass: expectedPass } = getAdminCreds();
  if (!expectedPass) {
    return NextResponse.json(
      { error: 'Set ADMIN_PASSWORD (or STUDIO_PASSWORD) in env' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const user = typeof body.user === 'string' ? body.user : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (user !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ error: 'Wrong username or password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(expectedUser, expectedPass), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const { user, pass } = getAdminCreds();
  if (!pass) return NextResponse.json({ ok: false }, { status: 401 });
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = cookie === adminToken(user, pass);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
