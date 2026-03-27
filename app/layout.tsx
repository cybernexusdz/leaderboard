import { cn } from "@/lib/utils"
import { Inter } from "next/font/google" 
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import "./fonts.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Leaderboard",
  description: "A dynamic leaderboard that highlights our club's top contributors, motivating everyone to strive for excellence.",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={inter.style}
        className={cn("antialiased scroll-smooth", inter.className)}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          forcedTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
