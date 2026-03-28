create or replace function public.capture_member_snapshots(member_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if member_ids is null or array_length(member_ids, 1) is null then
    return;
  end if;

  insert into public.leaderboard_snapshots (member_id, period_slug, rank, points)
  select
    id as member_id,
    'this_month'::text as period_slug,
    rank,
    points
  from public.leaderboard_this_month
  where id = any(member_ids);

  insert into public.leaderboard_snapshots (member_id, period_slug, rank, points)
  select
    id as member_id,
    'all_time'::text as period_slug,
    rank,
    points
  from public.leaderboard_all_time
  where id = any(member_ids);
end;
$$;

revoke all on function public.capture_member_snapshots(uuid[]) from public;
grant execute on function public.capture_member_snapshots(uuid[]) to authenticated;
