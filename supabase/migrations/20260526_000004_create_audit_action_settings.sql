create table if not exists public.audit_action_settings (
  action text primary key,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.audit_action_settings enable row level security;

grant all on table public.audit_action_settings to service_role;

insert into public.audit_action_settings (action, enabled)
values
  ('auth.sign_in', true),
  ('auth.sign_out', true),
  ('auth.sign_up', true),
  ('adoption_application.create', true),
  ('adoption_application.status_update', true),
  ('pet.create', true),
  ('pet.delete', true),
  ('pet.photo_upload', true),
  ('pet.walk_record', true),
  ('pet.walk_cancel', true),
  ('audit_action_setting.update', true),
  ('volunteer.create', true),
  ('volunteer.update', true),
  ('volunteer.delete', true)
on conflict (action) do nothing;
