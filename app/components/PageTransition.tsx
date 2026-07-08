'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import './page-transition.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Red curtain sweep between route changes.
 * Respects prefers-reduced-motion — skips animation when set.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.killTweensOf(curtain);

    const tl = gsap.timeline();
    tl.set(curtain, { pointerEvents: 'all', scaleY: 0, transformOrigin: 'top center' })
      .to(curtain, {
        scaleY: 1,
        duration: 0.42,
        ease: 'power3.inOut',
      })
      .to(curtain, {
        scaleY: 0,
        duration: 0.48,
        ease: 'power3.inOut',
        transformOrigin: 'bottom center',
      })
      .set(curtain, { pointerEvents: 'none', transformOrigin: 'top center' });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div ref={curtainRef} className="page-curtain" aria-hidden>
        <span className="page-curtain-label">CAPO&apos;S</span>
      </div>
      {children}
    </>
  );
}
