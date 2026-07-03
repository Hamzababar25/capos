'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LegalHero from '@/app/components/LegalHero';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: 'Booking & Events',
    items: [
      {
        q: 'How do I book CAPOS for my event?',
        a: 'Fill out our catering inquiry form on the website — or email us directly at hello@capos.coffee. Share your event date, venue, and guest count and we\'ll get back to you within 24–48 hours to confirm availability and discuss the details.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 4–6 weeks in advance for most events. For weddings and large gatherings (300+), 3–6 months ahead ensures you secure your preferred date. That said, reach out even for last-minute requests — we\'ll do our best.',
      },
      {
        q: 'What types of events do you cater?',
        a: 'Weddings, sweet sixteens, birthdays, corporate events, private gatherings, product launches, conferences, pop-ups, and festivals. If you\'re bringing people together, we\'re there.',
      },
      {
        q: 'Do you require a deposit to reserve a date?',
        a: 'Yes — a deposit is required to lock in your event date. Full details including deposit amount and payment schedule will be outlined in your booking agreement after your initial inquiry.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made more than 30 days before the event receive a full deposit refund. Cancellations within 30 days may forfeit the deposit. Full details are provided in the service agreement at the time of booking.',
      },
    ],
  },
  {
    label: 'Our Service',
    items: [
      {
        q: 'What areas do you serve?',
        a: 'We serve the greater Tri-State area — New York, New Jersey, Connecticut, and Pennsylvania. Travel fees may apply for events outside our standard service radius. Contact us with your location and we\'ll confirm availability.',
      },
      {
        q: 'How many guests can you accommodate?',
        a: 'Our setup scales from intimate gatherings of 20 to large-scale events of 500+. We tailor our staffing and equipment to match your guest count — let us know your numbers and we\'ll plan accordingly.',
      },
      {
        q: 'What equipment do you bring?',
        a: 'We arrive with our full coffee cart setup — professional espresso machine, grinder, all necessary supplies, cups, lids, stirrers, and any specialty ingredients for the menu. We just need power access at the venue.',
      },
      {
        q: 'How long does a typical setup take?',
        a: 'We typically arrive 60–90 minutes before service begins to set up and calibrate equipment. Breakdown takes approximately 45 minutes after service ends.',
      },
      {
        q: 'Can CAPOS travel to an outdoor venue?',
        a: 'Absolutely. Outdoor events are a staple of what we do. We just ask that there\'s a covered area or tent available if there\'s a chance of rain, and access to a standard 120V outlet.',
      },
    ],
  },
  {
    label: 'Menu & Drinks',
    items: [
      {
        q: 'Can I customise the menu for my event?',
        a: 'Yes — that\'s one of our favourite parts. We can work with you to create a menu that reflects the theme, season, or culture of your event. Our signatures can be adapted, and we\'re always open to new collaborations.',
      },
      {
        q: 'Do you accommodate dietary restrictions?',
        a: 'We offer oat milk and almond milk as dairy alternatives for all drinks. Please let us know of any specific allergies or dietary needs when you book — we\'ll make sure every guest is taken care of.',
      },
      {
        q: 'Can guests see a full menu on the day?',
        a: 'Yes — we provide a printed or display menu at the cart for guests. We can also create a custom menu card that matches your event\'s aesthetic if you\'d like.',
      },
      {
        q: 'Do you serve tea or non-coffee options?',
        a: 'Our core menu is coffee-focused, but we can include select non-coffee options depending on your guest profile. Reach out and we\'ll discuss what\'s possible for your event.',
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    gsap.to(el, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.45,
      ease: 'expo.inOut',
    });
  }, [open]);

  return (
    <div
      className="border-b border-[rgba(151,29,19,0.12)] cursor-pointer"
      onClick={() => setOpen(!open)}
      data-reveal
    >
      <div className="flex items-center justify-between gap-6 py-6">
        <p
          className="m-0 font-semibold text-[#ffffff] transition-colors duration-300"
          style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.4 }}
        >
          {q}
        </p>
        <span
          className="shrink-0 w-7 h-7 rounded-full border border-[rgba(151,29,19,0.35)] flex items-center justify-center text-[#971d13] transition-transform duration-300"
          style={{ fontSize: 18, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden
        >
          +
        </span>
      </div>
      <div ref={bodyRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p
          className="m-0 pb-6 leading-[1.8] text-[rgba(240,237,230,0.60)]"
          style={{ fontSize: 'max(0.9vw, 14px)' }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = bodyRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(sections, { opacity: 0, y: 30 });
    sections.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }),
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <LegalHero
        eyebrow="Help Centre"
        titleLine1="Frequently"
        titleLine2="Asked"
        subtitle="Everything you need to know about booking CAPOS, our service, and what to expect on the day."
        meta={[
          { value: '14',  label: 'Questions' },
          { value: '3',   label: 'Categories' },
          { value: '24h', label: 'Reply time' },
        ]}
      />

      <div className="bg-[#080d0a]">
      {/* Body */}
      <section ref={bodyRef} className="px-5 py-20 sm:px-6 md:px-[3.9vw] md:py-28">
        <div className="mx-auto max-w-[820px]">
          {categories.map((cat) => (
            <div key={cat.label} className="mb-16 last:mb-0" data-reveal>
              {/* Category label */}
              <div className="mb-8 flex items-center gap-5">
                <span
                  className="font-bold uppercase tracking-[0.22em] text-[#971d13]"
                  style={{ fontSize: 'max(0.677vw, 11px)', whiteSpace: 'nowrap' }}
                >
                  {cat.label}
                </span>
                <div className="h-px flex-1 bg-[rgba(151,29,19,0.12)]" />
              </div>

              {/* Accordion items */}
              <div>
                {cat.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div
            className="mt-20 rounded-[6px] border border-[rgba(151,29,19,0.15)] bg-[#0d1410] p-8 text-center md:p-12"
            data-reveal
          >
            <p
              className="mb-2 font-bold uppercase tracking-[0.22em] text-[#971d13]"
              style={{ fontSize: 'max(0.677vw, 11px)' }}
            >
              Still have questions?
            </p>
            <h3
              className="mb-4 font-bold text-[#ffffff]"
              style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
            >
              We&apos;d love to hear from you.
            </h3>
            <p
              className="mb-8 leading-[1.75] text-[rgba(240,237,230,0.50)]"
              style={{ fontSize: 'max(0.9vw, 14px)' }}
            >
              Can&apos;t find your answer here? Reach out directly — we reply within 24 hours.
            </p>
            <a
              href="mailto:hello@capos.coffee"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: 'max(0.677vw, 11px)', letterSpacing: '0.12em' }}
            >
              hello@capos.coffee →
            </a>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="border-t border-[rgba(151,29,19,0.10)] px-5 py-8 sm:px-6 md:px-[3.9vw]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span
            className="font-bold uppercase tracking-[0.18em] text-[rgba(240,237,230,0.25)]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            CAPOS Coffee
          </span>
          <div className="flex flex-wrap gap-6">
            {[['Home', '/'], ['Catering', '/catering'], ['Terms', '/terms'], ['Privacy', '/privacy']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-bold uppercase tracking-[0.14em] text-[rgba(240,237,230,0.35)] transition-colors hover:text-[#971d13]"
                style={{ fontSize: 'max(0.677vw, 11px)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
