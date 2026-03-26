create extension if not exists pgcrypto;

create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.point_events (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  activity text not null,
  points_change integer not null,
  awarded_by uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (activity <> '')
);

create table public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  period_slug text not null check (period_slug in ('this_month', 'all_time')),
  rank integer not null check (rank > 0),
  points integer not null,
  captured_at timestamptz not null default now()
);

create index members_is_active_idx
  on public.members(is_active);

create index point_events_member_id_idx
  on public.point_events(member_id);

create index point_events_created_at_idx
  on public.point_events(created_at desc);

create index leaderboard_snapshots_member_period_captured_idx
  on public.leaderboard_snapshots(member_id, period_slug, captured_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_set_updated_at
before update on public.members
for each row
execute function public.set_updated_at();

create or replace view public.leaderboard_all_time as
with totals as (
  select
    m.id,
    m.display_name as name,
    m.avatar_url,
    coalesce(sum(pe.points_change), 0) as points
  from public.members m
  left join public.point_events pe
    on pe.member_id = m.id
  where m.is_active = true
  group by m.id, m.display_name, m.avatar_url
),
ranked as (
  select
    id,
    name,
    avatar_url,
    points,
    rank() over (
      order by points desc, name asc, id asc
    ) as rank
  from totals
)
select
  id,
  name,
  avatar_url,
  'all_time'::text as period_slug,
  'All Time'::text as period_label,
  points,
  rank
from ranked;

create or replace view public.leaderboard_this_month as
with totals as (
  select
    m.id,
    m.display_name as name,
    m.avatar_url,
    coalesce(
      sum(pe.points_change) filter (
        where date_trunc('month', pe.created_at at time zone 'UTC') =
              date_trunc('month', now() at time zone 'UTC')
      ),
      0
    ) as points
  from public.members m
  left join public.point_events pe
    on pe.member_id = m.id
  where m.is_active = true
  group by m.id, m.display_name, m.avatar_url
),
ranked as (
  select
    id,
    name,
    avatar_url,
    points,
    rank() over (
      order by points desc, name asc, id asc
    ) as rank
  from totals
)
select
  id,
  name,
  avatar_url,
  'this_month'::text as period_slug,
  'This Month'::text as period_label,
  points,
  rank
from ranked;

create or replace view public.leaderboard_with_previous_rank as
with current_leaderboard as (
  select * from public.leaderboard_this_month
  union all
  select * from public.leaderboard_all_time
),
latest_snapshots as (
  select
    s.member_id,
    s.period_slug,
    s.rank as previous_rank,
    row_number() over (
      partition by s.member_id, s.period_slug
      order by s.captured_at desc
    ) as snapshot_order
  from public.leaderboard_snapshots s
)
select
  cl.id,
  cl.name,
  cl.avatar_url,
  cl.period_slug,
  cl.period_label,
  cl.points,
  cl.rank,
  ls.previous_rank
from current_leaderboard cl
left join latest_snapshots ls
  on ls.member_id = cl.id
 and ls.period_slug = cl.period_slug
 and ls.snapshot_order = 1;

alter table public.admin_users enable row level security;
alter table public.members enable row level security;
alter table public.point_events enable row level security;
alter table public.leaderboard_snapshots enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users admin
    where admin.id = auth.uid()
  );
$$;

create policy "admins can read admin_users"
on public.admin_users
for select
using (public.is_admin());

create policy "admins can manage admin_users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read members"
on public.members
for select
using (public.is_admin());

create policy "admins can manage members"
on public.members
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read point_events"
on public.point_events
for select
using (public.is_admin());

create policy "admins can manage point_events"
on public.point_events
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read leaderboard_snapshots"
on public.leaderboard_snapshots
for select
using (public.is_admin());

create policy "admins can manage leaderboard_snapshots"
on public.leaderboard_snapshots
for all
using (public.is_admin())
with check (public.is_admin());

grant select on public.leaderboard_all_time to authenticated;
grant select on public.leaderboard_this_month to authenticated;
grant select on public.leaderboard_with_previous_rank to authenticated;
