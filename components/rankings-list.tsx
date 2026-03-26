import { ArrowDownCircleIcon, ArrowUpCircleIcon, Star } from "lucide-react"

export function RankingsListItem({
  rank,
  name,
  avatar,
  points,
}: {
  rank: number
  name: string
  avatar: string
  points: number
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-black/10 hover:bg-gray-200/40 rounded-lg cursor-pointer transition-colors">
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
        <span className="chakra-bold text-base sm:text-lg font-bold pr-2">{points}</span>
      </div>
    </div>
  )
}

export function RankingsList() {
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
    <div className="w-full max-w-2xl mx-auto flex flex-col">
      {rankingUsers.map((user) => (
        <RankingsListItem
          key={user.rank}
          rank={user.rank}
          name={user.name}
          avatar={user.avatar}
          points={user.points}
        />
      ))}
    </div>
  )
}
