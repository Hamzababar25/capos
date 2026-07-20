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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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
        <span className="as-eyebrow t-h6">Payment confirmed</span>
        <h1 className="as-title">
          The pour is <i>yours.</i>
        </h1>
        <p className="as-copy">
          Thank you for supporting Capo&apos;s editorial library.
          {sessionId
            ? ' Your Stripe receipt is on the way.'
            : ' Your purchase went through.'}{' '}
          Digital delivery will attach to this checkout once the database is connected.
        </p>
        {ready && sessionId && (
          <p className="as-copy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Session · {sessionId.slice(0, 18)}…
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
