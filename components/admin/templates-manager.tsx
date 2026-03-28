"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  createReasonTemplate,
  deleteReasonTemplate,
  updateReasonTemplate,
} from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AdminReasonTemplate } from "@/lib/admin"

export function ReasonTemplatesManager({
  templates,
}: {
  templates: AdminReasonTemplate[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newPoints, setNewPoints] = useState("")
  const [newStatus, setNewStatus] = useState(true)
  const [editingTemplate, setEditingTemplate] =
    useState<AdminReasonTemplate | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPoints, setEditPoints] = useState("")
  const [editStatus, setEditStatus] = useState(true)
  const [deletingTemplate, setDeletingTemplate] =
    useState<AdminReasonTemplate | null>(null)

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return templates
    }

    return templates.filter((template) =>
      template.title.toLowerCase().includes(normalizedSearch),
    )
  }, [templates, searchTerm])

  const resetCreateForm = () => {
    setNewTitle("")
    setNewPoints("")
    setNewStatus(true)
  }

  const handleCreateTemplate = () => {
    const pointsChange = Number(newPoints)

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void createReasonTemplate({
        title: newTitle,
        pointsChange,
        isActive: newStatus,
      })
        .then(() => {
          setFeedbackMessage("Reason template created successfully.")
          resetCreateForm()
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error
              ? error.message
              : "Unable to create reason template.",
          )
        })
    })
  }

  const openEditModal = (template: AdminReasonTemplate) => {
    setEditingTemplate(template)
    setEditTitle(template.title)
    setEditPoints(String(template.pointsChange))
    setEditStatus(template.isActive)
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) {
      return
    }

    const pointsChange = Number(editPoints)

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void updateReasonTemplate({
        templateId: editingTemplate.id,
        title: editTitle,
        pointsChange,
        isActive: editStatus,
      })
        .then(() => {
          setFeedbackMessage("Reason template updated successfully.")
          setEditingTemplate(null)
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error
              ? error.message
              : "Unable to update reason template.",
          )
        })
    })
  }

  const handleDeleteTemplate = () => {
    if (!deletingTemplate) {
      return
    }

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void deleteReasonTemplate({
        templateId: deletingTemplate.id,
      })
        .then(() => {
          setFeedbackMessage("Reason template deleted successfully.")
          setDeletingTemplate(null)
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error
              ? error.message
              : "Unable to delete reason template.",
          )
        })
    })
  }

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="space-y-4 p-6 mb-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_auto]">
          <div className="space-y-2">
            <Label htmlFor="template-title">Template title</Label>
            <Input
              id="template-title"
              placeholder="e.g. Sprint delivery bonus"
              value={newTitle} 
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-points">Points</Label>
            <Input
              id="template-points"
              type="number"
              placeholder="100"
              value={newPoints}
              className="chakra-bold"
              onChange={(event) => setNewPoints(event.target.value)}
            />
          </div>  
        </div> 
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                type="button"
                onClick={() => setNewStatus(true)}
                className={
                  newStatus
                    ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                    : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setNewStatus(false)}
                className={
                  !newStatus
                    ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                    : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                Inactive
              </button>
            </div>
          </div>
          <Button
            type="button"
            className="w-full sm:w-fit"
            onClick={handleCreateTemplate}
            disabled={isPending || !newTitle.trim() || !newPoints || Number(newPoints) === 0}
          >
            {isPending ? "Creating..." : "Create template"}
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
          <Label htmlFor="template-search">Search templates</Label>
          <Input
            id="template-search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No reason templates found.
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-foreground">{template.title}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        template.isActive
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-red-300 bg-red-50 text-red-700",
                      )}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="chakra-bold text-sm text-muted-foreground">
                    Points: {template.pointsChange > 0 ? "+" : ""}
                    {template.pointsChange}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEditModal(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeletingTemplate(template)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingTemplate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Edit reason template
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update the template title, points, and status.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEditingTemplate(null)}
                aria-label="Close edit reason template modal"
              >
                ×
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-title">Template title</Label>
                <Input
                  id="edit-template-title"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-points">Points</Label>
                <Input
                  id="edit-template-points"
                  type="number"
                  value={editPoints}
                  className="chakra-bold"
                  onChange={(event) => setEditPoints(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="inline-flex rounded-full bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setEditStatus(true)}
                    className={
                      editStatus
                        ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                        : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    }
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus(false)}
                    className={
                      !editStatus
                        ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                        : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    }
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingTemplate(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateTemplate}
                disabled={isPending || !editTitle.trim() || !editPoints || Number(editPoints) === 0}
              >
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingTemplate ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              Delete reason template
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete &quot;{deletingTemplate.title}&quot;.
            </p>

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This action cannot be undone.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingTemplate(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteTemplate}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete template"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
