import { AuthButton } from "@/components/auth/auth-button"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = { 
  title: "Leaderboard | Admin",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/templates"
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Templates
            </Link>
            <Link
              href="/admin/logs"
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Logs
            </Link>
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
      {children}
    </main>
  )
}
