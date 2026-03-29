# Supabase Security Notes

This project uses a layered security model:

- table-level privileges
- row level security (RLS)
- view grants
- `security definer` helper functions where needed

## Publicly readable

These objects are intentionally readable by `anon` and `authenticated` because the leaderboard is public:

- `public.leaderboard_all_time`
- `public.leaderboard_this_month`
- `public.leaderboard_with_previous_rank`
- `public.member_point_history`

Notes:

- these are `SELECT`-only for public roles
- these views are exposed through explicit read-only grants, not `security_invoker`
- `member_point_history` exposes activity history and the admin display name/email fallback for the award source

## Admin-only tables

These tables are protected by RLS and only available to authenticated admins:

- `public.members`
- `public.point_events`
- `public.leaderboard_snapshots`
- `public.reason_templates`
- `public.admin_audit_logs`
- `public.admin_users`

General rules:

- regular admins can read and manage most app data
- super admins have extra privileges for sensitive actions

## Super admin only

The `super_admin` role is enforced in both the app and database policies for:

- managing `public.admin_users`
- deleting `public.members`
- deleting `public.point_events`
- accessing the auth-user management page and related server actions

Related helpers:

- `public.is_admin()`
- `public.is_super_admin()`

## Audit log protections

`public.admin_audit_logs` is restricted so:

- admins can read logs
- admins can insert logs
- insert policy requires `actor_admin_id = auth.uid()`

This prevents one admin from writing a log row pretending to be another admin.

## Snapshot functions

Snapshot functions are `security definer`:

- `public.capture_leaderboard_snapshots()`
- `public.capture_member_snapshots(uuid[])`

They are executable by `authenticated`, but the app only calls the member-scoped function in admin flows.

## Internal-only function

`public.set_updated_at()` is not intended for direct client use.

- direct execute access is revoked from `public`, `anon`, and `authenticated`
- it is only used by triggers

## Auth users

Auth users are not seeded directly through SQL anymore.

Recommended bootstrap flow:

1. create the auth user in Supabase Auth
2. insert a matching row into `public.admin_users`
3. assign `admin` or `super_admin`

Example:

```sql
insert into public.admin_users (id, role)
values ('your-auth-user-id', 'super_admin');
```

## Important operational note

If you add new tables, views, RPCs, or triggers:

1. decide whether they are public, admin-only, or super-admin-only
2. add explicit grants
3. add RLS if the object is a table
4. document the decision here if it affects access boundaries
