'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { RoseFlourish, BeanFlourish } from '../components/Flourishes';

/* Launch: midnight at the end of August 15th (America/New_York) → Aug 16, 2026 00:00 */
const LAUNCH_DATE = new Date('2026-08-16T00:00:00-04:00');

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
    <div className="flex flex-col items-center gap-2">
      <span
        className="tabular-nums font-bold leading-none text-white"
        style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="font-bold uppercase tracking-[0.22em] text-[#971d13]"
        style={{ fontSize: 'max(0.677vw, 11px)' }}
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
    <div className="min-h-screen bg-[#080d0a] text-white">
      <Navigation />

      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 py-40 text-center md:px-[3.9vw]">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[80vw] w-[80vw] max-w-[900px]"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(151,29,19,0.06) 0%, transparent 60%)' }}
          aria-hidden
        />
        <RoseFlourish
          className="pointer-events-none absolute right-8 top-32 hidden md:block"
          size={200}
          style={{ color: '#971d13', opacity: 0.12, filter: 'drop-shadow(0 0 40px rgba(151,29,19,0.3))' }}
        />
        <BeanFlourish
          className="pointer-events-none absolute left-[15%] top-[35%] hidden md:block"
          size={28}
          style={{ color: 'rgba(255,255,255,0.2)' }}
        />

        <div className="relative z-10 flex max-w-[720px] flex-col items-center">
          <span
            className="mb-6 inline-flex items-center gap-3 font-bold uppercase tracking-[0.22em] text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            <span>Capos Shop</span>
            <span className="h-1 w-1 rounded-full bg-[#971d13]" aria-hidden />
            <span>Coming Soon</span>
          </span>

          <h1
            className="m-0 mb-6 font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(44px, 8vw, 110px)' }}
          >
            Something&apos;s<br />
            <span
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
            className="m-0 mb-12 max-w-[480px] leading-[1.7] text-[rgba(240,237,230,0.6)]"
            style={{ fontSize: 'max(1.04vw, 16px)' }}
          >
            Our shop is being crafted with care and launches August 15th Midnight.
            Check back soon.
          </p>

          <div
            className="mb-12 flex items-center gap-6 rounded-[4px] border border-[rgba(151,29,19,0.22)] bg-[#0d1410] px-8 py-8 md:gap-10 md:px-12"
            aria-live="polite"
          >
            <CountdownUnit value={timeLeft?.days ?? 0} label="Days" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>:</span>
            <CountdownUnit value={timeLeft?.hours ?? 0} label="Hours" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>:</span>
            <CountdownUnit value={timeLeft?.minutes ?? 0} label="Mins" />
            <span className="text-[rgba(255,255,255,0.15)]" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>:</span>
            <CountdownUnit value={timeLeft?.seconds ?? 0} label="Secs" />
          </div>

          <Link
            href="/"
            className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
