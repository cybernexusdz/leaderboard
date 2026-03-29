create or replace view public.leaderboard_all_time
with (security_invoker = true) as
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

create or replace view public.leaderboard_this_month
with (security_invoker = true) as
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

create or replace view public.leaderboard_with_previous_rank
with (security_invoker = true) as
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

create or replace view public.member_point_history
with (security_invoker = true) as
select
  pe.id,
  pe.member_id,
  pe.activity,
  pe.points_change,
  pe.created_at,
  pe.awarded_by,
  coalesce(
    au.raw_user_meta_data ->> 'display_name',
    au.email,
    'Unknown admin'
  ) as awarded_by_name
from public.point_events pe
left join auth.users au
  on au.id = pe.awarded_by;
