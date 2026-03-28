"use server"

import { requireAdmin, requireSuperAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"
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

type CreateAuthUserInput = {
  email: string
  password: string
  role: "registered" | "admin" | "super_admin"
}

type UpdateAuthUserInput = {
  userId: string
  email: string
  password?: string
  role: "registered" | "admin" | "super_admin"
}

type DeleteAuthUserInput = {
  userId: string
}

type AdminAuditLogInsert = {
  actionType: string
  entityType: string
  entityId?: string | null
  entityLabel?: string | null
  details?: Record<string, unknown>
}

async function insertAdminAuditLogs(
  entries: AdminAuditLogInsert[],
  actor: {
    supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]
    userId: string
    userEmail: string | null
  },
) {
  if (entries.length === 0) {
    return
  }

  const { error } = await actor.supabase.from("admin_audit_logs").insert(
    entries.map((entry) => ({
      actor_admin_id: actor.userId,
      actor_email: actor.userEmail,
      action_type: entry.actionType,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      entity_label: entry.entityLabel ?? null,
      details: entry.details ?? {},
    })),
  )

  if (error) {
    throw error
  }
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

  const admin = await requireAdmin()
  const { supabase, userId } = admin

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, display_name")
    .in("id", memberIds)

  if (membersError) {
    throw membersError
  }

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

  await insertAdminAuditLogs(
    (members ?? []).map((member) => ({
      actionType: "points_adjusted",
      entityType: "member",
      entityId: member.id,
      entityLabel: member.display_name,
      details: {
        activity: trimmedActivity,
        pointsChange,
        affectedMemberIds: memberIds,
        affectedMemberCount: memberIds.length,
      },
    })),
    admin,
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/logs")
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

  const admin = await requireAdmin()
  const { supabase } = admin

  const { data: existingMember, error: existingMemberError } = await supabase
    .from("members")
    .select("id, display_name, avatar_url, is_active")
    .eq("id", memberId)
    .single()

  if (existingMemberError) {
    throw existingMemberError
  }

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

  await insertAdminAuditLogs(
    [
      {
        actionType: "member_updated",
        entityType: "member",
        entityId: memberId,
        entityLabel: trimmedName,
        details: {
          before: {
            name: existingMember.display_name,
            image: existingMember.avatar_url,
            status: existingMember.is_active ? "active" : "inactive",
          },
          after: {
            name: trimmedName,
            image: trimmedImage || null,
            status,
          },
        },
      },
    ],
    admin,
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/logs")
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

  const admin = await requireAdmin()
  const { supabase } = admin

  const { data: createdMember, error } = await supabase
    .from("members")
    .insert({
      display_name: trimmedName,
      avatar_url: trimmedImage || null,
      is_active: status === "active",
    })
    .select("id, display_name")
    .single()

  if (error) {
    throw error
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "member_created",
        entityType: "member",
        entityId: createdMember.id,
        entityLabel: createdMember.display_name,
        details: {
          name: trimmedName,
          image: trimmedImage || null,
          status,
        },
      },
    ],
    admin,
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/logs")
}

export async function deleteMember({ memberId }: DeleteMemberInput) {
  const admin = await requireAdmin()
  const { supabase } = admin

  if (admin.role !== "super_admin") {
    throw new Error("Only super admins can delete members.")
  }

  const { data: existingMember, error: existingMemberError } = await supabase
    .from("members")
    .select("id, display_name, avatar_url, is_active")
    .eq("id", memberId)
    .single()

  if (existingMemberError) {
    throw existingMemberError
  }

  const { error } = await supabase.from("members").delete().eq("id", memberId)

  if (error) {
    throw error
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "member_deleted",
        entityType: "member",
        entityId: existingMember.id,
        entityLabel: existingMember.display_name,
        details: {
          name: existingMember.display_name,
          image: existingMember.avatar_url,
          status: existingMember.is_active ? "active" : "inactive",
        },
      },
    ],
    admin,
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/logs")
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

  const admin = await requireAdmin()
  const { supabase } = admin

  const { data: createdTemplate, error } = await supabase
    .from("reason_templates")
    .insert({
      title: trimmedTitle,
      points_change: pointsChange,
      is_active: isActive,
    })
    .select("id, title")
    .single()

  if (error) {
    throw error
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "reason_template_created",
        entityType: "reason_template",
        entityId: createdTemplate.id,
        entityLabel: createdTemplate.title,
        details: {
          title: trimmedTitle,
          pointsChange,
          isActive,
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
  revalidatePath("/admin/logs")
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

  const admin = await requireAdmin()
  const { supabase } = admin

  const { data: existingTemplate, error: existingTemplateError } = await supabase
    .from("reason_templates")
    .select("id, title, points_change, is_active")
    .eq("id", templateId)
    .single()

  if (existingTemplateError) {
    throw existingTemplateError
  }

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

  await insertAdminAuditLogs(
    [
      {
        actionType: "reason_template_updated",
        entityType: "reason_template",
        entityId: templateId,
        entityLabel: trimmedTitle,
        details: {
          before: {
            title: existingTemplate.title,
            pointsChange: existingTemplate.points_change,
            isActive: existingTemplate.is_active,
          },
          after: {
            title: trimmedTitle,
            pointsChange,
            isActive,
          },
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
  revalidatePath("/admin/logs")
}

export async function deleteReasonTemplate({
  templateId,
}: DeleteReasonTemplateInput) {
  const admin = await requireAdmin()
  const { supabase } = admin

  const { data: existingTemplate, error: existingTemplateError } = await supabase
    .from("reason_templates")
    .select("id, title, points_change, is_active")
    .eq("id", templateId)
    .single()

  if (existingTemplateError) {
    throw existingTemplateError
  }

  const { error } = await supabase
    .from("reason_templates")
    .delete()
    .eq("id", templateId)

  if (error) {
    throw error
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "reason_template_deleted",
        entityType: "reason_template",
        entityId: existingTemplate.id,
        entityLabel: existingTemplate.title,
        details: {
          title: existingTemplate.title,
          pointsChange: existingTemplate.points_change,
          isActive: existingTemplate.is_active,
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin")
  revalidatePath("/admin/templates")
  revalidatePath("/admin/logs")
}

export async function createAuthUser({
  email,
  password,
  role,
}: CreateAuthUserInput) {
  const admin = await requireSuperAdmin()
  const authAdmin = createAdminClient()
  const normalizedEmail = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  if (!normalizedEmail) {
    throw new Error("Email is required.")
  }

  if (trimmedPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.")
  }

  const { data, error } = await authAdmin.auth.admin.createUser({
    email: normalizedEmail,
    password: trimmedPassword,
    email_confirm: true,
  })

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error("Unable to create auth user.")
  }

  if (role !== "registered") {
    const { error: roleError } = await admin.supabase.from("admin_users").upsert({
      id: data.user.id,
      role,
    })

    if (roleError) {
      throw roleError
    }
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "auth_user_created",
        entityType: "auth_user",
        entityId: data.user.id,
        entityLabel: normalizedEmail,
        details: {
          email: normalizedEmail,
          role,
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin/users")
  revalidatePath("/admin/logs")
}

export async function updateAuthUser({
  userId,
  email,
  password,
  role,
}: UpdateAuthUserInput) {
  const admin = await requireSuperAdmin()
  const authAdmin = createAdminClient()
  const normalizedEmail = email.trim().toLowerCase()
  const trimmedPassword = password?.trim() ?? ""

  if (!normalizedEmail) {
    throw new Error("Email is required.")
  }

  if (trimmedPassword && trimmedPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.")
  }

  if (userId === admin.userId && role !== "super_admin") {
    throw new Error("You cannot remove your own super admin access.")
  }

  const { data: existingUserResponse, error: existingUserError } =
    await authAdmin.auth.admin.getUserById(userId)

  if (existingUserError) {
    throw existingUserError
  }

  const existingUser = existingUserResponse.user

  const { data: existingAdminRole, error: existingAdminRoleError } = await admin.supabase
    .from("admin_users")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (existingAdminRoleError) {
    throw existingAdminRoleError
  }

  const { error: updateError } = await authAdmin.auth.admin.updateUserById(userId, {
    email: normalizedEmail,
    ...(trimmedPassword ? { password: trimmedPassword } : {}),
  })

  if (updateError) {
    throw updateError
  }

  if (role === "registered") {
    const { error: roleDeleteError } = await admin.supabase
      .from("admin_users")
      .delete()
      .eq("id", userId)

    if (roleDeleteError) {
      throw roleDeleteError
    }
  } else {
    const { error: roleUpsertError } = await admin.supabase.from("admin_users").upsert({
      id: userId,
      role,
    })

    if (roleUpsertError) {
      throw roleUpsertError
    }
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "auth_user_updated",
        entityType: "auth_user",
        entityId: userId,
        entityLabel: normalizedEmail,
        details: {
          before: {
            email: existingUser.email ?? null,
            role: existingAdminRole?.role ?? "registered",
          },
          after: {
            email: normalizedEmail,
            role,
            passwordUpdated: Boolean(trimmedPassword),
          },
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin/users")
  revalidatePath("/admin/logs")
}

export async function deleteAuthUser({ userId }: DeleteAuthUserInput) {
  const admin = await requireSuperAdmin()
  const authAdmin = createAdminClient()

  if (userId === admin.userId) {
    throw new Error("You cannot delete your own account.")
  }

  const { data: existingUserResponse, error: existingUserError } =
    await authAdmin.auth.admin.getUserById(userId)

  if (existingUserError) {
    throw existingUserError
  }

  const existingUser = existingUserResponse.user

  const { data: existingAdminRole, error: existingAdminRoleError } = await admin.supabase
    .from("admin_users")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (existingAdminRoleError) {
    throw existingAdminRoleError
  }

  const { error } = await authAdmin.auth.admin.deleteUser(userId)

  if (error) {
    throw error
  }

  await insertAdminAuditLogs(
    [
      {
        actionType: "auth_user_deleted",
        entityType: "auth_user",
        entityId: userId,
        entityLabel: existingUser.email ?? userId,
        details: {
          email: existingUser.email ?? null,
          role: existingAdminRole?.role ?? "registered",
        },
      },
    ],
    admin,
  )

  revalidatePath("/admin/users")
  revalidatePath("/admin/logs")
}
