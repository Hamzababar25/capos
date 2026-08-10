'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin';
  const [user, setUser] = useState('capos');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.replace(next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Could not sign in');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={onSubmit}>
        <p className="admin-brand" style={{ marginBottom: 0 }}>
          Capos Admin
        </p>
        <h1 style={{ margin: 0, fontSize: 28 }}>Sign in</h1>
        <p className="admin-muted" style={{ margin: 0 }}>
          Simple username + password. Same as studio password if ADMIN_* not set.
        </p>

        <label>
          Username
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            required
            style={{
              width: '100%',
              marginTop: 6,
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0f1115',
              color: '#fff',
            }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{
              width: '100%',
              marginTop: 6,
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0f1115',
              color: '#fff',
            }}
          />
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Checking…' : 'Enter Admin →'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login" />}>
      <LoginForm />
    </Suspense>
  );
}
