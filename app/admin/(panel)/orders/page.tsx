'use client';

import { useCallback, useEffect, useState } from 'react';

type Order = {
  id: string;
  article_id: string;
  article_title?: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  status: string;
  fulfillment_status: string;
  paid_at: string | null;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'fulfilled'>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const q = filter === 'all' ? '' : `?filter=${filter}`;
    const res = await fetch(`/api/admin/orders${q}`);
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Failed');
    else {
      setError('');
      setOrders(data.orders || []);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setFulfillment = async (id: string, fulfillment_status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, fulfillment_status }),
    });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>Article purchases from Stripe. Mark fulfilled after delivery.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        {(['pending', 'fulfilled', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`admin-btn${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'pending' ? 'Pending' : f === 'fulfilled' ? 'Fulfilled' : 'All'}
          </button>
        ))}
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Article</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Fulfillment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.buyer_email}</td>
                <td>{o.article_title || o.article_id}</td>
                <td>
                  ${((o.amount_cents || 0) / 100).toFixed(0)}{' '}
                  <span className="admin-muted">{o.currency}</span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-ok">{o.status}</span>
                </td>
                <td>
                  <span
                    className={`admin-badge ${
                      o.fulfillment_status === 'fulfilled'
                        ? 'admin-badge-ok'
                        : 'admin-badge-new'
                    }`}
                  >
                    {o.fulfillment_status || 'pending'}
                  </span>
                </td>
                <td>
                  {o.fulfillment_status !== 'fulfilled' ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ok"
                      onClick={() => setFulfillment(o.id, 'fulfilled')}
                    >
                      Mark fulfilled
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => setFulfillment(o.id, 'pending')}
                    >
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!orders.length ? (
              <tr>
                <td colSpan={6} className="admin-muted">
                  No orders here.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
