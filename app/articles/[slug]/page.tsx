'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { ARTICLES, formatPrice, type Article } from '@/lib/articles';
import '../articles.css';

function ArticleDetailInner() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params?.slug ?? '';

  const article = useMemo<Article | null>(
    () => ARTICLES.find((a) => a.slug === slug) ?? null,
    [slug]
  );

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cancelled = searchParams.get('cancelled') === '1';

  useEffect(() => {
    if (cancelled) setError('');
  }, [cancelled]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Checkout failed. Please try again.');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError('No checkout URL returned.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <main className="ad-hero" style={{ textAlign: 'center', minHeight: '70vh' }}>
        <p className="ad-eyebrow t-h6">Not found</p>
        <h1 className="ad-title">This piece left the shelf.</h1>
        <Link href="/articles" className="ad-back" style={{ marginTop: 24 }}>
          ← Back to articles
        </Link>
      </main>
    );
  }

  return (
    <>
      <section className="ad-hero">
        <Link href="/articles" className="ad-back t-h6">
          ← All articles
        </Link>

        <div className="ad-layout">
          <div className="ad-cover">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 979px) 100vw, 50vw"
              className="ad-cover-img"
            />
            <span className="ad-cover-badge">{article.eventType}</span>
          </div>

          <div className="ad-info">
            <span className="ad-eyebrow t-h6">
              {article.format} · {article.pages} pages
            </span>
            <h1 className="ad-title">{article.title}</h1>
            <p className="ad-subtitle">{article.subtitle}</p>

            <div className="ad-meta-row">
              <span>{article.eventLabel}</span>
              <span>
                Published{' '}
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="ad-body">
              {article.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>

            <div className="ad-buy">
              <div className="ad-buy-price">
                <span className="ad-buy-amount">
                  {formatPrice(article.priceCents)}
                </span>
                <span className="ad-buy-label t-h6">One-time · Digital</span>
              </div>

              {cancelled && (
                <p className="ad-buy-cancelled">
                  Checkout cancelled — your card was not charged. Try again when ready.
                </p>
              )}

              <form className="ad-buy-form" onSubmit={handleBuy}>
                <input
                  type="email"
                  className="ad-buy-input"
                  placeholder="Email for your receipt (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn-primary ad-buy-btn"
                  disabled={loading}
                >
                  {loading ? 'Opening Stripe…' : 'Purchase with Stripe →'}
                </button>
              </form>

              {error && <p className="ad-buy-error">{error}</p>}

              <p className="ad-buy-hint">
                Secure payment via Stripe. Delivery email + download links will
                connect once the database is live — the checkout flow is ready now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {article.gallery.length > 0 && (
        <section className="ad-gallery">
          <div className="ap-section-head">
            <span className="ap-section-eyebrow t-h6">From the event</span>
            <h2 className="ap-section-title">
              Visual <i>notes</i>
            </h2>
          </div>
          <div className="ad-gallery-grid">
            {article.gallery.map((src) => (
              <div key={src} className="ad-gallery-item">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ArticleDetailPage() {
  return (
    <div className="ad-page">
      <Navigation />
      <Suspense
        fallback={
          <main className="ad-hero" style={{ minHeight: '50vh' }}>
            <p className="ad-eyebrow t-h6">Loading…</p>
          </main>
        }
      >
        <ArticleDetailInner />
      </Suspense>
      <Footer />
    </div>
  );
}
