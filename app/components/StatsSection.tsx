'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './stats-section.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '5+', label: 'Years of\nmastery',      num: 5, suffix: '+'  },
  { value: '3',  label: 'Single-origin\nsources', num: 3, suffix: ''   },
  { value: '8000', label: 'Cups served\nworldwide', num: 8000,  suffix: '+' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const numbers  = section.querySelectorAll<HTMLElement>('.stats-value');
    const labels   = section.querySelectorAll('.stats-label');
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

        // ADDED: count each number from 0 to its target as it fades in
        numbers.forEach((el, i) => {
          const { num, suffix } = stats[i];
          const duration = 1500;
          let start: number | null = null;
          const tick = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * num) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
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
