import { LogsManager } from "@/components/admin/logs-manager"
import { Card } from "@/components/ui/card"
import { getAdminAuditLogs } from "@/lib/admin"
import { Suspense } from "react"

export default function AdminLogsPage() {
  return (
    <Suspense fallback={<LogsPageSkeleton />}>
      <LogsPageContent />
    </Suspense>
  )
}

async function LogsPageContent() {
  try {
    const logs = await getAdminAuditLogs()

    return <LogsManager logs={logs} />
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load audit logs."

    return (
      <div className="w-full max-w-3xl px-4 py-10">
        <Card className="border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-800">
            Audit logs unavailable
          </h1>
          <p className="mt-2 text-sm text-red-700">{message}</p>
        </Card>
      </div>
    )
  }
}

function LogsPageSkeleton() {
  return (
    <div className="w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="h-24 animate-pulse rounded bg-muted" />
      </Card>
      <Card className="p-6">
        <div className="h-[560px] animate-pulse rounded bg-muted" />
      </Card>
    </div>
  )
}
