"use client"

import type {
  LeaderboardHistoryMap,
  LeaderboardUser,
  PointsHistoryEntry,
} from "@/lib/leaderboard"
import { cn, formatHistoryDate } from "@/lib/utils"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Star, X } from "lucide-react"
import { useState } from "react"

const FALLBACK_AVATAR = "/unnamed.png"

type RankingsListProps = {
  podiumUsers?: LeaderboardUser[]
  rankingUsers?: LeaderboardUser[]
  historyByUserId?: LeaderboardHistoryMap
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSelectUser?: (user: LeaderboardUser) => void
}

const defaultPodiumUsers: LeaderboardUser[] = [
  {
    id: "user-2",
    rank: 2,
    previousRank: 3,
    name: "Hammond",
    points: 8632,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjSE4xePqSXx--4DAxrQyTIihXuNshpTt3rFRFI-73uhYG8BrHWZ_76eQrLhIcfrBEv4eA9BzormcXRGb4ysyrI96Hy4lmbVp0RXpVQ7WhwNrk07qdDtQHvR70By4YWx-tCCJRu-2yzslRDaKIhLkCGxQ_QbteUgCB1GC_0QxqW58ID5tcMEiOZJLklU2GW2tAp2jyVH2iyGQlw7vJNiIj8K9ZjlQDill6enHIXG41jowbEcmUl1g3dOCTAqVujIV4YmhPCe-X5ks",
  },
  {
    id: "user-1",
    rank: 1,
    previousRank: 1,
    name: "Johnny Rios",
    points: 9654,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYDmxUgBTbd7JW9yDrHwmXL0A0udnJ9LoHQrE092EOO15iby1eIO20xdRdbDybIrDUFat0C4yCcbmgVmMfxuAHjqaL95-RLfUkmv5Ojxw0ieoml3QDRsvoAE_EpFyS2p4t8Dy_emckQA118sARLgLDHBupzPn-80AA2COkxjt4R5o9VW7CejedqGGyXBzo-V4vu3TmyyM7FRbAF9UoEj3O1oNv6db_79wZVI1WWLLlGkoyvkaFF2WIXvbCBundIxtGNWuvQ85ycK4",
  },
  {
    id: "user-3",
    rank: 3,
    previousRank: 2,
    name: "Hodges",
    points: 6878,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTyCEBD4HC4yMD-2w6i6Ggh8KAHy230en6e-5HmyhvgnH0a0mk12wFagxW0YF0uZhfzsvyhnU0Sm3D-O1WejG3JxfPkJ0-IHPSgTvAfQL209M7ILT3ng4aHm4SMb-YCzBX95378KXoCakKikIYWg5UKRES5CSvm1djtfAiIRUqXlJPse7CcfuKy94QTZciFQEClsVJ4lQ8VyTYL4sHzx3HzltpsAjoPVngC2euVHh7rL6r2mRuP284h1cLm2ykOuSCUQYKPkEo48Q",
  },
]

const defaultRankingUsers: LeaderboardUser[] = [
  {
    id: "user-4",
    rank: 4,
    previousRank: 3,
    name: "Dora Hines",
    points: 6432,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "user-5",
    rank: 5,
    previousRank: 7,
    name: "Carolyn Francis",
    points: 5232,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "user-6",
    rank: 6,
    previousRank: 8,
    name: "Isaiah McGee",
    points: 5200,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "user-7",
    rank: 7,
    previousRank: 5,
    name: "Mark Holmes",
    points: 4997,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    id: "user-8",
    rank: 8,
    previousRank: 8,
    name: "Georgie Clayton",
    points: 3200,
    avatarUrl: FALLBACK_AVATAR,
  },
]

const defaultHistoryByUserId: LeaderboardHistoryMap = {
  "user-1": [
    {
      id: "history-1",
      date: "2026-03-20",
      activity: "Completed task: Website redesign",
      pointsChange: 500,
    },
    {
      id: "history-2",
      date: "2026-03-18",
      activity: "Code review contribution",
      pointsChange: 250,
    },
    {
      id: "history-3",
      date: "2026-03-15",
      activity: "Bug fix: Critical issue resolved",
      pointsChange: 300,
    },
  ],
  "user-4": [
    {
      id: "history-4",
      date: "2026-03-12",
      activity: "Documentation update",
      pointsChange: 100,
    },
    {
      id: "history-5",
      date: "2026-03-10",
      activity: "Team presentation",
      pointsChange: 200,
    },
    {
      id: "history-6",
      date: "2026-03-05",
      activity: "Missed deadline penalty",
      pointsChange: -50,
    },
  ],
}

function formatRank(rank: number) {
  return rank.toString().padStart(2, "0")
}

function getAvatarUrl(avatarUrl?: string | null) {
  return avatarUrl || FALLBACK_AVATAR
}

function getPodiumDisplayOrder(users: LeaderboardUser[]) {
  const podiumOrder = [2, 1, 3]

  return podiumOrder
    .map((rank) => users.find((user) => user.rank === rank))
    .filter((user): user is LeaderboardUser => user !== undefined)
}

function getRankChange(previousRank?: number | null, currentRank?: number) {
  if (previousRank == null || currentRank == null) {
    return 0
  }

  return previousRank - currentRank
}
 
function TrendIndicator({
  previousRank,
  currentRank,
}: {
  previousRank?: number | null
  currentRank: number
}) {
  const rankChange = getRankChange(previousRank, currentRank)

  if (rankChange > 0) {
    return <ArrowUpCircleIcon className="size-5 text-green-600" />
  }

  if (rankChange < 0) {
    return <ArrowDownCircleIcon className="size-5 text-red-600" />
  }

  return null
}

function UserAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string
  avatarUrl?: string | null
  className: string
}) {
  return (
    <img
      alt={name}
      className={className}
      src={getAvatarUrl(avatarUrl)}
    />
  )
}

function RankingsListItem({
  user,
  onSelect,
}: {
  user: LeaderboardUser
  onSelect: (user: LeaderboardUser) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="flex w-full items-center justify-between rounded-lg border-b border-black/10 py-4 text-left transition-colors hover:bg-gray-200/40"
    >
      <div className="flex items-center">
        <span className="chakra-bold mr-4 pl-2 text-center text-xl font-medium sm:text-2xl">
          {formatRank(user.rank)}
        </span>
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          className="mr-4 h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
        />
        <span className="flex items-center gap-2 text-base font-medium sm:text-lg">
          {user.name}
          <TrendIndicator
            previousRank={user.previousRank}
            currentRank={user.rank}
          />
        </span>
      </div>

      <div className="flex items-center">
        <Star className="mr-1 size-5 fill-yellow-500 text-yellow-500" />
        <span className="chakra-bold pr-2 text-base font-bold sm:text-lg">
          {user.points}
        </span>
      </div>
    </button>
  )
}

function RankingsLoadingState() {
  return (
    <>
      <div className="flex w-full max-w-2xl items-end justify-center space-x-1 px-4 sm:space-x-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex w-1/3 flex-col items-center">
            <div className="mb-1 flex flex-col items-center">
              <div className="mb-2 h-16 w-16 animate-pulse rounded-full bg-gray-200 sm:h-20 sm:w-20" />
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="w-full animate-pulse rounded-sm bg-gray-200 h-24 sm:h-32" />
          </div>
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center justify-between border-b border-black/10 py-4"
          >
            <div className="flex items-center">
              <div className="mr-4 h-8 w-8 rounded bg-gray-200" />
              <div className="mr-4 h-10 w-10 rounded-full bg-gray-200" />
              <div className="h-5 w-32 rounded bg-gray-200" />
            </div>
            <div className="h-5 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </>
  )
}

function LeaderboardErrorState({
  error,
  onRetry,
}: {
  error: string
  onRetry?: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">{error}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

function LeaderboardEmptyState() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-dashed border-black/15 p-8 text-center">
      <p className="text-lg font-medium">No rankings available yet.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Once the API returns leaderboard data, it will show up here.
      </p>
    </div>
  )
}

export function RankingsList({
  podiumUsers = defaultPodiumUsers,
  rankingUsers = defaultRankingUsers,
  historyByUserId = defaultHistoryByUserId,
  isLoading = false,
  error = null,
  onRetry,
  onSelectUser,
}: RankingsListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const orderedPodiumUsers = getPodiumDisplayOrder(podiumUsers)
  const allUsers = [...podiumUsers, ...rankingUsers]
  const selectedUser =
    allUsers.find((user) => user.id === selectedUserId) ?? null

  const handleSelectUser = (user: LeaderboardUser) => {
    setSelectedUserId(user.id)
    onSelectUser?.(user)
  }

  if (isLoading) {
    return <RankingsLoadingState />
  }

  if (error) {
    return <LeaderboardErrorState error={error} onRetry={onRetry} />
  }

  if (allUsers.length === 0) {
    return <LeaderboardEmptyState />
  }

  return (
    <>
      <div className="relative z-10 mb-2 flex w-full max-w-2xl items-end justify-center space-x-1 px-4 sm:space-x-4">
        {orderedPodiumUsers.map((user) => (
          <PodiumPlace
            key={user.id}
            user={user}
            onSelect={handleSelectUser}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col">
        {rankingUsers.map((user) => (
          <RankingsListItem
            key={user.id}
            user={user}
            onSelect={handleSelectUser}
          />
        ))}
      </div>

      <PointsHistoryModal
        user={selectedUser}
        history={selectedUser ? historyByUserId[selectedUser.id] ?? [] : []}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  )
}

function PointsHistoryModal({
  user,
  history,
  isOpen,
  onClose,
}: {
  user: LeaderboardUser | null
  history: PointsHistoryEntry[]
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">Rank #{user.rank}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            aria-label={`Close ${user.name} history`}
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4">
          <span className="text-muted-foreground">Total Points</span>
          <div className="mb-2 flex items-center gap-2">
            <Star className="size-6 text-yellow-500" />
            <span className="chakra-bold text-3xl font-bold">{user.points}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-6">
            {history.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-muted-foreground">
                No points history is available for this user yet.
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.activity}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatHistoryDate(entry.date)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "chakra-bold ml-4 flex items-center gap-1 text-lg font-bold",
                      entry.pointsChange > 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {entry.pointsChange > 0 ? "+" : ""}
                    {entry.pointsChange}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PodiumPlace({
  user,
  onSelect,
}: {
  user: LeaderboardUser
  onSelect: (user: LeaderboardUser) => void
}) {
  return (
    <div className="flex w-1/3 flex-col items-center">
      <button
        type="button"
        onClick={() => onSelect(user)}
        className="mb-1 flex flex-col items-center text-center"
      >
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          className={cn(
            "mb-1 rounded-full border-2 border-gray-400 object-cover",
            user.rank === 1
              ? "h-20 w-20 border-yellow-500"
              : user.rank === 2
                ? "h-16 w-16 border-gray-400"
                : "h-16 w-16 border-amber-700",
          )}
        />
        <span className="text-lg font-medium leading-tight">{user.name}</span>
        <div className="flex items-center">
          <Star className="mr-1 size-5 fill-yellow-500 text-yellow-500" />
          <span className="chakra-bold font-bold">{user.points}</span>
        </div>
      </button>
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-sm bg-gray-300",
          user.rank === 1 ? "h-48" : user.rank === 2 ? "h-32" : "h-24",
        )}
      >
        <span
          className={cn(
            "chakra-bold font-bold text-[#888]",
            user.rank === 1 ? "text-6xl" : "text-5xl",
          )}
        >
          {formatRank(user.rank)}
        </span>
      </div>
    </div>
  )
}
