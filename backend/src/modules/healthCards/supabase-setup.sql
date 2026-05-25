-- Health Cards feature — Supabase setup
-- Run this entire script in Supabase SQL Editor (Project → SQL Editor → New query).
-- It is idempotent: safe to re-run.

create table if not exists public.health_card_entries (
  id bigserial primary key,
  pet_id bigint not null references public.pets(id) on delete cascade,
  entry_type text not null default 'other'
    check (entry_type in ('illness', 'treatment', 'medication', 'vaccination', 'checkup', 'other')),
  title text not null,
  description text,
  medication text,
  treatment_date date not null default current_date,
  vet_id uuid,
  vet_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists health_card_entries_pet_id_idx
  on public.health_card_entries (pet_id, treatment_date desc);

-- Row Level Security. Backend uses service_role key which bypasses RLS,
-- so this policy is defense-in-depth for any direct anon-key access.
alter table public.health_card_entries enable row level security;

drop policy if exists "health_card_entries read for authenticated" on public.health_card_entries;
create policy "health_card_entries read for authenticated"
  on public.health_card_entries for select
  to authenticated
  using (true);
