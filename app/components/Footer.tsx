'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Marquee from './Marquee';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

const footerMarqueeItems = [
  'Available for Booking',
  '2026 Season Open',
  'NY · NJ · CT · PA · Beyond',
  'Handcrafted On-Site',
  'Est. 2025',
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const router    = useRouter();
  const pathname  = usePathname();

  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      sessionStorage.setItem('scrollTo', sectionId);
      router.push('/');
    }
  };

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
      setEmail('');
    } catch {
      setSendError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const head    = footer.querySelector('.c-footer-head');
    const contact = footer.querySelector('.c-footer-col--contact');
    const cols    = footer.querySelector('.c-footer-cols-right');
    const signup  = footer.querySelector('.c-footer-signup');
    const bottom  = footer.querySelector('.c-footer-bottom');

    const els = [head, contact, cols, signup, bottom].filter(Boolean);
    gsap.set(els, { y: 50, opacity: 0 });

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(els, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'expo.out' });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <footer id="contact" className="c-footer" ref={footerRef}>
      {/* ── Marquee at the top of the footer ── */}
      <div className="c-footer-marquee">
        <Marquee items={footerMarqueeItems} speed={45} />
      </div>

      {/* ── Massive watermark ── */}
      <div className="c-footer-watermark" aria-hidden="true">CAPO&apos;S</div>

      <div className="c-footer-inner">
        {/* Head — editorial statement */}
        <div className="c-footer-head">
          <div className="c-footer-head-eyebrow">
            <span className="c-footer-head-dot" aria-hidden />
            <span></span>
            <span className="c-footer-head-rule" aria-hidden />
          </div>
          <h2 className="c-footer-title t-h2">
            Your moments.<br /> <i>Capo&apos;s way</i>
          </h2>
          <p className="c-footer-tagline">
            Coffee cart catering, poured with intention for events across
            the Tri-State area and Pennsylvania.
          </p>
        </div>

        {/* Body — 4 columns */}
        <div className="c-footer-body">
          <div className="c-footer-col c-footer-col--contact">
            <p className="c-footer-muted t-text">
              Reach out for collaborations, wholesale enquiries, <br />
              or simply a great cup of conversation.
            </p>
            <a href="mailto:hello@capos.coffee" className="c-footer-email">
              info@capos.com
              <span className="c-footer-arrow">→</span>
            </a>
          </div>

          <div className="c-footer-cols-right">
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Studio</h5>
              <address className="c-footer-address c-footer-muted t-text">
                CAPOS Coffee<br />
                New Jersey, USA<br />
                <span className="c-footer-coords">40.0583° N · 74.4057° W</span>
              </address>
            </div>

            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Follow</h5>
              <ul className="c-footer-socials">
                <li>
                  <a
                    href="https://www.instagram.com/caposcoffee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-footer-social-link t-text"
                  >
                    <span>Instagram</span>
                    <span className="c-footer-arrow">→</span>
                    {/* <span className="c-footer-social-arrow" aria-hidden>↗</span> */}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/capos-coffee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-footer-social-link t-text"
                  >
                    <span>LinkedIn</span>
                    <span className="c-footer-arrow">→</span>
                    {/* <span className="c-footer-social-arrow" aria-hidden>↗</span> */}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61591468595806"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-footer-social-link t-text"
                  >
                    <span>Facebook</span>
                    <span className="c-footer-arrow">→</span>
                    {/* <span className="c-footer-social-arrow" aria-hidden>↗</span> */}
                  </a>
                </li>
              </ul>
            </div>

            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Navigate</h5>
              <ul className="c-footer-nav t-h6">
                <li><Link href="/"         className="c-footer-nav-link">Home</Link></li>
                <li><Link href="/catering" className="c-footer-nav-link">Catering</Link></li>
                <li><Link href="/moments"  className="c-footer-nav-link">Moments</Link></li>
                <li><Link href="/shop" className="c-footer-nav-link">Shop</Link></li>
                <li><a href="#" className="c-footer-nav-link" onClick={scrollToSection('about')}>About</a></li>
                <li><a href="#" className="c-footer-nav-link" onClick={scrollToSection('booking')}>Book Event</a></li>
              </ul>
            </div>

            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Legal</h5>
              <ul className="c-footer-nav t-h6">
                <li><Link href="/faq"     className="c-footer-nav-link">FAQ</Link></li>
                <li><Link href="/terms"   className="c-footer-nav-link">Terms</Link></li>
                <li><Link href="/privacy" className="c-footer-nav-link">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter card — visually prominent */}
        <div className="c-footer-signup">
          <div className="c-footer-signup-head">
            <span className="c-footer-signup-eyebrow t-h6">Newsletter</span>
            {/* <h3 className="c-footer-signup-title">
              Stories from <i>origin</i>.
            </h3> */}
            <p className="c-footer-signup-desc">
              Rare beans, seasonal drops and the occasional invitation.
            </p>
          </div>

          {submitted ? (
            <p className="c-footer-signup-thanks t-text">
              <span className="c-footer-signup-check" aria-hidden>✓</span>
              Thank you. We&apos;ll be in touch.
            </p>
          ) : (
            <>
              <form className="c-footer-signup-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="c-footer-signup-input t-text"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={sending}
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="c-footer-signup-btn btn-primary"
                  disabled={sending}
                  style={{ opacity: sending ? 0.6 : 1 }}
                >
                  {sending ? '…' : 'Subscribe →'}
                </button>
              </form>
              {sendError && (
                <p className="c-footer-signup-error">
                  {sendError}
                </p>
              )}
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div className="c-footer-bottom">
          <div className="c-footer-bottom-left">
            <span className="c-footer-muted t-text-sm">
              © 2025 · CAPOS Coffee LLC· All rights reserved
            </span>
            <br/>
            <span className="c-footer-signature t-text-sm">
              Crafted <span className="c-footer-signature-heart" aria-hidden></span> in New Jersey
            </span>
          </div>

          <button className="c-footer-top-btn t-text-sm" onClick={scrollToTop} aria-label="Back to top">
            <span>Back to top</span>
            <span className="c-footer-top-arrow" aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
