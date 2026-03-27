"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star } from "lucide-react"
import type { AdminMember } from "@/lib/admin"

interface AdminDataTableProps {
  members: AdminMember[]
  periodFilter: "this_month" | "all_time"
  selectedMembers: string[]
  allSelected: boolean
  onSelectMember: (memberId: string) => void
  onSelectAll: () => void
  onMemberClick: (member: AdminMember) => void
}

export function AdminDataTable({
  members,
  periodFilter,
  selectedMembers,
  allSelected,
  onSelectMember,
  onSelectAll,
  onMemberClick,
}: AdminDataTableProps) {
  return (
    <div className="w-full">
      <div className="sticky top-0 z-10 border-b border-border bg-muted/30">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-foreground">
          <div className="col-span-1 flex items-center">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all members"
            />
          </div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3">Points</div>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="w-full">
          {members.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No members found
            </div>
          ) : (
            members.map((member) => {
              const isSelected = selectedMembers.includes(member.id)
              const points =
                periodFilter === "this_month"
                  ? member.thisMonthPoints
                  : member.allTimePoints

              return (
                <div
                  key={member.id}
                  role="button"
                  tabIndex={0}
                  className={`grid w-full grid-cols-12 gap-4 border-b border-border px-6 py-3 text-left transition-colors ${
                    isSelected ? "bg-accent/5" : "hover:bg-muted/30"
                  }`}
                  onClick={() => onMemberClick(member)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onMemberClick(member)
                    }
                  }}
                >
                  <div
                    className="col-span-1 flex items-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectMember(member.id)}
                      aria-label={`Select ${member.name}`}
                    />
                  </div>

                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                      <img
                        src={member.image ?? "/default-avatar.png"}
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </div>
                    <span className="truncate font-medium text-foreground">
                      {member.name}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <Badge
                      variant="outline"
                      className={
                        member.status === "active"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-red-300 bg-red-50 text-red-700"
                      }
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="col-span-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="chakra-bold font-semibold text-foreground">
                        {points}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
