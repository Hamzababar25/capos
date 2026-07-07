'use client';

import { useEffect, useRef } from 'react';
import './cursor.css';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only enable on precision-pointer devices (mouse / trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      dot.style.display  = 'none';
      ring.style.display = 'none';
      return;
    }

    // Start at screen centre so nothing is "invisible until first move"
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId  = 0;

    // Position synchronously on mount so users see the cursor immediately
    dot.style.transform  = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    dot.style.opacity    = '1';
    ring.style.opacity   = '1';

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Ensure visible in case cursor was hidden after leaving window
      if (dot.style.opacity !== '1') {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      dot.style.opacity  = '1';
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

    document.addEventListener('mousemove',  handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const animate = () => {
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      // Trailing ring: exponential lerp toward mouse position
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
