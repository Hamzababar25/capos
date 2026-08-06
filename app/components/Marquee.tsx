'use client';

import { useEffect, useState } from 'react';
import './marquee.css';

interface MarqueeProps {
  items?: string[];
  speed?: number;
  className?: string;
}

const defaultItems = [
  'Next Event',
  'Pakistan 🇵🇰 Day Parade',
  'Sunday, August 16',
  'Rain Date: August 23',
  'Oak Tree Road, Woodbridge & Edison, NJ',
];

/**
 * Editorial marquee — loads items from Sanity (Site Settings) when available.
 */
export default function Marquee({
  items: itemsProp,
  speed = 50,
  className = '',
}: MarqueeProps) {
  const [items, setItems] = useState<string[]>(itemsProp ?? defaultItems);

  useEffect(() => {
    if (itemsProp?.length) {
      setItems(itemsProp);
      return;
    }

    let cancelled = false;
    fetch('/api/site-content')
      .then((r) => r.json())
      .then((data: { marqueeItems?: string[] }) => {
        if (!cancelled && data.marqueeItems?.length) {
          setItems(data.marqueeItems);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [itemsProp]);

  const loop = [...items, ...items];

  return (
    <div className={`mq-strip ${className}`} aria-hidden="true">
      <div className="mq-track" style={{ animationDuration: `${speed}s` }}>
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="mq-item">
            <span className="mq-star" aria-hidden>
              ◆
            </span>
            <span className="mq-text">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
