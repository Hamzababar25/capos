'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import { RoseFlourish, BeanFlourish } from '@/app/components/Flourishes';
import './shop.css';

/* Launch: midnight at the end of August 15th (America/New_York) → Aug 16, 2026 00:00 */
const LAUNCH_DATE = new Date('2026-08-14T00:00:00-04:00');

function getTimeLeft() {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="tabular-nums font-bold leading-none text-white"
        style={{ fontSize: 'clamp(48px, 7.5vw, 104px)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="font-bold uppercase tracking-[0.28em] text-[#971d13]"
        style={{ fontSize: 'max(0.8vw, 12px)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ShopPage() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-40 text-center md:px-[3.9vw]">
        <div className="shop-shirt-bg" aria-hidden>
          <Image src="/blur.png" alt="" fill className="object-contain" />
        </div>

        <div className="shop-vignette" aria-hidden />

        <div
          className="pointer-events-none absolute right-0 top-0 h-[85vw] w-[85vw] max-w-250"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(151,29,19,0.1) 0%, transparent 60%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[70vw] w-[70vw] max-w-200"
          style={{ background: 'radial-gradient(circle at 20% 80%, rgba(151,29,19,0.07) 0%, transparent 60%)' }}
          aria-hidden
        />
        <RoseFlourish
          className="pointer-events-none absolute right-8 top-32 hidden md:block"
          size={220}
          style={{ color: '#971d13', opacity: 0.15, filter: 'drop-shadow(0 0 50px rgba(151,29,19,0.4))' }}
        />
        <BeanFlourish
          className="pointer-events-none absolute left-[15%] top-[35%] hidden md:block"
          size={30}
          style={{ color: 'rgba(255,255,255,0.15)' }}
        />

        <div className="relative z-10 flex max-w-215 flex-col items-center">
          <span
            className="mb-8 inline-flex items-center gap-3 font-bold uppercase tracking-[0.3em] text-[#971d13]"
            style={{ fontSize: 'max(0.85vw, 13px)' }}
          >
            <span>Capos Shop</span>
            <span className="h-1 w-1 rounded-full bg-[#971d13]" aria-hidden />
            <span>Coming Soon</span>
          </span>

          <h1
            className="m-0 mb-8 font-bold uppercase leading-[0.9] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(56px, 10vw, 150px)' }}
          >
            Something&apos;s<br />
            <span
              className="shop-glow-word"
              style={{
                color: '#971d13',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 500,
                textTransform: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              brewing.
            </span>
          </h1>

          <p
            className="m-0 mb-14 max-w-140 leading-[1.7] text-[rgba(240,237,230,0.55)]"
            style={{ fontSize: 'max(1.25vw, 18px)' }}
          >
            Our shop is being crafted with care and launches August 14th Midnight.
            Check back soon.
          </p>

          <div
            className="shop-countdown mb-14 flex items-center gap-6 rounded-[4px] border border-[rgba(151,29,19,0.22)] bg-[#0d1410] px-8 py-10 md:gap-12 md:px-14"
            aria-live="polite"
          >
            <CountdownUnit value={timeLeft?.days ?? 0} label="Days" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>:</span>
            <CountdownUnit value={timeLeft?.hours ?? 0} label="Hours" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>:</span>
            <CountdownUnit value={timeLeft?.minutes ?? 0} label="Mins" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>:</span>
            <CountdownUnit value={timeLeft?.seconds ?? 0} label="Secs" />
          </div>

          <Link
            href="/"
            className="font-bold uppercase tracking-[0.16em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#971d13]"
            style={{ fontSize: 'max(0.8vw, 12px)' }}
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
