'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
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
            We w<i>o</i>uld l<i>o</i>ve t<i>o</i>&nbsp;hear fr<i>o</i>m you.
          </h2>
        </div>

        {/* Body */}
        <div className="c-footer-body">
          {/* Left — contact */}
          <div className="c-footer-col c-footer-col--contact">
            <p className="c-footer-muted t-text">
              Reach out for collaborations, wholesale enquiries, or simply a great cup of conversation.
            </p>
            <a href="mailto:hello@capos.coffee" className="c-footer-email">
              hello@capos.coffee
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
                London, United Kingdom<br />
                <span className="c-footer-coords">51.5074° N, 0.1278° W</span>
              </address>
            </div>

            {/* Social */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Follow</h5>
              <ul className="c-footer-socials">
                <li><a href="#" className="c-footer-social-link t-text">Instagram</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Twitter</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Facebook</a></li>
              </ul>
            </div>

            {/* Nav */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Navigate</h5>
              <ul className="c-footer-nav t-h6">
                <li><Link href="/"        className="c-footer-nav-link">Home</Link></li>
                <li><a   href="#work"     className="c-footer-nav-link">Work</a></li>
                <li><a   href="#about"    className="c-footer-nav-link">About</a></li>
                <li><a   href="#contact"  className="c-footer-nav-link">Contact</a></li>
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
            <form className="c-footer-signup-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="c-footer-signup-input t-text"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button type="submit" className="c-footer-signup-btn btn-primary">
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="c-footer-bottom">
          <span className="c-footer-muted t-text-sm">
            © CAPOS COFFEE 2024 · All rights reserved
          </span>
          <button className="c-footer-top-btn t-text-sm" onClick={scrollToTop}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
