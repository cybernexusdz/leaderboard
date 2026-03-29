# Leaderboard App

A Next.js + Supabase leaderboard application with:

- a public leaderboard homepage
- an admin dashboard for members and point management
- reason templates for faster point adjustments
- audit logs for admin actions
- auth-user management with `admin` and `super_admin` roles

## Overview

The project is split into two main areas:

- public app:
  - homepage leaderboard
  - points history modal
  - monthly and all-time views
- admin app:
  - member management
  - points assignment
  - reason template CRUD
  - audit log viewer
  - auth-user management

The leaderboard is backed by Supabase tables, views, RLS policies, and a small set of helper RPC functions.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Radix UI primitives
- Lucide icons

## Features

### Public leaderboard

- `This Month` and `All Time` periods
- podium layout for the top 3
- automatic fallback to plain list when podium users do not all have points
- rank movement indicators derived from `previousRank`
- member points history modal
- history entries show who awarded the points

### Admin dashboard

- search members
- filter by period
- filter by active/inactive state
- sort by points
- bulk point assignment
- confirmation modal before applying points
- reason template shortcuts
- member edit modal
- member status update
- super-admin-only member deletion
- super-admin-only point-history deletion

### Templates

- create, edit, activate/deactivate, and delete reason templates

### Audit logs

- track points adjustments
- track member CRUD
- track reason template CRUD
- track auth-user CRUD
- collapsible details payload in the logs UI

### Auth users

- create auth users
- edit email, password, role, and display name
- delete auth users
- promote registered users into `admin` or `super_admin`

## Project Structure

```text
app/
  page.tsx                  Public leaderboard page
  admin/
    page.tsx                Admin dashboard
    actions.ts             Server actions for admin flows
    templates/page.tsx     Reason templates page
    logs/page.tsx          Audit logs page
    users/page.tsx         Auth users page
  auth/                    Authentication routes

components/
  rankings-list.tsx        Public leaderboard UI
  admin/
    admin-dashboard.tsx
    admin-data-table.tsx
    points-manager.tsx
    templates-manager.tsx
    logs-manager.tsx
    auth-users-manager.tsx
  auth/
    login-form.tsx
    sign-up-form.tsx
    auth-button.tsx

lib/
  leaderboard.ts           Public leaderboard queries and types
  admin.ts                 Admin queries and types
  supabase/
    client.ts
    server.ts
    admin.ts
    proxy.ts

supabase/
  migrations/              Database schema and security migrations
  seed.sql                 App data seed
  SECURITY.md              Security notes
```

## Data Model

Main tables:

- `public.members`
- `public.point_events`
- `public.leaderboard_snapshots`
- `public.reason_templates`
- `public.admin_users`
- `public.admin_audit_logs`

Key views:

- `public.leaderboard_all_time`
- `public.leaderboard_this_month`
- `public.leaderboard_with_previous_rank`
- `public.member_point_history`

Key helper functions:

- `public.is_admin()`
- `public.is_super_admin()`
- `public.capture_leaderboard_snapshots()`
- `public.capture_member_snapshots(uuid[])`

## Ranking Logic

### Periods

The app supports two periods:

- `this_month`
- `all_time`

`this_month` is derived from `point_events.created_at` inside the current month.

`all_time` is derived from the full history of `point_events`.

No monthly reset job is required.

### Rank change

Rank movement is based on:

```text
previous_rank - current_rank
```

- `> 0`: moved up
- `< 0`: moved down
- `= 0`: no change

Snapshots are used to preserve previous rank values.

### Snapshot behavior

Before a points adjustment is applied, the app captures snapshots only for the affected members. This keeps `previousRank` meaningful without duplicating the entire leaderboard on every update.

## Roles

### Registered user

- has an auth account
- not an admin

### Admin

- can access the admin dashboard
- can manage members
- can assign points
- can manage reason templates
- can read audit logs

### Super admin

Includes everything an admin can do, plus:

- manage `admin_users`
- access auth-user management
- delete members
- delete point history entries

## Security

Security is enforced through:

- Supabase grants
- Row Level Security
- role helper functions
- `security_definer` functions where needed
- carefully granted public views for leaderboard reads

See [supabase/SECURITY.md](/Users/yassk/Documents/Coding/web/leaderboard-app/supabase/SECURITY.md) for the current security model.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Depending on your local workflow, you may also need a direct database connection string for seeding/reset tooling, for example:

```env
DATABASE_URL=your-postgres-connection-string
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create `.env` from `.env.example` and fill in your project values.

### 3. Run database migrations

Use the Supabase CLI or the SQL editor to apply everything in:

- [supabase/migrations](/Users/yassk/Documents/Coding/web/leaderboard-app/supabase/migrations)

Typical local CLI flow:

```bash
supabase db reset
```

or:

```bash
supabase migration up
```

### 4. Seed app data

Run:

```bash
supabase db reset
```

or execute [supabase/seed.sql](/Users/yassk/Documents/Coding/web/leaderboard-app/supabase/seed.sql) manually.

### 5. Create the first admin

Auth users are separate from leaderboard members.

To bootstrap the first admin:

1. create an auth user in Supabase Auth
2. insert that user id into `public.admin_users`
3. set the role to `admin` or `super_admin`

Example:

```sql
insert into public.admin_users (id, role)
values ('your-auth-user-id', 'super_admin');
```

### 6. Start the app

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Seeding Notes

Current seeding behavior:

- `supabase/seed.sql` seeds application data such as:
  - members
  - point events
  - leaderboard snapshots
  - reason templates
- auth users are not created directly by the SQL seed

If you want a seeded admin account, create it in Supabase Auth first and then insert the corresponding role row into `public.admin_users`.

## Admin Workflows

### Members

- create new members
- update name, image, and active status
- delete members as super admin

### Point updates

- assign points to one or more selected members
- use manual reason + points
- or choose a predefined reason template
- review changes in a confirmation modal before submit

### Point history removal

Super admins can remove individual point history entries from the member edit modal.

### Reason templates

- create
- update
- activate/deactivate
- delete

### Audit logs

Every important admin action can be recorded with:

- actor
- action type
- entity type
- entity label
- JSON details payload

### Auth users

Super admins can:

- create users
- edit email
- edit password
- edit display name
- change role
- delete users

## Public UI Notes

- the podium is shown only when all top 3 users have points
- if one of the podium users has `0` points, the whole podium is hidden and everyone is rendered in the ranked list
- if a member has `0` points and no points history, rank-change indicators are hidden

## Troubleshooting

### "Data that blocks navigation was accessed outside of `<Suspense>`"

The app already uses `Suspense` boundaries for the public page and admin pages. If this reappears, check any new async route-level component first.

### "Database error querying schema" during login

This usually points to a malformed auth user in Supabase Auth rather than the login form itself. Prefer creating auth users through the Auth dashboard or the admin auth-user page.

### Admin page says access denied

Make sure the signed-in auth user exists in `public.admin_users`.

### Public leaderboard loads but history is empty

Check that:

- migrations for `member_point_history` were applied
- `point_events` actually contain data
- `awarded_by` values are present if you expect "Added by ..." labels
