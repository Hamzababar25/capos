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
    title: 'Who We Are',
    body: `CAPOS Coffee is a mobile coffee cart catering service based in the Tri-State area. When we refer to "we", "us", or "our" in this policy, we mean CAPOS Coffee.\n\nIf you have questions about this Privacy Policy or how we handle your data, contact us at hello@capos.coffee.`,
  },
  {
    title: 'Information We Collect',
    body: `We collect information you voluntarily provide to us:\n\n• Contact information (name, email address, phone number)\n• Event details (date, venue, location, guest count, event type)\n• Message content you include in inquiries or notes\n• Email address if you subscribe to our newsletter\n\nWe do not collect payment card information directly. Any payments are processed through secure third-party payment processors.\n\nWhen you visit our website, we may also collect basic technical data such as your IP address, browser type, device type, and pages visited, through cookies and analytics tools.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We use the information you provide to:\n\n• Respond to your catering inquiry and confirm bookings\n• Communicate with you about your event before, during, and after\n• Send you confirmations, updates, and service information\n• Send our newsletter if you opted in (you can unsubscribe at any time)\n• Improve our website and services\n• Comply with legal obligations\n\nWe do not sell your personal information to any third party. Ever.`,
  },
  {
    title: 'Email Communications',
    body: `When you submit a catering inquiry, you will receive a confirmation email. This is a transactional email, not marketing, and you cannot opt out of it as it is necessary to confirm your request.\n\nIf you sign up for our newsletter, we will send you occasional updates about CAPOS: pop-up events, new menus, and stories from origin. You can unsubscribe from marketing emails at any time using the unsubscribe link in any email we send.`,
  },
  {
    title: 'Sharing Your Information',
    body: `We do not sell, trade, or share your personal information with third parties for their marketing purposes.\n\nWe may share information with trusted service providers who assist us in operating our website and delivering our services, such as email delivery services (Resend) and analytics platforms. These providers are contractually required to handle your data securely and only for the purpose of providing services to us.\n\nWe may also disclose information if required by law or to protect our rights and safety.`,
  },
  {
    title: 'Cookies & Analytics',
    body: `Our website may use cookies to improve your experience. Cookies are small text files stored on your device.\n\nWe may use analytics tools (such as Vercel Analytics or similar) to understand how visitors use our site. This data is aggregated and anonymised, so we cannot identify individual visitors from this data.\n\nYou can control cookie settings through your browser. Disabling cookies may affect some functionality of the website.`,
  },
  {
    title: 'Data Retention',
    body: `We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by law.\n\nInquiry and booking data is retained for up to 3 years after your event to maintain business records and handle any disputes.\n\nNewsletter subscription data is retained until you unsubscribe.\n\nYou may request deletion of your data at any time by emailing hello@capos.coffee.`,
  },
  {
    title: 'Your Rights',
    body: `Depending on your location, you may have rights regarding your personal data:\n\n• Right to access: request a copy of the data we hold about you\n• Right to correction: ask us to correct inaccurate data\n• Right to deletion: request deletion of your personal data\n• Right to withdraw consent: where processing is based on consent\n• Right to object: to certain types of processing\n\nTo exercise any of these rights, contact us at hello@capos.coffee. We will respond within 30 days.`,
  },
  {
    title: 'Data Security',
    body: `We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, or misuse.\n\nOur website is served over HTTPS. We use reputable third-party services with strong security practices for email and hosting.\n\nHowever, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.`,
  },
  {
    title: 'Third-Party Links',
    body: `Our website may contain links to third-party websites (such as social media profiles). This Privacy Policy applies only to the CAPOS Coffee website. We are not responsible for the privacy practices of any third-party sites you visit.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will update the "last updated" date at the top of this page. We encourage you to review this policy periodically.\n\nContinued use of our website or services after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: 'Contact Us',
    body: `For any privacy-related questions, data requests, or concerns:\n\nCAP OS Coffee\nEmail: hello@capos.coffee\nTristate Area, New York, USA`,
  },
];

export default function PrivacyPage() {
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
        titleLine1="Privacy"
        titleLine2="Policy"
        subtitle="Your privacy matters to us. This policy explains what we collect, how we use it, and what choices you have."
        lastUpdated={LAST_UPDATED}
        meta={[
          { value: '12',  label: 'Sections' },
          { value: '0',   label: 'Data sold' },
          { value: '30d', label: 'Response time' },
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
            Your privacy matters to us. This policy explains what information we collect when you use the CAPOS Coffee website or book our services, how we use it, and what choices you have.
          </p>

          {/* Sections */}
          {sections.map((s, i) => (
            <div key={s.title} className="mb-12 last:mb-0" data-reveal>
              <div className="mb-5 flex items-baseline gap-5">
                <span
                  className="shrink-0 font-bold tabular-nums text-[rgba(151,29,19,0.40)]"
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
              <div className="border-l-2 border-[rgba(151,29,19,0.18)] pl-6 md:pl-10">
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

          {/* Contact card */}
          <div
            className="mt-20 rounded-[6px] border border-[rgba(151,29,19,0.15)] bg-[#0d1410] p-8 text-center md:p-12"
            data-reveal
          >
            <p
              className="mb-2 font-bold uppercase tracking-[0.22em] text-[#971d13]"
              style={{ fontSize: 'max(0.677vw, 11px)' }}
            >
              Privacy questions?
            </p>
            <h3
              className="mb-4 font-bold text-[#ffffff]"
              style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}
            >
              We&apos;re here to help.
            </h3>
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
            {[['Home', '/'], ['FAQ', '/faq'], ['Terms', '/terms']].map(([label, href]) => (
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
