import { getSanityWriteClient } from './sanity';
import { createServiceClient } from './supabase';

function emailDocId(email: string) {
  return `newsletter.${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export async function saveNewsletterSubscriber(email: string): Promise<{
  ok: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  const normalized = email.trim().toLowerCase();
  const subscribedAt = new Date().toISOString();

  let wroteSupabase = false;
  let wroteSanity = false;

  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      {
        email: normalized,
        status: 'active',
        subscribed_at: subscribedAt,
        updated_at: subscribedAt,
      },
      { onConflict: 'email' }
    );
    if (error) {
      console.error('[newsletter] supabase failed', error);
      errors.push(`supabase: ${error.message}`);
    } else {
      wroteSupabase = true;
    }
  }

  const sanity = getSanityWriteClient();
  if (sanity) {
    try {
      await sanity.createOrReplace({
        _id: emailDocId(normalized),
        _type: 'newsletterSubscriber',
        email: normalized,
        status: 'active',
        subscribedAt,
      });
      wroteSanity = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'sanity failed';
      console.error('[newsletter] sanity failed', err);
      errors.push(`sanity: ${msg}`);
    }
  } else {
    errors.push('sanity: write client not configured');
  }

  return { ok: wroteSanity || wroteSupabase, errors };
}
