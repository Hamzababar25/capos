'use client';

import { useCallback, useEffect, useState } from 'react';

type Drink = {
  _id: string;
  name: string;
  category: string;
  desc: string;
  origin?: string;
  ingredients?: string;
  image?: string;
  featured?: boolean;
  sortOrder?: number;
  active?: boolean;
};

export default function AdminMenuPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/menu');
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Failed');
    else setDrinks(data.drinks || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (drink: Drink) => {
    setSaving(drink._id);
    const res = await fetch('/api/admin/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drink),
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Save failed');
    } else {
      setError('');
      load();
    }
  };

  const addDrink = async () => {
    const name = window.prompt('New drink name');
    if (!name) return;
    await fetch('/api/admin/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category: 'signature', desc: '' }),
    });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Menu</h1>
          <p>Edit drinks shown on /catering. Publish is instant after Save.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={addDrink}>
          + Add drink
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-list">
        {drinks.map((d, idx) => (
          <div key={d._id} className="admin-drink">
            <div className="admin-form" style={{ padding: 0 }}>
              <label>
                Name
                <input
                  value={d.name}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, name: e.target.value };
                    setDrinks(next);
                  }}
                />
              </label>
              <label>
                Category
                <select
                  value={d.category}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, category: e.target.value };
                    setDrinks(next);
                  }}
                >
                  <option value="signature">Signature</option>
                  <option value="refresher">Refresher</option>
                </select>
              </label>
              <label>
                Description
                <textarea
                  value={d.desc || ''}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, desc: e.target.value };
                    setDrinks(next);
                  }}
                />
              </label>
              <label>
                Image path
                <input
                  value={d.image || ''}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, image: e.target.value };
                    setDrinks(next);
                  }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={Boolean(d.featured)}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, featured: e.target.checked };
                    setDrinks(next);
                  }}
                />
                Featured this season
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={d.active !== false}
                  onChange={(e) => {
                    const next = [...drinks];
                    next[idx] = { ...d, active: e.target.checked };
                    setDrinks(next);
                  }}
                />
                Active on website
              </label>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={saving === d._id}
                onClick={() => update(d)}
              >
                {saving === d._id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
