'use client';

import './marquee.css';

interface MarqueeProps {
  items?: string[];
  speed?: number;
  className?: string;
}

const defaultItems = [
  '40+ Events Poured',
  'NY · NJ · CT · PA',
  'By Invitation',
  'Est. 2025',
  'Handcrafted On-Site',
  'A Marriage of Cultures',
  'Yemeni · Italian · South Asian',
  'Tri-State Area',
];

/**
 * Editorial marquee — auto-scrolling text strip.
 * Pauses on hover. Respects prefers-reduced-motion.
 */
export default function Marquee({
  items = defaultItems,
  speed = 50,
  className = '',
}: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className={`mq-strip ${className}`} aria-hidden="true">
      <div
        className="mq-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((item, i) => (
          <span key={i} className="mq-item">
            <span className="mq-star" aria-hidden>◆</span>
            <span className="mq-text">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
