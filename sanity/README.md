# Capos × Sanity CMS (Step 3)

Client edits articles at **`/studio`**. Site reads from Sanity. Supabase mirrors articles + stores purchases.

## Flow

```
Studio Publish → Sanity webhook → /api/webhooks/sanity → Supabase articles
                              ↘ site reads Sanity via /api/articles
```

## Env (`.env.local` + Vercel)

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=kqc2ytxi
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=sk...          # Editor token (read + seed)
SANITY_WEBHOOK_SECRET=...             # required for webhook / sync
STUDIO_USER=capos                     # browser gate for /studio
STUDIO_PASSWORD=...                   # required on Vercel / production
```

## Access control (important)

`/studio` has **two locks**:

1. **Browser password** (`STUDIO_USER` / `STUDIO_PASSWORD`) — site pe pehla gate  
2. **Sanity login** — sirf invited project members edit kar sakte hain  

Public visitors articles change **nahi** kar sakte. Client ko invite karo:

https://www.sanity.io/manage/project/kqc2ytxi/members → **Invite** → role **Editor**

Random Google sign-in se project mein entry nahi milti jab tak aap invite na karo.

## Sanity → Supabase webhook (production)

1. Open https://www.sanity.io/manage/project/kqc2ytxi/api  
2. **Webhooks** → **Create webhook**
3. Settings:
   - **Name:** `supabase-articles-sync`
   - **URL:** `https://capos.coffee/api/webhooks/sanity?secret=YOUR_SANITY_WEBHOOK_SECRET`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type == "article"`
   - **Projection** (optional but recommended):

```groq
{
  _id,
  _type,
  articleId,
  "slug": slug.current,
  title,
  subtitle,
  excerpt,
  body,
  eventType,
  eventLabel,
  priceCents,
  currency,
  coverImage,
  gallery,
  pages,
  format,
  featured,
  publishedAt,
  active
}
```

4. Save. Next Studio **Publish** → Supabase `articles` row updates within seconds.

## Manual sync (catch-up)

```bash
curl -X POST "http://localhost:3000/api/articles/sync" \
  -H "Authorization: Bearer $SANITY_WEBHOOK_SECRET"
```

## Seed content (menu + marquee + orders)

```bash
npm run seed:content
```

## Who edits what

| Content | Where in Studio |
|---------|-----------------|
| Event inquiries (New / Responded) | Event Inquiries |
| Article orders (fulfill) | Orders |
| Menu drinks | Menu |
| Marquee + essentials + add-ons | Site Settings (Marquee) |
| Articles catalog | Articles |
| Purchases (source of truth) | Supabase `article_purchases` (auto-mirrored to Studio) |

## Fallback order (site)

1. Sanity (via `/api/articles` + token)  
2. Supabase `articles`  
3. In-memory seed
