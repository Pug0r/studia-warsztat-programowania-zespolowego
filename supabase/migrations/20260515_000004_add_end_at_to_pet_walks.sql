-- Add end_at column to pet_walks
alter table public.pet_walks
add column if not exists end_at timestamptz;

-- Add index for walker_id to check volunteer availability
create index if not exists pet_walks_walker_id_idx
  on public.pet_walks (walker_id);

-- Add index for checking pet availability (pet_id, walked_at, end_at)
create index if not exists pet_walks_pet_id_walked_at_end_at_idx
  on public.pet_walks (pet_id, walked_at, end_at);

-- Add index for checking walker availability (walker_id, walked_at, end_at)
create index if not exists pet_walks_walker_id_walked_at_end_at_idx
  on public.pet_walks (walker_id, walked_at, end_at);
