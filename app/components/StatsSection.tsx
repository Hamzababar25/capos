'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './stats-section.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '15+',  label: 'Years of\nmastery' },
  { value: '12',   label: 'Single-origin\nsources' },
  { value: '3M+',  label: 'Cups served\nworldwide' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const numbers = section.querySelectorAll('.stats-value');
    const labels  = section.querySelectorAll('.stats-label');
    const dividers = section.querySelectorAll('.stats-divider');

    gsap.set([numbers, labels, dividers], { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(dividers, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'expo.out' });
        gsap.to(numbers,  { opacity: 1, y: 0, duration: 1,   stagger: 0.15, ease: 'expo.out', delay: 0.1 });
        gsap.to(labels,   { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out', delay: 0.2 });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-eyebrow t-h6">By the numbers</div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stats-item" key={i}>
            {i > 0 && <div className="stats-divider" aria-hidden="true" />}
            <span className="stats-value">{s.value}</span>
            <span className="stats-label t-h6">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
