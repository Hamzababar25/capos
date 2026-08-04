import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Capo's Studio",
  robots: { index: false, follow: false },
};

/**
 * Isolated Studio shell — no Lenis, custom cursor, or loading screen.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: '#fff',
        overflow: 'auto',
        cursor: 'auto',
      }}
    >
      {children}
    </div>
  );
}
