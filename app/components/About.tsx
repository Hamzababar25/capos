'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './about.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ─────────────────────────────────────────── */

interface Chapter {
  id: number;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const chapters: Chapter[] = [
  {
    id: 1,
    num: '01',
    tag: 'Origin',
    title: 'Your event,\nCapo’s way.',
    subtitle: 'Any time · Any place',
    description:
      'Whether it’s a wedding, corporate event, or private celebration, Capo’s Coffee adds a touch of elegance with café-quality beverages and an unforgettable guest experience.',
    image: '/momento.jpg',
  },
  {
    id: 2,
    num: '02',
    tag: 'Collaboration',
    title: 'Brand meets\nbrew.',
    subtitle: 'Exceptional brands, exceptional experiences',
    description:
      'We love collaborating with brands, boutiques, fitness studios, grand openings and community events to bring people together over exceptional coffee and memorable experiences.',
    image: '/collab.jpeg',
  },
  {
    id: 3,
    num: '03',
    tag: 'Craft',
    title: 'Artisanal\nexcellence.',
    subtitle: 'Years of expertise, distilled',
    description:
      'Passion meets craft in every roast. Years of experience, constant innovation, and a deep respect for coffee tradition this is what CAPOS is made of.',
    image: '/capos4.jpg',
  },
  // {
  //   id: 4,
  //   num: '04',
  //   tag: 'Vision',
  //   title: 'Every cup,\na new story.',
  //   subtitle: 'Tri-State · Pennsylvania · Beyond',
  //   description:
  //     'From intimate morning rituals to grand celebrations, we pour with intention building a coffee culture that honours heritage while pushing what a mobile cart can be.',
  //   image: '/capos-3.PNG',
  // },
];

/* ── Component ───────────────────────────────────── */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  /* Pinned split-scroll: vertical scroll -> chapter advance */
  useEffect(() => {
    const section = sectionRef.current;
    const pin     = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();

    /* Desktop / tablet — pinned narrative */
    mm.add(
      {
        isDesktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean };
        if (!isDesktop) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end:   () => `+=${window.innerHeight * chapters.length * 0.85}`,
          pin: pin,
          pinSpacing: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(
              chapters.length - 1,
              Math.floor(p * chapters.length * 0.999)
            );
            setActiveIdx(idx);
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleY(${p})`;
            }
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  /* Mobile fallback: manual advance every 6s, respects reduced motion */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia('(min-width: 900px)').matches;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isDesktop || rm) return;

    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % chapters.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const active = chapters[activeIdx];

  return (
    <section id="about" className="c-about" ref={sectionRef}>
      {/* Pinned wrapper — becomes the full viewport during scroll */}
      <div className="c-about-pin" ref={pinRef}>
        {/* Header rail across the top */}
        <div className="c-about-header">
          <span className="c-about-eyebrow t-h6">About CAPOS</span>
          <div className="c-about-header-rule" aria-hidden />
          <span className="c-about-counter t-h6">
            <span className="c-about-counter-current">
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            <span className="c-about-counter-sep">—</span>
            <span className="c-about-counter-total">
              {String(chapters.length).padStart(2, '0')}
            </span>
          </span>
        </div>

        {/* Main split body — text left, image right */}
        <div className="c-about-body">
          {/* LEFT — chapter text stack */}
          <div className="c-about-text">
            <div className="c-about-stage">
              {chapters.map((ch, i) => (
                <article
                  key={ch.id}
                  className={`c-about-chapter${
                    i === activeIdx
                      ? ' is-active'
                      : i < activeIdx
                      ? ' is-prev'
                      : ' is-next'
                  }`}
                  aria-hidden={i !== activeIdx}
                >
                  <span className="c-about-chapter-num t-h6">
                    Chapter {ch.num}
                  </span>
                  <h2 className="c-about-chapter-title">
                    {ch.title.split('\n').map((line, li) => (
                      <span key={li} className="c-about-chapter-line">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="c-about-chapter-sub">{ch.subtitle}</p>
                  <p className="c-about-chapter-desc">{ch.description}</p>
                </article>
              ))}
            </div>

            {/* Chapter nav dots (also acts as jump-to on desktop) */}
            <div className="c-about-nav">
              {chapters.map((ch, i) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`c-about-nav-btn${
                    i === activeIdx ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Chapter ${i + 1}: ${ch.tag}`}
                >
                  <span className="c-about-nav-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="c-about-nav-label">{ch.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — pinned image stack */}
          <div className="c-about-visual">
            <div className="c-about-visual-frame">
              {chapters.map((ch, i) => (
                <div
                  key={ch.id}
                  className={`c-about-visual-slide${
                    i === activeIdx
                      ? ' is-active'
                      : i < activeIdx
                      ? ' is-prev'
                      : ' is-next'
                  }`}
                  aria-hidden={i !== activeIdx}
                >
                  <Image
                    src={ch.image}
                    alt={ch.title.replace('\n', ' ')}
                    fill
                    sizes="(max-width: 899px) 100vw, 50vw"
                    className="c-about-visual-img"
                    priority={i === 0}
                  />
                  <div className="c-about-visual-overlay" aria-hidden />
                </div>
              ))}

              {/* Floating tag badge — updates with active chapter */}
              <div className="c-about-visual-tag t-h6">
                <span className="c-about-visual-tag-dot" aria-hidden />
                {active.tag}
              </div>

              {/* Corner brackets — editorial framing */}
              <span className="c-about-bracket c-about-bracket--tl" aria-hidden />
              <span className="c-about-bracket c-about-bracket--tr" aria-hidden />
              <span className="c-about-bracket c-about-bracket--bl" aria-hidden />
              <span className="c-about-bracket c-about-bracket--br" aria-hidden />
            </div>
          </div>
        </div>

        {/* Vertical progress bar on the far right edge */}
        <div className="c-about-progress" aria-hidden>
          <div className="c-about-progress-fill" ref={progressRef} />
        </div>

        {/* Scroll cue at the bottom */}
        <div className="c-about-cue" aria-hidden>
          <span className="c-about-cue-text">Scroll through the story</span>
          <span className="c-about-cue-line" />
        </div>
      </div>
    </section>
  );
}
