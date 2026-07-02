'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import gsap from 'gsap';

interface Props {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  lastUpdated?: string;
  meta: { value: string; label: string }[];
}

export default function LegalHero({
  eyebrow, titleLine1, titleLine2, subtitle, lastUpdated, meta,
}: Props) {
  const topRef   = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const ruleRef  = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set([topRef.current, bottomRef.current], { opacity: 0, y: 20 });
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 60 });
    gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' });

    gsap.timeline({ delay: 0.05 })
      .to(topRef.current,   { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.4')
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.65')
      .to(ruleRef.current,  { scaleX: 1,         duration: 1.1, ease: 'expo.out' }, '-=0.5')
      .to(bottomRef.current,{ opacity: 1, y: 0,  duration: 0.8, ease: 'expo.out' }, '-=0.6');
  }, []);

  return (
    <>
      <Navigation />

      <section
        className="relative flex min-h-[88vh] flex-col overflow-hidden bg-[#0a0906]"
        style={{ paddingTop: 'max(96px, 8vh)' }}
      >
        {/* Subtle ambient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(200,146,42,0.05) 0%, transparent 60%)' }}
          aria-hidden
        />

        {/* ── Top meta bar ── */}
        <div
          ref={topRef}
          className="flex items-center justify-between px-5 pb-0 sm:px-6 md:px-[3.9vw]"
          style={{ opacity: 0 }}
        >
          <span
            className="font-bold uppercase tracking-[0.22em] text-[#c8922a]"
            style={{ fontSize: 'max(0.677vw, 10px)' }}
          >
            CAPOS Coffee · {eyebrow}
          </span>
          {lastUpdated && (
            <span
              className="font-bold uppercase tracking-[0.18em] text-[rgba(240,237,230,0.28)]"
              style={{ fontSize: 'max(0.677vw, 10px)' }}
            >
              {lastUpdated}
            </span>
          )}
        </div>

        {/* ── Giant title ── */}
        <div className="mt-auto flex flex-col px-5 sm:px-6 md:px-[3.9vw]" style={{ paddingBottom: 0 }}>

          {/* Line 1 — solid warm white */}
          <div
            ref={line1Ref}
            className="overflow-hidden"
            style={{ opacity: 0 }}
          >
            <h1
              className="m-0 font-bold uppercase leading-[0.88] tracking-[-0.04em] text-[#f0ede6]"
              style={{ fontSize: 'clamp(72px, 13.5vw, 200px)' }}
            >
              {titleLine1}
            </h1>
          </div>

          {/* Line 2 — outline (ghost) style + extending amber rule */}
          <div
            ref={line2Ref}
            className="flex items-end gap-6 overflow-hidden"
            style={{ opacity: 0 }}
          >
            <h1
              className="m-0 shrink-0 font-bold uppercase leading-[0.88] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(72px, 13.5vw, 200px)',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(240,237,230,0.22)',
              }}
            >
              {titleLine2}
            </h1>
            {/* Line extends across remaining space */}
            <div
              className="mb-[0.12em] h-[1.5px] flex-1"
              style={{ background: 'linear-gradient(90deg, rgba(200,146,42,0.50) 0%, rgba(200,146,42,0.06) 100%)' }}
            />
          </div>
        </div>

        {/* ── Amber rule ── */}
        <div
          ref={ruleRef}
          className="mt-10 h-px w-full"
          style={{
            background: 'linear-gradient(90deg, #c8922a 0%, rgba(200,146,42,0.10) 100%)',
            transformOrigin: 'left center',
          }}
        />

        {/* ── Bottom strip ── */}
        <div
          ref={bottomRef}
          className="grid grid-cols-1 gap-8 px-5 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:px-[3.9vw] md:py-10"
          style={{ opacity: 0 }}
        >
          {/* Left — description */}
          <p
            className="m-0 max-w-[560px] leading-[1.85] text-[rgba(240,237,230,0.45)]"
            style={{ fontSize: 'max(0.95vw, 14px)' }}
          >
            {subtitle}
          </p>

          {/* Right — meta + back link */}
          <div className="flex flex-wrap items-end gap-x-10 gap-y-3 md:flex-col md:items-end md:gap-3">
            {meta.map((m) => (
              <span
                key={m.label}
                className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.30)]"
                style={{ fontSize: 'max(0.677vw, 10px)' }}
              >
                <span className="text-[#c8922a]">{m.value}</span>
                {' '}
                {m.label}
              </span>
            ))}
            <Link
              href="/"
              className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.25)] transition-colors hover:text-[#c8922a]"
              style={{ fontSize: 'max(0.677vw, 10px)', marginTop: 4 }}
            >
              ← Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
