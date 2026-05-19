'use client';

import { useEffect, useRef } from 'react';
import '../styles/about.css';

export default function About() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.2 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content" ref={contentRef}>
          <div className="about-text">
            <h2>Crafted with Passion</h2>
            <p>
              At CAPOS, we believe that exceptional coffee begins with 
              a deep respect for the craft. Every bean is carefully selected 
              from sustainable farms around the world.
            </p>
            <p>
              Our roasters work in small batches to ensure perfect development, 
              bringing out the unique characteristics of each origin. From farm 
              to cup, quality is our commitment.
            </p>
            <button className="btn btn-primary">Learn More</button>
          </div>

          <div className="about-values">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainable</h3>
              <p>100% ethically sourced from certified farmers</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🔥</div>
              <h3>Small Batch</h3>
              <p>Roasted fresh in small quantities for peak flavor</p>
            </div>

            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Artisanal</h3>
              <p>Crafted by passionate roasters with 15+ years expertise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
