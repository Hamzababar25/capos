# Capos Admin Panel

URL: `/admin`  
Login: username + password (`ADMIN_USER` / `ADMIN_PASSWORD`, or Studio creds as fallback)

## Sections

1. **Dashboard** — counts  
2. **Event Bookings** — New / Responded  
3. **Newsletter** — subscriber list  
4. **Orders** — Pending / Fulfilled  
5. **Menu** — drinks on `/catering`  
6. **Marquee & Settings** — ticker + essentials  
7. **Articles** — titles, prices, featured  

## Env (Vercel)

```bash
ADMIN_USER=capos
ADMIN_PASSWORD=your-password
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
SANITY_API_WRITE_TOKEN=...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
```
