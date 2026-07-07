'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { RoseFlourish, CupFlourish, BeanFlourish } from '../components/Flourishes';
import './moments.css';

gsap.registerPlugin(ScrollTrigger);

/* --- Data ------------------------------------------- */

interface Event {
  id: number;
  title: string;
  venue: string;
  location: string;
  type: string;
  date: string;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'A Marriage of Cultures',
    venue: 'The Grand at Bella Terra',
    location: 'Long Island, NY',
    type: 'Wedding',
    date: 'May 2026',
    image: '/capos1.PNG',
  },
  {
    id: 2,
    title: 'Namkeen Collab · Cars N’ Coffee',
    venue: '9 N Beverwyck Rd',
    location: 'Lake Hiawatha, NJ',
    type: 'Pop-up',
    date: 'May 2026',
    image: '/collab.jpeg',
  },
  {
    id: 3,
    title: 'Product Launch — Studio 47',
    venue: 'Chelsea Loft',
    location: 'Manhattan, NY',
    type: 'Corporate',
    date: 'April 2026',
    image: '/capos-2.PNG',
  },
  {
    id: 4,
    title: 'Golden Hour — Sweet Sixteen',
    venue: 'Private Residence',
    location: 'Short Hills, NJ',
    type: 'Private Party',
    date: 'March 2026',
    image: '/capos4.jpg',
  },
  {
    id: 5,
    title: 'The Morning Ritual',
    venue: 'Rooftop at The Standard',
    location: 'Hoboken, NJ',
    type: 'Brand Activation',
    date: 'February 2026',
    image: '/capos-3.PNG',
  },
  {
    id: 6,
    title: 'Winter Gala',
    venue: 'Waldorf Astoria',
    location: 'Manhattan, NY',
    type: 'Corporate',
    date: 'January 2026',
    image: '/capos3.PNG',
  },
];

/* --- Testimonials ---------------------------------- */

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  event: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'Capo’s made our wedding morning feel like a boutique café. Every guest asked where the coffee was from — the rose saffron latte stole the show.',
    author: 'Sana & Adil',
    role: 'Bride & Groom',
    event: 'Long Island, NY · May 2026',
  },
  {
    id: 2,
    quote:
      'Working with Capo’s was effortless. They arrived early, set up beautifully, and treated every one of our 300 attendees like a VIP. Our team is already asking when they’ll be back.',
    author: 'Meera Patel',
    role: 'Head of Events',
    event: 'Studio 47 · April 2026',
  },
  {
    id: 3,
    quote:
      'The team has real craft — you can taste it. From the tiramisu latte to how carefully they poured each cup, it was clearly built by people who love what they do.',
    author: 'Farhan Qureshi',
    role: 'Founder, Namkeen',
    event: 'Collab Pop-up · May 2026',
  },
];

/* ===================================================
   Page
   =================================================== */

export default function MomentsPage() {
  const router = useRouter();
  const heroRef      = useRef<HTMLElement>(null);
  const galleryRef   = useRef<HTMLElement>(null);
  const testiRef     = useRef<HTMLElement>(null);
  const [activeTesti, setActiveTesti] = useState(0);

  const goToBooking = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem('scrollTo', 'booking');
    router.push('/');
  }, [router]);

  /* Hero reveal ---------------------------------- */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const rule    = el.querySelector('[data-hero-rule]');
    const eyebrow = el.querySelector('[data-hero-eyebrow]');
    const title   = el.querySelectorAll('[data-hero-title-line]');
    const meta    = el.querySelector('[data-hero-meta]');
    const rose    = el.querySelector('[data-hero-rose]');

    gsap.set([rule, eyebrow, title, meta, rose], { opacity: 0, y: 30 });
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });

    gsap.timeline({ delay: 0.15 })
      .to(rule,    { scaleX: 1, duration: 1.1, ease: 'expo.out' })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.65')
      .to(title,   { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out' }, '-=0.45')
      .to(meta,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
      .to(rose,    { opacity: 0.75, y: 0, duration: 1.2, ease: 'expo.out' }, '-=0.9');
  }, []);

  /* Gallery scroll-reveal ------------------------ */
  useEffect(() => {
    const section = galleryRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>('.mp-card');

    gsap.set(cards, { opacity: 0, y: 60 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.95, stagger: 0.12, ease: 'expo.out',
        });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  /* Testimonial auto-rotate ---------------------- */
  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setActiveTesti((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mp-page">
      <Navigation />

      {/* ======= HERO ======= */}
      <section className="mp-hero" ref={heroRef}>
        {/* Corner flourishes */}
        <RoseFlourish
          data-hero-rose
          className="mp-hero-rose"
          size={220}
          aria-hidden
        />
        <BeanFlourish className="mp-hero-bean mp-hero-bean--1" size={20} />
        <BeanFlourish className="mp-hero-bean mp-hero-bean--2" size={16} />

        <div data-hero-rule className="mp-hero-rule" aria-hidden />

        <div className="mp-hero-inner">
          <span data-hero-eyebrow className="mp-hero-eyebrow t-h6">
            <span>Portfolio</span>
            <span className="mp-eyebrow-dot" aria-hidden />
            <span>Moments captured, stories poured</span>
          </span>

          <h1 className="mp-hero-title">
            <span data-hero-title-line className="mp-hero-title-line">
              Every event
            </span>
            <span data-hero-title-line className="mp-hero-title-line mp-hero-title-italic">
              a new story.
            </span>
          </h1>

          <div data-hero-meta className="mp-hero-meta">
            <div className="mp-hero-meta-item">
              <span className="mp-hero-meta-label t-h6">Featured</span>
              <span className="mp-hero-meta-value">{events.length} Events</span>
            </div>
            <div className="mp-hero-meta-divider" aria-hidden />
            <div className="mp-hero-meta-item">
              <span className="mp-hero-meta-label t-h6">Voices</span>
              <span className="mp-hero-meta-value">{testimonials.length} Testimonials</span>
            </div>
            <div className="mp-hero-meta-divider" aria-hidden />
            <div className="mp-hero-meta-item">
              <span className="mp-hero-meta-label t-h6">Region</span>
              <span className="mp-hero-meta-value">Tri-State Area</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======= RECENT EVENTS GALLERY ======= */}
      <section id="events" className="mp-gallery" ref={galleryRef}>
        <div className="mp-section-head">
          <div className="mp-section-head-left">
            <span className="mp-section-eyebrow t-h6">Recent Events</span>
            <h2 className="mp-section-title t-h2">
              Where <i>we&apos;ve been</i>
            </h2>
          </div>
          <p className="mp-section-lead t-text-lg">
            A glimpse into the celebrations, brand activations and quiet
            morning rituals we&apos;ve had the honour of pouring for.
          </p>
        </div>

        <div className="mp-grid">
          {events.map((ev, i) => (
            <article key={ev.id} className={`mp-card mp-card--${(i % 6) + 1}`}>
              <div className="mp-card-image">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                  className="mp-card-img"
                />
                <div className="mp-card-overlay" aria-hidden />
                <span className="mp-card-type t-h6">{ev.type}</span>
              </div>

              <div className="mp-card-body">
                <div className="mp-card-meta">
                  <span className="mp-card-num t-h6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mp-card-date t-h6">{ev.date}</span>
                </div>
                <h3 className="mp-card-title">{ev.title}</h3>
                <p className="mp-card-venue">
                  {ev.venue}
                  <span className="mp-card-location"> · {ev.location}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======= TESTIMONIALS ======= */}
      <section id="testimonials" className="mp-testi" ref={testiRef}>
        <CupFlourish className="mp-testi-cup" size={140} aria-hidden />

        <div className="mp-section-head">
          <div className="mp-section-head-left">
            <span className="mp-section-eyebrow t-h6">Testimonials</span>
            <h2 className="mp-section-title t-h2">
              <i>Words</i> from our guests
            </h2>
          </div>
        </div>

        <div className="mp-testi-frame">
          <div
            className="mp-testi-track"
            style={{ transform: `translateX(-${activeTesti * 100}%)` }}
          >
            {testimonials.map((t) => (
              <blockquote key={t.id} className="mp-testi-slide">
                <span className="mp-testi-mark" aria-hidden>&ldquo;</span>
                <p className="mp-testi-quote">{t.quote}</p>
                <footer className="mp-testi-foot">
                  <div className="mp-testi-line" aria-hidden />
                  <div className="mp-testi-author">
                    <cite className="mp-testi-name">{t.author}</cite>
                    <span className="mp-testi-role">
                      {t.role} · {t.event}
                    </span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Dots — clickable indicators */}
        <div className="mp-testi-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`mp-testi-dot${i === activeTesti ? ' is-active' : ''}`}
              onClick={() => setActiveTesti(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ======= CTA STRIP ======= */}
      <section className="mp-cta">
        <div className="mp-cta-inner">
          <RoseFlourish className="mp-cta-rose" size={100} aria-hidden />
          <span className="mp-cta-eyebrow t-h6">Your Moment</span>
          <h2 className="mp-cta-title">
            Ready to write the next chapter?
          </h2>
          <p className="mp-cta-sub">
            Whether it&apos;s twenty guests or two thousand, we&apos;d love to
            hear about your event and pour something unforgettable.
          </p>
          <div className="mp-cta-actions">
            <a
              href="#"
              className="btn-primary mp-cta-btn"
              onClick={goToBooking}
            >
              <span>Book Your Event</span>
              <span className="mp-cta-arrow" aria-hidden>→</span>
            </a>
            <Link href="/catering" className="mp-cta-link t-h6">
              Explore the menu →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
