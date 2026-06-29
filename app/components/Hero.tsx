'use client';

import { useEffect, useRef, useState } from 'react';
import '../styles/hero.css';

// ADDED: Animates a number from 0 to `target` over `duration` ms once `triggered` is true
function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return count;
}

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  // ADDED: Ref and state for triggering counter animation on visibility
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // ADDED: Animated counter values
  const count50 = useCountUp(50, 1500, statsVisible);
  const count15 = useCountUp(15, 1500, statsVisible);
  const count100 = useCountUp(100, 1500, statsVisible);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fade-in-up');
    }
  }, []);

  // ADDED: Observe stats section and trigger animation when it enters the viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-background gradient-bg"></div>

      <div className="hero-content container">
        <div className="hero-text" ref={titleRef}>
          <h1 className="hero-title">
            We craft<br />
            <span className="highlight">exceptional</span><br />
            coffee moments
          </h1>
          <p className="hero-subtitle">
            Premium single-origin & artisanal blends from around the world
          </p>
        </div>

        <div className="hero-footer">
          {/* CHANGED: added ref to trigger counter animation on visibility */}
          <div className="hero-stats" ref={statsRef}>
            <div className="stat">
              {/* CHANGED: animated from 0 → 50+ */}
              <span className="stat-number">{count50}+</span>
              <p>Unique Blends</p>
            </div>
            <div className="stat">
              {/* CHANGED: animated from 0 → 15 */}
              <span className="stat-number">{count15}</span>
              <p>Years Experience</p>
            </div>
            <div className="stat">
              {/* CHANGED: animated from 0 → 100% */}
              <span className="stat-number">{count100}%</span>
              <p>Ethically Sourced</p>
            </div>
          </div>

          <button className="btn btn-primary">Explore Collection</button>

          <div className="hero-scroll">
            <div className="scroll-indicator">
              <svg viewBox="0 0 34 106" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 1v60M8 76l9 9 9-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
