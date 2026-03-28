import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Card } from "@/components/ui/card"
import {
  getAdminMemberHistory,
  getAdminMembers,
  getAdminReasonTemplates,
  requireAdmin,
} from "@/lib/admin"
import { Suspense } from "react"

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminPageContent />
    </Suspense>
  )
}

async function AdminPageContent() {
  try {
    const [{ role }, members, historyByMemberId, reasonTemplates] = await Promise.all([
      requireAdmin(),
      getAdminMembers(),
      getAdminMemberHistory(),
      getAdminReasonTemplates(),
    ])

    return (
      <AdminDashboard
        members={members}
        historyByMemberId={historyByMemberId}
        reasonTemplates={reasonTemplates}
        currentAdminRole={role}
      />
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load the admin dashboard."
        
    console.error("Error loading admin members:", error) 
    return (
      <div className="w-full max-w-3xl px-4 py-10">
        <Card className="border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-800">
            Admin dashboard unavailable
          </h1>
          <p className="mt-2 text-sm text-red-700">{message}</p>
        </Card>
      </div>
    )
  }
}

function AdminPageSkeleton() {
  return (
    <div className="w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="h-10 animate-pulse rounded bg-muted" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="h-[640px] animate-pulse rounded bg-muted" />
        </Card>
        <Card className="p-6">
          <div className="h-[320px] animate-pulse rounded bg-muted" />
        </Card>
      </div>
    </div>
  )
}
