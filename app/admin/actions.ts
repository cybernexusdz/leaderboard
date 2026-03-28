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

type CreateMemberInput = {
  name: string
  image: string
  status: "active" | "inactive"
}

type DeleteMemberInput = {
  memberId: string
}

type CreateReasonTemplateInput = {
  title: string
  pointsChange: number
  isActive: boolean
}

type UpdateReasonTemplateInput = {
  templateId: string
  title: string
  pointsChange: number
  isActive: boolean
}

type DeleteReasonTemplateInput = {
  templateId: string
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

  const { error: snapshotError } = await supabase.rpc(
    "capture_member_snapshots",
    { member_ids: memberIds },
  )

  if (snapshotError) {
    throw snapshotError
  }

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

export async function createMember({
  name,
  image,
  status,
}: CreateMemberInput) {
  const trimmedName = name.trim()
  const trimmedImage = image.trim()

  if (!trimmedName) {
    throw new Error("Member name is required.")
  }

  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("members").insert({
    display_name: trimmedName,
    avatar_url: trimmedImage || null,
    is_active: status === "active",
  })

  if (error) {
    throw error
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteMember({ memberId }: DeleteMemberInput) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("members").delete().eq("id", memberId)

  if (error) {
    throw error
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function createReasonTemplate({
  title,
  pointsChange,
  isActive,
}: CreateReasonTemplateInput) {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    throw new Error("Template title is required.")
  }

  if (!Number.isFinite(pointsChange) || pointsChange === 0) {
    throw new Error("Template points must be a non-zero number.")
  }

  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("reason_templates").insert({
    title: trimmedTitle,
    points_change: pointsChange,
    is_active: isActive,
  })

  if (error) {
    throw error
  }

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
}

export async function updateReasonTemplate({
  templateId,
  title,
  pointsChange,
  isActive,
}: UpdateReasonTemplateInput) {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    throw new Error("Template title is required.")
  }

  if (!Number.isFinite(pointsChange) || pointsChange === 0) {
    throw new Error("Template points must be a non-zero number.")
  }

  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from("reason_templates")
    .update({
      title: trimmedTitle,
      points_change: pointsChange,
      is_active: isActive,
    })
    .eq("id", templateId)

  if (error) {
    throw error
  }

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
}

export async function deleteReasonTemplate({
  templateId,
}: DeleteReasonTemplateInput) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from("reason_templates")
    .delete()
    .eq("id", templateId)

  if (error) {
    throw error
  }

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
}
