'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  bookingsTotal: number;
  bookingsNew: number;
  newsletter: number;
  ordersTotal: number;
  ordersPending: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setStats(d);
      })
      .catch(() => setError('Could not load stats'));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Quick view of bookings, newsletter, and orders.</p>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-grid">
        <div className="admin-stat">
          <span>New bookings</span>
          <strong>{stats?.bookingsNew ?? '—'}</strong>
        </div>
        <div className="admin-stat">
          <span>All bookings</span>
          <strong>{stats?.bookingsTotal ?? '—'}</strong>
        </div>
        <div className="admin-stat">
          <span>Newsletter</span>
          <strong>{stats?.newsletter ?? '—'}</strong>
        </div>
        <div className="admin-stat">
          <span>Orders pending</span>
          <strong>{stats?.ordersPending ?? '—'}</strong>
        </div>
        <div className="admin-stat">
          <span>All orders</span>
          <strong>{stats?.ordersTotal ?? '—'}</strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <Link className="admin-btn admin-btn-primary" href="/admin/bookings">
          Open bookings
        </Link>
        <Link className="admin-btn" href="/admin/orders">
          Open orders
        </Link>
        <Link className="admin-btn" href="/admin/newsletter">
          Newsletter list
        </Link>
      </div>
    </>
  );
}
