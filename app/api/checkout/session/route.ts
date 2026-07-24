import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getPurchaseBySessionId, upsertPaidPurchase } from '@/lib/purchases';
import { getArticleById } from '@/lib/articles';

/**
 * Verifies a Checkout Session after redirect.
 * Also backfills purchase row if webhook hasn't fired yet (local/dev).
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    let purchase = await getPurchaseBySessionId(sessionId);

    // Backfill if webhook missed (common in local without stripe listen)
    if (paid && !purchase && session.metadata?.articleId) {
      const email =
        session.customer_details?.email ??
        session.customer_email ??
        'unknown@capos.coffee';

      await upsertPaidPurchase({
        article_id: session.metadata.articleId,
        buyer_email: email,
        stripe_session_id: session.id,
        stripe_payment_intent:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        status: 'paid',
        paid_at: new Date().toISOString(),
      });

      purchase = await getPurchaseBySessionId(sessionId);
    }

    const article = session.metadata?.articleId
      ? await getArticleById(session.metadata.articleId)
      : null;

    return NextResponse.json({
      paid,
      sessionId: session.id,
      email: session.customer_details?.email ?? session.customer_email,
      amountCents: session.amount_total,
      currency: session.currency,
      article: article
        ? { id: article.id, slug: article.slug, title: article.title }
        : null,
      purchaseSaved: Boolean(purchase),
    });
  } catch (err) {
    console.error('[/api/checkout/session]', err);
    return NextResponse.json({ error: 'Could not verify session' }, { status: 500 });
  }
}
