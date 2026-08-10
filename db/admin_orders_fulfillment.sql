-- Fulfillment status for article orders (admin panel)
alter table public.article_purchases
  add column if not exists fulfillment_status text not null default 'pending'
    check (fulfillment_status in ('pending', 'fulfilled'));

create index if not exists article_purchases_fulfillment_idx
  on public.article_purchases (fulfillment_status);
