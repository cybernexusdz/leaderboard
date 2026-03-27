"use client"

import { useMemo, useState, useTransition } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { applyPointsAdjustment, updateMemberProfile } from "@/app/admin/actions"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { PointsManager } from "@/components/admin/points-manager"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AdminMember, AdminMemberHistoryMap } from "@/lib/admin"

type PeriodFilter = "this_month" | "all_time"
type StatusFilter = "all" | "active" | "inactive"
type SortDirection = "highest" | "lowest"

export function AdminDashboard({
  members,
  historyByMemberId,
}: {
  members: AdminMember[]
  historyByMemberId: AdminMemberHistoryMap
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all_time")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortDirection, setSortDirection] = useState<SortDirection>("highest")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filtered = members.filter((member) => {
      const matchesSearch = normalizedSearch
        ? member.name.toLowerCase().includes(normalizedSearch)
        : true
      const matchesStatus =
        statusFilter === "all" ? true : member.status === statusFilter

      return matchesSearch && matchesStatus
    })

    return filtered.toSorted((left, right) => {
      const leftPoints =
        periodFilter === "this_month"
          ? left.thisMonthPoints
          : left.allTimePoints
      const rightPoints =
        periodFilter === "this_month"
          ? right.thisMonthPoints
          : right.allTimePoints

      if (leftPoints === rightPoints) {
        return left.name.localeCompare(right.name)
      }

      return sortDirection === "highest"
        ? rightPoints - leftPoints
        : leftPoints - rightPoints
    })
  }, [members, periodFilter, searchTerm, sortDirection, statusFilter])

  const selectedMember =
    members.find((member) => member.id === selectedMemberId) ?? null

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    )
  }

  const toggleAllMembers = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([])
      return
    }

    setSelectedMembers(filteredMembers.map((member) => member.id))
  }

  const handleApplyPoints = ({
    activity,
    pointsChange,
  }: {
    activity: string
    pointsChange: number
  }) => {
    const memberIds =
      selectedMembers.length > 0
        ? selectedMembers
        : selectedMember
          ? [selectedMember.id]
          : []

    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void applyPointsAdjustment({
        activity,
        memberIds,
        pointsChange,
      })
        .then(() => {
          setFeedbackMessage("Points updated successfully.")
          setSelectedMembers([])
          setSelectedMemberId(null)
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error
              ? error.message
              : "Unable to update member points.",
          )
        })
    })
  }

  const handleUpdateMemberProfile = ({
    memberId,
    name,
    image,
    status,
  }: {
    memberId: string
    name: string
    image: string
    status: "active" | "inactive"
  }) => {
    setFeedbackMessage(null)
    setFeedbackError(null)

    startTransition(() => {
      void updateMemberProfile({
        memberId,
        name,
        image,
        status,
      })
        .then(() => {
          setFeedbackMessage("Member details updated successfully.")
          router.refresh()
        })
        .catch((error) => {
          setFeedbackError(
            error instanceof Error
              ? error.message
              : "Unable to update member details.",
          )
        })
    })
  }

  return (
    <div className="w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] lg:items-start">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Search
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-2 size-5 text-muted-foreground" />
              <Input
                placeholder="Search members by name..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <FilterGroup
            label="Period"
            options={[
              { label: "This Month", value: "this_month" },
              { label: "All Time", value: "all_time" },
            ]}
            value={periodFilter}
            onChange={(value) => setPeriodFilter(value as PeriodFilter)}
          />

          <FilterGroup
            label="Status"
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
          />

          <FilterGroup
            label="Sort"
            options={[
              { label: "Highest", value: "highest" },
              { label: "Lowest", value: "lowest" },
            ]}
            value={sortDirection}
            onChange={(value) => setSortDirection(value as SortDirection)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <AdminDataTable
              members={filteredMembers}
              periodFilter={periodFilter}
              selectedMembers={selectedMembers}
              allSelected={
                selectedMembers.length === filteredMembers.length &&
                filteredMembers.length > 0
              }
              onSelectMember={toggleMemberSelection}
              onSelectAll={toggleAllMembers}
              onMemberClick={(member) => setSelectedMemberId(member.id)}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <PointsManager
            selectedMember={selectedMember}
            selectedCount={selectedMembers.length}
            affectedCount={
              selectedMembers.length > 0
                ? selectedMembers.length
                : selectedMember
                  ? 1
                  : 0
            }
            periodFilter={periodFilter}
            history={
              selectedMember ? (historyByMemberId[selectedMember.id] ?? []) : []
            }
            isPending={isPending}
            feedbackMessage={feedbackMessage}
            feedbackError={feedbackError}
            onApply={handleApplyPoints}
            onUpdateMemberProfile={handleUpdateMemberProfile}
          />
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="inline-flex rounded-full bg-muted p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              option.value === value
                ? "rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
