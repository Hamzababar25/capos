'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen() {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const rafRef      = useRef<number>(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas  = canvasRef.current;
    if (!overlay || !canvas) return;

    document.body.style.overflow = 'hidden';

    /* ── CRT static ─────────────────────────────────── */
    const ctx = canvas.getContext('2d')!;
    const drawStatic = () => {
      // quarter-res for a chunky, vintage pixel look
      const w = Math.ceil(window.innerWidth  / 3);
      const h = Math.ceil(window.innerHeight / 3);
      canvas.width  = w;
      canvas.height = h;

      const img  = ctx.createImageData(w, h);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v      = Math.random() * 220;
        data[i]     = v;           // R
        data[i + 1] = v;           // G — pure white noise
        data[i + 2] = v;           // B
        data[i + 3] = Math.random() < 0.04 ? 180 : 16; // occasional bright flicker
      }
      ctx.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(drawStatic);
    };
    drawStatic();

    /* ── GSAP timeline ──────────────────────────────── */
    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(rafRef.current);
        document.body.style.overflow = '';
        gsap.set(overlay, { display: 'none' });
      },
    });

    tl
      // eyebrow fades in
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
      // main logo rises up
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
      .to({}, { duration: 0.7 })
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
      cancelAnimationFrame(rafRef.current);
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
        background: '#0a0906',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
        overflow: 'hidden',
      }}
    >
      {/* CRT static canvas — full screen, behind content */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
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
          }}
        >
          MEMBERS ONLY
        </div>

        {/* White sweep line — below the heading */}
        <div
          ref={lineRef}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.1) 100%)',
            marginTop: 14,
            borderRadius: 1,
          }}
        />

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
