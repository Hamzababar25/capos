'use client';

import { useEffect, useState } from 'react';
import './section-labels.css';

interface Section {
  id: string;
  label: string;
}

const defaultSections: Section[] = [
  { id: 'hero',    label: 'Prelude' },
  { id: 'about',   label: 'About' },
  { id: 'stats',   label: 'Craft' },
  { id: 'quote',   label: 'Ethos' },
  { id: 'booking', label: 'Booking' },
];

/**
 * Vertical sticky section labels on the left rail.
 * Highlights the section currently in view. Desktop only.
 */
export default function SectionLabels({
  sections = defaultSections,
}: { sections?: Section[] } = {}) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="sl-rail" aria-label="Section navigation">
      <ul className="sl-list">
        {sections.map((s, i) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="sl-item">
              <button
                type="button"
                className={`sl-btn${isActive ? ' is-active' : ''}`}
                onClick={() => scrollTo(s.id)}
                aria-label={`Jump to ${s.label} section`}
              >
                <span className="sl-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="sl-dash" aria-hidden />
                <span className="sl-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
