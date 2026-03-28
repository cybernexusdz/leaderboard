create or replace function public.capture_leaderboard_snapshots()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.leaderboard_snapshots (member_id, period_slug, rank, points)
  select
    id as member_id,
    'this_month'::text as period_slug,
    rank,
    points
  from public.leaderboard_this_month;

  insert into public.leaderboard_snapshots (member_id, period_slug, rank, points)
  select
    id as member_id,
    'all_time'::text as period_slug,
    rank,
    points
  from public.leaderboard_all_time;
end;
$$;

revoke all on function public.capture_leaderboard_snapshots() from public;
grant execute on function public.capture_leaderboard_snapshots() to authenticated;
