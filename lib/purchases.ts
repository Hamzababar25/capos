import { createServiceClient } from './supabase';

export interface ArticlePurchase {
  id?: string;
  article_id: string;
  buyer_email: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paid_at: string | null;
}

export async function upsertPaidPurchase(
  purchase: Omit<ArticlePurchase, 'id' | 'status'> & { status?: ArticlePurchase['status'] }
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase service client not configured' };
  }

  const { error } = await supabase.from('article_purchases').upsert(
    {
      article_id: purchase.article_id,
      buyer_email: purchase.buyer_email,
      stripe_session_id: purchase.stripe_session_id,
      stripe_payment_intent: purchase.stripe_payment_intent,
      amount_cents: purchase.amount_cents,
      currency: purchase.currency,
      status: purchase.status ?? 'paid',
      paid_at: purchase.paid_at ?? new Date().toISOString(),
    },
    { onConflict: 'stripe_session_id' }
  );

  if (error) {
    console.error('[purchases] upsert failed', error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getPurchaseBySessionId(sessionId: string) {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('article_purchases')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.warn('[purchases] lookup failed', error.message);
    return null;
  }

  return data;
}
