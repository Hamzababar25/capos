import { NextRequest, NextResponse } from 'next/server';

/**
 * Extra lock on /studio — browser password prompt before Sanity login.
 * Set STUDIO_USER + STUDIO_PASSWORD in env (Vercel + .env.local).
 * If unset in development, studio stays open (Sanity login still required).
 * In production, password is required when STUDIO_PASSWORD is set.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  const user = process.env.STUDIO_USER || 'capos';
  const pass = process.env.STUDIO_PASSWORD;

  // Production without password = block studio entirely (fail closed)
  if (!pass) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return new NextResponse(
        'Studio is locked. Set STUDIO_PASSWORD in environment variables.',
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const colon = decoded.indexOf(':');
      const u = colon >= 0 ? decoded.slice(0, colon) : '';
      const p = colon >= 0 ? decoded.slice(colon + 1) : '';
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Capos Studio", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/studio/:path*'],
};
