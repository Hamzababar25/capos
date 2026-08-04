'use client';

import { useEffect } from 'react';

/**
 * Site hides the native cursor globally (cursor: none).
 * Force it back for the entire document while Studio is mounted —
 * including Sanity portals that render outside [data-studio].
 */
export default function StudioCursorFix() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add('studio-mode');
    body.classList.add('studio-mode');
    html.style.setProperty('cursor', 'auto', 'important');
    body.style.setProperty('cursor', 'auto', 'important');

    return () => {
      html.classList.remove('studio-mode');
      body.classList.remove('studio-mode');
      html.style.removeProperty('cursor');
      body.style.removeProperty('cursor');
    };
  }, []);

  return null;
}
