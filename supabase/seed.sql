-- Demo seed data for the leaderboard app.
-- Safe to run after the initial schema migration.
--
-- Note:
-- `admin_users` is intentionally not seeded here because it depends on real
-- rows in `auth.users`. After creating your first admin account in Supabase
-- Auth, insert that user's id into `public.admin_users`.

insert into public.members (id, display_name, avatar_url, is_active)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Johnny Rios',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Hammond',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Hodges',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Dora Hines',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Carolyn Francis',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Isaiah McGee',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Mark Holmes',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop',
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Georgie Clayton',
    null,
    true
  )
on conflict (id) do update
set
  display_name = excluded.display_name,
  avatar_url = excluded.avatar_url,
  is_active = excluded.is_active;

insert into public.point_events (id, member_id, activity, points_change, created_at)
values
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Completed task: Website redesign',
    500,
    date_trunc('month', now()) + interval '2 days'
  ),
  (
    'a1111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111111',
    'Code review contribution',
    250,
    date_trunc('month', now()) + interval '7 days'
  ),
  (
    'a1111111-1111-1111-1111-111111111113',
    '11111111-1111-1111-1111-111111111111',
    'Bug fix: Critical issue resolved',
    300,
    date_trunc('month', now()) + interval '11 days'
  ),
  (
    'a1111111-1111-1111-1111-111111111114',
    '11111111-1111-1111-1111-111111111111',
    'Last quarter bonus',
    8604,
    date_trunc('month', now()) - interval '45 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Shipped internal tooling update',
    400,
    date_trunc('month', now()) + interval '3 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Mentored teammate',
    232,
    date_trunc('month', now()) + interval '9 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222223',
    '22222222-2222-2222-2222-222222222222',
    'Feature delivery milestone',
    8000,
    date_trunc('month', now()) - interval '65 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333333',
    'Sprint contribution',
    378,
    date_trunc('month', now()) + interval '4 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333332',
    '33333333-3333-3333-3333-333333333333',
    'Cross-team support',
    500,
    date_trunc('month', now()) + interval '8 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'Quarterly delivery bonus',
    6000,
    date_trunc('month', now()) - interval '95 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444441',
    '44444444-4444-4444-4444-444444444444',
    'Documentation update',
    100,
    date_trunc('month', now()) + interval '5 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444442',
    '44444444-4444-4444-4444-444444444444',
    'Team presentation',
    200,
    date_trunc('month', now()) + interval '10 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444443',
    '44444444-4444-4444-4444-444444444444',
    'Missed deadline penalty',
    -50,
    date_trunc('month', now()) + interval '14 days'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'Legacy project contribution',
    6182,
    date_trunc('month', now()) - interval '120 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555551',
    '55555555-5555-5555-5555-555555555555',
    'Accessibility improvements',
    132,
    date_trunc('month', now()) + interval '6 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555552',
    '55555555-5555-5555-5555-555555555555',
    'QA support',
    100,
    date_trunc('month', now()) + interval '12 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555553',
    '55555555-5555-5555-5555-555555555555',
    'Platform migration help',
    5000,
    date_trunc('month', now()) - interval '85 days'
  ),
  (
    'a6666666-6666-6666-6666-666666666661',
    '66666666-6666-6666-6666-666666666666',
    'Bug bash participation',
    100,
    date_trunc('month', now()) + interval '1 day'
  ),
  (
    'a6666666-6666-6666-6666-666666666662',
    '66666666-6666-6666-6666-666666666666',
    'Performance optimization',
    100,
    date_trunc('month', now()) + interval '13 days'
  ),
  (
    'a6666666-6666-6666-6666-666666666663',
    '66666666-6666-6666-6666-666666666666',
    'Ops support',
    5000,
    date_trunc('month', now()) - interval '75 days'
  ),
  (
    'a7777777-7777-7777-7777-777777777771',
    '77777777-7777-7777-7777-777777777777',
    'Customer bug fix',
    97,
    date_trunc('month', now()) + interval '2 days'
  ),
  (
    'a7777777-7777-7777-7777-777777777772',
    '77777777-7777-7777-7777-777777777777',
    'Documentation review',
    100,
    date_trunc('month', now()) + interval '16 days'
  ),
  (
    'a7777777-7777-7777-7777-777777777773',
    '77777777-7777-7777-7777-777777777777',
    'Historical delivery work',
    4800,
    date_trunc('month', now()) - interval '150 days'
  ),
  (
    'a8888888-8888-8888-8888-888888888881',
    '88888888-8888-8888-8888-888888888888',
    'New member onboarding',
    100,
    date_trunc('month', now()) + interval '4 days'
  ),
  (
    'a8888888-8888-8888-8888-888888888882',
    '88888888-8888-8888-8888-888888888888',
    'Knowledge sharing session',
    100,
    date_trunc('month', now()) + interval '18 days'
  ),
  (
    'a8888888-8888-8888-8888-888888888883',
    '88888888-8888-8888-8888-888888888888',
    'Archived project carryover',
    3000,
    date_trunc('month', now()) - interval '200 days'
  )
on conflict (id) do nothing;

insert into public.leaderboard_snapshots (id, member_id, period_slug, rank, points, captured_at)
values
  (
    'b1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'this_month',
    1,
    1000,
    now() - interval '1 day'
  ),
  (
    'b1111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111111',
    'all_time',
    1,
    9300,
    now() - interval '1 day'
  ),
  (
    'b2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'this_month',
    3,
    500,
    now() - interval '1 day'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'all_time',
    2,
    8400,
    now() - interval '1 day'
  ),
  (
    'b3333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333333',
    'this_month',
    2,
    820,
    now() - interval '1 day'
  ),
  (
    'b3333333-3333-3333-3333-333333333332',
    '33333333-3333-3333-3333-333333333333',
    'all_time',
    3,
    6800,
    now() - interval '1 day'
  ),
  (
    'b4444444-4444-4444-4444-444444444441',
    '44444444-4444-4444-4444-444444444444',
    'this_month',
    5,
    200,
    now() - interval '1 day'
  ),
  (
    'b4444444-4444-4444-4444-444444444442',
    '44444444-4444-4444-4444-444444444444',
    'all_time',
    4,
    6300,
    now() - interval '1 day'
  ),
  (
    'b5555555-5555-5555-5555-555555555551',
    '55555555-5555-5555-5555-555555555555',
    'this_month',
    6,
    180,
    now() - interval '1 day'
  ),
  (
    'b5555555-5555-5555-5555-555555555552',
    '55555555-5555-5555-5555-555555555555',
    'all_time',
    5,
    5100,
    now() - interval '1 day'
  ),
  (
    'b6666666-6666-6666-6666-666666666661',
    '66666666-6666-6666-6666-666666666666',
    'this_month',
    7,
    150,
    now() - interval '1 day'
  ),
  (
    'b6666666-6666-6666-6666-666666666662',
    '66666666-6666-6666-6666-666666666666',
    'all_time',
    6,
    5050,
    now() - interval '1 day'
  ),
  (
    'b7777777-7777-7777-7777-777777777771',
    '77777777-7777-7777-7777-777777777777',
    'this_month',
    8,
    150,
    now() - interval '1 day'
  ),
  (
    'b7777777-7777-7777-7777-777777777772',
    '77777777-7777-7777-7777-777777777777',
    'all_time',
    7,
    4900,
    now() - interval '1 day'
  ),
  (
    'b8888888-8888-8888-8888-888888888881',
    '88888888-8888-8888-8888-888888888888',
    'this_month',
    9,
    100,
    now() - interval '1 day'
  ),
  (
    'b8888888-8888-8888-8888-888888888882',
    '88888888-8888-8888-8888-888888888888',
    'all_time',
    8,
    3100,
    now() - interval '1 day'
  )
on conflict (id) do nothing;
