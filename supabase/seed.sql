-- Demo seed data for the leaderboard app.
-- Safe to run after the initial schema migration.
--
-- Note:
-- `admin_users` is intentionally not seeded here because it depends on real
-- rows in `auth.users`. After creating your first admin account in Supabase
-- Auth, insert that user's id into `public.admin_users`

insert into
  public.members (id, display_name, avatar_url, is_active)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Sofiane Dex',
    'https://cybernexusdz.vercel.app/images/team/sofiane-image-front.jpg',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Aziz Ben',
    'https://avatars.githubusercontent.com/u/204910182?v=4',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Achouak Nour',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Samira Mostefaoui',
    'https://cybernexusdz.vercel.app/images/team/samira-image-front.JPG',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Mendjour Lounis',
    'https://cybernexusdz.vercel.app/images/team/lounis-image-front.png',
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Norddine',
    'https://cybernexusdz.vercel.app/images/team/noureddine-image-front.jpg',
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Hafid',
    'https://cybernexusdz.vercel.app/images/team/hafid-image-front.png',
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Nadji Mechta',
    'https://cybernexusdz.vercel.app/images/team/nadji-image-front.png',
    true
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'Bachir',
    'https://cybernexusdz.vercel.app/images/team/bachir-iamge-front.jpg',
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Fatah',
    'https://cybernexusdz.vercel.app/images/team/fatah-image-front.png',
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Amine',
    'https://cybernexusdz.vercel.app/images/team/amine-image-front.jpg',
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Karim',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop',
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Mohamed Reggad',
    'https://cybernexusdz.vercel.app/images/team/reggad-image-front.png',
    true
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Islem',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop',
    true
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Aliah',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop',
    true
  ),
  (
    '12121212-1212-1212-1212-121212121212',
    'Samadoo',
    'https://cybernexusdz.vercel.app/images/team/tounssi-image-front.jpg',
    true
  ),
  (
    '13131313-1313-1313-1313-131313131313',
    'Ahlem Moussa',
    'https://cybernexusdz.vercel.app/images/team/ahlem-image-front.png',
    true
  ),
  (
    '14141414-1414-1414-1414-141414141414',
    'Adam Rhmni',
    'https://cybernexusdz.vercel.app/images/team/adam-image-front.jpg',
    true
  ),
  (
    '15151515-1515-1515-1515-151515151515',
    'Farah',
    'https://cybernexusdz.vercel.app/images/team/farah-image-front.png',
    true
  ),
  (
    '16161616-1616-1616-1616-161616161616',
    'Kawther Hadjadj',
    'https://cybernexusdz.vercel.app/images/team/kawther-image-front.jpg',
    true
  ),
  (
    '17171717-1717-1717-1717-171717171717',
    'Achraf Riadh',
    'https://cybernexusdz.vercel.app/images/team/riad-image-front.png',
    true
  ),
  (
    '18181818-1818-1818-1818-181818181818',
    'повар',
    'https://cybernexusdz.vercel.app/images/team/mlsvmdl-image-front.jpg',
    true
  ),
  (
    '19191919-1919-1919-1919-191919191919',
    'Rafika Rohdea',
    'https://cybernexusdz.vercel.app/images/team/rafika-image-front.png',
    true
  ),
  (
    '20202020-2020-2020-2020-202020202020',
    'Abderrhmane',
    'https://cybernexusdz.vercel.app/images/team/abdo-image-front.png',
    true
  ),
  (
    '21212121-2121-2121-2121-212121212121',
    'Rania Manel',
    'https://cybernexusdz.vercel.app/images/team/rania-image-front.png',
    true
  ),
  (
    'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5',
    'Abd Al-Jabbar',
    'https://cybernexusdz.vercel.app/images/team/joseph-image-front.jpg',
    true
  ),
  (
    '23232323-2323-2323-2323-232323232323',
    'Kamel',
    'https://cybernexusdz.vercel.app/images/team/kamel-image-front.png',
    true
  ),
  (
    '24242424-2424-2424-2424-242424242424',
    'Hakim',
    'https://cybernexusdz.vercel.app/images/team/hakim-image-front.jpg',
    true
  ),
  (
    '25252525-2525-2525-2525-252525252525',
    'Catrina',
    'https://cybernexusdz.vercel.app/images/team/sabrine-image-front.png',
    true
  ),
  (
    '26262626-2626-2626-2626-262626262626',
    'Salma',
    'https://cybernexusdz.vercel.app/images/team/selma-image-front.jpg',
    true
  ),
  (
    '27272727-2727-2727-2727-272727272727',
    'MrAhmed',
    'https://cybernexusdz.vercel.app/images/team/chikhaoui-image-front.png',
    true
  ),
  (
    '28282828-2828-2828-2828-282828282828',
    'Soltana',
    'https://cybernexusdz.vercel.app/images/team/soltana-iamge-front.png',
    true
  ),
  (
    '29292929-2929-2929-2929-292929292929',
    'Aya',
    'https://cybernexusdz.vercel.app/images/team/aya-image-front.png',
    true
  ),
  (
    '30303030-3030-3030-3030-303030303030',
    'Wissam',
    'https://cybernexusdz.vercel.app/images/team/wissam-image-front.png',
    true
  ),
  (
    '31313131-3131-3131-3131-313131313131',
    'Hadi Adda',
    'https://cybernexusdz.vercel.app/images/team/adda-image-front.jpg',
    true
  )
on conflict (id) do update
set
  display_name = excluded.display_name;

insert into
  public.point_events (
    id,
    member_id,
    activity,
    points_change,
    created_at
  )
values 
  (
    gen_random_uuid (),
    '11111111-1111-1111-1111-111111111111',
    'إنجاز مهمة رئيسية',
    15,
    now() - interval '2 days'
  ),
  (
    gen_random_uuid (),
    '11111111-1111-1111-1111-111111111111',
    'تنظيم حدث',
    20,
    now() - interval '5 days'
  ),
  (
    gen_random_uuid (),
    '11111111-1111-1111-1111-111111111111',
    'جلب شراكة رسمية',
    40,
    now() - interval '20 days'
  ),
  -- Salma
  (
    gen_random_uuid (),
    '22222222-2222-2222-2222-222222222222',
    'مساعدة عضو آخر',
    10,
    now() - interval '3 days'
  ),
  (
    gen_random_uuid (),
    '22222222-2222-2222-2222-222222222222',
    'إنشاء محتوى',
    6,
    now() - interval '10 days'
  ),
  -- Achouak Nour
  (
    gen_random_uuid (),
    '33333333-3333-3333-3333-333333333333',
    'تصميم منشور',
    5,
    now() - interval '4 days'
  ),
  (
    gen_random_uuid (),
    '33333333-3333-3333-3333-333333333333',
    'إبداع في التصميم',
    9,
    now() - interval '15 days'
  ),
  -- Adam Rhmni
  (
    gen_random_uuid (),
    '44444444-4444-4444-4444-444444444444',
    'تقديم عرض',
    7,
    now() - interval '2 days'
  ),
  (
    gen_random_uuid (),
    '44444444-4444-4444-4444-444444444444',
    'جودة العرض',
    10,
    now() - interval '12 days'
  ),
  -- Random distribution for rest
  (
    gen_random_uuid (),
    '55555555-5555-5555-5555-555555555555',
    'الحضور في الوقت',
    3,
    now() - interval '1 day'
  ),
  (
    gen_random_uuid (),
    '66666666-6666-6666-6666-666666666666',
    'التأخر',
    -2,
    now() - interval '6 days'
  ),
  (
    gen_random_uuid (),
    '77777777-7777-7777-7777-777777777777',
    'المشاركة في حدث',
    5,
    now() - interval '7 days'
  ),
  (
    gen_random_uuid (),
    '88888888-8888-8888-8888-888888888888',
    'عدم التفاعل',
    -3,
    now() - interval '9 days'
  ),
  (
    gen_random_uuid (),
    '99999999-9999-9999-9999-999999999999',
    'العمل الجماعي الممتاز',
    9,
    now() - interval '3 days'
  ),
  (
    gen_random_uuid (),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'التكاسل',
    -5,
    now() - interval '11 days'
  ),
  (
    gen_random_uuid (),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'اقتراح فكرة جديدة',
    6,
    now() - interval '5 days'
  ),
  (
    gen_random_uuid (),
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'تحسين عملية داخلية',
    10,
    now() - interval '13 days'
  ),
  (
    gen_random_uuid (),
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'تقديم تقرير مفصل',
    7,
    now() - interval '8 days'
  ),
  (
    gen_random_uuid (),
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'عدم تقديم التقرير',
    -6,
    now() - interval '14 days'
  ),
  (
    gen_random_uuid (),
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'المبادرة بدون طلب',
    6,
    now() - interval '6 days'
  ),
  (
    gen_random_uuid (),
    '12121212-1212-1212-1212-121212121212',
    'زيادة التفاعل',
    10,
    now() - interval '2 days'
  ),
  (
    gen_random_uuid (),
    '13131313-1313-1313-1313-131313131313',
    'إدارة حساب',
    8,
    now() - interval '4 days'
  ),
  (
    gen_random_uuid (),
    '14141414-1414-1414-1414-141414141414',
    'نشر منتظم',
    4,
    now() - interval '10 days'
  ),
  (
    gen_random_uuid (),
    '15151515-1515-1515-1515-151515151515',
    'تصوير حدث',
    6,
    now() - interval '6 days'
  ),
  (
    gen_random_uuid (),
    '16161616-1616-1616-1616-161616161616',
    'مونتاج فيديو',
    8,
    now() - interval '9 days'
  ),
  (
    gen_random_uuid (),
    '17171717-1717-1717-1717-171717171717',
    'تغطية حدث كاملة',
    12,
    now() - interval '7 days'
  ),
  (
    gen_random_uuid (),
    '18181818-1818-1818-1818-181818181818',
    'إرسال تقرير التغطية',
    5,
    now() - interval '12 days'
  );

insert into
  public.leaderboard_snapshots (
    id,
    member_id,
    period_slug,
    rank,
    points,
    captured_at
  )
values
  -- THIS MONTH
  (
    gen_random_uuid (),
    '11111111-1111-1111-1111-111111111111',
    'this_month',
    1,
    75,
    now()
  ),
  (
    gen_random_uuid (),
    '22222222-2222-2222-2222-222222222222',
    'this_month',
    2,
    30,
    now()
  ),
  (
    gen_random_uuid (),
    '33333333-3333-3333-3333-333333333333',
    'this_month',
    3,
    28,
    now()
  ),
  (
    gen_random_uuid (),
    '44444444-4444-4444-4444-444444444444',
    'this_month',
    4,
    25,
    now()
  ),
  (
    gen_random_uuid (),
    '55555555-5555-5555-5555-555555555555',
    'this_month',
    5,
    10,
    now()
  ),
  (
    gen_random_uuid (),
    '66666666-6666-6666-6666-666666666666',
    'this_month',
    6,
    8,
    now()
  ),
  (
    gen_random_uuid (),
    '77777777-7777-7777-7777-777777777777',
    'this_month',
    7,
    7,
    now()
  ),
  (
    gen_random_uuid (),
    '88888888-8888-8888-8888-888888888888',
    'this_month',
    8,
    6,
    now()
  ),
  -- ALL TIME
  (
    gen_random_uuid (),
    '11111111-1111-1111-1111-111111111111',
    'all_time',
    1,
    420,
    now()
  ),
  (
    gen_random_uuid (),
    '22222222-2222-2222-2222-222222222222',
    'all_time',
    2,
    310,
    now()
  ),
  (
    gen_random_uuid (),
    '33333333-3333-3333-3333-333333333333',
    'all_time',
    3,
    290,
    now()
  ),
  (
    gen_random_uuid (),
    '44444444-4444-4444-4444-444444444444',
    'all_time',
    4,
    250,
    now()
  ),
  (
    gen_random_uuid (),
    '55555555-5555-5555-5555-555555555555',
    'all_time',
    5,
    200,
    now()
  ),
  (
    gen_random_uuid (),
    '66666666-6666-6666-6666-666666666666',
    'all_time',
    6,
    180,
    now()
  ),
  (
    gen_random_uuid (),
    '77777777-7777-7777-7777-777777777777',
    'all_time',
    7,
    150,
    now()
  ),
  (
    gen_random_uuid (),
    '88888888-8888-8888-8888-888888888888',
    'all_time',
    8,
    120,
    now()
  )
on conflict (id) do nothing;

insert into
  public.reason_templates (id, title, points_change, is_active)
values
  ('a0000001-0000-0000-0000-000000000001', 'إنجاز مهمة رئيسية', 15, true),
  ('a0000001-0000-0000-0000-000000000002', 'إنجاز مهمة صغيرة', 5, true),
  ('a0000001-0000-0000-0000-000000000003', 'حل مشكلة تقنية أو تنظيمية', 8, true),
  ('a0000001-0000-0000-0000-000000000004', 'مساعدة عضو آخر', 10, true),
  ('a0000001-0000-0000-0000-000000000005', 'تأطير وتنظيم ورشة كاملة', 25, true),
  ('a0000001-0000-0000-0000-000000000006', 'الحضور في الوقت', 3, true),
  ('a0000001-0000-0000-0000-000000000007', 'التأخر', -2, true),
  ('a0000001-0000-0000-0000-000000000008', 'الغياب بدون عذر', -5, true),
  ('a0000001-0000-0000-0000-000000000009', 'المشاركة الفعالة في الاجتماع', 4, true),
  ('a0000001-0000-0000-0000-000000000010', 'عدم التفاعل', -3, true),
  ('a0000001-0000-0000-0000-000000000011', 'اقتراح فكرة جديدة', 6, true),
  ('a0000001-0000-0000-0000-000000000012', 'تطبيق فكرة مبتكرة', 12, true),
  ('a0000001-0000-0000-0000-000000000013', 'تحسين عملية داخلية', 10, true),
  ('a0000001-0000-0000-0000-000000000014', 'تقديم تقرير مفصل', 7, true),
  ('a0000001-0000-0000-0000-000000000015', 'عدم تقديم التقرير', -6, true),
  ('a0000001-0000-0000-0000-000000000016', 'المشاركة في حدث', 5, true),
  ('a0000001-0000-0000-0000-000000000017', 'تنظيم حدث', 20, true),
  ('a0000001-0000-0000-0000-000000000018', 'المساهمة في التنظيم', 8, true),
  ('a0000001-0000-0000-0000-000000000019', 'عدم الالتزام بالمهام', -7, true),
  ('a0000001-0000-0000-0000-000000000020', 'العمل الجماعي الممتاز', 9, true),
  ('a0000001-0000-0000-0000-000000000021', 'إثارة مشاكل داخل الفريق', -10, true),
  ('a0000001-0000-0000-0000-000000000022', 'احترام القوانين', 2, true),
  ('a0000001-0000-0000-0000-000000000023', 'خرق القوانين', -8, true),
  ('a0000001-0000-0000-0000-000000000024', 'المبادرة بدون طلب', 6, true),
  ('a0000001-0000-0000-0000-000000000025', 'التكاسل', -5, true),
  ('a0000001-0000-0000-0000-000000000026', 'تحقيق هدف شهري', 15, true),
  ('a0000001-0000-0000-0000-000000000027', 'عدم تحقيق الهدف', -10, true),
  ('a0000001-0000-0000-0000-000000000028', 'المساهمة في التسويق', 7, true),
  ('a0000001-0000-0000-0000-000000000029', 'إنشاء محتوى', 6, true),
  ('a0000001-0000-0000-0000-000000000030', 'تصميم منشور', 5, true),
  ('a0000001-0000-0000-0000-000000000031', 'إدارة حساب', 8, true),
  ('a0000001-0000-0000-0000-000000000032', 'زيادة التفاعل', 10, true),
  ('a0000001-0000-0000-0000-000000000033', 'نشر منتظم', 4, true),
  ('a0000001-0000-0000-0000-000000000034', 'عدم النشر', -6, true),
  ('a0000001-0000-0000-0000-000000000035', 'تصوير حدث', 6, true),
  ('a0000001-0000-0000-0000-000000000036', 'مونتاج فيديو', 8, true),
  ('a0000001-0000-0000-0000-000000000037', 'إبداع في التصميم', 9, true),
  ('a0000001-0000-0000-0000-000000000038', 'تغطية حدث كاملة', 12, true),
  ('a0000001-0000-0000-0000-000000000039', 'إرسال تقرير التغطية', 5, true),
  ('a0000001-0000-0000-0000-000000000040', 'التأخر في التسليم', -4, true),
  ('a0000001-0000-0000-0000-000000000041', 'تقديم عرض', 7, true),
  ('a0000001-0000-0000-0000-000000000042', 'جودة العرض', 10, true),
  ('a0000001-0000-0000-0000-000000000043', 'ضعف العرض', -5, true),
  ('a0000001-0000-0000-0000-000000000044', 'الإجابة على الأسئلة', 4, true),
  ('a0000001-0000-0000-0000-000000000045', 'عدم التحضير', -6, true),
  ('a0000001-0000-0000-0000-000000000046', 'التفاعل مع الجمهور', 6, true),
  ('a0000001-0000-0000-0000-000000000047', 'تنظيم الوقت أثناء العرض', 5, true),
  ('a0000001-0000-0000-0000-000000000048', 'تجاوز الوقت', -3, true),
  ('a0000001-0000-0000-0000-000000000049', 'تقديم تدريب', 15, true),
  ('a0000001-0000-0000-0000-000000000050', 'جودة التدريب', 12, true),
  ('a0000001-0000-0000-0000-000000000051', 'ضعف التدريب', -8, true),
  ('a0000001-0000-0000-0000-000000000052', 'تحضير محتوى التدريب', 10, true),
  ('a0000001-0000-0000-0000-000000000053', 'عدم التحضير', -7, true),
  ('a0000001-0000-0000-0000-000000000054', 'تفاعل المتدربين', 8, true),
  ('a0000001-0000-0000-0000-000000000055', 'تقييم إيجابي', 10, true),
  ('a0000001-0000-0000-0000-000000000056', 'تقييم سلبي', -6, true),
  ('a0000001-0000-0000-0000-000000000057', 'متابعة المتدربين', 6, true),
  ('a0000001-0000-0000-0000-000000000058', 'جلب متحدث مميز', 20, true),
  ('a0000001-0000-0000-0000-000000000059', 'جلب مدرب من شركة معروفة', 25, true),
  ('a0000001-0000-0000-0000-000000000061', 'جلب شراكة رسمية', 40, true),
  ('a0000001-0000-0000-0000-000000000062', 'توفير تدريب خارجي للأعضاء', 35, true)
on conflict (id) do update
set
  title = excluded.title,
  points_change = excluded.points_change,
  is_active = excluded.is_active;