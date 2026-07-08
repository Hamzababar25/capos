'use client';

import { useEffect } from 'react';

const SELECTOR = '.btn-primary, .magnetic-btn, .c-header-cta, .cf-next';

/**
 * Subtle magnetic pull on primary CTAs — cursor gently draws buttons toward the pointer.
 * Uses event delegation so dynamically mounted buttons are covered.
 */
export default function MagneticButtons() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse  = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    let active: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.transform = '';
      el.style.transition = '';
    };

    const onMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(SELECTOR);
      if (!target) {
        if (active) {
          reset(active);
          active = null;
        }
        return;
      }

      if (active && active !== target) reset(active);
      active = target;

      const rect = target.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.18;

      target.style.transition = 'transform 0.15s ease-out';
      target.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onLeave = () => {
      if (active) {
        reset(active);
        active = null;
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (active) reset(active);
    };
  }, []);

  return null;
}
