'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const tagRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Lock scroll while loading
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        gsap.set(overlay, { display: 'none' });
      },
    });

    tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.75, ease: 'expo.out' }
      )
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.35'
      )
      .fromTo(
        tagRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        '-=0.25'
      )
      // Pause so the user can read it
      .to({}, { duration: 0.6 })
      // Fade content out
      .to([logoRef.current, tagRef.current, lineRef.current], {
        opacity: 0,
        y: -18,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.in',
      })
      // Wipe the overlay upward
      .to(overlay, {
        yPercent: -100,
        duration: 0.85,
        ease: 'expo.inOut',
      }, '-=0.1');
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0906',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        pointerEvents: 'all',
      }}
    >
      {/* Amber accent line */}
      <div
        ref={lineRef}
        style={{
          width: 64,
          height: 1,
          background: '#c8922a',
          marginBottom: 22,
          alignSelf: 'center',
        }}
      />

      {/* Brand name */}
      <div
        ref={logoRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(52px, 9vw, 110px)',
          fontWeight: 700,
          letterSpacing: '0.28em',
          color: '#f0ede6',
          textTransform: 'uppercase',
          lineHeight: 1,
          opacity: 0,
        }}
      >
        MEMBERS ONLY
      </div>

      {/* Tagline */}
      <p
        ref={tagRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'max(0.72vw, 11px)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#c8922a',
          marginTop: 18,
          opacity: 0,
        }}
      >
      CAPO'S COFFEE
      </p>
    </div>
  );
}
