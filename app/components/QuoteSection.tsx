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

    gsap.set([deco, text, attr], { opacity: 0, y: 50 });
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(line, { scaleX: 1, duration: 1.2, ease: 'expo.out' })
          .to(deco, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
          .to(text, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, '-=0.5')
          .to(attr, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.4');
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className="quote-section" ref={sectionRef}>
      <div className="quote-line" aria-hidden="true" />
      <div className="quote-inner">
        <span className="quote-deco t-h6">Founder&apos;s Note</span>
        <blockquote className="quote-text t-display">
          &ldquo;Coffee is not a drink — it is a discipline. Every origin teaches patience,
          every roast demands presence. At CAPOS, we have chosen obsession over convenience,
          and ritual over routine.&rdquo;
        </blockquote>
        <div className="quote-attribution t-h6">
          — Ali Hassan, Founder · CAPOS Coffee, London 2009
        </div>
      </div>
    </section>
  );
}
