'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { RoseFlourish, BeanFlourish } from '@/app/components/Flourishes';
import { ARTICLES, formatPrice, getArticles, type Article } from '@/lib/articles';
import './articles.css';

gsap.registerPlugin(ScrollTrigger);

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <article className={`ap-card${article.featured ? ' is-featured' : ''}`}>
      <Link href={`/articles/${article.slug}`} className="ap-card-link">
        <div className="ap-card-media">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 40vw"
            className="ap-card-img"
            priority={index < 2}
          />
          <div className="ap-card-veil" aria-hidden />
          <span className="ap-card-num t-h6">{String(index + 1).padStart(2, '0')}</span>
          <span className="ap-card-type t-h6">{article.eventType}</span>
        </div>

        <div className="ap-card-body">
          <div className="ap-card-meta">
            <span className="ap-card-format t-h6">{article.format}</span>
            <span className="ap-card-pages t-h6">{article.pages} pages</span>
          </div>
          <h2 className="ap-card-title">{article.title}</h2>
          <p className="ap-card-excerpt">{article.excerpt}</p>
          <div className="ap-card-foot">
            <span className="ap-card-event">{article.eventLabel}</span>
            <span className="ap-card-price">{formatPrice(article.priceCents)}</span>
          </div>
          <span className="ap-card-cta t-h6">
            Read &amp; purchase <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function ArticlesPage() {
  const heroRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLElement>(null);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    let cancelled = false;
    getArticles().then((list) => {
      if (!cancelled && list.length) setArticles(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-ap-hero]');
    gsap.set(targets, { opacity: 0, y: 28 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      stagger: 0.1,
      ease: 'expo.out',
      delay: 0.15,
    });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const featuredEl = featuredRef.current;
    const catalogEl = catalogRef.current;
    const triggers: ScrollTrigger[] = [];

    const reveal = (cards: NodeListOf<HTMLElement>, immediate: boolean) => {
      if (!cards.length) return;
      if (reduced) {
        gsap.set(cards, { clearProps: 'opacity,transform' });
        return;
      }

      if (immediate) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'expo.out',
            delay: 0.2,
            clearProps: 'transform',
          }
        );
        return;
      }

      gsap.set(cards, { opacity: 0, y: 40 });
      triggers.push(
        ScrollTrigger.create({
          trigger: cards[0].closest('section') ?? cards[0],
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: 'expo.out',
              clearProps: 'transform',
            });
          },
        })
      );
    };

    if (featuredEl) {
      reveal(featuredEl.querySelectorAll<HTMLElement>('.ap-card'), true);
    }
    if (catalogEl) {
      const inView = catalogEl.getBoundingClientRect().top < window.innerHeight * 0.9;
      reveal(catalogEl.querySelectorAll<HTMLElement>('.ap-card'), inView);
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => triggers.forEach((t) => t.kill());
  }, [articles]);

  const featured = articles.filter((a) => a.featured);

  return (
    <div className="ap-page">
      <Navigation />

      <section className="ap-hero" ref={heroRef}>
        <RoseFlourish className="ap-hero-rose" size={200} aria-hidden />
        <BeanFlourish className="ap-hero-bean" size={18} />
        <div className="ap-hero-rule" data-ap-hero aria-hidden />

        <div className="ap-hero-inner">
          <span className="ap-hero-eyebrow t-h6" data-ap-hero>
            <span>Library</span>
            <span className="ap-dot" aria-hidden />
            <span>Event-tied essays &amp; field guides</span>
          </span>

          <h1 className="ap-hero-title" data-ap-hero>
            <span className="ap-hero-title-line">Stories you can</span>
            <span className="ap-hero-title-line ap-hero-title-italic">pour into.</span>
          </h1>

          <p className="ap-hero-lead" data-ap-hero>
            Short editorial pieces drawn from real Capo&apos;s events —
            wedding mornings, loft launches, pop-ups. Buy a digital guide
            and keep the craft close.
          </p>

          <div className="ap-hero-meta" data-ap-hero>
            <div className="ap-hero-meta-item">
              <span className="ap-hero-meta-label t-h6">Pieces</span>
              <span className="ap-hero-meta-value">{articles.length} Articles</span>
            </div>
            <div className="ap-hero-meta-divider" aria-hidden />
            <div className="ap-hero-meta-item">
              <span className="ap-hero-meta-label t-h6">Format</span>
              <span className="ap-hero-meta-value">Digital PDF</span>
            </div>
            <div className="ap-hero-meta-divider" aria-hidden />
            <div className="ap-hero-meta-item">
              <span className="ap-hero-meta-label t-h6">Checkout</span>
              <span className="ap-hero-meta-value">Stripe secure</span>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="ap-featured" ref={featuredRef}>
          <div className="ap-section-head">
            <span className="ap-section-eyebrow t-h6">Featured</span>
            <h2 className="ap-section-title">
              Editor&apos;s <i>pick</i>
            </h2>
          </div>
          <div className="ap-featured-grid">
            {featured.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="ap-catalog" ref={catalogRef} id="catalog">
        <div className="ap-section-head">
          <span className="ap-section-eyebrow t-h6">Catalog</span>
          <h2 className="ap-section-title">
            The full <i>shelf</i>
          </h2>
          <p className="ap-section-lead">
            Each piece is tied to a real event. Purchase unlocks the digital edition —
            ready the moment Stripe confirms.
          </p>
        </div>

        <div className="ap-grid">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </section>

      <section className="ap-note">
        <div className="ap-note-inner">
          <span className="ap-note-eyebrow t-h6">How it works</span>
          <ol className="ap-note-steps">
            <li>
              <strong>01</strong>
              <span>Choose a guide that matches your event.</span>
            </li>
            <li>
              <strong>02</strong>
              <span>Pay securely through Stripe Checkout.</span>
            </li>
            <li>
              <strong>03</strong>
              <span>Receive your digital edition by email (once delivery is wired).</span>
            </li>
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  );
}
