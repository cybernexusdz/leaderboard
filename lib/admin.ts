import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export type AdminRole = "admin" | "super_admin"
export type AuthUserRole = "registered" | AdminRole

export type AdminMember = {
  id: string
  name: string
  image: string | null
  status: "active" | "inactive"
  thisMonthPoints: number
  allTimePoints: number
}

export type AdminMemberHistoryEntry = {
  id: string
  activity: string
  pointsChange: number
  date: string
  awardedByName: string | null
}

export type AdminMemberHistoryMap = Record<string, AdminMemberHistoryEntry[]>

export type AdminReasonTemplate = {
  id: string
  title: string
  pointsChange: number
  isActive: boolean
}

export type AdminAuditLog = {
  id: string
  actorAdminId: string
  actorEmail: string | null
  actionType: string
  entityType: string
  entityId: string | null
  entityLabel: string | null
  details: Record<string, unknown>
  createdAt: string
}

export type AdminAuthUser = {
  id: string
  email: string | null
  displayName: string | null
  role: AuthUserRole
  createdAt: string
  lastSignInAt: string | null
}

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You must be signed in to access the admin dashboard.")
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin")

  if (adminError) {
    throw adminError
  }

  if (!isAdmin) {
    throw new Error("You do not have admin access.")
  }

  const { data: adminUser, error: adminUserError } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (adminUserError) {
    throw adminUserError
  }

  return {
    supabase,
    userId: user.id,
    userEmail: user.email ?? null,
    role: adminUser.role as AdminRole,
  }
}

export async function requireSuperAdmin() {
  const admin = await requireAdmin()

  if (admin.role !== "super_admin") {
    throw new Error("Only super admins can manage users.")
  }

  return admin
}

export async function getAdminMembers(): Promise<AdminMember[]> {
  const { supabase } = await requireAdmin()

  const [
    { data: members, error: membersError },
    { data: allTimeTotals, error: allTimeTotalsError },
    { data: thisMonthTotals, error: thisMonthTotalsError },
  ] = await Promise.all([
      supabase
        .from("members")
        .select("id, display_name, avatar_url, is_active")
        .order("display_name", { ascending: true }),
      supabase.from("leaderboard_all_time").select("id, points"),
      supabase.from("leaderboard_this_month").select("id, points"),
    ])

  if (membersError) {
    throw membersError
  }

  if (allTimeTotalsError) {
    throw allTimeTotalsError
  }

  if (thisMonthTotalsError) {
    throw thisMonthTotalsError
  }

  const allTimePointsByMemberId = new Map(
    (allTimeTotals ?? []).map((member) => [member.id, member.points]),
  )
  const thisMonthPointsByMemberId = new Map(
    (thisMonthTotals ?? []).map((member) => [member.id, member.points]),
  )

  return (members ?? []).map((member) => ({
    id: member.id,
    name: member.display_name,
    image: member.avatar_url,
    status: member.is_active ? "active" : "inactive",
    thisMonthPoints: thisMonthPointsByMemberId.get(member.id) ?? 0,
    allTimePoints: allTimePointsByMemberId.get(member.id) ?? 0,
  }))
}

export async function getAdminMemberHistory(): Promise<AdminMemberHistoryMap> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from("member_point_history")
    .select(
      "id, member_id, activity, points_change, created_at, awarded_by_name",
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).reduce<AdminMemberHistoryMap>((acc, row) => {
    if (!acc[row.member_id]) {
      acc[row.member_id] = []
    }

    acc[row.member_id].push({
      id: row.id,
      activity: row.activity,
      pointsChange: row.points_change,
      date: row.created_at,
      awardedByName: row.awarded_by_name,
    })

    return acc
  }, {})
}

export async function getAdminReasonTemplates(): Promise<AdminReasonTemplate[]> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from("reason_templates")
    .select("id, title, points_change, is_active")
    .order("title", { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((template) => ({
    id: template.id,
    title: template.title,
    pointsChange: template.points_change,
    isActive: template.is_active,
  }))
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select(
      "id, actor_admin_id, actor_email, action_type, entity_type, entity_id, entity_label, details, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(250)

  if (error) {
    throw error
  }

  return (data ?? []).map((log) => ({
    id: log.id,
    actorAdminId: log.actor_admin_id,
    actorEmail: log.actor_email,
    actionType: log.action_type,
    entityType: log.entity_type,
    entityId: log.entity_id,
    entityLabel: log.entity_label,
    details:
      log.details && typeof log.details === "object" && !Array.isArray(log.details)
        ? (log.details as Record<string, unknown>)
        : {},
    createdAt: log.created_at,
  }))
}

export async function getAdminAuthUsers(): Promise<AdminAuthUser[]> {
  const { supabase } = await requireSuperAdmin()
  const adminClient = createAdminClient()

  const { data: adminUsers, error: adminUsersError } = await supabase
    .from("admin_users")
    .select("id, role")

  if (adminUsersError) {
    throw adminUsersError
  }

  const adminRoleByUserId = new Map(
    (adminUsers ?? []).map((adminUser) => [adminUser.id, adminUser.role as AdminRole]),
  )

  const users: AdminAuthUser[] = []
  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    })

    if (error) {
      throw error
    }

    for (const user of data.users) {
      users.push({
        id: user.id,
        email: user.email ?? null,
        displayName:
          typeof user.user_metadata?.display_name === "string"
            ? user.user_metadata.display_name
            : null,
        role: adminRoleByUserId.get(user.id) ?? "registered",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
      })
    }

    if (data.users.length < perPage) {
      break
    }

    page += 1
  }

  return users.toSorted((left, right) =>
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}
