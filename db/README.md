# Capos × Supabase

**Important:** Capos must use its **own** Supabase account/org — not Cornerstone.

## Setup (new Capos account)

1. Sign up / log in at https://supabase.com with the Capos email
2. Create organization + project named `capos` (any region near NJ, e.g. `us-east-1`)
3. In SQL Editor, run `db/schema.sql`
4. Then run the seed insert from `db/seed.sql` (or ask the agent after you paste keys)
5. Project Settings → API → copy keys into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

6. Restart `npm run dev`

Until keys are set, the site uses in-memory article seed (checkout still works via Stripe).

## Tables

| Table | Purpose |
|-------|---------|
| `articles` | Catalog |
| `article_purchases` | Stripe orders (service role only) |
