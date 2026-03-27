create table public.reason_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  points_change integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (title <> '')
);

create trigger reason_templates_set_updated_at
before update on public.reason_templates
for each row
execute function public.set_updated_at();

alter table public.reason_templates enable row level security;

create policy "admins can read reason_templates"
on public.reason_templates
for select
using (public.is_admin());

create policy "admins can manage reason_templates"
on public.reason_templates
for all
using (public.is_admin())
with check (public.is_admin());
