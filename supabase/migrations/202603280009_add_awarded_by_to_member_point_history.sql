create or replace view public.member_point_history as
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

grant select on public.member_point_history to authenticated;
grant select on public.member_point_history to anon;
