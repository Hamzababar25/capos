# Capos × Sanity CMS (Step 3)

Client edits articles at **`/studio`**. Site reads from Sanity first; Supabase still stores purchases.

## One-time setup

1. Create a free project: https://www.sanity.io/manage → **Create project** → name `capos`
2. Copy **Project ID**
3. Add to `.env.local` (and Vercel):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

4. CORS: Sanity → Project → API → CORS origins  
   - `http://localhost:3000` (Allow credentials)  
   - your Vercel URL (Allow credentials)

5. Write token (for seeding only): API → Tokens → Add API token → **Editor**  
   ```bash
   SANITY_API_WRITE_TOKEN=sk...
   ```

6. Restart `npm run dev` → open http://localhost:3000/studio → log in with Sanity account

7. Seed the 4 articles:
   ```bash
   npm run seed:sanity
   ```

Invite the Capos client as a **Editor** in Sanity Manage so they can edit without seeing code.

## Who edits what

| Content | Where |
|---------|--------|
| Titles, body, prices, images, featured | Sanity `/studio` |
| Purchases / sales | Supabase `article_purchases` |

## Fallback order

1. Sanity (if project ID set + docs exist)  
2. Supabase `articles`  
3. In-memory seed in `lib/articles.ts`
