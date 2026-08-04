import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

export { isSanityConfigured };

/**
 * Server-side Sanity client.
 * This dataset requires a token for reads (public query returns []).
 * Never import this into client components — use /api/articles instead.
 */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;

  const token =
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    ...(token ? { token } : {}),
  });
}

/** Write client for seed scripts (needs SANITY_API_WRITE_TOKEN). */
export function getSanityWriteClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'published',
  });
}
