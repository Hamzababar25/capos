'use client';

import { useCallback, useEffect, useState } from 'react';

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  venue: string;
  guests: string;
  budget: string | null;
  notes: string | null;
  status: 'new' | 'responded';
  submitted_at: string;
};

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState<'all' | 'new' | 'responded'>('new');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const q = filter === 'all' ? '' : `?status=${filter}`;
    const res = await fetch(`/api/admin/bookings${q}`);
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Failed');
    else {
      setError('');
      setBookings(data.bookings || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: 'new' | 'responded') => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) load();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Event Bookings</h1>
          <p>Form inquiries. Mark Responded after you call / email them.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        {(['new', 'responded', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`admin-btn${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'new' ? 'New' : f === 'responded' ? 'Responded' : 'All'}
          </button>
        ))}
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p className="admin-muted">Loading…</p> : null}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Contact</th>
              <th>Event</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <span
                    className={`admin-badge ${
                      b.status === 'new' ? 'admin-badge-new' : 'admin-badge-ok'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  <strong>{b.name}</strong>
                  <div className="admin-muted">{b.email}</div>
                  <div className="admin-muted">{b.phone}</div>
                </td>
                <td>
                  {b.event_type}
                  <div className="admin-muted">{b.event_date}</div>
                  <div className="admin-muted">{b.venue}</div>
                </td>
                <td>
                  Guests: {b.guests}
                  <div className="admin-muted">Budget: {b.budget || '—'}</div>
                  <div className="admin-muted">{b.notes || ''}</div>
                </td>
                <td>
                  {b.status === 'new' ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ok"
                      onClick={() => setStatus(b.id, 'responded')}
                    >
                      Mark responded
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => setStatus(b.id, 'new')}
                    >
                      Move to new
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !bookings.length ? (
              <tr>
                <td colSpan={5} className="admin-muted">
                  No bookings in this list.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
