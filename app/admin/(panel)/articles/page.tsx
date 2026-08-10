'use client';

import { useCallback, useEffect, useState } from 'react';

type ArticleRow = {
  _id: string;
  articleId: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  slug?: string;
  priceCents: number;
  featured?: boolean;
  active?: boolean;
  eventType?: string;
  eventLabel?: string;
  pages?: number;
  format?: string;
  coverImage?: string;
  publishedAt?: string;
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/articles');
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Failed');
    else setArticles(data.articles || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (article: ArticleRow) => {
    setSaving(article._id);
    const res = await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
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

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Articles</h1>
          <p>Price is in cents (1800 = $18). Changes show on /articles.</p>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-list">
        {articles.map((a, idx) => (
          <div key={a._id} className="admin-drink">
            <div className="admin-form" style={{ padding: 0 }}>
              <label>
                Title
                <input
                  value={a.title}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, title: e.target.value };
                    setArticles(next);
                  }}
                />
              </label>
              <label>
                Slug
                <input
                  value={a.slug || ''}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, slug: e.target.value };
                    setArticles(next);
                  }}
                />
              </label>
              <label>
                Price (cents)
                <input
                  type="number"
                  value={a.priceCents ?? 0}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, priceCents: Number(e.target.value) };
                    setArticles(next);
                  }}
                />
              </label>
              <label>
                Subtitle
                <input
                  value={a.subtitle || ''}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, subtitle: e.target.value };
                    setArticles(next);
                  }}
                />
              </label>
              <label>
                Excerpt
                <textarea
                  value={a.excerpt || ''}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, excerpt: e.target.value };
                    setArticles(next);
                  }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={Boolean(a.featured)}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, featured: e.target.checked };
                    setArticles(next);
                  }}
                />
                Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={a.active !== false}
                  onChange={(e) => {
                    const next = [...articles];
                    next[idx] = { ...a, active: e.target.checked };
                    setArticles(next);
                  }}
                />
                Active on site
              </label>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={saving === a._id}
                onClick={() => save(a)}
              >
                {saving === a._id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
