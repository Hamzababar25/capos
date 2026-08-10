import { NextRequest, NextResponse } from 'next/server';

const STUDIO_COOKIE = 'capos_studio_gate';
const ADMIN_COOKIE = 'capos_admin_gate';

function edgeToken(user: string, pass: string) {
  return btoa(`${user}:${pass}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function studioExpected() {
  const user = process.env.STUDIO_USER || 'capos';
  const pass = process.env.STUDIO_PASSWORD || '';
  if (!pass) return null;
  return edgeToken(user, pass);
}

function adminExpected() {
  const user = process.env.ADMIN_USER || process.env.STUDIO_USER || 'capos';
  const pass = process.env.ADMIN_PASSWORD || process.env.STUDIO_PASSWORD || '';
  if (!pass) return null;
  return edgeToken(user, pass);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  // ── Admin panel ──────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }

    const expected = adminExpected();
    if (!expected) {
      if (isProd) {
        return new NextResponse('Admin locked. Set ADMIN_PASSWORD in env.', {
          status: 403,
        });
      }
      return NextResponse.next();
    }

    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie === expected) return NextResponse.next();

    const login = req.nextUrl.clone();
    login.pathname = '/admin/login';
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  // ── Sanity Studio (legacy gate) ──────────────────────────
  if (pathname.startsWith('/studio')) {
    if (pathname.startsWith('/studio-login')) return NextResponse.next();

    const expected = studioExpected();
    if (!expected) {
      if (isProd) {
        return new NextResponse(
          'Studio is locked. Set STUDIO_PASSWORD in environment variables.',
          { status: 403 }
        );
      }
      return NextResponse.next();
    }

    const cookie = req.cookies.get(STUDIO_COOKIE)?.value;
    if (cookie === expected) return NextResponse.next();

    const login = req.nextUrl.clone();
    login.pathname = '/studio-login';
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/admin/:path*'],
};
