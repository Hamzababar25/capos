import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * Stripe webhook — marks purchases paid once DB is wired.
 * For now: verifies the event and logs it. Plug into article_purchases later.
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
    // TODO: insert into article_purchases when Supabase is connected
    console.info('[stripe] purchase completed', {
      sessionId: session.id,
      email: session.customer_details?.email ?? session.customer_email,
      articleId: session.metadata?.articleId,
      articleSlug: session.metadata?.articleSlug,
      amount: session.amount_total,
    });
  }

  return NextResponse.json({ received: true });
}
