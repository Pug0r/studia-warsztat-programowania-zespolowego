-- Add status and photo_url columns to pets table
alter table public.pets
  add column status text not null default 'available' check (status in ('available', 'quarantine')),
  add column photo_url text;

-- Create index for status column for efficient filtering
create index if not exists pets_status_idx on public.pets (status);
