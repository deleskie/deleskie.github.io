create extension if not exists pgcrypto;

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  region text,
  interest text,
  invitation_code text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

alter table public.access_requests enable row level security;

revoke all on table public.access_requests from anon, authenticated;

create index if not exists access_requests_created_at_idx
  on public.access_requests (created_at desc);
