-- CAPOS Articles + Purchases schema
-- Applied via Supabase migration / SQL editor

create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id            text primary key,
  slug          text unique not null,
  title         text not null,
  subtitle      text not null,
  excerpt       text not null,
  body          text[] not null default '{}',
  event_type    text not null,
  event_label   text not null,
  price_cents   integer not null check (price_cents >= 0),
  currency      text not null default 'usd',
  cover_image   text not null,
  gallery       text[] not null default '{}',
  pages         integer not null default 1,
  format        text not null default 'Digital PDF',
  featured      boolean not null default false,
  published_at  date not null,
  stripe_price_id text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.article_purchases (
  id                    uuid primary key default gen_random_uuid(),
  article_id            text not null references public.articles(id),
  buyer_email           text not null,
  stripe_session_id     text unique not null,
  stripe_payment_intent text,
  amount_cents          integer not null,
  currency              text not null default 'usd',
  status                text not null default 'pending'
                          check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at            timestamptz not null default now(),
  paid_at               timestamptz
);

create index if not exists article_purchases_email_idx
  on public.article_purchases (buyer_email);

create index if not exists article_purchases_article_idx
  on public.article_purchases (article_id);

alter table public.articles enable row level security;
alter table public.article_purchases enable row level security;

drop policy if exists "Public read active articles" on public.articles;
create policy "Public read active articles"
  on public.articles for select
  using (active = true);

-- Purchases: no public policies — service role only (webhook / server)
