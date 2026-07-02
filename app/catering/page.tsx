'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─────────────────────────────────────────── */

const signatures = [
  {
    name: 'Crème Brûlée Latte',
    desc: 'A rich espresso blended with velvety milk, layered with a cloud of golden caramel custard, tucked under the decadent flavor of hard-top candied caramelised sugar.',
    tag: null,
  },
  {
    name: 'Rose Saffron Latte',
    desc: 'A luxurious floral blend of fragrant rose syrup and warm cardamom, finished with a cloud of sweet cold foam and topped with rose petals and saffron.',
    tag: "Mother's Day Special",
  },
  {
    name: 'Latte España',
    desc: 'A creamy Spanish latte made with bold espresso and silky oat milk, subtly sweetened with condensed milk and cold foam for smooth indulgence.',
    tag: null,
  },
];

const essentialFlavors = ['Vanilla', 'Caramel', 'Hazelnut', 'Mocha / Chocolate', 'White Chocolate'];

const collabItems = [
  {
    name: 'Tiramisu Latte',
    desc: 'A dessert-style latte featuring bold espresso, soft vanilla notes, and a luxurious mascarpone cold foam. Topped with cocoa powder and Swiss chocolate.',
  },
  {
    name: 'La Dolce Latte',
    desc: 'A silky iced latte crafted with golden espresso and a blend of brown sugar and homemade caramel for rich sweetness. Finished with smooth cold foam for a creamy, luxurious sip that lives up to its name — "The Sweet Latte."',
  },
];

const addOns = [
  'Extra shot of espresso',
  'Oat milk / Almond milk',
  'Rose petals / Drizzle',
  'Extra syrup pump',
  'Biscoff bomb',
];

/* ─── Scroll-reveal hook ────────────────────────────── */

function useReveal(ref: React.RefObject<HTMLElement | null>, options: { stagger?: number; y?: number } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y: options.y ?? 40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1, y: 0,
          duration: 0.85,
          stagger: options.stagger ?? 0.1,
          ease: 'expo.out',
        });
      },
    });
    return () => trigger.kill();
  }, [ref, options.stagger, options.y]);
}

/* ─── Sub-components ────────────────────────────────── */

function Rule() {
  return (
    <div
      className="my-0 h-px w-full"
      style={{ background: 'linear-gradient(90deg, #c8922a 0%, rgba(200,146,42,0.10) 100%)' }}
      aria-hidden
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mb-5 block font-bold uppercase tracking-[0.22em] text-[#c8922a]"
      style={{ fontSize: 'max(0.677vw, 11px)' }}
      data-reveal
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="m-0 font-bold uppercase leading-none tracking-[-0.03em] text-[#f0ede6]"
      style={{ fontSize: 'clamp(36px, 5vw, 80px)' }}
      data-reveal
    >
      {children}
    </h2>
  );
}

function DrinkCard({ name, desc, tag }: {
  name: string; desc: string; tag?: string | null;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[4px] border border-[rgba(200,146,42,0.12)] bg-[#1e1a15] p-7 transition-[border-color] duration-500 hover:border-[rgba(200,146,42,0.30)]"
      data-reveal
    >
      <div className="flex items-start justify-between gap-4">
        <h3
          className="m-0 leading-tight tracking-[-0.01em] text-[#f0ede6]"
          style={{ fontSize: 'clamp(18px, 1.6vw, 26px)', fontWeight: 600 }}
        >
          {name}
        </h3>
        {tag && (
          <span
            className="rounded-sm border border-[rgba(200,146,42,0.35)] px-3 py-1 font-bold uppercase tracking-[0.14em] text-[rgba(200,146,42,0.85)]"
            style={{ fontSize: 'max(0.677vw, 10px)' }}
          >
            {tag}
          </span>
        )}
      </div>
      <p
        className="m-0 leading-[1.7] text-[rgba(240,237,230,0.55)]"
        style={{ fontSize: 'max(0.9vw, 14px)' }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────── */

export default function MenuPage() {
  const router = useRouter();

  const goToBooking = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem('scrollTo', 'booking');
    router.push('/');
  }, [router]);

  const heroRef      = useRef<HTMLElement>(null);
  const sigRef       = useRef<HTMLElement>(null);
  const essRef       = useRef<HTMLElement>(null);
  const collabRef    = useRef<HTMLElement>(null);
  const customizeRef = useRef<HTMLElement>(null);

  useReveal(sigRef,       { stagger: 0.12 });
  useReveal(essRef,       { stagger: 0.10 });
  useReveal(collabRef,    { stagger: 0.12 });
  useReveal(customizeRef, { stagger: 0.08 });

  // Hero entrance
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const targets = hero.querySelectorAll('[data-hero]');
    gsap.set(targets, { opacity: 0, y: 30 });
    gsap.to(targets, {
      opacity: 1, y: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.35,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0906] text-[#f0ede6]">
      <Navigation />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] flex-col items-start justify-end overflow-hidden px-5 pb-16 pt-40 md:px-[3.9vw] md:pb-20"
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[80vw] w-[80vw] max-w-[900px]"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(200,146,42,0.055) 0%, transparent 60%)' }}
          aria-hidden
        />

        <div className="relative z-10 max-w-[900px]">
          <span
            className="mb-6 block font-bold uppercase tracking-[0.22em] text-[#c8922a]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
            data-hero
          >
            Coffee Cart · Tri-State Area · Est. 2023
          </span>

          <h1
            className="m-0 mb-8 font-bold uppercase leading-none tracking-[-0.04em] text-[#f0ede6]"
            style={{ fontSize: 'clamp(52px, 9vw, 140px)' }}
            data-hero
          >
            The<br />
            <span style={{ color: '#c8922a' }}>Menu.</span>
          </h1>

          <p
            className="m-0 mb-10 max-w-[520px] leading-[1.7] text-[rgba(240,237,230,0.55)]"
            style={{ fontSize: 'max(1.04vw, 16px)' }}
            data-hero
          >
            A marriage of cultures, one unforgettable cup at a time.
            Bold South Asian flavours, authentic Yemeni-style coffee, and
            timeless Italian recipes — served straight to you.
          </p>

          <div className="flex flex-wrap items-center gap-4" data-hero>
            <a href="#" className="btn-primary" style={{ padding: '13px 28px', fontSize: 'max(0.677vw, 11px)', letterSpacing: '0.12em' }} onClick={goToBooking}>
              Book Your Event →
            </a>
            <Link
              href="/"
              className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#c8922a]"
              style={{ fontSize: 'max(0.677vw, 11px)' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ background: 'linear-gradient(90deg, #c8922a 0%, rgba(200,146,42,0.10) 100%)', height: '1px' }}
          aria-hidden
        />
      </section>

      {/* ── SIGNATURES BY CAPO ─────────────────────────── */}
      <section
        ref={sigRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Signatures by CAPO</Eyebrow>
            <SectionTitle>Our Craft<br />Selections.</SectionTitle>
          </div>
          <p
            className="m-0 self-end font-bold uppercase tracking-[0.18em] text-[rgba(240,237,230,0.30)]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
            data-reveal
          >
            All options served iced
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {signatures.map((item) => (
            <DrinkCard key={item.name} {...item} />
          ))}
        </div>
      </section>

      <Rule />

      {/* ── CAPO'S ESSENTIALS ──────────────────────────── */}
      <section
        ref={essRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1fr] md:gap-[6vw]">
          <div>
            <Eyebrow>Capo&apos;s Essentials</Eyebrow>
            <SectionTitle>Simple.<br />Perfect.</SectionTitle>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div
              className="flex flex-col gap-4 border-b border-[rgba(200,146,42,0.12)] pb-8"
              data-reveal
            >
              <h3
                className="m-0 font-semibold tracking-[-0.01em] text-[#f0ede6]"
                style={{ fontSize: 'clamp(18px, 1.5vw, 24px)' }}
              >
                Iced Latte
              </h3>
              <p
                className="m-0 leading-[1.65] text-[rgba(240,237,230,0.55)]"
                style={{ fontSize: 'max(0.9vw, 14px)' }}
              >
                Chilled espresso over ice with your choice of classic syrups
                for a refreshing caffeine fix.
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {essentialFlavors.map((f) => (
                  <span
                    key={f}
                    className="rounded-sm border border-[rgba(200,146,42,0.20)] px-3 py-1 text-[rgba(200,146,42,0.70)]"
                    style={{ fontSize: 'max(0.677vw, 10px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="m-0 leading-[1.7] text-[rgba(240,237,230,0.35)]"
              style={{ fontSize: 'max(0.677vw, 12px)' }}
              data-reveal
            >
              Customise your order — see below for available add-ons.
            </p>
          </div>
        </div>
      </section>

      <Rule />

      {/* ── COLLABORATION MENU ─────────────────────────── */}
      <section
        ref={collabRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        {/* Collab header block */}
        <div
          className="mb-14 rounded-[4px] border border-[rgba(200,146,42,0.15)] bg-[#1e1a15] p-8 md:p-10"
          data-reveal
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3">
              <span
                className="font-bold uppercase tracking-[0.22em] text-[#c8922a]"
                style={{ fontSize: 'max(0.677vw, 11px)' }}
              >
                Collaboration Menu
              </span>
              <p
                className="m-0 font-semibold text-[#f0ede6]"
                style={{ fontSize: 'clamp(16px, 1.3vw, 20px)' }}
              >
                In collaboration with <span className="text-[#c8922a]">Namkeen</span>
              </p>
              <p
                className="m-0 text-[rgba(240,237,230,0.45)]"
                style={{ fontSize: 'max(0.9vw, 13px)' }}
              >
                9 N Beverwyck Rd, Lake Hiawatha, NJ 07034
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex items-center gap-3">
                <span
                  className="rounded-sm border border-[rgba(200,146,42,0.30)] px-3 py-1.5 font-bold uppercase tracking-[0.14em] text-[rgba(200,146,42,0.80)]"
                  style={{ fontSize: 'max(0.677vw, 10px)' }}
                >
                  Cars N&apos; Coffee
                </span>
                <span
                  className="rounded-sm border border-[rgba(240,237,230,0.12)] px-3 py-1.5 font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.40)]"
                  style={{ fontSize: 'max(0.677vw, 10px)' }}
                >
                  Mother&apos;s Day Edition
                </span>
              </div>
              <p
                className="m-0 text-[rgba(240,237,230,0.35)]"
                style={{ fontSize: 'max(0.677vw, 11px)' }}
              >
                9 AM – 1 PM &nbsp;·&nbsp; May 10, 2026
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <SectionTitle>Special<br />Collabs.</SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {collabItems.map((item) => (
            <DrinkCard key={item.name} {...item} />
          ))}
        </div>
      </section>

      <Rule />

      {/* ── CUSTOMIZE YOUR CUP ─────────────────────────── */}
      <section
        ref={customizeRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1fr] md:gap-[6vw]">
          <div>
            <Eyebrow>Add-Ons</Eyebrow>
            <SectionTitle>Customize<br />Your Cup.</SectionTitle>
            <p
              className="mt-6 leading-[1.7] text-[rgba(240,237,230,0.45)]"
              style={{ fontSize: 'max(1.04vw, 15px)' }}
              data-reveal
            >
              Make it yours. Add any of the extras below to any drink on our menu.
            </p>
          </div>

          <ul className="flex list-none flex-col gap-0 p-0">
            {addOns.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-[rgba(200,146,42,0.10)] py-5 transition-colors duration-300 last:border-0 hover:border-[rgba(200,146,42,0.25)]"
                data-reveal
              >
                <span
                  className="shrink-0 font-bold text-[rgba(200,146,42,0.40)]"
                  style={{ fontSize: 'max(0.677vw, 11px)', width: '1.8em' }}
                >
                  0{i + 1}
                </span>
                <span
                  className="font-medium text-[#f0ede6]"
                  style={{ fontSize: 'clamp(15px, 1.3vw, 20px)' }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Rule />

      {/* ── FOOTER STRIP ───────────────────────────────── */}
      <footer className="flex flex-col items-center gap-6 px-5 py-16 text-center md:px-[3.9vw]">
        <p
          className="m-0 font-bold uppercase tracking-[0.3em] text-[rgba(240,237,230,0.20)]"
          style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          aria-hidden
        >
          CAPOS
        </p>
        <p
          className="m-0 max-w-[360px] leading-[1.7] text-[rgba(240,237,230,0.40)]"
          style={{ fontSize: 'max(0.9vw, 14px)' }}
        >
          At your service — wherever the occasion takes us.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="mailto:hello@capos.coffee"
            className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#c8922a]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            hello@capos.coffee
          </a>
          <span className="text-[rgba(240,237,230,0.20)]" aria-hidden>·</span>
          <a
            href="tel:+442079460958"
            className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#c8922a]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            +44 20 7946 0958
          </a>
          <span className="text-[rgba(240,237,230,0.20)]" aria-hidden>·</span>
          <a
            href="#"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: 'max(0.677vw, 10px)', letterSpacing: '0.12em' }}
            onClick={goToBooking}
          >
            Book Your Event →
          </a>
        </div>
      </footer>
    </div>
  );
}
