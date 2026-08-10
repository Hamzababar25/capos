'use client';

import { useEffect, useState } from 'react';

function toLines(arr: string[]) {
  return arr.join('\n');
}

function fromLines(text: string) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminSettingsPage() {
  const [marquee, setMarquee] = useState('');
  const [flavors, setFlavors] = useState('');
  const [addOns, setAddOns] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setMarquee(toLines(d.settings?.marqueeItems || []));
          setFlavors(toLines(d.settings?.essentialFlavors || []));
          setAddOns(toLines(d.settings?.addOns || []));
        }
      });
  }, []);

  const save = async () => {
    setMsg('');
    setError('');
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marqueeItems: fromLines(marquee),
        essentialFlavors: fromLines(flavors),
        addOns: fromLines(addOns),
      }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Save failed');
    else setMsg('Saved. Check homepage marquee / catering essentials.');
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Marquee & Settings</h1>
          <p>One line per item. Marquee is the ticker above About.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={save}>
          Save
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {msg ? <p className="admin-muted">{msg}</p> : null}

      <div className="admin-card">
        <div className="admin-form">
          <label>
            Marquee lines
            <textarea value={marquee} onChange={(e) => setMarquee(e.target.value)} />
          </label>
          <label>
            Essential flavors
            <textarea value={flavors} onChange={(e) => setFlavors(e.target.value)} />
          </label>
          <label>
            Customize / add-ons
            <textarea value={addOns} onChange={(e) => setAddOns(e.target.value)} />
          </label>
        </div>
      </div>
    </>
  );
}
