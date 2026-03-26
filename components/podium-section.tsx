import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

function PodiumPlace({
  position,
  name,
  score,
  image,
}: {
  position: number
  name: string
  score: number
  image: string
}) {
  return (
    <div className="flex flex-col items-center w-1/3">
      <div className="flex flex-col items-center mb-1 text-center">
        <img
          alt={name}
          className={cn(
            "rounded-full border-2 border-gray-400 object-cover mb-1",
            position === 1
              ? "w-20 h-20 border-yellow-500"
              : position === 2
                ? "w-16 h-16 border-gray-400"
                : "w-16 h-16 border-amber-700",
          )}
          src={image}
        />
        <span className="font-medium text-lg leading-tight">{name}</span>
        <div className="flex items-center text-gray-700">
          <Star className="size-5 text-yellow-500 mr-1" />
          <span className="chakra-bold font-bold text-black">{score}</span>
        </div>
      </div>
      <div
        className={cn(
          "w-full bg-gray-300 flex justify-center items-center rounded-sm",
          position === 1 ? "h-48" : position === 2 ? "h-32" : "h-24",
        )}
      >
        <span
          className={cn(
            "chakra-bold font-bold text-[#888]",
            position === 1 ? "text-6xl" : "text-5xl",
          )}
        >
          0{position}
        </span>
      </div>
    </div>
  )
}

export function PodiumSection() {
  return (
    <div className="flex items-end justify-center space-x-1 sm:space-x-4 relative z-10 w-full max-w-2xl px-4 mb-2">
      {/* Second Place */}
      <PodiumPlace
        position={2}
        name="Hammond"
        score={8632}
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAjSE4xePqSXx--4DAxrQyTIihXuNshpTt3rFRFI-73uhYG8BrHWZ_76eQrLhIcfrBEv4eA9BzormcXRGb4ysyrI96Hy4lmbVp0RXpVQ7WhwNrk07qdDtQHvR70By4YWx-tCCJRu-2yzslRDaKIhLkCGxQ_QbteUgCB1GC_0QxqW58ID5tcMEiOZJLklU2GW2tAp2jyVH2iyGQlw7vJNiIj8K9ZjlQDill6enHIXG41jowbEcmUl1g3dOCTAqVujIV4YmhPCe-X5ks"
      />

      {/* First Place */}
      <PodiumPlace
        position={1}
        name="Johnny Rios"
        score={9654}
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBYDmxUgBTbd7JW9yDrHwmXL0A0udnJ9LoHQrE092EOO15iby1eIO20xdRdbDybIrDUFat0C4yCcbmgVmMfxuAHjqaL95-RLfUkmv5Ojxw0ieoml3QDRsvoAE_EpFyS2p4t8Dy_emckQA118sARLgLDHBupzPn-80AA2COkxjt4R5o9VW7CejedqGGyXBzo-V4vu3TmyyM7FRbAF9UoEj3O1oNv6db_79wZVI1WWLLlGkoyvkaFF2WIXvbCBundIxtGNWuvQ85ycK4"
      />

      {/* Third Place */}
      <PodiumPlace
        position={3}
        name="Hodges"
        score={6878}
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCTyCEBD4HC4yMD-2w6i6Ggh8KAHy230en6e-5HmyhvgnH0a0mk12wFagxW0YF0uZhfzsvyhnU0Sm3D-O1WejG3JxfPkJ0-IHPSgTvAfQL209M7ILT3ng4aHm4SMb-YCzBX95378KXoCakKikIYWg5UKRES5CSvm1djtfAiIRUqXlJPse7CcfuKy94QTZciFQEClsVJ4lQ8VyTYL4sHzx3HzltpsAjoPVngC2euVHh7rL6r2mRuP284h1cLm2ykOuSCUQYKPkEo48Q"
      />
    </div>
  )
}
