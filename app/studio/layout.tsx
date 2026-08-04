/**
 * Full-viewport shell for Sanity Studio — sits above site chrome (cursor, etc.).
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-studio
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#fff',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
}
