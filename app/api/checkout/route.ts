import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';
import { getStripe, getSiteUrl } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!slug) {
      return NextResponse.json({ error: 'Missing article slug' }, { status: 400 });
    }

    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            'Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.local to enable checkout.',
          code: 'STRIPE_NOT_CONFIGURED',
        },
        { status: 503 }
      );
    }

    const siteUrl = getSiteUrl();

    // Stripe only accepts publicly reachable HTTPS images — skip localhost
    const coverImages =
      article.coverImage.startsWith('http') && !article.coverImage.includes('localhost')
        ? [article.coverImage]
        : siteUrl.startsWith('https')
          ? [`${siteUrl}${article.coverImage}`]
          : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: article.currency,
            unit_amount: article.priceCents,
            product_data: {
              name: article.title,
              description: `${article.format} · ${article.pages} pages · ${article.eventType}`,
              ...(coverImages ? { images: coverImages } : {}),
            },
          },
        },
      ],
      metadata: {
        articleId: article.id,
        articleSlug: article.slug,
      },
      success_url: `${siteUrl}/articles/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/articles/${article.slug}?cancelled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
