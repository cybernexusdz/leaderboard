"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { AdminAuditLog } from "@/lib/admin"

type ActionFilter = "all" | "points" | "members" | "templates"

const actionLabels: Record<string, string> = {
  points_adjusted: "Points adjusted",
  member_created: "Member created",
  member_updated: "Member updated",
  member_deleted: "Member deleted",
  reason_template_created: "Template created",
  reason_template_updated: "Template updated",
  reason_template_deleted: "Template deleted",
}

export function LogsManager({ logs }: { logs: AdminAuditLog[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all")

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return logs.filter((log) => {
      const matchesSearch = normalizedSearch
        ? [
            log.actorEmail ?? "",
            log.entityLabel ?? "",
            actionLabels[log.actionType] ?? log.actionType,
            JSON.stringify(log.details),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch)
        : true

      const matchesAction =
        actionFilter === "all"
          ? true
          : actionFilter === "points"
            ? log.actionType === "points_adjusted"
            : actionFilter === "members"
              ? log.entityType === "member"
              : log.entityType === "reason_template"

      return matchesSearch && matchesAction
    })
  }, [actionFilter, logs, searchTerm])

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-start">
          <div className="space-y-2">
            <Label
              htmlFor="logs-search"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Search logs
            </Label>
            <Input
              id="logs-search"
              placeholder="Search by admin, member, template, or details..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <FilterGroup
            label="Type"
            options={[
              { label: "All", value: "all" },
              { label: "Points", value: "points" },
              { label: "Members", value: "members" },
              { label: "Templates", value: "templates" },
            ]}
            value={actionFilter}
            onChange={(value) => setActionFilter(value as ActionFilter)}
          />
        </div>
      </Card>

      <div className="mt-6 space-y-3">
        {filteredLogs.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted-foreground">
            No audit logs found for the current filters.
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        log.actionType === "points_adjusted" &&
                          "border-sky-300 bg-sky-50 text-sky-700",
                        log.entityType === "member" &&
                          log.actionType !== "points_adjusted" &&
                          "border-amber-300 bg-amber-50 text-amber-700",
                        log.entityType === "reason_template" &&
                          "border-emerald-300 bg-emerald-50 text-emerald-700",
                      )}
                    >
                      {actionLabels[log.actionType] ?? log.actionType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatLogDate(log.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    {getLogTitle(log)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    by {log.actorEmail ?? "Unknown admin"}
                  </p>
                </div>

                <Badge variant="secondary" className="w-fit">
                  {log.entityType.replaceAll("_", " ")}
                </Badge>
              </div>

              <details className="rounded-xl border border-border bg-muted/20">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground">
                  View details
                </summary>
                <pre className="overflow-x-auto border-t border-border bg-muted/60 p-4 text-xs leading-6 text-foreground">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </details>
            </Card>
          ))
        )}
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

function formatLogDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function getLogTitle(log: AdminAuditLog) {
  const label = log.entityLabel ?? "Unknown item"
  const pointsChange =
    typeof log.details.pointsChange === "number"
      ? log.details.pointsChange
      : null

  if (log.actionType === "points_adjusted" && pointsChange !== null) {
    return `${label} (${pointsChange > 0 ? "+" : ""}${pointsChange})`
  }

  return label
}
