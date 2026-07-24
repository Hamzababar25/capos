'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { RoseFlourish } from '../../components/Flourishes';
import '../articles.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'paid' | 'error'>('loading');
  const [title, setTitle] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus('paid');
      return;
    }

    let cancelled = false;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setStatus('error');
          return;
        }
        setStatus(data.paid ? 'paid' : 'error');
        setTitle(data.article?.title ?? null);
        setEmail(data.email ?? null);
        setSaved(Boolean(data.purchaseSaved));
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="as-main">
      <div className="as-glow" aria-hidden />
      <RoseFlourish
        className="pointer-events-none absolute right-[8%] top-[18%] opacity-40"
        size={180}
        style={{ color: '#971d13' }}
        aria-hidden
      />

      <div className="as-inner">
        <span className="as-eyebrow t-h6">
          {status === 'loading'
            ? 'Confirming payment'
            : status === 'paid'
              ? 'Payment confirmed'
              : 'Almost there'}
        </span>
        <h1 className="as-title">
          {status === 'paid' ? (
            <>
              The pour is <i>yours.</i>
            </>
          ) : status === 'loading' ? (
            <>Confirming…</>
          ) : (
            <>
              We&apos;re <i>checking</i> that.
            </>
          )}
        </h1>
        <p className="as-copy">
          {status === 'loading' && 'Verifying your Stripe checkout with Capo’s library…'}
          {status === 'paid' && (
            <>
              Thank you{email ? `, ${email}` : ''}
              {title ? (
                <>
                  {' '}
                  — <strong style={{ color: '#fff' }}>{title}</strong> is yours.
                </>
              ) : (
                ' for supporting Capo’s editorial library.'
              )}{' '}
              {saved
                ? 'Your purchase is saved in our records.'
                : 'Your Stripe receipt is on the way. Purchase record will sync once the webhook is running.'}
            </>
          )}
          {status === 'error' &&
            'We could not verify this session yet. If you were charged, your receipt from Stripe is still valid — email us at hello@capos.coffee.'}
        </p>
        {sessionId && (
          <p className="as-copy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Session · {sessionId.slice(0, 22)}…
          </p>
        )}
        <div className="as-actions">
          <Link href="/articles" className="btn-primary" style={{ padding: '14px 28px' }}>
            Browse more articles →
          </Link>
          <Link
            href="/"
            className="t-h6"
            style={{
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 12,
            }}
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ArticleSuccessPage() {
  return (
    <div className="as-page">
      <Navigation />
      <Suspense
        fallback={
          <main className="as-main">
            <div className="as-inner">
              <p className="as-copy">Confirming your purchase…</p>
            </div>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
