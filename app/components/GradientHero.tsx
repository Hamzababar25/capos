'use client';

import { useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import './hero.css';
import gsap from 'gsap';
import { scrambleText } from '../lib/textScramble';


export default function GradientHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cancelScrambleRef = useRef<(() => void) | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate scroll progress (0 to 1) based on first viewport
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // GSAP cinematic text reveal on mount
  useEffect(() => {
    const lines    = document.querySelectorAll('.pixi-intro-line');
    const eyebrow  = document.querySelector('.pixi-intro-eyebrow');
    const sub      = document.querySelector('.pixi-intro-sub');
    const cta      = document.querySelector('.pixi-intro-cta');
    const foot     = document.querySelector('.pixi-intro-foot');
    const nav      = document.querySelector('.c-header');

    gsap.set(nav,     { y: -20, opacity: 0 });
    gsap.set(eyebrow, { y: 20, opacity: 0 });
    gsap.set(lines,   { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
    gsap.set(sub,     { y: 20, opacity: 0 });
    gsap.set(cta,     { y: 20, opacity: 0 });
    gsap.set(foot,    { y: 30, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(nav, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' })
      .to(eyebrow, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .to(lines,   {
        y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
        duration: 1.1, stagger: 0.11, ease: 'expo.out',
      }, '-=0.35')
      .to(sub,  { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .to(cta,  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to(foot, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.55');
  }, []);

  /* Text scramble on hero line hover */
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lines = title.querySelectorAll<HTMLElement>('.pixi-intro-line');

    const onEnter = (line: HTMLElement) => {
      const hover = line.querySelector<HTMLElement>('.hero-flip-hover');
      if (!hover) return;

      const finalText = hover.textContent?.trim() ?? '';
      if (!finalText) return;

      cancelScrambleRef.current?.();
      cancelScrambleRef.current = scrambleText(hover, finalText, 380);
    };

    const onLeave = (line: HTMLElement) => {
      const hover = line.querySelector<HTMLElement>('.hero-flip-hover');
      if (!hover) return;

      cancelScrambleRef.current?.();
      cancelScrambleRef.current = null;
      hover.textContent = hover.getAttribute('data-text') ?? hover.textContent;
    };

    const cleanups: (() => void)[] = [];

    lines.forEach((line) => {
      const hover = line.querySelector<HTMLElement>('.hero-flip-hover');
      if (hover && !hover.getAttribute('data-text')) {
        hover.setAttribute('data-text', hover.textContent?.trim() ?? '');
      }

      const enter = () => onEnter(line);
      const leave = () => onLeave(line);
      line.addEventListener('mouseenter', enter);
      line.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        line.removeEventListener('mouseenter', enter);
        line.removeEventListener('mouseleave', leave);
      });
    });

    return () => {
      cancelScrambleRef.current?.();
      cleanups.forEach((fn) => fn());
    };
  }, []);


  return (
    <section id="hero" className="pixi-intro" ref={sectionRef}>
      {/* Navigation - part of hero */}
      <Navigation />
      
      {/* Background video — poster prevents the black flash before first frame loads */}
      <video
        className="pixi-intro-canvas"
        src="/hero-section.mp4"
        poster="/logo.png"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="pixi-intro-video-veil" />

      {/* Interactive cursor circle */}
      <div 
        className="cursor-circle"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Content */}
      <div 
        className="pixi-intro-inner"
        style={{
          transform: `translateY(${scrollProgress * 100}px)`,
          opacity: 1 - scrollProgress * 0.5,
        }}
      >
        <div className="pixi-intro-center">
          <div className="pixi-intro-text">
            <div className="pixi-intro-eyebrow t-h6">
              <span>Coffee Cart</span>
              <span className="pixi-intro-eyebrow-dot" aria-hidden="true" />
              <span>Tri-State Area</span>
              <span className="pixi-intro-eyebrow-dot" aria-hidden="true" />
              <span>Est. 2025</span>
            </div>
            <h1
              ref={titleRef}
              className="pixi-intro-title t-h1"
              style={{
                transform: `scale(${1 + scrollProgress * 0.4})`,
                opacity: 1 - scrollProgress,
              }}
              role="heading"
              aria-level={1}
            >
              {/* Line 1 — hover reveals: WELCOME */}
              <span className="pixi-intro-line pixi-intro-line--1">
                <span className="hero-flip">
                  <span className="hero-flip-default">CAPO'S</span>
                  <span className="hero-flip-hover hero-flip-hover--en" aria-hidden="true">
                    WELCOME
                  </span>
                </span>
              </span>

              {/* Line 2 — hover reveals: مرحباً (Arabic) */}
              <span className="pixi-intro-line pixi-intro-line--2">
                <span className="hero-flip">
                  <span className="hero-flip-default">COFFEE</span>
                  <span className="hero-flip-hover hero-flip-hover--ar" lang="ar" dir="rtl" aria-hidden="true">
                    مرحباً
                  </span>
                </span>
              </span>

              {/* Line 3 — hover reveals: BENVENUTO (Italian) */}
              <span className="pixi-intro-line pixi-intro-line--3">
                <span className="hero-flip">
                  <span className="hero-flip-default">EST. 2025</span>
                  <span className="hero-flip-hover hero-flip-hover--it" lang="it" aria-hidden="true">
                    BENVENUTO
                  </span>
                </span>
              </span>
            </h1>
            <p className="pixi-intro-sub t-text-lg">
              Handcrafted espresso experiences,
              tailored to every occasion.
            </p>
            <a
              href="#booking"
              className="pixi-intro-cta btn-primary pointer-events-auto px-7 py-3.5 text-xs tracking-[0.12em] opacity-0"
            >
              <span>Book Your Event</span>
              <span className="pixi-intro-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div 
          className="pixi-intro-foot"
          style={{
            opacity: 1 - scrollProgress * 1.5,
            transform: `translateY(${scrollProgress * 50}px)`,
          }}
        >
          <div className="pixi-intro-foot-row">
            <div className="pixi-intro-foot-circles">
              <svg viewBox="0 0 54 18" width="54" height="18" fill="none">
                <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
                <circle cx="27" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
                <circle cx="45" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
              </svg>
            </div>

            <div className="pixi-intro-foot-items">
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>New Jersey</strong>
                <span className="pixi-intro-foot-sub">40.7375° N, 0.1278° W</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Sumatran Beans</strong>
                <span className="pixi-intro-foot-sub">ethically sourced</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Italian Touch</strong>
                <span className="pixi-intro-foot-sub">roasted to order</span>
              </div>
            </div>

            <div className="pixi-intro-scroll-wrap">
              <svg viewBox="0 0 17 52" width="17" height="52" fill="none" aria-label="Scroll down indicator">
                <line x1="8.5" y1="0" x2="8.5" y2="42" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                <path d="M2 38 L8.5 52 L15 38" stroke="white" strokeOpacity="0.4" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
