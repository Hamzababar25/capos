'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className="quote-section" ref={sectionRef}>
      <div className="quote-line" aria-hidden="true" />
      <div className="quote-layout">
        <div className="quote-inner">
          <span className="quote-deco t-h6">Founder&apos;s Note</span>
          <blockquote className="quote-text t-display">
            &ldquo;At Capo’s, <br/> it’s more than just what’s in your cup. We pride ourselves in serving you a marriage of cultures and heritage. Our team is inspired by the rich traditions we come from, and we’re passionate about presenting you with the ultimate cup.
          We pride ourselves on putting quality and uniqueness first, offering a blend of bold South Asian flavors, authentic Yemeni style coffee, and timeless Italian recipes. Whether it’s an intimate gathering or a grand celebration, Capo’s Coffee brings a one of a kind experience straight to you at your service.
        With love,<br/>
  &rdquo;
  - Capo
          </blockquote>
          <div className="quote-attribution t-h6"> 
            - Founder · CAPOS Coffee, 
            <br/> New York 2025
          </div>
        </div>
        <div className="quote-image">
          <video
            src="/founders.mp4"
            className="quote-video"
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
