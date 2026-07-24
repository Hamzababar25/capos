import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { upsertPaidPurchase } from '@/lib/purchases';
import Stripe from 'stripe';

/**
 * Stripe webhook — persists paid checkouts into article_purchases.
 * Configure: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error('[stripe webhook] signature failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const articleId = session.metadata?.articleId;
    const email =
      session.customer_details?.email ??
      session.customer_email ??
      'unknown@capos.coffee';

    if (!articleId) {
      console.error('[stripe webhook] missing articleId metadata', session.id);
      return NextResponse.json({ error: 'Missing article metadata' }, { status: 400 });
    }

    const result = await upsertPaidPurchase({
      article_id: articleId,
      buyer_email: email,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      status: 'paid',
      paid_at: new Date().toISOString(),
    });

    if (!result.ok) {
      console.error('[stripe webhook] db write failed', result.error);
      // Return 500 so Stripe retries
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.info('[stripe] purchase saved', {
      sessionId: session.id,
      email,
      articleId,
      amount: session.amount_total,
    });
  }

  return NextResponse.json({ received: true });
}
