'use client';

import { useEffect, useRef } from 'react';
import './about.css';

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="c-about" ref={ref}>
      <div className="c-about-inner container">
        <div className="c-about-head">
          <p className="c-about-label t-h6">About CAPOS</p>
        </div>

        <div className="c-about-body">
          <h2 className="c-about-title t-h1">
            Crafted<br />
            with pass<i>i</i><i>o</i>n
          </h2>

          <div className="c-about-text">
            <div className="c-about-text-inner">
              <p className="t-text-lg">
                At CAPOS, we believe exceptional coffee begins with deep respect for the craft.
                Every bean is carefully selected from sustainable farms around the world.
              </p>
              <p className="t-text-lg" style={{ marginTop: '24px' }}>
                Our roasters work in small batches to ensure perfect development,
                bringing out the unique characteristics of each origin.
                From farm to cup, quality is our commitment.
              </p>
              <div className="c-about-values">
                <div className="c-about-value">
                  <span className="c-about-value-num">01</span>
                  <div>
                    <h4 className="t-h6">Sustainable</h4>
                    <p className="t-text" style={{ color: '#7f7f7f', marginTop: '8px' }}>100% ethically sourced</p>
                  </div>
                </div>
                <div className="c-about-value">
                  <span className="c-about-value-num">02</span>
                  <div>
                    <h4 className="t-h6">Small Batch</h4>
                    <p className="t-text" style={{ color: '#7f7f7f', marginTop: '8px' }}>Roasted for peak flavor</p>
                  </div>
                </div>
                <div className="c-about-value">
                  <span className="c-about-value-num">03</span>
                  <div>
                    <h4 className="t-h6">Artisanal</h4>
                    <p className="t-text" style={{ color: '#7f7f7f', marginTop: '8px' }}>15+ years of expertise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
