'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function StudioLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/studio';
  const [user, setUser] = useState('capos');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        setError('Wrong username or password');
        setLoading(false);
        return;
      }
      router.replace(next.startsWith('/studio') ? next : '/studio');
      router.refresh();
    } catch {
      setError('Could not sign in');
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#080d0a',
        color: '#f0ede6',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          border: '1px solid rgba(151,29,19,0.35)',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#971d13',
            fontWeight: 700,
          }}
        >
          Capos Studio
        </p>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Sign in</h1>
        <p style={{ margin: 0, opacity: 0.55, fontSize: 14, lineHeight: 1.5 }}>
          Extra gate before Sanity. Use the studio password from Vercel env.
        </p>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          Username
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={inputStyle}
          />
        </label>

        {error ? (
          <p style={{ margin: 0, color: '#971d13', fontSize: 13 }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Checking…' : 'Enter Studio →'}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#0d1410',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  padding: '12px 14px',
  fontSize: 15,
  outline: 'none',
};

export default function StudioLoginPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: '#080d0a' }} />}>
      <StudioLoginForm />
    </Suspense>
  );
}
