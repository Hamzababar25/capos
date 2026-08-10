import { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'capos_admin_gate';

export function getAdminCreds() {
  return {
    user: process.env.ADMIN_USER || process.env.STUDIO_USER || 'capos',
    pass: process.env.ADMIN_PASSWORD || process.env.STUDIO_PASSWORD || '',
  };
}

export function adminToken(user: string, pass: string): string {
  return Buffer.from(`${user}:${pass}`).toString('base64url');
}

/** Edge-safe token (middleware). */
export function adminTokenEdge(user: string, pass: string): string {
  return btoa(`${user}:${pass}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function isAdminRequest(req: NextRequest): boolean {
  const { user, pass } = getAdminCreds();
  if (!pass) return false;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  return Boolean(cookie && cookie === adminToken(user, pass));
}
