create or replace view public.member_point_history as
select
  id,
  member_id,
  activity,
  points_change,
  created_at
from public.point_events;

grant select on public.member_point_history to authenticated;
grant select on public.member_point_history to anon;

grant select on public.leaderboard_all_time to anon;
grant select on public.leaderboard_this_month to anon;
grant select on public.leaderboard_with_previous_rank to anon;
