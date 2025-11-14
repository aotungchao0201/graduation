"use client"

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"

interface MusicContextType {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  loading: boolean
  play: () => Promise<void>
  pause: () => void
  toggle: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(50)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasUserInteractedRef = useRef(false)

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return

    const audio = new Audio("/theme_song.mp3")
    audio.loop = true
    audio.volume = volume / 100
    audio.muted = isMuted
    audio.preload = "auto" // Preload audio

    const playAttemptedRef = { current: false }

    const handleCanPlay = () => {
      setLoading(false)
      // Try to play when audio is ready
      if (!playAttemptedRef.current && hasUserInteractedRef.current) {
        playAttemptedRef.current = true
        audio.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Silent fail - will retry on user interaction
            playAttemptedRef.current = false
          })
      }
    }

    const handleCanPlayThrough = () => {
      setLoading(false)
      // Try to play when audio is fully loaded
      if (!playAttemptedRef.current && hasUserInteractedRef.current) {
        playAttemptedRef.current = true
        audio.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Silent fail - will retry on user interaction
            playAttemptedRef.current = false
          })
      }
    }

    const handleLoadedData = () => {
      // Try even earlier when data is loaded
      if (!playAttemptedRef.current && hasUserInteractedRef.current) {
        playAttemptedRef.current = true
        audio.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Silent fail - will retry on user interaction
            playAttemptedRef.current = false
          })
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      audio.currentTime = 0
      audio.play().catch(console.error)
    }

    const handleError = (e: any) => {
      console.error("Audio error:", e)
      setLoading(false)
    }

    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    audioRef.current = audio

    // Try multiple aggressive autoplay attempts
    const tryAutoplay = async () => {
      if (playAttemptedRef.current) return
      
      try {
        // Try play with muted first (some browsers allow this)
        const wasMuted = audio.muted
        audio.muted = true
        await audio.play()
        setIsPlaying(true)
        hasUserInteractedRef.current = true
        playAttemptedRef.current = true
        // Restore mute state after successful play
        audio.muted = wasMuted
      } catch {
        // If muted play failed, try unmuted
        try {
          audio.muted = isMuted
          await audio.play()
          setIsPlaying(true)
          hasUserInteractedRef.current = true
          playAttemptedRef.current = true
        } catch {
          // Both failed - will wait for user interaction
        }
      }
    }

    // Multiple attempts with different strategies
    const timers: NodeJS.Timeout[] = []
    
    // Try immediately (might work in some browsers/configurations)
    tryAutoplay()
    
    // Try after audio metadata loads
    audio.addEventListener("loadedmetadata", () => {
      if (!playAttemptedRef.current) {
        tryAutoplay()
      }
    }, { once: true })
    
    // Try after 50ms
    timers.push(setTimeout(() => {
      if (!playAttemptedRef.current) tryAutoplay()
    }, 50))
    
    // Try after 200ms
    timers.push(setTimeout(() => {
      if (!playAttemptedRef.current) tryAutoplay()
    }, 200))
    
    // Try after 500ms
    timers.push(setTimeout(() => {
      if (!playAttemptedRef.current) tryAutoplay()
    }, 500))
    
    // Try after 1000ms (last resort)
    timers.push(setTimeout(() => {
      if (!playAttemptedRef.current) tryAutoplay()
    }, 1000))

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [])

  // Global click/touch listener to enable autoplay after first interaction
  useEffect(() => {
    if (hasUserInteractedRef.current) return

    const enableAutoplay = () => {
      if (!hasUserInteractedRef.current && audioRef.current) {
        hasUserInteractedRef.current = true
        // Try to play immediately after user interaction
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Silent fail - user can manually play later
          })
      }
    }

    // Use capture phase to catch events earlier
    // Listen to multiple events to catch interaction as early as possible
    const options = { once: true, capture: true, passive: true }
    
    window.addEventListener("click", enableAutoplay, options)
    window.addEventListener("touchstart", enableAutoplay, options)
    window.addEventListener("keydown", enableAutoplay, options)
    window.addEventListener("mousedown", enableAutoplay, options)
    window.addEventListener("pointerdown", enableAutoplay, options)

    return () => {
      window.removeEventListener("click", enableAutoplay, options as any)
      window.removeEventListener("touchstart", enableAutoplay, options as any)
      window.removeEventListener("keydown", enableAutoplay, options as any)
      window.removeEventListener("mousedown", enableAutoplay, options as any)
      window.removeEventListener("pointerdown", enableAutoplay, options as any)
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Update mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (err) {
        console.error("Error playing audio:", err)
      }
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err)
        })
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        loading,
        play,
        pause,
        toggle,
        toggleMute,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider")
  }
  return context
}
