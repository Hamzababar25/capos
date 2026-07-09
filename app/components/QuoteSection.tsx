'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoseFlourish, BeanFlourish } from './Flourishes';
import './quote-section.css';

gsap.registerPlugin(ScrollTrigger);

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const line   = section.querySelector('.quote-line');
    const text   = section.querySelector('.quote-text');
    const attr   = section.querySelector('.quote-attribution');
    const deco   = section.querySelector('.quote-deco');
    const img    = section.querySelector('.quote-image');

    gsap.set([deco, text, attr], { opacity: 0, y: 50 });
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(img, { opacity: 0, x: 40 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(line, { scaleX: 1, duration: 1.2, ease: 'expo.out' })
          .to(deco, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
          .to(text, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, '-=0.5')
          .to(attr, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.4')
          .to(img,  { opacity: 1, x: 0,  duration: 1.0, ease: 'expo.out' }, '-=1.0');

        const reveal = section.querySelector('.img-reveal');
        if (reveal) reveal.classList.add('is-revealed');
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section id="quote" className="quote-section" ref={sectionRef}>
      {/* Corner flourishes — subtle brand marks */}
      <RoseFlourish className="quote-flourish quote-flourish--rose" size={130} />
      <BeanFlourish className="quote-flourish quote-flourish--bean" size={22} />

      <div className="quote-line" aria-hidden="true" />
      <div className="quote-layout">
        <div className="quote-inner">
          <span className="quote-deco t-h6">Founder&apos;s Note</span>
          <blockquote className="quote-text t-display">
            &ldquo;At Capo’s, it’s more than what’s in your cup. Every drink is crafted with authentic Yemeni coffee, bold South Asian flavors, and timeless Italian influence. From intimate gatherings to grand celebrations, we bring an elevated coffee experience to every event.
          </blockquote>
          <div className="quote-attribution t-h6"> 
            - Founder           </div>
        </div>
        <div className="quote-image img-reveal">
          <video
            src="/fq-updated.mp4"
            className="quote-video img-reveal-target"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
