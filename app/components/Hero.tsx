'use client';

import { useEffect, useRef } from 'react';
import '../styles/hero.css';

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fade-in-up');
    }
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
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50+</span>
              <p>Unique Blends</p>
            </div>
            <div className="stat">
              <span className="stat-number">15</span>
              <p>Years Experience</p>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
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
