'use client';

/**
 * Drop this component anywhere inside the home page.
 * On mount it checks sessionStorage for a pending scroll target
 * (set by Navigation when navigating from another page to a section),
 * scrolls there, then clears the key so it only fires once.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToSection() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const target = sessionStorage.getItem('scrollTo');
    if (!target) return;

    sessionStorage.removeItem('scrollTo');

    // Small delay so the page has time to paint fully
    const timer = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
