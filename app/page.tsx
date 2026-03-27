import { RankingsList } from "@/components/rankings-list"
import {
  getLeaderboardData,
  isLeaderboardPeriod,
  type LeaderboardPeriod,
} from "@/lib/leaderboard"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

const defaultPeriod: LeaderboardPeriod = "this_month"

export default function Home({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>
}) {
  return (
    <main className="my-20 flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<LeaderboardPageSkeleton />}>
        <LeaderboardPageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function LeaderboardPageContent({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const period = isLeaderboardPeriod(resolvedSearchParams?.period)
    ? resolvedSearchParams.period
    : defaultPeriod

  try {
    const { podiumUsers, rankingUsers, historyByUserId } =
      await getLeaderboardData(period)

    return (
      <>
        <LeaderboardHeader currentPeriod={period} />
        <RankingsList
          podiumUsers={podiumUsers}
          rankingUsers={rankingUsers}
          historyByUserId={historyByUserId}
        />
      </>
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load the leaderboard right now."

    return (
      <>
        <LeaderboardHeader currentPeriod={period} />
        <RankingsList error={message} podiumUsers={[]} rankingUsers={[]} />
      </>
    )
  }
}

function LeaderboardHeader({
  currentPeriod,
}: {
  currentPeriod: LeaderboardPeriod
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-8 flex w-full flex-col items-center justify-center px-4 sm:px-8 lg:px-16">
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/logo-mark.png"
            alt="Logo"
            width={200}
            height={200}
            loading="eager"
            className="h-24 w-auto sm:h-32"
          />
        </div>
        <h1 className="chakra-bold text-center text-4xl font-bold uppercase sm:text-6xl">
          Leaderboard
        </h1>
        <div className="inline-flex space-x-1 rounded-full bg-muted p-1 border border-muted-foreground/10">
          <PeriodLink
            period="this_month"
            currentPeriod={currentPeriod}
            label="This Month"
          />
          <PeriodLink
            period="all_time"
            currentPeriod={currentPeriod}
            label="All Time"
          />
        </div>
      </div>
    </div>
  )
}

function LeaderboardPageSkeleton() {
  return (
    <>
      <LeaderboardHeader currentPeriod={defaultPeriod} />
      <RankingsList isLoading podiumUsers={[]} rankingUsers={[]} />
    </>
  )
}

function PeriodLink({
  period,
  currentPeriod,
  label,
}: {
  period: LeaderboardPeriod
  currentPeriod: LeaderboardPeriod
  label: string
}) {
  const isActive = period === currentPeriod

  return (
    <Link
      href={`/?period=${period}`}
      className={cn("rounded-full px-6 py-2 text-sm font-medium", 
        isActive ? "bg-primary text-muted shadow-sm" : "text-muted-foreground transition-colors hover:text-foreground")} 
    >
      {label}
    </Link>
  )
}
