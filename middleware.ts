import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'capos_studio_gate';

function expectedToken() {
  const user = process.env.STUDIO_USER || 'capos';
  const pass = process.env.STUDIO_PASSWORD || '';
  if (!pass) return null;
  // Edge-safe base64url
  const raw = `${user}:${pass}`;
  const b64 = btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return b64;
}

/**
 * Cookie gate for /studio — avoids Chrome Basic-auth ERR_TOO_MANY_RETRIES.
 * Login page: /studio-login
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  // Never gate the login page itself
  if (pathname.startsWith('/studio-login')) {
    return NextResponse.next();
  }

  const expected = expectedToken();
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  if (!expected) {
    if (isProd) {
      return new NextResponse(
        'Studio is locked. Set STUDIO_PASSWORD in Vercel environment variables.',
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  const login = req.nextUrl.clone();
  login.pathname = '/studio-login';
  login.searchParams.set('next', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/studio/:path*'],
};
