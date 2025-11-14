"use client"

import { useMusic } from "@/contexts/music-context"

interface MusicPlayerControlsProps {
  className?: string
}

export default function MusicPlayerControls({ className = "" }: MusicPlayerControlsProps) {
  const { isPlaying, isMuted, volume, loading, toggle, toggleMute, setVolume } = useMusic()

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-800/60 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={toggle}
        onTouchStart={(e) => {
          e.preventDefault()
          toggle()
        }}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group"
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Volume Slider - Desktop Only */}
      <div className="hidden sm:flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-colors"
          style={{
            background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${volume}%, rgb(55 65 81) ${volume}%, rgb(55 65 81) 100%)`,
          }}
        />
        <span className="text-xs text-gray-400 font-mono min-w-[2.5rem] text-right">
          {volume}%
        </span>
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        onTouchStart={(e) => {
          e.preventDefault()
          toggleMute()
        }}
        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-800/60 hover:bg-gray-700/80 border transition-all duration-200 group ${
          isMuted
            ? "border-red-500/50 hover:border-red-400/70"
            : "border-gray-600/50 hover:border-cyan-400/50"
        }`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
