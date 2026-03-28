create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_admin_id uuid not null references auth.users(id) on delete cascade,
  actor_email text,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  entity_label text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);

create index admin_audit_logs_action_type_idx
  on public.admin_audit_logs (action_type);

create index admin_audit_logs_entity_type_entity_id_idx
  on public.admin_audit_logs (entity_type, entity_id);

alter table public.admin_audit_logs enable row level security;

create policy "Admins can read audit logs"
  on public.admin_audit_logs
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert audit logs"
  on public.admin_audit_logs
  for insert
  to authenticated
  with check (public.is_admin());

grant select, insert on public.admin_audit_logs to authenticated;
