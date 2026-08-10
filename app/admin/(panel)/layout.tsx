'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Event Bookings' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/settings', label: 'Marquee & Settings' },
  { href: '/admin/articles', label: 'Articles' },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="admin-brand">Capos Admin</p>
        {LINKS.map((link) => {
          const active =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? 'is-active' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: 'auto' }}
          onClick={logout}
        >
          Log out
        </button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
