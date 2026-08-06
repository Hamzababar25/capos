import { createServiceClient } from './supabase';
import { getSanityWriteClient } from './sanity';
import { getArticleById } from './articles';

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

async function syncOrderToSanity(
  purchase: Omit<ArticlePurchase, 'id'> & { status: ArticlePurchase['status'] }
): Promise<void> {
  const sanity = getSanityWriteClient();
  if (!sanity) return;

  try {
    const article = await getArticleById(purchase.article_id);
    const docId = `order.${purchase.stripe_session_id}`;
    const existingFulfillment = await sanity.fetch<string | null>(
      `*[_id == $id][0].fulfillmentStatus`,
      { id: docId }
    );

    await sanity.createOrReplace({
      _id: docId,
      _type: 'articleOrder',
      stripeSessionId: purchase.stripe_session_id,
      articleId: purchase.article_id,
      articleTitle: article?.title ?? purchase.article_id,
      buyerEmail: purchase.buyer_email,
      amountCents: purchase.amount_cents,
      currency: purchase.currency,
      paymentStatus: purchase.status,
      fulfillmentStatus: existingFulfillment || 'pending',
      paidAt: purchase.paid_at,
    });
  } catch (err) {
    console.warn('[purchases] sanity order sync failed', err);
  }
}

export async function upsertPaidPurchase(
  purchase: Omit<ArticlePurchase, 'id' | 'status'> & { status?: ArticlePurchase['status'] }
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase service client not configured' };
  }

  const status = purchase.status ?? 'paid';
  const paidAt = purchase.paid_at ?? new Date().toISOString();

  const { error } = await supabase.from('article_purchases').upsert(
    {
      article_id: purchase.article_id,
      buyer_email: purchase.buyer_email,
      stripe_session_id: purchase.stripe_session_id,
      stripe_payment_intent: purchase.stripe_payment_intent,
      amount_cents: purchase.amount_cents,
      currency: purchase.currency,
      status,
      paid_at: paidAt,
    },
    { onConflict: 'stripe_session_id' }
  );

  if (error) {
    console.error('[purchases] upsert failed', error);
    return { ok: false, error: error.message };
  }

  await syncOrderToSanity({
    ...purchase,
    status,
    paid_at: paidAt,
  });

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
