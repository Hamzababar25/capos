'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const circles = footer.querySelector('.c-footer-circles');
    const title = footer.querySelector('.c-footer-title');
    const contact = footer.querySelector('.c-footer-col--contact');
    const colsRight = footer.querySelector('.c-footer-cols-right');
    const bottom = footer.querySelector('.c-footer-bottom');

    const els = [circles, title, contact, colsRight, bottom].filter(Boolean);

    gsap.set(els, { y: 50, opacity: 0 });

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(els, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'expo.out',
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <footer id="contact" className="c-footer" ref={footerRef}>
      <div className="c-footer-inner">
        {/* Head */}
        <div className="c-footer-head">
          <svg viewBox="0 0 36 18" width="36" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" className="c-footer-circles">
            <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
            <circle cx="18" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
            <circle cx="27" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
          </svg>
          <h2 className="c-footer-title t-h2">
            We w<i>o</i>uld l<i>o</i>ve t<i>o</i>&nbsp;hear fr<i>o</i>m you.
          </h2>
        </div>

        {/* Body */}
        <div className="c-footer-body">
          {/* Left — contact */}
          <div className="c-footer-col c-footer-col--contact">
            <p className="c-footer-gray t-text">
              Feel free to reach out if you want to collaborate with us, or simply have a chat.
            </p>
            <a href="mailto:hello@capos.coffee" className="c-footer-email t-h5">
              hello@capos.coffee <span className="c-footer-arrow">→</span>
            </a>
          </div>

          {/* Right — columns */}
          <div className="c-footer-cols-right">
            {/* Address */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Our Address</h5>
              <address className="c-footer-address c-footer-gray t-text">
                CAPOS Coffee<br />
                London, United Kingdom<br />
                <br />
                hello@capos.coffee
              </address>
            </div>

            {/* Social */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Follow Us</h5>
              <ul className="c-footer-socials">
                <li><a href="#" className="c-footer-social-link t-text">Ig</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Tw</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Fb</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Li</a></li>
              </ul>
            </div>

            {/* Nav */}
            <div className="c-footer-col">
              <ul className="c-footer-nav t-h6">
                <li><Link href="/" className="c-footer-nav-link">Home</Link></li>
                <li><a href="#work" className="c-footer-nav-link">Work</a></li>
                <li><a href="#about" className="c-footer-nav-link">About</a></li>
                <li><a href="#contact" className="c-footer-nav-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="c-footer-bottom">
          <span className="c-footer-gray t-text-sm">
            © CAPOS COFFEE 2024 All rights reserved
          </span>
          <button className="c-footer-top-btn t-text-sm" onClick={scrollToTop}>
            top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
