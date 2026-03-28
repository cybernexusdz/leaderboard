import { ReasonTemplatesManager } from "@/components/admin/templates-manager"
import { Card } from "@/components/ui/card"
import { getAdminReasonTemplates } from "@/lib/admin"
import { Suspense } from "react"

export default function AdminReasonTemplatesPage() {
  return (
    <Suspense fallback={<ReasonTemplatesPageSkeleton />}>
      <TemplatesPageContent />
    </Suspense>
  )
}

async function TemplatesPageContent() {
  try {
    const templates = await getAdminReasonTemplates()

    return <ReasonTemplatesManager templates={templates} />
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load reason templates."

    return (
      <div className="w-full max-w-3xl px-4 py-10">
        <Card className="border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-800">
            Templates unavailable
          </h1>
          <p className="mt-2 text-sm text-red-700">{message}</p>
        </Card>
      </div>
    )
  }
}

function ReasonTemplatesPageSkeleton() {
  return (
    <div className="w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="h-48 animate-pulse rounded bg-muted" />
      </Card>
      <Card className="p-6">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </Card>
    </div>
  )
}
