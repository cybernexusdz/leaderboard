import { AuthButton } from "@/components/auth/auth-button"
import { Suspense } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
      {children}
    </main>
  )
}
