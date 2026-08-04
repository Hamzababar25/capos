'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './cursor.css';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';

export default function Cursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Hide custom cursor on Sanity Studio + restore native pointer
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const hide = Boolean(pathname?.startsWith('/studio'));
    dot.style.display = hide ? 'none' : '';
    ring.style.display = hide ? 'none' : '';

    if (hide) {
      document.documentElement.classList.add('studio-mode');
      document.body.classList.add('studio-mode');
      document.documentElement.style.setProperty('cursor', 'auto', 'important');
      document.body.style.setProperty('cursor', 'auto', 'important');
    } else {
      document.documentElement.classList.remove('studio-mode');
      document.body.classList.remove('studio-mode');
      document.documentElement.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');
    }
  }, [pathname]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    if (!window.matchMedia('(pointer: fine)').matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    dot.style.opacity = '1';
    ring.style.opacity = '1';

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot.style.opacity !== '1') {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const setHovering = (state: boolean) => {
      if (state) {
        dot.classList.add('is-hovering');
        ring.classList.add('is-hovering');
      } else {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
      }
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(HOVER_SELECTOR);
      if (target) setHovering(true);
    };

    const handlePointerOut = (e: MouseEvent) => {
      const from = (e.target as Element | null)?.closest?.(HOVER_SELECTOR);
      if (!from) return;
      const to = (e.relatedTarget as Element | null)?.closest?.(HOVER_SELECTOR);
      if (!to) setHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handlePointerOver);
    document.addEventListener('mouseout', handlePointerOut);

    const animate = () => {
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('mouseout', handlePointerOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
