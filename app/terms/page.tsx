'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LegalHero from '@/app/components/LegalHero';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LAST_UPDATED = 'July 1, 2025';

const sections = [
  {
    title: 'Acceptance of Terms',
    body: `By accessing the CAPOS Coffee website (capos.coffee) or engaging our catering services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.\n\nThese terms apply to all visitors, clients, and anyone who accesses or uses our services.`,
  },
  {
    title: 'Our Services',
    body: `CAPOS Coffee provides mobile coffee cart catering for private and corporate events in the Tri-State area (New York, New Jersey, Connecticut, and Pennsylvania). Our services include:\n\n• Setup and operation of a professional espresso and coffee bar at your event\n• Preparation of drinks from our signature and collaboration menus\n• Service staff for the duration of the agreed service window\n• All necessary equipment, ingredients, and consumables\n\nThe specific services, menu items, duration, and staffing will be confirmed in a written service agreement at the time of booking.`,
  },
  {
    title: 'Booking & Confirmation',
    body: `A booking is considered confirmed only upon:\n\n1. Receipt of a completed booking inquiry\n2. Written confirmation from CAPOS Coffee\n3. Payment of the required deposit\n\nCAP OS Coffee reserves the right to decline any booking request. Confirming an inquiry does not guarantee availability until a deposit has been received and a service agreement has been signed.`,
  },
  {
    title: 'Payment Terms',
    body: `A non-refundable deposit is required to secure your event date. The deposit amount will be specified in your service agreement and is typically a percentage of the total booking value.\n\nThe remaining balance is due no later than 7 days before the event date unless otherwise agreed in writing. Failure to complete payment by the due date may result in cancellation of your booking.`,
  },
  {
    title: 'Cancellation Policy',
    body: `Client cancellations must be submitted in writing to hello@capos.coffee.\n\n• Cancellations made more than 30 days before the event: deposit is fully refundable\n• Cancellations made 15–30 days before the event: 50% of the deposit will be refunded\n• Cancellations made fewer than 15 days before the event: deposit is non-refundable\n• Cancellations within 48 hours of the event: the full booking value may be charged\n\nCAP OS Coffee reserves the right to cancel a booking in the event of force majeure (severe weather, illness, or other circumstances beyond our control). In such cases, a full refund of all payments will be issued.`,
  },
  {
    title: 'Client Responsibilities',
    body: `The client is responsible for:\n\n• Providing accurate event information (date, time, venue, guest count)\n• Ensuring access to a standard 120V power outlet at the venue\n• Notifying CAPOS Coffee of any venue restrictions, permit requirements, or access limitations at least 14 days before the event\n• Ensuring a safe and suitable working environment for our staff\n\nCAP OS Coffee is not liable for service delays or inability to operate caused by the client's failure to meet these responsibilities.`,
  },
  {
    title: 'Limitation of Liability',
    body: `CAPOS Coffee's liability is limited to the total value paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages arising from our services or any inability to provide services.\n\nWe take every precaution to ensure food safety and hygiene standards. Clients with known allergies or dietary restrictions must inform us at the time of booking. CAPOS Coffee cannot guarantee allergen-free environments.`,
  },
  {
    title: 'Intellectual Property',
    body: `All content on this website — including text, images, graphics, logos, and design elements — is the property of CAPOS Coffee and is protected by applicable intellectual property laws.\n\nYou may not reproduce, distribute, or use any content from this website without prior written permission from CAPOS Coffee.`,
  },
  {
    title: 'Governing Law',
    body: `These Terms of Service are governed by and construed in accordance with the laws of the State of New York, United States. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of New York.`,
  },
  {
    title: 'Changes to These Terms',
    body: `CAPOS Coffee reserves the right to update these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes constitutes acceptance of the revised terms.`,
  },
  {
    title: 'Contact',
    body: `For questions about these Terms of Service, please contact us:\n\nCAP OS Coffee\nEmail: hello@capos.coffee\nTristate Area, New York`,
  },
];

export default function TermsPage() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = bodyRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(els, { opacity: 0, y: 24 });
    els.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out' }),
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <LegalHero
        eyebrow="Legal"
        titleLine1="Terms of"
        titleLine2="Service"
        subtitle="These terms govern your use of our website and catering services. Please read them before booking."
        lastUpdated={LAST_UPDATED}
        meta={[
          { value: '11',  label: 'Sections' },
          { value: '30d', label: 'Cancellation window' },
        ]}
      />

      <div className="bg-[#080d0a]">
      {/* Content */}
      <section ref={bodyRef} className="px-5 py-20 sm:px-6 md:px-[3.9vw] md:py-28">
        <div className="mx-auto max-w-[760px]">
          {/* Intro */}
          <p
            className="mb-16 leading-[1.85] text-[rgba(240,237,230,0.55)]"
            style={{ fontSize: 'max(1vw, 15px)' }}
            data-reveal
          >
            Please read these Terms of Service carefully before using the CAPOS Coffee website or booking our catering services. These terms govern your use of our service and form the basis of our relationship with you.
          </p>

          {/* Sections */}
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="mb-12 last:mb-0"
              data-reveal
            >
              <div className="mb-5 flex items-baseline gap-5">
                <span
                  className="shrink-0 font-bold tabular-nums text-[rgba(200,146,42,0.40)]"
                  style={{ fontSize: 'max(0.677vw, 11px)', letterSpacing: '0.14em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2
                  className="m-0 font-bold text-[#ffffff]"
                  style={{ fontSize: 'clamp(17px, 1.4vw, 22px)', letterSpacing: '-0.01em' }}
                >
                  {s.title}
                </h2>
              </div>
              <div className="border-l-2 border-[rgba(200,146,42,0.18)] pl-6 md:pl-10">
                {s.body.split('\n\n').map((para, j) => (
                  <p
                    key={j}
                    className="mb-4 last:mb-0 leading-[1.85] text-[rgba(240,237,230,0.55)] whitespace-pre-line"
                    style={{ fontSize: 'max(0.9vw, 14px)' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <div className="border-t border-[rgba(200,146,42,0.10)] px-5 py-8 sm:px-6 md:px-[3.9vw]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span
            className="font-bold uppercase tracking-[0.18em] text-[rgba(240,237,230,0.25)]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            CAPOS Coffee
          </span>
          <div className="flex flex-wrap gap-6">
            {[['Home', '/'], ['FAQ', '/faq'], ['Privacy', '/privacy']].map(([label, href]) => (
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
