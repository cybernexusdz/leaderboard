import { createClient } from "@/lib/supabase/server"

export type LeaderboardPeriod = "this_month" | "all_time"

export type LeaderboardUser = {
  id: string
  rank: number
  previousRank?: number | null
  name: string
  avatarUrl?: string | null
  points: number
}

export type PointsHistoryEntry = {
  id: string
  date: string
  activity: string
  pointsChange: number
}

export type LeaderboardHistoryMap = Record<string, PointsHistoryEntry[]>

type LeaderboardResponse = {
  podiumUsers: LeaderboardUser[]
  rankingUsers: LeaderboardUser[]
  historyByUserId: LeaderboardHistoryMap
}

const validPeriods: LeaderboardPeriod[] = ["this_month", "all_time"]

export function isLeaderboardPeriod(
  value: string | undefined,
): value is LeaderboardPeriod {
  return value !== undefined && validPeriods.includes(value as LeaderboardPeriod)
}

export async function getLeaderboard(period: LeaderboardPeriod) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("leaderboard_with_previous_rank")
    .select(
      "id, name, avatar_url, points, rank, previous_rank, period_slug",
    )
    .eq("period_slug", period)
    .order("rank", { ascending: true })

  if (error) {
    throw error
  }

  const users: LeaderboardUser[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    points: row.points,
    rank: row.rank,
    previousRank: row.previous_rank,
  }))

  return users
}

export async function getLeaderboardHistory(
  memberIds: string[],
  period: LeaderboardPeriod,
) {
  if (memberIds.length === 0) {
    return {}
  }

  const supabase = await createClient()

  let query = supabase
    .from("member_point_history")
    .select("id, member_id, activity, points_change, created_at")
    .in("member_id", memberIds)
    .order("created_at", { ascending: false })

  if (period === "this_month") {
    const startOfMonth = new Date()
    startOfMonth.setUTCDate(1)
    startOfMonth.setUTCHours(0, 0, 0, 0)

    query = query.gte("created_at", startOfMonth.toISOString())
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data ?? []).reduce<LeaderboardHistoryMap>((acc, row) => {
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

export async function getLeaderboardData(
  period: LeaderboardPeriod,
): Promise<LeaderboardResponse> {
  const users = await getLeaderboard(period)
  const historyByUserId = await getLeaderboardHistory(
    users.map((user) => user.id),
    period,
  )

  return {
    podiumUsers: users.slice(0, 3),
    rankingUsers: users.slice(3),
    historyByUserId,
  }
}
