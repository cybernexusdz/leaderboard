"use client"

import { cn } from "@/lib/utils"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Star, X } from "lucide-react"
import { useState } from "react"

export function RankingsListItem({
  rank,
  name,
  avatar,
  points,
  onSelect,
}: {
  rank: number
  name: string
  avatar: string
  points: number
  onSelect?: (user: {
    rank: number
    name: string
    avatar: string
    points: number
  }) => void
}) {
  return (
    <div
      onClick={() => onSelect?.({ rank, name, avatar, points })}
      className="flex items-center justify-between py-4 border-b border-black/10 hover:bg-gray-200/40 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex items-center">
        <span className="chakra-bold text-xl sm:text-2xl font-medium text-center pl-2 mr-4">
          0{rank}
        </span>
        <img
          alt={name}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover mr-4"
          src={avatar ?? "/unnamed.png"}
        />
        <span className="flex items-center gap-2 text-base sm:text-lg font-medium">
          {name}
          <ArrowDownCircleIcon className="size-5 text-red-600" />
          <ArrowUpCircleIcon className="size-5 text-green-600" />
        </span>
      </div>

      <div className="flex items-center">
        <Star className="size-5 text-yellow-500 mr-1" />
        <span className="chakra-bold text-base sm:text-lg font-bold pr-2">
          {points}
        </span>
      </div>
    </div>
  )
}

export function RankingsList() {
  const [selectedUser, setSelectedUser] = useState<{
    rank: number
    name: string
    avatar: string
    points: number
  } | null>(null)

  const rankingUsers = [
    {
      rank: 4,
      name: "Dora Hines",
      points: 6432,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      rank: 5,
      name: "Carolyn Francis",
      points: 5232,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      rank: 6,
      name: "Isaiah McGee",
      points: 5200,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      rank: 7,
      name: "Mark Holmes",
      points: 4997,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    {
      rank: 8,
      name: "Georgie Clayton",
      points: 3200,
      avatar: "/unnamed.png",
    },
  ]

  return (
    <>
      <div className="flex items-end justify-center space-x-1 sm:space-x-4 relative z-10 w-full max-w-2xl px-4 mb-2">
        {/* Second Place */}
        <PodiumPlace
          rank={2}
          name="Hammond"
          points={8632}
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAjSE4xePqSXx--4DAxrQyTIihXuNshpTt3rFRFI-73uhYG8BrHWZ_76eQrLhIcfrBEv4eA9BzormcXRGb4ysyrI96Hy4lmbVp0RXpVQ7WhwNrk07qdDtQHvR70By4YWx-tCCJRu-2yzslRDaKIhLkCGxQ_QbteUgCB1GC_0QxqW58ID5tcMEiOZJLklU2GW2tAp2jyVH2iyGQlw7vJNiIj8K9ZjlQDill6enHIXG41jowbEcmUl1g3dOCTAqVujIV4YmhPCe-X5ks"
          onSelect={setSelectedUser}
        />

        {/* First Place */}
        <PodiumPlace
          rank={1}
          name="Johnny Rios"
          points={9654}
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBYDmxUgBTbd7JW9yDrHwmXL0A0udnJ9LoHQrE092EOO15iby1eIO20xdRdbDybIrDUFat0C4yCcbmgVmMfxuAHjqaL95-RLfUkmv5Ojxw0ieoml3QDRsvoAE_EpFyS2p4t8Dy_emckQA118sARLgLDHBupzPn-80AA2COkxjt4R5o9VW7CejedqGGyXBzo-V4vu3TmyyM7FRbAF9UoEj3O1oNv6db_79wZVI1WWLLlGkoyvkaFF2WIXvbCBundIxtGNWuvQ85ycK4"
          onSelect={setSelectedUser}
        />

        {/* Third Place */}
        <PodiumPlace
          rank={3}
          name="Hodges"
          points={6878}
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCTyCEBD4HC4yMD-2w6i6Ggh8KAHy230en6e-5HmyhvgnH0a0mk12wFagxW0YF0uZhfzsvyhnU0Sm3D-O1WejG3JxfPkJ0-IHPSgTvAfQL209M7ILT3ng4aHm4SMb-YCzBX95378KXoCakKikIYWg5UKRES5CSvm1djtfAiIRUqXlJPse7CcfuKy94QTZciFQEClsVJ4lQ8VyTYL4sHzx3HzltpsAjoPVngC2euVHh7rL6r2mRuP284h1cLm2ykOuSCUQYKPkEo48Q"
          onSelect={setSelectedUser}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col">
        {rankingUsers.map((user) => (
          <RankingsListItem
            key={user.rank}
            rank={user.rank}
            name={user.name}
            avatar={user.avatar}
            points={user.points}
            onSelect={setSelectedUser}
          />
        ))}
      </div>
      <PointsHistoryModal
        user={selectedUser}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
      />
    </>
  )
}

export function PointsHistoryModal({
  user,
  isOpen,
  onClose,
}: {
  user: { rank: number; name: string; avatar: string; points: number } | null
  isOpen: boolean
  onClose: () => void
}) {
  const mockHistory = [
    {
      date: "2026-03-20",
      activity: "Completed task: Website redesign",
      pointsChange: 500,
    },
    {
      date: "2026-03-18",
      activity: "Code review contribution",
      pointsChange: 250,
    },
    {
      date: "2026-03-15",
      activity: "Bug fix: Critical issue resolved",
      pointsChange: 300,
    },
    {
      date: "2026-03-12",
      activity: "Documentation update",
      pointsChange: 100,
    },
    {
      date: "2026-03-10",
      activity: "Team presentation",
      pointsChange: 200,
    },
    {
      date: "2026-03-05",
      activity: "Missed deadline penalty",
      pointsChange: -50,
    },
  ]

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
              src={user.avatar ?? "/unnamed.png"}
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">Rank #{user.rank}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Points Summary */}
        <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-gray-100">
          <span className="text-muted-foreground">Total Points</span>
          <div className="flex items-center gap-2 mb-2">
            <Star className="size-6 text-yellow-500" />
            <span className="text-3xl font-bold chakra-bold">
              {user.points}
            </span>
          </div>
        </div>

        {/* History List */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">
            {mockHistory.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{entry.activity}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.date}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 ml-4 font-bold text-lg chakra-bold",
                    entry.pointsChange > 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {entry.pointsChange > 0 ? "+" : ""}
                  {entry.pointsChange}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PodiumPlace({
  rank,
  name,
  points,
  avatar,
  onSelect,
}: {
  rank: number
  name: string
  points: number
  avatar: string
  onSelect?: (user: {
    rank: number
    name: string
    avatar: string
    points: number
  }) => void
}) {
  return (
    <div className="flex flex-col items-center w-1/3">
      <div
        onClick={() => onSelect?.({ rank, name, avatar, points })}
        className="flex flex-col items-center mb-1 text-center cursor-pointer"
      >
        <img
          alt={name}
          className={cn(
            "rounded-full border-2 border-gray-400 object-cover mb-1",
            rank === 1
              ? "w-20 h-20 border-yellow-500"
              : rank === 2
                ? "w-16 h-16 border-gray-400"
                : "w-16 h-16 border-amber-700",
          )}
          src={avatar}
        />
        <span className="font-medium text-lg leading-tight">{name}</span>
        <div className="flex items-center text-gray-700">
          <Star className="size-5 text-yellow-500 mr-1" />
          <span className="chakra-bold font-bold text-black">{points}</span>
        </div>
      </div>
      <div
        className={cn(
          "w-full bg-gray-300 flex justify-center items-center rounded-sm",
          rank === 1 ? "h-48" : rank === 2 ? "h-32" : "h-24",
        )}
      >
        <span
          className={cn(
            "chakra-bold font-bold text-[#888]",
            rank === 1 ? "text-6xl" : "text-5xl",
          )}
        >
          0{rank}
        </span>
      </div>
    </div>
  )
}
