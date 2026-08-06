import { getSanityClient, isSanityConfigured } from './sanity';

export const FALLBACK_MARQUEE = [
  'Next Event',
  'Pakistan 🇵🇰 Day Parade',
  'Sunday, August 16',
  'Rain Date: August 23',
  'Oak Tree Road, Woodbridge & Edison, NJ',
];

export async function getMarqueeItems(): Promise<string[]> {
  if (!isSanityConfigured()) return FALLBACK_MARQUEE;

  const client = getSanityClient();
  if (!client) return FALLBACK_MARQUEE;

  try {
    const doc = await client.fetch<{ marqueeItems?: string[] } | null>(
      `*[_type == "siteSettings" && _id == "siteSettings"][0]{ marqueeItems }`
    );
    if (doc?.marqueeItems?.length) return doc.marqueeItems;
  } catch (err) {
    console.warn('[siteContent] marquee fetch failed', err);
  }

  return FALLBACK_MARQUEE;
}
