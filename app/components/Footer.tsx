'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const router   = useRouter();
  const pathname = usePathname();

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

    const circles  = footer.querySelector('.c-footer-circles');
    const title    = footer.querySelector('.c-footer-title');
    const contact  = footer.querySelector('.c-footer-col--contact');
    const colsRight= footer.querySelector('.c-footer-cols-right');
    const signup   = footer.querySelector('.c-footer-signup');
    const bottom   = footer.querySelector('.c-footer-bottom');

    const els = [circles, title, contact, colsRight, signup, bottom].filter(Boolean);
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
      {/* Large watermark */}
      <div className="c-footer-watermark" aria-hidden="true">CAPOS</div>

      <div className="c-footer-inner">
        {/* Head */}
        <div className="c-footer-head">
          <svg viewBox="0 0 36 18" width="36" height="18" fill="none" className="c-footer-circles">
            <circle cx="9"  cy="9" r="8.5" stroke="currentColor" strokeOpacity="0.3"/>
            <circle cx="18" cy="9" r="8.5" stroke="currentColor" strokeOpacity="0.3"/>
            <circle cx="27" cy="9" r="8.5" stroke="currentColor" strokeOpacity="0.3"/>
          </svg>
          <h2 className="c-footer-title t-h2">
            Your moments.<br/> <i>Capo’s way</i>
            {/* We w<i>o</i>uld l<i>o</i>ve t<i>o</i>&nbsp;hear fr<i>o</i>m you. */}
          </h2>
        </div>

        {/* Body */}
        <div className="c-footer-body">
          {/* Left — contact */}
          <div className="c-footer-col c-footer-col--contact">
            <p className="c-footer-muted t-text">
              Reach out for collaborations, wholesale enquiries, <br/>
              or simply a great cup of conversation.
            </p>
            <a href="mailto:hello@capos.coffee" className="c-footer-email">
              info@capos.com
              <span className="c-footer-arrow">→</span>
            </a>
          </div>

          {/* Right — columns */}
          <div className="c-footer-cols-right">
            {/* Address */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Our Address</h5>
              <address className="c-footer-address c-footer-muted t-text">
                CAPOS Coffee<br />
                New Jersy, USA<br />
                <span className="c-footer-coords">51.5074° N, 0.1278° W</span>
              </address>
            </div>

            {/* Social */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Follow</h5>
              <ul className="c-footer-socials">
                <li><a href="https://www.instagram.com/caposcoffee/" target='_blank' className="c-footer-social-link t-text">Instagram</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Twitter</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Facebook</a></li>
              </ul>
            </div>

            {/* Nav */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Navigate</h5>
              <ul className="c-footer-nav t-h6">
                <li><Link href="/"       className="c-footer-nav-link">Home</Link></li>
                <li><Link href="/catering" className="c-footer-nav-link">Catering</Link></li>
                <li><a href="#" className="c-footer-nav-link" onClick={scrollToSection('about')}>About</a></li>
                <li><a href="#" className="c-footer-nav-link" onClick={scrollToSection('booking')}>Book Event</a></li>
              </ul>
            </div>

            {/* Legal */}
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

        {/* Email signup */}
        <div className="c-footer-signup">
          <p className="c-footer-signup-label t-h6">Newsletter — Stories from origin</p>
          {submitted ? (
            <p className="c-footer-signup-thanks t-text">
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
                  {sending ? '…' : 'Subscribe'}
                </button>
              </form>
              {sendError && (
                <p style={{ marginTop: 8, fontSize: 12, color: 'rgba(220,80,60,0.85)' }}>
                  {sendError}
                </p>
              )}
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div className="c-footer-bottom">
          <span className="c-footer-muted t-text-sm">
            © CAPOS COFFEE 2025 · All rights reserved
          </span>
          <button className="c-footer-top-btn t-text-sm" onClick={scrollToTop}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
