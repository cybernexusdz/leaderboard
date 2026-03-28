"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  createAuthUser,
  deleteAuthUser,
  updateAuthUser,
} from "@/app/admin/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { AdminAuthUser, AuthUserRole } from "@/lib/admin"

export function AuthUsersManager({ users }: { users: AdminAuthUser[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<AuthUserRole>("registered")
  const [editingUser, setEditingUser] = useState<AdminAuthUser | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editRole, setEditRole] = useState<AuthUserRole>("registered")
  const [deletingUser, setDeletingUser] = useState<AdminAuthUser | null>(null)

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return users
    }

    return users.filter((user) =>
      [user.email ?? "", roleLabel(user.role)].join(" ").toLowerCase().includes(normalizedSearch),
    )
  }, [searchTerm, users])

  const resetCreateForm = () => {
    setNewEmail("")
    setNewPassword("")
    setNewRole("registered")
  }

  const handleCreateUser = () => {
    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void createAuthUser({
        email: newEmail,
        password: newPassword,
        role: newRole,
      })
        .then(() => {
          setFeedbackMessage("User created successfully.")
          resetCreateForm()
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error ? error.message : "Unable to create user.",
          )
        })
    })
  }

  const openEditModal = (user: AdminAuthUser) => {
    setEditingUser(user)
    setEditEmail(user.email ?? "")
    setEditPassword("")
    setEditRole(user.role)
  }

  const handleUpdateUser = () => {
    if (!editingUser) {
      return
    }

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void updateAuthUser({
        userId: editingUser.id,
        email: editEmail,
        password: editPassword,
        role: editRole,
      })
        .then(() => {
          setFeedbackMessage("Auth user updated successfully.")
          setEditingUser(null)
          setEditPassword("")
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error ? error.message : "Unable to update auth user.",
          )
        })
    })
  }

  const handleDeleteUser = () => {
    if (!deletingUser) {
      return
    }

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void deleteAuthUser({ userId: deletingUser.id })
        .then(() => {
          setFeedbackMessage("User deleted successfully.")
          setDeletingUser(null)
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error ? error.message : "Unable to delete user.",
          )
        })
    })
  }

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mb-6 space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
          <div className="space-y-2">
            <Label htmlFor="auth-user-email">Email</Label>
            <Input
              id="auth-user-email"
              type="email"
              placeholder="admin@example.com"
              value={newEmail} 
              onChange={(event) => setNewEmail(event.target.value)}
            />
          </div>
          <RoleSelector label="Role" value={newRole} onChange={setNewRole} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="auth-user-password">Password</Label>
            <Input
              id="auth-user-password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <Button
            type="button"
            className="w-full lg:w-fit"
            onClick={handleCreateUser}
            disabled={
              isPending || !newEmail.trim() || !newPassword.trim() || newPassword.trim().length < 6
            }
          >
            {isPending ? "Creating..." : "Create auth user"}
          </Button>
        </div>

        {feedbackMessage ? (
          <p className="text-sm text-green-700">{feedbackMessage}</p>
        ) : null}

        {feedbackError ? (
          <p className="text-sm text-red-700">{feedbackError}</p>
        ) : null}
      </Card>

      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="auth-users-search">Search auth users</Label>
          <Input
            id="auth-users-search"
            placeholder="Search by email or role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No auth users found.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-foreground">
                      {user.email ?? "No email"}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(roleBadgeClasses[user.role])}
                    >
                      {roleLabel(user.role)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(user.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last sign in:{" "}
                    {user.lastSignInAt ? formatDate(user.lastSignInAt) : "Never"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => openEditModal(user)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeletingUser(user)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Edit auth user</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update email, optional password, and access role.
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
                Close
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-auth-email">Email</Label>
                <Input
                  id="edit-auth-email"
                  type="email"
                  value={editEmail}
                  onChange={(event) => setEditEmail(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-auth-password">New password</Label>
                <Input
                  id="edit-auth-password"
                  type="password"
                  value={editPassword}
                  onChange={(event) => setEditPassword(event.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <RoleSelector label="Role" value={editRole} onChange={setEditRole} />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateUser}
                disabled={isPending || !editEmail.trim() || (editPassword ? editPassword.length < 6 : false)}
              >
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingUser ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">Delete auth user</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete {deletingUser.email ?? "this account"}.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteUser}>
                {isPending ? "Deleting..." : "Delete user"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RoleSelector({
  label,
  value,
  onChange,
}: {
  label: string
  value: AuthUserRole
  onChange: (value: AuthUserRole) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="inline-flex rounded-full bg-muted p-1">
        {(["registered", "admin", "super_admin"] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={
              role === value
                ? "w-full rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                : "w-full rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {roleLabel(role)}
          </button>
        ))}
      </div>
    </div>
  )
}

function roleLabel(role: AuthUserRole) {
  if (role === "super_admin") {
    return "Super_Admin"
  }

  if (role === "admin") {
    return "Admin"
  }

  return "Registered"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

const roleBadgeClasses: Record<AuthUserRole, string> = {
  registered: "border-slate-300 bg-slate-50 text-slate-700",
  admin: "border-sky-300 bg-sky-50 text-sky-700",
  super_admin: "border-amber-300 bg-amber-50 text-amber-700",
}
