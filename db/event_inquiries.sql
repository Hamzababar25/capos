-- Event / catering booking inquiries
create table if not exists public.event_inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text not null,
  event_type    text not null,
  event_date    text not null,
  venue         text not null,
  guests        text not null,
  budget        text,
  notes         text,
  status        text not null default 'new'
                  check (status in ('new', 'responded')),
  submitted_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists event_inquiries_status_idx
  on public.event_inquiries (status);

create index if not exists event_inquiries_submitted_idx
  on public.event_inquiries (submitted_at desc);

alter table public.event_inquiries enable row level security;

-- No public policies — service role only (API writes)
