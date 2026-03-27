import { createClient } from "@/lib/supabase/server"

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
}

export type AdminMemberHistoryMap = Record<string, AdminMemberHistoryEntry[]>

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

  return { supabase, userId: user.id }
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
    .from("point_events")
    .select("id, member_id, activity, points_change, created_at")
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
    })

    return acc
  }, {})
}
