'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoseFlourish, BeanFlourish } from '../components/Flourishes';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────── */

interface Drink {
  name: string;
  desc: string;
  origin?: string;
  ingredients?: string;
  tag?: string | null;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const signatures: Drink[] = [
  {
    name: 'Crème Brûlée Latte',
    desc: 'Rich espresso blended with velvety milk, layered with a cloud of golden caramel custard, tucked under a decadent hard-top of candied caramelised sugar.',
    origin: 'French pâtisserie meets Italian espresso',
    ingredients: 'Espresso · Milk · Caramel custard · Torched sugar',
    image: '/cremblue.png',
    imageWidth: 1000,
    imageHeight: 1200,
  },
  {
    name: 'Rose Saffron Latte',
    desc: 'A luxurious floral blend of fragrant rose syrup and warm cardamom, finished with a cloud of sweet cold foam and topped with rose petals and saffron threads.',
    origin: 'A quiet nod to Persian tearooms',
    ingredients: 'Espresso · Rose syrup · Cardamom · Cold foam · Saffron',
    tag: "",
    image: '/rose-saf.jpg',
    imageWidth: 1000,
    imageHeight: 1200,
  },
  {
    name: 'Latte España',
    desc: 'A creamy Spanish latte made with bold espresso and silky oat milk, subtly sweetened with condensed milk and cold foam for a smooth indulgence.',
    origin: 'Inspired by Madrid’s café con leche',
    ingredients: 'Espresso · Oat milk · Condensed milk · Cold foam',
    image: '/esp.png',
    imageWidth: 1000,
    imageHeight: 1200,
  },
  {
    name: 'Tiramisu Latte',
    desc: 'A dessert-style latte featuring bold espresso, soft vanilla notes, and a luxurious mascarpone cold foam. Topped with cocoa powder and Swiss chocolate.',
    origin: 'Inspired by the classic Italian dessert of the same name',
    ingredients: 'Espresso · Vanilla · Mascarpone cold foam · Cocoa powder · Swiss chocolate',
    image: '/tira.png',
  },
  {
    name: 'La Dolce Latte',
    desc: 'A silky iced latte crafted with golden espresso and a blend of brown sugar and honey/caramel for rich sweetness. Finished with smooth cold foam for a creamy, luxurious sip that lives up to its name, "The Sweet Latte."',
    origin: 'A nod to "la dolce vita"  the sweet life',
    ingredients: 'Espresso · Brown sugar · Honey caramel · Cold foam',
    image: '/ladoche.png',
  },
];

const essentialFlavors = ['Vanilla', 'Caramel', 'Hazelnut', 'Mocha', 'White Chocolate'];

const collabItems: Drink[] = [
  {
    name: "Tony's Cup",
    desc: "Dark cherry and vanilla Italian soda topped with a swirl of cream. Bold & unapologetic refreshment",
    origin: "Inspired by classic Italian soda shops, with a bold cherry-vanilla twist.",
    ingredients: "Dark Cherry Syrup · Vanilla Syrup · Soda Water · Cream ",
    image: "/tonycup.png",
    imageWidth: 1000,
    imageHeight: 1200,
  },
  {
    name: 'Elvira',
    desc: 'A mysterious mix of blueberry and lavender syrups with sparkling soda, optionally swirled with cream for a dreamy purple haze',
    origin: 'A moody blueberry-lavender blend for those who like a little mystery in their cup.',
    ingredients: 'Blueberry Syrup · Lavender Syrup · Soda Water · Cream',
    image: '/elvira.png',
    imageWidth: 1000,
    imageHeight: 1200,
  },
];

const addOns = [
  'Extra shot of espresso',
  'Oat milk',
  'Almond milk',
  'Rose petals / Drizzle',
  'Extra syrup pump',
];

/* ── Category tabs ─────────────────────────────────── */

interface Category {
  id: string;
  label: string;
  count: number;
}

const categories: Category[] = [
  { id: 'signatures', label: 'Signatures', count: signatures.length },
  { id: 'essentials', label: 'Essentials', count: 1 },
  { id: 'refreshers', label: 'Refreshers', count: collabItems.length },
  { id: 'customize',  label: 'Customize',  count: addOns.length },
];

/* ── Scroll reveal hook ────────────────────────────── */

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

/* ── Sub-components ────────────────────────────────── */

function Rule() {
  return (
    <div
      className="my-0 h-px w-full"
      style={{ background: 'linear-gradient(90deg, #971d13 0%, rgba(151,29,19,0.10) 100%)' }}
      aria-hidden
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mb-5 block font-bold uppercase tracking-[0.22em] text-[#971d13]"
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
      className="m-0 font-bold uppercase leading-none tracking-[-0.03em] text-white"
      style={{ fontSize: 'clamp(36px, 5vw, 80px)' }}
      data-reveal
    >
      {children}
    </h2>
  );
}

/**
 * Drink card with a hover-reveal overlay showing origin + ingredients.
 * The description slides out; the "story" (origin + ingredients) slides in.
 */
function DrinkCard({ name, desc, origin, ingredients, tag, image, index, className }: Drink & { index: number; className?: string }) {
  return (
    <article
      className={`cat-drink group relative flex flex-col overflow-hidden rounded-[4px] border border-[rgba(151,29,19,0.12)] bg-[#0d1410] transition-[border-color,box-shadow] duration-500 hover:border-[rgba(151,29,19,0.5)] hover:shadow-[0_12px_40px_-12px_rgba(151,29,19,0.25)]${className ? ` ${className}` : ''}`}
      data-reveal
    >
      {/* Photo — inset/framed, sized to its own natural aspect ratio, clips with a gentle Ken Burns on hover */}
      {image && (
        <div className="p-6 pb-0">
          <div className="relative mx-auto aspect-32/43 w-2/4 lg:w-98 overflow-hidden rounded-sm border border-[rgba(151,29,19,0.15)]">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 75vw, 25vw"
              className="object-cover brightness-90 contrast-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
            />
            {/* Number chip — on top of the image */}
            <span
              className="absolute left-2.5 top-2.5 rounded-sm border border-[rgba(255,255,255,0.1)] bg-[rgba(8,13,10,0.65)] px-2 py-1 font-bold tracking-[0.24em] text-[rgba(255,255,255,0.55)] backdrop-blur-sm"
              style={{ fontSize: '10px' }}
              aria-hidden
            >
              {String(index).padStart(2, '0')}
            </span>
            {tag && (
              <span
                className="absolute right-2.5 top-2.5 rounded-sm border border-[rgba(151,29,19,0.5)] bg-[rgba(151,29,19,0.75)] px-2 py-1 font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm"
                style={{ fontSize: '9px' }}
              >
                {tag}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Number chip when no image */}
        {!image && (
          <span
            className="cat-drink-num absolute right-6 top-6 font-bold tracking-[0.24em] text-[rgba(151,29,19,0.4)] transition-colors duration-500 group-hover:text-[#971d13]"
            style={{ fontSize: 'max(0.72vw, 11px)' }}
            aria-hidden
          >
            {String(index).padStart(2, '0')}
          </span>
        )}

        {/* Header */}
        <div className="mb-3 flex items-start gap-4 pr-10">
          <h3
            className="m-0 leading-tight tracking-[-0.01em] text-white"
            style={{ fontSize: 'clamp(19px, 1.7vw, 28px)', fontWeight: 600 }}
          >
            {name}
          </h3>
          {tag && !image && (
            <span
              className="mt-1 shrink-0 rounded-sm border border-[rgba(151,29,19,0.4)] bg-[rgba(151,29,19,0.08)] px-3 py-1 font-bold uppercase tracking-[0.14em] text-[rgba(151,29,19,0.9)]"
              style={{ fontSize: 'max(0.677vw, 10px)' }}
            >
              {tag}
            </span>
          )}
        </div>

      {/* Description (fades out on hover to reveal ingredients) */}
      <div className="relative min-h-[100px] flex-1">
        <p
          className="absolute inset-0 m-0 leading-[1.7] text-[rgba(240,237,230,0.55)] transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-0"
          style={{ fontSize: 'max(0.9vw, 14px)' }}
        >
          {desc}
        </p>

        {/* Hover story */}
        <div className="absolute inset-0 flex translate-y-2 flex-col gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {origin && (
            <p
              className="m-0 italic text-white"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(15px, 1.15vw, 18px)',
                lineHeight: 1.4,
              }}
            >
              &ldquo;{origin}&rdquo;
            </p>
          )}
          {ingredients && (
            <>
              <span
                className="font-bold uppercase tracking-[0.22em] text-[#971d13]"
                style={{ fontSize: 'max(0.6vw, 10px)' }}
              >
                Notes
              </span>
              <p
                className="m-0 leading-[1.6] text-[rgba(240,237,230,0.75)]"
                style={{ fontSize: 'max(0.85vw, 13px)' }}
              >
                {ingredients}
              </p>
            </>
          )}
        </div>
      </div>

        {/* Bottom rule + subtle "iced" note */}
        <div className="mt-4 flex items-center justify-between border-t border-[rgba(151,29,19,0.08)] pt-3 transition-colors duration-500 group-hover:border-[rgba(151,29,19,0.25)]">
          <span
            className="font-bold uppercase tracking-[0.2em] text-[rgba(240,237,230,0.35)]"
            style={{ fontSize: 'max(0.6vw, 10px)' }}
          >
            Served Iced
          </span>
          <span
            className="text-[#971d13] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Page ──────────────────────────────────────────── */

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
  const refreshersRef = useRef<HTMLElement>(null);
  const customizeRef = useRef<HTMLElement>(null);

  useReveal(sigRef,       { stagger: 0.12 });
  useReveal(essRef,       { stagger: 0.10 });
  useReveal(refreshersRef, { stagger: 0.12 });
  useReveal(customizeRef, { stagger: 0.08 });

  /* Active category tracker */
  const [activeCat, setActiveCat] = useState<string>('signatures');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCat(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToCat = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Hero entrance */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const targets = hero.querySelectorAll('[data-hero]');
    gsap.set(targets, { opacity: 0, y: 30 });
    gsap.to(targets, {
      opacity: 1, y: 0,
      duration: 1.0, stagger: 0.12,
      ease: 'expo.out', delay: 0.35,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#080d0a] text-white">
      <Navigation />

      {/* -- HERO -------------------------------------------- */}
      <section
        ref={heroRef}
        className="relative flex min-h-[75vh] flex-col items-start justify-end overflow-hidden px-5 pb-16 pt-40 md:px-[3.9vw] md:pb-20"
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[80vw] w-[80vw] max-w-[900px]"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(151,29,19,0.06) 0%, transparent 60%)' }}
          aria-hidden
        />

        <RoseFlourish
          className="pointer-events-none absolute right-8 top-32 hidden md:block"
          size={200}
          style={{
            color: '#971d13',
            opacity: 0.12,
            filter: 'drop-shadow(0 0 40px rgba(151,29,19,0.3))',
          }}
        />
        <BeanFlourish
          className="pointer-events-none absolute left-[15%] top-[35%] hidden md:block"
          size={28}
          style={{ color: 'rgba(255,255,255,0.2)' }}
        />

        <div className="relative z-10 max-w-[900px]">
          <span
            className="mb-6 inline-flex items-center gap-3 font-bold uppercase tracking-[0.22em] text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
            data-hero
          >
            <span>Coffee Cart</span>
            <span className="h-1 w-1 rounded-full bg-[#971d13]" aria-hidden />
            <span>Tri-State Area</span>
            <span className="h-1 w-1 rounded-full bg-[#971d13]" aria-hidden />
            <span>Est. 2025</span>
          </span>

          <h1
            className="m-0 mb-8 font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(52px, 9vw, 140px)' }}
            data-hero
          >
            The<br />
            <span style={{
              color: '#971d13',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 500,
              textTransform: 'none',
              letterSpacing: '-0.02em',
            }}>
              menu.
            </span>
          </h1>

          <p
            className="m-0 mb-10 max-w-[520px] leading-[1.7] text-[rgba(240,237,230,0.6)]"
            style={{ fontSize: 'max(1.04vw, 16px)' }}
            data-hero
          >
            A marriage of cultures, one unforgettable cup at a time.
            Bold South Asian flavours, authentic Yemeni-style coffee, and
            timeless Italian recipes, served straight to you.
          </p>

          <div className="flex flex-wrap items-center gap-4" data-hero>
            <a
              href="#"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: 'max(0.677vw, 11px)', letterSpacing: '0.12em' }}
              onClick={goToBooking}
            >
              Book Your Event →
            </a>
            <Link
              href="/"
              className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#971d13]"
              style={{ fontSize: 'max(0.677vw, 11px)' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ background: 'linear-gradient(90deg, #971d13 0%, rgba(151,29,19,0.10) 100%)', height: '1px' }}
          aria-hidden
        />
      </section>

      {/* -- STICKY CATEGORY NAV -------------------------- */}
      <nav
        className="sticky top-[72px] z-30 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(8,13,10,0.85)] backdrop-blur-md"
        aria-label="Menu categories"
      >
        <div className="flex items-center gap-6 overflow-x-auto px-5 py-4 md:gap-8 md:px-[3.9vw] md:py-5">
          <span
            className="hidden shrink-0 font-bold uppercase tracking-[0.24em] text-[rgba(255,255,255,0.3)] md:inline"
            style={{ fontSize: '10px' }}
          >
            Explore
          </span>
          {categories.map((cat, i) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToCat(cat.id)}
                className={`flex shrink-0 items-center gap-3 py-1 font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
                }`}
                style={{ fontSize: 'max(0.72vw, 11px)' }}
              >
                <span className={isActive ? 'text-[#971d13]' : 'text-[rgba(151,29,19,0.5)]'}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`h-px transition-all duration-500 ${
                    isActive
                      ? 'w-8 bg-[#971d13] shadow-[0_0_8px_rgba(151,29,19,0.6)]'
                      : 'w-3 bg-[rgba(255,255,255,0.15)]'
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* -- SIGNATURES BY CAPO --------------------------- */}
      <section
        id="signatures"
        ref={sigRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div
          className="cat-featured group relative mb-14 overflow-hidden rounded-[4px] border border-[rgba(151,29,19,0.22)] bg-[#0d1410] p-8 md:p-10"
          data-reveal
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(151,29,19,0.18) 0%, transparent 70%)' }}
            aria-hidden
          />
          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <span
                className="mb-4 inline-flex items-center gap-2 font-bold uppercase tracking-[0.24em] text-[#971d13]"
                style={{ fontSize: 'max(0.677vw, 10px)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#971d13] shadow-[0_0_8px_rgba(151,29,19,0.8)]" />
                Featured This Season
              </span>
              <h2
                className="m-0 mb-3 font-semibold tracking-[-0.02em] text-white"
                style={{ fontSize: 'clamp(28px, 3.2vw, 48px)' }}
              >
                Rose Saffron Latte
              </h2>
              <p
                className="m-0 max-w-[560px] leading-[1.7] text-[rgba(240,237,230,0.6)]"
                style={{ fontSize: 'max(0.95vw, 15px)' }}
              >
                A luxurious floral blend of fragrant rose syrup, warm cardamom,
                sweet cold foam, finished with rose petals and saffron threads.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <span
                className="rounded-sm border border-[rgba(151,29,19,0.35)] bg-[rgba(151,29,19,0.1)] px-3 py-1.5 font-bold uppercase tracking-[0.14em] text-[#971d13]"
                style={{ fontSize: 'max(0.677vw, 10px)' }}
              >
                Seasonal Special
              </span>
              <span
                className="font-bold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.45)] transition-colors duration-300 group-hover:text-white"
                style={{ fontSize: 'max(0.677vw, 10px)' }}
              >
                Hover any drink for notes →
              </span>
            </div>
          </div>
        </div>

        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Signatures by CAPO</Eyebrow>
            <SectionTitle>
              Our craft<br />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  textTransform: 'none',
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                selections.
              </span>
            </SectionTitle>
          </div>
          <p
            className="m-0 self-end font-bold uppercase tracking-[0.18em] text-[rgba(240,237,230,0.35)]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
            data-reveal
          >
            Hover for tasting notes →
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {signatures.slice(0, 3).map((item, i) => (
            <DrinkCard key={item.name} {...item} index={i + 1} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {signatures.slice(3).map((item, i) => (
            <DrinkCard key={item.name} {...item} index={i + 4} />
          ))}
        </div>
      </section>

      <Rule />

      {/* -- CAPO'S ESSENTIALS ---------------------------- */}
      <section
        id="essentials"
        ref={essRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr] md:gap-8 lg:gap-[3.5vw]">
          <div data-reveal>
            <Eyebrow>Capo&apos;s Essentials</Eyebrow>
            <SectionTitle>
              Simple.<br />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  textTransform: 'none',
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                perfect.
              </span>
            </SectionTitle>
          </div>

          <div
            className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-[4px] border border-[rgba(151,29,19,0.12)] bg-[#0d1410] p-8 transition-[border-color,box-shadow] duration-500 hover:border-[rgba(151,29,19,0.5)] hover:shadow-[0_12px_40px_-12px_rgba(151,29,19,0.25)] md:grid-cols-[392px_1fr] md:p-10"
            data-reveal
          >
            <div className="relative mx-auto aspect-32/43 w-2/4 overflow-hidden rounded-sm border border-[rgba(151,29,19,0.15)] md:w-full md:max-w-98">
              <Image
                src="/iced.png"
                alt="Iced Latte"
                fill
                sizes="(max-width: 768px) 75vw, 25vw"
                className="object-cover brightness-90 contrast-105"
              />
            </div>

            <div className="flex flex-col justify-center gap-8">
              <div className="flex flex-col gap-4 border-b border-[rgba(151,29,19,0.12)] pb-8">
                <h3
                  className="m-0 font-semibold tracking-[-0.01em] text-white"
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
                      className="rounded-sm border border-[rgba(151,29,19,0.2)] px-3 py-1 text-[rgba(151,29,19,0.7)] transition-colors duration-300 hover:border-[rgba(151,29,19,0.5)] hover:text-[#971d13]"
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
              >
                Customise your order, see below for available add-ons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* -- REFRESHERS MENU ------------------------------ */}
      <section
        id="refreshers"
        ref={refreshersRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        {/* Refreshers header block */}
        <div
          className="mb-14 rounded-[4px] border border-[rgba(151,29,19,0.15)] bg-[#0d1410] p-8 md:p-10"
          data-reveal
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3">
              <span
                className="font-bold uppercase tracking-[0.22em] text-[#971d13]"
                style={{ fontSize: 'max(0.677vw, 11px)' }}
              >
                {/* Refreshers Menu */}
              </span>
              <p
                className="m-0 font-semibold text-white"
                style={{ fontSize: 'clamp(16px, 1.3vw, 20px)' }}
              >
                Capos <span className="text-[#971d13]">Refreshers</span>
              </p>
              <p
                className="m-0 text-[rgba(240,237,230,0.45)]"
                style={{ fontSize: 'max(0.9vw, 13px)' }}
              >
                Crafted with fresh ingredients for a light, vibrant, and refreshing experience.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex items-center gap-3">
                <span
                  className="rounded-sm border border-[rgba(151,29,19,0.3)] px-3 py-1.5 font-bold uppercase tracking-[0.14em] text-[rgba(151,29,19,0.8)]"
                  style={{ fontSize: 'max(0.677vw, 10px)' }}
                >
                  Perfect for any time of day.
                </span>
                <span
                  className="rounded-sm border border-[rgba(240,237,230,0.12)] px-3 py-1.5 font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.4)]"
                  style={{ fontSize: 'max(0.677vw, 10px)' }}
                >
                
                </span>
              </div>
              <p
                className="m-0 text-[rgba(240,237,230,0.35)]"
                style={{ fontSize: 'max(0.677vw, 11px)' }}
              >
                Refresh • Recharge • Enjoy
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <SectionTitle>
             Refreshers Menu <br />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 500,
                textTransform: 'none',
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              Italian Sodas
            </span>
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {collabItems.map((item, i) => (
            <DrinkCard key={item.name} {...item} index={i + 1} />
          ))}
        </div>
      </section>

      <Rule />

      {/* -- CUSTOMIZE YOUR CUP --------------------------- */}
      <section
        id="customize"
        ref={customizeRef}
        className="px-5 py-20 md:px-[3.9vw] md:py-28"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1fr] md:gap-[6vw]">
          <div>
            <Eyebrow>Add-Ons</Eyebrow>
            <SectionTitle>
              Customize<br />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  textTransform: 'none',
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                your cup.
              </span>
            </SectionTitle>
            <p
              className="mt-20 pt-10 leading-[1.7] text-[rgba(240,237,230,0.5)]"
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
                className="group flex items-center gap-4 border-b border-[rgba(151,29,19,0.1)] py-5 transition-all duration-300 last:border-0 hover:border-[rgba(151,29,19,0.4)] hover:pl-3"
                data-reveal
              >
                <span
                  className="shrink-0 font-bold text-[rgba(151,29,19,0.4)] transition-colors duration-300 group-hover:text-[#971d13]"
                  style={{ fontSize: 'max(0.677vw, 11px)', width: '1.8em' }}
                >
                  0{i + 1}
                </span>
                <span
                  className="flex-1 font-medium text-white"
                  style={{ fontSize: 'clamp(15px, 1.3vw, 20px)' }}
                >
                  {item}
                </span>
                <span
                  className="text-[#971d13] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  +
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Rule />

      {/* -- FOOTER STRIP --------------------------------- */}
      <footer className="flex flex-col items-center gap-6 px-5 py-16 text-center md:px-[3.9vw]">
        <p
          className="m-0 font-bold uppercase tracking-[0.3em] text-[rgba(240,237,230,0.15)]"
          style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          aria-hidden
        >
          CAPOS 
        </p>
        <p
          className="m-0 max-w-[360px] leading-[1.7] text-[rgba(240,237,230,0.4)]"
          style={{ fontSize: 'max(0.9vw, 14px)' }}
        >
          At your service, wherever the occasion takes us.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="mailto:info@capos.coffee"
            className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            info@capos.coffee
          </a>
          <span className="text-[rgba(240,237,230,0.2)]" aria-hidden>·</span>
          <a
            href="tel:+17327894792"
            className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            +1 (732) 789-4792
          </a>
          <span className="text-[rgba(240,237,230,0.2)]" aria-hidden>·</span>
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
