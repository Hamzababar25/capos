import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

export { isSanityConfigured };

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
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
