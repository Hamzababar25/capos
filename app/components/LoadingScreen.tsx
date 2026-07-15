'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*▓▒░';
const TARGET_TEXT = 'MEMBERS ONLY';

// TESTER KNOB: tweak the thunder background video's opacity while previewing.
const VIDEO_OPACITY = 0.28;

export default function LoadingScreen() {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const scanlineRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const tagRef       = useRef<HTMLParagraphElement>(null);
  const scrambleRafRef = useRef<number>(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const video   = videoRef.current;
    if (!overlay || !video) return;

    document.body.style.overflow = 'hidden';

    // occasional whole-frame flicker + jitter, like a loose antenna signal
    const flicker = gsap.timeline({ repeat: -1 });
    const flickerStep = () => {
      const jitter = Math.random();
      if (jitter > 0.88) {
        gsap.to(video, {
          opacity: Math.max(0, VIDEO_OPACITY - 0.1) + Math.random() * 0.15,
          x: (Math.random() - 0.5) * 6,
          duration: 0.05,
          onComplete: () => gsap.to(video, { opacity: VIDEO_OPACITY, x: 0, duration: 0.08 }),
        });
      }
    };
    flicker.to({}, { duration: 0.09, repeat: -1, onRepeat: flickerStep });

    // slow vertical drift of the scanline overlay for a rolling-picture feel
    if (scanlineRef.current) {
      gsap.set(scanlineRef.current, { backgroundPositionY: '0px' });
      gsap.to(scanlineRef.current, {
        backgroundPositionY: '400px',
        duration: 8,
        repeat: -1,
        ease: 'none',
      });
    }

    /* -- alphabet scramble → reveal on the brand name -- */
    const scrambleLogo = () => {
      const el = logoRef.current;
      if (!el) return () => {};
      const duration = 900;
      const start = performance.now();
      const perCharDelay = (duration * 0.95) / TARGET_TEXT.length;

      const tick = (now: number) => {
        const elapsed = now - start;
        let out = '';
        for (let idx = 0; idx < TARGET_TEXT.length; idx++) {
          const ch = TARGET_TEXT[idx];
          if (ch === ' ') { out += ' '; continue; }
          const revealAt = duration * 0.2 + idx * perCharDelay;
          out += elapsed >= revealAt
            ? ch
            : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
        }
        el.textContent = out;

        if (elapsed < duration) {
          scrambleRafRef.current = requestAnimationFrame(tick);
        } else {
          el.textContent = TARGET_TEXT;
        }
      };
      scrambleRafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(scrambleRafRef.current);
    };

    /* -- GSAP timeline -------------------------------- */
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        gsap.set(overlay, { display: 'none' });
      },
    });

    let stopScramble = () => {};

    tl
      // eyebrow fades in
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
      // logo rises up while its letters scramble through and lock into place
      .call(() => { stopScramble = scrambleLogo(); }, [], '-=0.2')
      .fromTo(logoRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'expo.out' },
        '-=0.2'
      )
      // amber line sweeps left → right beneath the logo
      .fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'expo.inOut' },
        '-=0.3'
      )
      // tagline
      .fromTo(tagRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.45'
      )
      // hold
      .to({}, { duration: 0.9 })
      // fade everything out
      .to([eyebrowRef.current, logoRef.current, lineRef.current, tagRef.current], {
        opacity: 0, y: -16,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power3.in',
      })
      // wipe overlay upward
      .to(overlay, {
        yPercent: -100,
        duration: 0.9,
        ease: 'expo.inOut',
      }, '-=0.1');

    return () => {
      cancelAnimationFrame(scrambleRafRef.current);
      stopScramble();
      flicker.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
        overflow: 'hidden',
      }}
    >
      {/* Thunder / atmospheric background video */}
      <video
        ref={videoRef}
        src="/Thunder.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: VIDEO_OPACITY,
          filter: 'grayscale(1) contrast(1.4) brightness(0.7)',
          pointerEvents: 'none',
        }}
      />

      {/* Rolling scanlines */}
      <div
        ref={scanlineRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 2px, transparent 4px)',
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />

      {/* CRT vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Content block */}
      <div style={{ position: 'relative', textAlign: 'center' }}>

        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'max(0.65vw, 10px)',
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.35)',
            marginBottom: 20,
            opacity: 0,
          }}
        >
          Est. 2025 · Tri-State Area
        </p>

        {/* Brand name */}
        <div
          ref={logoRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(64px, 11vw, 140px)',
            fontWeight: 800,
            letterSpacing: '0.24em',
            color: '#ffffff',
            textTransform: 'uppercase',
            lineHeight: 1,
            opacity: 0,
            textShadow: '2px 0 rgba(255,40,60,0.35), -2px 0 rgba(40,220,255,0.3)',
          }}
        >
          MEMBERS ONLY
        </div>

        {/* White sweep line — below the heading */}
        {/* <div
          ref={lineRef}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.1) 100%)',
            marginTop: 14,
            borderRadius: 1,
          }}
        /> */}

        {/* Tagline */}
        <p
          ref={tagRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'max(0.72vw, 11px)',
            fontWeight: 600,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.35)',
            marginTop: 16,
            opacity: 0,
          }}
        >
          
        </p>
      </div>
    </div>
  );
}
