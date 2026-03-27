"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, X } from "lucide-react"
import { cn, formatHistoryDate } from "@/lib/utils"
import type { AdminMember, AdminMemberHistoryEntry } from "@/lib/admin"

interface PointsManagerProps {
  selectedMember: AdminMember | null
  selectedCount: number
  affectedCount: number
  periodFilter: "this_month" | "all_time"
  history: AdminMemberHistoryEntry[]
  isPending: boolean
  feedbackMessage: string | null
  feedbackError: string | null
  onApply: (input: { activity: string; pointsChange: number }) => void
  onUpdateMemberProfile: (input: {
    memberId: string
    name: string
    image: string
    status: "active" | "inactive"
  }) => void
  onDeleteMember: (input: { memberId: string }) => void
}

export function PointsManager({
  selectedMember,
  selectedCount,
  affectedCount,
  periodFilter,
  history,
  isPending,
  feedbackMessage,
  feedbackError,
  onApply,
  onUpdateMemberProfile,
  onDeleteMember,
}: PointsManagerProps) {
  const [activity, setActivity] = useState("")
  const [pointsInput, setPointsInput] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberImage, setMemberImage] = useState("")
  const [memberStatus, setMemberStatus] = useState<"active" | "inactive">(
    "active",
  )

  const hasSelection = selectedMember !== null || selectedCount > 0

  useEffect(() => {
    if (!selectedMember) {
      setIsModalOpen(false)
      setIsDeleteConfirmOpen(false)
      setMemberName("")
      setMemberImage("")
      setMemberStatus("active")
      return
    }

    setMemberName(selectedMember.name)
    setMemberImage(selectedMember.image ?? "")
    setMemberStatus(selectedMember.status)
  }, [selectedMember])

  const historyPreview = useMemo(() => history.slice(0, 8), [history])
  const selectedMemberPoints = selectedMember
    ? periodFilter === "this_month"
      ? selectedMember.thisMonthPoints
      : selectedMember.allTimePoints
    : 0

  const handleApplyPoints = () => {
    const pointsChange = Number(pointsInput)

    if (!activity.trim() || !Number.isFinite(pointsChange) || pointsChange === 0) {
      return
    }

    onApply({ activity, pointsChange })
    setIsConfirmOpen(false)
    setActivity("")
    setPointsInput("")
  }

  const handleOpenConfirmation = () => {
    const pointsChange = Number(pointsInput)

    if (
      !activity.trim() ||
      !Number.isFinite(pointsChange) ||
      pointsChange === 0 ||
      affectedCount === 0
    ) {
      return
    }

    setIsConfirmOpen(true)
  }

  const handleSaveProfile = () => {
    if (!selectedMember) {
      return
    }

    onUpdateMemberProfile({
      memberId: selectedMember.id,
      name: memberName,
      image: memberImage,
      status: memberStatus,
    })
  }

  const handleDeleteMember = () => {
    if (!selectedMember) {
      return
    }

    onDeleteMember({ memberId: selectedMember.id })
    setIsDeleteConfirmOpen(false)
    setIsModalOpen(false)
  }

  return (
    <div className="w-full">
      <Card className="border-accent/30 bg-accent/5 p-4">
        <div className="space-y-2">
          {selectedCount > 0 ? (
            <>
              <div className="text-sm font-medium text-muted-foreground">
                Bulk Edit
              </div>
              <div className="text-lg font-bold text-foreground">
                {selectedCount} members selected
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                The same reason and points change will be applied to all checked
                members.
              </div> 
            </>
          ) : selectedMember ? (
            <>
              <div className="text-sm font-medium text-muted-foreground">
                Selected Member
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {selectedMember.name}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Star className="size-5 fill-yellow-500 text-yellow-500" />
                    <span className="chakra-bold text-2xl font-bold text-foreground">
                      {selectedMemberPoints}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                >
                  History
                </Button>
              </div>
              <Badge
                variant="outline"
                className={
                  selectedMember.status === "active"
                    ? "w-fit border-green-300 bg-green-50 text-green-700"
                    : "w-fit border-red-300 bg-red-50 text-red-700"
                }
              >
                {selectedMember.status.charAt(0).toUpperCase() +
                  selectedMember.status.slice(1)}
              </Badge>
            </>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Select a member or multiple members to manage points.
            </div>
          )}
        </div>
      </Card>

      {hasSelection ? (
        <Card className="space-y-4 p-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason-input" className="text-sm font-medium">
              Adjustment reason
            </Label>
            <Input
              id="reason-input"
              type="text"
              placeholder="Enter reason for points adjustment"
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points-input" className="text-sm font-medium">
              Points change
            </Label>
            <div className="flex gap-2">
              <Input
                id="points-input"
                type="number"
                placeholder="Use positive or negative values"
                value={pointsInput}
                onChange={(event) => setPointsInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleOpenConfirmation()
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleOpenConfirmation}
                disabled={
                  isPending ||
                  !activity.trim() ||
                  !pointsInput ||
                  Number(pointsInput) === 0 ||
                  affectedCount === 0
                }
                className="px-4"
              >
                Review
              </Button>
            </div>
          </div>

          {feedbackMessage ? (
            <p className="text-sm text-green-700">{feedbackMessage}</p>
          ) : null}

          {feedbackError ? (
            <p className="text-sm text-red-700">{feedbackError}</p>
          ) : null}
        </Card>
      ) : null}

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Confirm points update
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review this adjustment before submitting it.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsConfirmOpen(false)}
                aria-label="Close confirmation modal"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="font-semibold text-foreground">
                  {affectedCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points change</span>
                <span
                  className={cn(
                    "font-semibold",
                    Number(pointsInput) >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {Number(pointsInput) > 0 ? "+" : ""}
                  {Number(pointsInput)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Reason</span>
                <p className="text-sm font-medium text-foreground">{activity}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleApplyPoints}
                disabled={isPending}
              >
                {isPending ? "Applying..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMember && isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedMember.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Edit member details and review points history
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close member history"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Member name</Label>
                  <Input
                    id="member-name"
                    value={memberName}
                    onChange={(event) => setMemberName(event.target.value)}
                    placeholder="Enter member name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-image">Image URL</Label>
                  <Input
                    id="member-image"
                    value={memberImage}
                    onChange={(event) => setMemberImage(event.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="inline-flex rounded-full bg-muted p-1">
                    <button
                      type="button"
                      onClick={() => setMemberStatus("active")}
                      className={
                        memberStatus === "active"
                          ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                          : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      }
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberStatus("inactive")}
                      className={
                        memberStatus === "inactive"
                          ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                          : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      }
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="mb-3 text-sm font-medium text-muted-foreground">
                    Preview
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-foreground">
                      {memberImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={memberImage}
                          alt={memberName || selectedMember.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (memberName || selectedMember.name).charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {memberName || selectedMember.name}
                      </div>
                      <div className="chakra-bold text-sm text-muted-foreground">
                        {selectedMemberPoints} points
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-2 w-fit",
                          memberStatus === "active"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-red-300 bg-red-50 text-red-700",
                        )}
                      >
                        {memberStatus.charAt(0).toUpperCase() +
                          memberStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isPending || !memberName.trim()}
                    className="w-full"
                  >
                    {isPending ? "Saving..." : "Save member details"}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    disabled={isPending}
                    className="w-full"
                  >
                    Delete member
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Points History
                  </h3>
                </div>

                {historyPreview.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    No points history found for this member yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyPreview.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-border bg-muted/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {entry.activity}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatHistoryDate(entry.date)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "chakra-bold font-semibold",
                              entry.pointsChange >= 0
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {entry.pointsChange > 0 ? "+" : ""}
                            {entry.pointsChange}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMember && isDeleteConfirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Delete member
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This will permanently remove {selectedMember.name} and all
                  related point history.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteConfirmOpen(false)}
                aria-label="Close delete confirmation"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This action cannot be undone.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteMember}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete member"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
