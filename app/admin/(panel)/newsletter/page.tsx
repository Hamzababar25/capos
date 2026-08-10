'use client';

import { useCallback, useEffect, useState } from 'react';

type Sub = {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Sub[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/newsletter');
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Failed');
    else setSubscribers(data.subscribers || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: 'active' | 'unsubscribed') => {
    await fetch('/api/admin/newsletter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Newsletter</h1>
          <p>Emails that signed up from the footer.</p>
        </div>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Subscribed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.email}</strong>
                </td>
                <td>
                  <span
                    className={`admin-badge ${
                      s.status === 'active' ? 'admin-badge-ok' : 'admin-badge-new'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="admin-muted">
                  {s.subscribed_at
                    ? new Date(s.subscribed_at).toLocaleString()
                    : '—'}
                </td>
                <td>
                  {s.status === 'active' ? (
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => setStatus(s.id, 'unsubscribed')}
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ok"
                      onClick={() => setStatus(s.id, 'active')}
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!subscribers.length ? (
              <tr>
                <td colSpan={4} className="admin-muted">
                  No subscribers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
