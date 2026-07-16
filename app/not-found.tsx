'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Navigation from './components/Navigation';
import { RoseFlourish, CupFlourish, BeanFlourish } from './components/Flourishes';

export default function NotFound() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-nf]');
    const digits = el.querySelectorAll('[data-nf-digit]');
    const rose = el.querySelector('[data-nf-rose]');

    gsap.set(items, { y: 40, opacity: 0 });
    gsap.set(digits, { y: 100, opacity: 0, scaleY: 1.4 });
    gsap.set(rose,  { opacity: 0, scale: 0.6, rotation: -30 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(digits, {
      y: 0, opacity: 1, scaleY: 1,
      duration: 1.15, stagger: 0.09, ease: 'expo.out',
    })
      .to(rose, {
        opacity: 0.08, scale: 1, rotation: 0,
        duration: 1.4, ease: 'expo.out',
      }, '-=0.9')
      .to(items, {
        y: 0, opacity: 1,
        duration: 0.9, stagger: 0.09, ease: 'expo.out',
      }, '-=0.85');
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#080d0a] text-white">
      <Navigation />

      <main
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
      >
        {/* Background flourishes */}
        <RoseFlourish
          data-nf-rose
          className="pointer-events-none absolute right-[-10%] top-[10%] hidden md:block"
          size={520}
          style={{
            color: '#971d13',
            filter: 'blur(1px) drop-shadow(0 0 40px rgba(151,29,19,0.2))',
          }}
        />
        <BeanFlourish
          className="pointer-events-none absolute left-[8%] top-[22%] hidden md:block"
          size={32}
          style={{ color: 'rgba(255,255,255,0.15)' }}
        />
        <CupFlourish
          className="pointer-events-none absolute bottom-[10%] left-[6%] hidden md:block"
          size={100}
          style={{ color: 'rgba(151,29,19,0.15)' }}
        />

        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(151,29,19,0.08) 0%, transparent 60%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col items-center">
          <span
            data-nf
            className="mb-10 font-bold uppercase tracking-[0.3em] text-[#971d13]"
            style={{ fontSize: 'clamp(10px, 0.8vw, 12px)' }}
          >
            <span className="mr-2 inline-block h-1 w-1 rounded-full bg-[#971d13] align-middle" />
            Error 404 · Page not found
          </span>

          {/* Huge 404 — digits animate in individually */}
          <h1
            className="m-0 flex items-baseline gap-1 overflow-hidden font-bold uppercase leading-none tracking-[-0.05em] text-white"
            style={{ fontSize: 'clamp(120px, 22vw, 320px)' }}
            aria-label="404"
          >
            <span data-nf-digit className="inline-block">4</span>
            <span
              data-nf-digit
              className="inline-block"
              style={{ color: '#971d13' }}
            >
              0
            </span>
            <span data-nf-digit className="inline-block">4</span>
          </h1>

          <p
            data-nf
            className="mb-4 mt-10 italic text-white"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(24px, 3.5vw, 44px)',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            This coffee ran cold.
          </p>

          <p
            data-nf
            className="mb-14 max-w-[440px] leading-[1.7] text-[rgba(255,255,255,0.55)]"
            style={{ fontSize: 'clamp(14px, 1vw, 16px)' }}
          >
            The page you&apos;re looking for has drifted off-menu.
            Let us pour you something else, the rest of the shop is warm.
          </p>

          <div
            data-nf
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="/"
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: 'max(0.72vw, 12px)',
                letterSpacing: '0.14em',
              }}
            >
              <span>Back to home</span>
              <span className="ml-2 inline-block">→</span>
            </Link>
            <Link
              href="/moments"
              className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.55)] transition-colors duration-300 hover:text-[#971d13]"
              style={{ fontSize: 'max(0.72vw, 12px)' }}
            >
              Explore our moments →
            </Link>
          </div>
        </div>

        {/* Bottom watermark */}
        <p
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-bold uppercase tracking-[0.4em] text-[rgba(255,255,255,0.08)]"
          style={{ fontSize: 'clamp(10px, 0.75vw, 12px)' }}
          aria-hidden
        >
          Capo&apos;s Coffee · Est. 2025
        </p>
      </main>
    </div>
  );
}
