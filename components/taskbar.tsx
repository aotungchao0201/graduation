"use client"

import { useEffect, useState } from "react"

export default function TaskBar() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute bottom-0 left-0 w-full h-10 sm:h-12 bg-gray-950/80 backdrop-blur-sm 
                    flex items-center justify-between px-3 sm:px-4 border-t border-gray-700 z-30"
    >
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <img
          src="https://res.cloudinary.com/ds5zljulv/image/upload/v1762855288/SE172522_1_nruh0n.jpg"
          alt="Cường's Avatar"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 
                     object-cover shrink-0 bg-gray-700"
          loading="lazy"
        />
        <span className="text-xs sm:text-sm text-gray-300 font-medium truncate max-w-[140px] sm:max-w-none">
          Cường's Workspace
        </span>
      </div>

      {/* Right side - Clock */}
      <div className="text-[0.65rem] sm:text-xs text-gray-400 font-mono shrink-0">{time || "00:00:00"}</div>
    </div>
  )
}
