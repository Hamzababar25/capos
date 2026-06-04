'use client';

import { useEffect, useRef } from 'react';
import './cursor.css';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only enable on pointer-fine devices (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;
    let isVisible = false;

    const show = () => {
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      show();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const setHovering = (state: boolean) => {
      if (state) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      } else {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    };

    const attachToElements = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        if ((el as HTMLElement).dataset.cursorBound) return;
        (el as HTMLElement).dataset.cursorBound = '1';
        el.addEventListener('mouseenter', () => setHovering(true));
        el.addEventListener('mouseleave', () => setHovering(false));
      });
    };

    attachToElements();

    const mutationObserver = new MutationObserver(attachToElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
