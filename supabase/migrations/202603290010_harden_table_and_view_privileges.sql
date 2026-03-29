revoke all on table public.admin_users from anon, public;
revoke all on table public.members from anon, public;
revoke all on table public.point_events from anon, public;
revoke all on table public.leaderboard_snapshots from anon, public;
revoke all on table public.reason_templates from anon, public;
revoke all on table public.admin_audit_logs from anon, public;

grant select on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.members to authenticated;
grant select, insert, update, delete on table public.point_events to authenticated;
grant select, insert, update, delete on table public.leaderboard_snapshots to authenticated;
grant select, insert, update, delete on table public.reason_templates to authenticated;
grant select, insert on table public.admin_audit_logs to authenticated;

revoke all on table public.leaderboard_all_time from public;
revoke all on table public.leaderboard_this_month from public;
revoke all on table public.leaderboard_with_previous_rank from public;
revoke all on table public.member_point_history from public;

grant select on table public.leaderboard_all_time to authenticated, anon;
grant select on table public.leaderboard_this_month to authenticated, anon;
grant select on table public.leaderboard_with_previous_rank to authenticated, anon;
grant select on table public.member_point_history to authenticated, anon;

revoke all on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to postgres, service_role;
