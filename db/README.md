# Capos × Supabase

**Project:** `hiavrqvxatbkgucvqwpm` · region `ap-south-1`  
**Dashboard:** https://supabase.com/dashboard/project/hiavrqvxatbkgucvqwpm

## Local env (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hiavrqvxatbkgucvqwpm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...          # legacy JWT anon
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   # sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...              # service_role JWT (server only)
```

Restart `npm run dev` after changing keys.

Until keys are set, the site uses in-memory article seed (checkout still works via Stripe).

## Schema + seed

```bash
# schema
psql "$CONN" -f db/schema.sql
# seed (idempotent upsert)
psql "$CONN" -f db/seed.sql
```

Pooler (IPv4): `aws-0-ap-south-1.pooler.supabase.com:6543`  
User: `postgres.hiavrqvxatbkgucvqwpm`

## Tables

| Table | Purpose |
|-------|---------|
| `articles` | Catalog (public read when `active`) |
| `article_purchases` | Stripe orders (service role only) |

## Verify purchase save

1. Optional local webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Buy an article (test card `4242…`)
3. Check Table Editor → `article_purchases` (success page also backfills if webhook missed)
