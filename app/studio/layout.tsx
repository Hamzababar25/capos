import StudioCursorFix from './StudioCursorFix';

/**
 * Full-viewport shell for Sanity Studio — sits above site chrome.
 * StudioCursorFix restores the native mouse cursor for the whole document.
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
        cursor: 'auto',
      }}
    >
      <StudioCursorFix />
      {children}
    </div>
  );
}
