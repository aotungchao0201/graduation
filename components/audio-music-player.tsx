"use client"

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react"

export interface AudioMusicPlayerRef {
  play: () => Promise<void>
  pause: () => void
  toggle: () => void
}

interface AudioMusicPlayerProps {
  audioSrc: string
  autoPlay?: boolean
  loop?: boolean
  className?: string
}

const AudioMusicPlayer = forwardRef<AudioMusicPlayerRef, AudioMusicPlayerProps>(({
  audioSrc,
  autoPlay = true,
  loop = true,
  className = "",
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [loading, setLoading] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playAttemptedRef = useRef(false)

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return

    const audio = new Audio(audioSrc)
    audio.loop = loop
    audio.volume = volume / 100
    audio.muted = isMuted

    const handleCanPlay = () => {
      setLoading(false)
      // Try to play when audio is ready if autoplay is enabled
      if (autoPlay && !playAttemptedRef.current) {
        playAttemptedRef.current = true
        audio.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.log("Autoplay blocked - waiting for user interaction:", err)
        })
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      if (loop) {
        audio.currentTime = 0
        audio.play().catch(console.error)
      } else {
        setIsPlaying(false)
      }
    }

    const handleError = (e: any) => {
      console.error("Audio error:", e)
      setLoading(false)
    }

    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("canplaythrough", handleCanPlay)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    audioRef.current = audio

    // Try to play immediately if autoplay is enabled
    if (autoPlay && !playAttemptedRef.current) {
      playAttemptedRef.current = true
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.log("Autoplay blocked - waiting for user interaction:", err)
      })
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("canplaythrough", handleCanPlay)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [audioSrc, loop, autoPlay])

  // Global click/touch listener to enable autoplay after first interaction
  useEffect(() => {
    if (!autoPlay || hasUserInteracted) return

    const enableAutoplay = () => {
      if (!hasUserInteracted && audioRef.current && !isPlaying) {
        setHasUserInteracted(true)
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.log("Failed to start playback:", err)
        })
      }
    }

    // Listen for any user interaction
    window.addEventListener("click", enableAutoplay, { once: true })
    window.addEventListener("touchstart", enableAutoplay, { once: true })
    window.addEventListener("keydown", enableAutoplay, { once: true })

    return () => {
      window.removeEventListener("click", enableAutoplay)
      window.removeEventListener("touchstart", enableAutoplay)
      window.removeEventListener("keydown", enableAutoplay)
    }
  }, [autoPlay, hasUserInteracted, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (err) {
          console.error("Error playing audio:", err)
        }
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    },
    toggle: () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch((err) => {
            console.error("Error playing audio:", err)
          })
        }
      }
    },
  }), [isPlaying])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err)
      })
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
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
        onClick={togglePlay}
        onTouchStart={(e) => {
          e.preventDefault()
          togglePlay()
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
})

AudioMusicPlayer.displayName = "AudioMusicPlayer"

export default AudioMusicPlayer
