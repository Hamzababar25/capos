'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './about.css';

gsap.registerPlugin(ScrollTrigger);

interface Slide {
  id: number;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
}

const slides: Slide[] = [
  {
    id: 1,
    num: '01',
    title: 'Your event \n Capo’s way',
    subtitle: 'Any time. Any place.',
    description:
      'Whether it’s a wedding, corporate event, or private celebration, Capo’s Coffee adds a touch of elegance with café quality beverages and an unforgettable guest experience.',
    image: '/capos1.PNG',
    tag: 'Origin',
  },
  {
    id: 2,
    num: '02',
    title: 'Collaboration \n Events',
    subtitle: 'Exceptional brands - exceptional experiences',
    description:
      'We love collaborating with brands, boutiques, fitness studios, grand openings, and community events open to public to bring people together over exceptional coffee and memorable experiences.',
    image: '/collab.jpeg',
    tag: 'Roast',
  },
  {
    id: 3,
    num: '03',
    title: 'Artisanal\nExcellence',
    subtitle: '5+ Years of Expertise',
    description:
      'Passion meets craft in every roast. Years of experience, constant innovation, deep respect for coffee tradition ,this is what CAPOS is made of.',
    image: '/capos4.jpg',
    tag: 'Craft',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll-triggered entrance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const eyebrow = section.querySelector('.c-about-eyebrow');
    const content  = section.querySelector('.c-about-left');
    const imagery  = section.querySelector('.c-about-right');
    const progress = section.querySelector('.c-about-progress-wrap');

    gsap.set([eyebrow, content, progress], { y: 50, opacity: 0 });
    gsap.set(imagery, { x: 60, opacity: 0 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(eyebrow,  { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
          .to(content,  { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' }, '-=0.7')
          .to(imagery,  { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, '-=0.9')
          .to(progress, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.9');
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Auto-advance with progress bar
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Animate progress bar width reset on slide change
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 5s linear';
        bar.style.width = '100%';
      });
    });
  }, [currentSlide]);

  const goTo = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    startInterval();
    setTimeout(() => setIsAnimating(false), 900);
  };

  const prev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
  const next = () => goTo((currentSlide + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section id="about" className="c-about" ref={sectionRef}>
      {/* Section header */}
      <div className="c-about-header">
        <span className="c-about-eyebrow t-h6">About CAPOS</span>
        <div className="c-about-header-line" aria-hidden="true" />
      </div>

      {/* Main two-column layout */}
      <div className="c-about-body">
        {/* LEFT — text */}
        <div className="c-about-left">
          <div className="c-about-slide-num t-h6" aria-hidden="true">
            {slide.num} <span>/ {slides.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="c-about-text-panel">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className={`c-about-slide-content ${i === currentSlide ? 'is-active' : i < currentSlide ? 'is-prev' : 'is-next'}`}
              >
                <h2 className="c-about-slide-title">{s.title}</h2>
                <p className="c-about-slide-sub t-h6">{s.subtitle}</p>
                <p className="c-about-slide-desc t-text-lg">{s.description}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="c-about-controls">
            <button className="c-about-arrow" onClick={prev} aria-label="Previous">
              <span>←</span>
            </button>
            <button className="c-about-arrow" onClick={next} aria-label="Next">
              <span>→</span>
            </button>
            <div className="c-about-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`c-about-dot${i === currentSlide ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — image stack */}
        <div className="c-about-right">
          <div className="c-about-image-track">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className={`c-about-image-frame ${i === currentSlide ? 'is-active' : i < currentSlide ? 'is-prev' : 'is-next'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} loading="lazy" />
                <div className="c-about-image-overlay">
                  <span className="c-about-image-tag t-h6">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="c-about-progress-wrap">
        <div className="c-about-progress-track">
          <div className="c-about-progress-bar" ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
