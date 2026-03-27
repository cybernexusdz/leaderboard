"use server"

import { requireAdmin } from "@/lib/admin"
import { revalidatePath } from "next/cache"

type ApplyPointsAdjustmentInput = {
  activity: string
  memberIds: string[]
  pointsChange: number
}

type UpdateMemberProfileInput = {
  memberId: string
  name: string
  image: string
  status: "active" | "inactive"
}

export async function applyPointsAdjustment({
  activity,
  memberIds,
  pointsChange,
}: ApplyPointsAdjustmentInput) {
  const trimmedActivity = activity.trim()

  if (!trimmedActivity) {
    throw new Error("A reason is required for each points adjustment.")
  }

  if (!Number.isFinite(pointsChange) || pointsChange === 0) {
    throw new Error("Points change must be a non-zero number.")
  }

  if (memberIds.length === 0) {
    throw new Error("Select at least one member.")
  }

  const { supabase, userId } = await requireAdmin()

  const { error } = await supabase.from("point_events").insert(
    memberIds.map((memberId) => ({
      member_id: memberId,
      activity: trimmedActivity,
      points_change: pointsChange,
      awarded_by: userId,
    })),
  )

  if (error) {
    throw error
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateMemberProfile({
  memberId,
  name,
  image,
  status,
}: UpdateMemberProfileInput) {
  const trimmedName = name.trim()
  const trimmedImage = image.trim()

  if (!trimmedName) {
    throw new Error("Member name is required.")
  }

  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from("members")
    .update({
      display_name: trimmedName,
      avatar_url: trimmedImage || null,
      is_active: status === "active",
    })
    .eq("id", memberId)

  if (error) {
    throw error
  }

  revalidatePath("/")
  revalidatePath("/admin")
}
