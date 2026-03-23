import { AuthButton } from "@/components/auth/auth-button"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1>Hello World</h1>
      <Suspense>
        <AuthButton />
      </Suspense>
    </main>
  )
}
