"use client"

import { useEffect, useState } from "react"
import MusicPlayerControls from "@/components/music-player-controls"
import { useMusic } from "@/contexts/music-context"

interface IntroScreenProps {
  onEnter: () => void
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([])
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const { play } = useMusic()

  // Generate particles for desktop only
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
      }))
      setParticles(generatedParticles)
    }
    setMounted(true)
  }, [])

  // Auto sign in countdown - DISABLED
  // useEffect(() => {
  //   if (countdown <= 0) {
  //     return
  //   }

  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       const newCount = prev - 1
  //       if (newCount <= 0) {
  //         setTimeout(() => onEnter(), 0)
  //         return 0
  //       }
  //       return newCount
  //     })
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [onEnter])

  // Keyboard listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onEnter()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onEnter])

  const handleEyeClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Eye clicked!") // Debug
    setShowPassword(!showPassword)
  }

  const handleSignIn = (e?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log("Sign In clicked!") // Debug
    
    // Play nhạc
    play().catch(() => {
      // Silent fail
    })
    
    onEnter()
  }

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    
    // Skip nếu click vào music player (để controls hoạt động)
    if (target.closest('[data-music-player]')) {
      return
    }
    
    // Click vào bất kỳ đâu khác → vào workspace và play nhạc
    console.log("Screen clicked anywhere - entering workspace and playing music")
    
    // Play nhạc
    play().catch(() => {
      // Silent fail
    })
    
    // Vào workspace
    onEnter()
  }

  return (
    <div 
      className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden cursor-pointer" 
      style={{ isolation: 'isolate' }}
      onClick={handleScreenClick}
      onTouchStart={handleScreenClick}
    >
      {/* Background with blur - FPT image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dai-hoc-fpt-tp-hcm-1-H4qB478cfQgTjRCUbBTzZy2u02x3Wu.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 animate-gradient-shift-desktop" />
      </div>

      {/* Floating Particles - Desktop Only */}
      {mounted && particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-desktop"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Login Card - Centered */}
      <div className="relative z-[100] w-full max-w-md px-6 sm:px-8 animate-fade-in-up-desktop">
        <div className="relative z-[100]">
          {/* Animated Gradient Border - Desktop Only */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-orange-600/30 opacity-75 blur-xl animate-gradient-border-desktop hidden lg:block" />
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10 animate-card-glow-desktop z-[100]">
            {/* Avatar - Adjusted to show face better */}
            <div className="flex justify-center mb-6">
              <div className="relative animate-bounce-in-desktop">
                <img
                  src="https://res.cloudinary.com/ds5zljulv/image/upload/v1762855288/SE172522_1_nruh0n.jpg"
                  alt="Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 object-cover object-top shadow-lg hover:scale-105 transition-transform duration-300 relative z-10"
                  style={{ objectPosition: 'center 25%' }}
                  loading="lazy"
                />
                {/* Glow Ring - Desktop Only */}
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 hover:opacity-100 transition-opacity -z-10 hidden lg:block" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white/30 animate-pulse"></div>
              </div>
            </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-2 font-medium">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value="cuong@fpt.edu"
                readOnly
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-default"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-white/70 text-sm mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={showPassword ? "graduation2025" : "••••••••"}
                readOnly
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-default hover:border-white/30 transition-colors pointer-events-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onEnter()
                  }
                }}
              />
              
              {/* Eye Icon Button */}
              <button
                type="button"
                onClick={handleEyeClick}
                onTouchStart={handleEyeClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 rounded hover:bg-white/10 cursor-pointer z-30 pointer-events-auto"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Countdown Timer - DISABLED */}
          {/* <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(countdown / 5) * 100.53}, 100.53`}
                    strokeLinecap="round"
                    className="text-purple-400 transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {countdown}
                </span>
              </div>
              <span className="text-white/70 text-sm sm:text-base font-medium">
                Auto sign in in {countdown}s
              </span>
            </div>
          </div> */}

          {/* Sign In Button Wrapper */}
          <div className="relative z-[10000] mb-0">
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Touch Start - Sign In")
                handleSignIn(e)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Touch End - Sign In")
                handleSignIn(e)
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Click - Sign In")
                handleSignIn(e)
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Mouse Down - Sign In")
                handleSignIn(e)
              }}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-500 hover:to-orange-500 active:from-purple-700 active:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 active:scale-[0.98] group relative overflow-visible cursor-pointer z-[10000] pointer-events-auto select-none"
              style={{ 
                touchAction: 'manipulation', 
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                position: 'relative',
                zIndex: 10000,
                isolation: 'isolate'
              }}
              aria-label="Sign In"
            >
              {/* Shimmer Effect - Desktop Only */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent hidden lg:block" />
              <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
                🔓 Sign In Now
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Hint */}
          <p className="text-center text-white/50 text-xs mt-4 pointer-events-none">
            Or tap Sign In Now to enter immediately
          </p>
          </div>
        </div>
      </div>

      {/* Music Player - Top Right */}
      <div data-music-player className="absolute top-4 right-4 z-[50] sm:top-6 sm:right-6 pointer-events-auto">
        <MusicPlayerControls />
      </div>

      {/* System Info - Bottom */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 animate-fade-in-bottom-desktop">
        <p className="text-white/60 text-xs sm:text-sm font-mono">
          Ubuntu 22.04 LTS
        </p>
        <p className="text-white/40 text-xs mt-1">
          Graduation Workspace 2025 • An Toàn Thông Tin
        </p>
      </div>

    </div>
  )
}
