alter table public.admin_users force row level security;
alter table public.members force row level security;
alter table public.point_events force row level security;
alter table public.leaderboard_snapshots force row level security;
alter table public.reason_templates force row level security;
alter table public.admin_audit_logs force row level security;

drop policy if exists "admins can read admin_users" on public.admin_users;
drop policy if exists "super admins can manage admin_users" on public.admin_users;

create policy "admins can read admin_users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

create policy "super admins can insert admin_users"
on public.admin_users
for insert
to authenticated
with check (public.is_super_admin());

create policy "super admins can update admin_users"
on public.admin_users
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "super admins can delete admin_users"
on public.admin_users
for delete
to authenticated
using (public.is_super_admin());

drop policy if exists "admins can read members" on public.members;
drop policy if exists "admins can manage members" on public.members;

create policy "admins can read members"
on public.members
for select
to authenticated
using (public.is_admin());

create policy "admins can insert members"
on public.members
for insert
to authenticated
with check (public.is_admin());

create policy "admins can update members"
on public.members
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "super admins can delete members"
on public.members
for delete
to authenticated
using (public.is_super_admin());

drop policy if exists "admins can read point_events" on public.point_events;
drop policy if exists "admins can manage point_events" on public.point_events;

create policy "admins can read point_events"
on public.point_events
for select
to authenticated
using (public.is_admin());

create policy "admins can insert point_events"
on public.point_events
for insert
to authenticated
with check (public.is_admin());

create policy "admins can update point_events"
on public.point_events
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "super admins can delete point_events"
on public.point_events
for delete
to authenticated
using (public.is_super_admin());

drop policy if exists "admins can read leaderboard_snapshots" on public.leaderboard_snapshots;
drop policy if exists "admins can manage leaderboard_snapshots" on public.leaderboard_snapshots;

create policy "admins can read leaderboard_snapshots"
on public.leaderboard_snapshots
for select
to authenticated
using (public.is_admin());

create policy "admins can insert leaderboard_snapshots"
on public.leaderboard_snapshots
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can read reason_templates" on public.reason_templates;
drop policy if exists "admins can manage reason_templates" on public.reason_templates;

create policy "admins can read reason_templates"
on public.reason_templates
for select
to authenticated
using (public.is_admin());

create policy "admins can insert reason_templates"
on public.reason_templates
for insert
to authenticated
with check (public.is_admin());

create policy "admins can update reason_templates"
on public.reason_templates
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete reason_templates"
on public.reason_templates
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read audit logs" on public.admin_audit_logs;
drop policy if exists "Admins can insert audit logs" on public.admin_audit_logs;

create policy "admins can read audit logs"
on public.admin_audit_logs
for select
to authenticated
using (public.is_admin());

create policy "admins can insert audit logs"
on public.admin_audit_logs
for insert
to authenticated
with check (
  public.is_admin()
  and actor_admin_id = auth.uid()
);
