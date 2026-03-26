import { PodiumSection } from "@/components/podium-section"
import { RankingsList } from "@/components/rankings-list"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center my-20">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="mb-8 flex flex-col items-center justify-center w-full px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-center mb-6">
              <Image
                src="/logo-mark.png"
                alt="Logo"
                width={200}
                height={200}
                loading="eager"
                className="h-24 sm:h-32 w-auto"
              />
            </div>
          <h1 className="chakra-bold uppercase text-4xl sm:text-6xl font-bold text-center">
            Leaderboard
          </h1>
          <div className="bg-gray-200 rounded-full p-1 inline-flex space-x-1">
            <button className="px-6 py-2 rounded-full text-sm font-medium bg-black text-white shadow">
              This Month
            </button>
            <button className="px-6 py-2 rounded-full text-sm font-medium text-black hover:bg-gray-300 transition-colors">
              All Time
            </button>
          </div>
        </div>

        <PodiumSection />
      </div> 

      <RankingsList />
    </main>
  )
}
