"use client"

import React, { useState, useEffect } from "react"
import { X, Terminal, FileText, Briefcase, FolderOpen, Gift } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  action: string
  highlightId?: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "CHÀO MỪNG TỚI WORKSPACE CỦA CƯỜNG",
    description: "Chào bạn! Cảm ơn đã ghé thăm. Tôi đã \"đóng gói\" (packed) 4 năm hành trình của mình vào workspace này. Hãy bắt đầu một tour ngắn để xem câu chuyện nhé!",
    action: 'Click "Next" to begin the guided tour.',
  },
  {
    id: "terminal",
    title: "Bước 1: Khởi chạy (Initialize)",
    description:
      "Mọi hành trình lớn đều bắt đầu bằng một dòng lệnh. Hãy click vào 'Terminal' để 'biên dịch' (compile) 4 năm hành trình của tôi.",
    action: "Click Terminal icon",
    highlightId: "icon-terminal",
  },
  {
    id: "outro",
    title: "🎉 TOUR HOÀN TẤT & THIỆP MỜI! 🎉",
    description:
      "Quá trình 'compile' đã thành công và 'mở khóa' (unlock) toàn bộ Workspace. Giờ bạn có thể tự do khám phá và xem các hành trình của tui.",
    action: 'Click "Done" to start exploring!',
  },
]

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case "terminal":
      return <Terminal size={32} />
    case "handbook":
      return <FileText size={32} />
    case "ojt":
      return <Briefcase size={32} />
    case "journey":
      return <FolderOpen size={32} />
    case "outro":
      return <Gift size={32} />
    default:
      return <Terminal size={32} />
  }
}

export default function InteractiveOnboarding({
  onClose,
  onIconClick,
  onStepComplete,
}: {
  onClose: () => void
  onIconClick?: (iconId: string) => void
  onStepComplete?: (stepId: string) => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visitedIcons, setVisitedIcons] = useState<Set<string>>(new Set())
  const [highlightElement, setHighlightElement] = useState<DOMRect | null>(null)
  const [streamingText, setStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isGuideHidden, setIsGuideHidden] = useState(false)

  const step = ONBOARDING_STEPS[currentStep]

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 10
    
    const updateHighlight = () => {
      if (step.highlightId) {
        const element = document.getElementById(step.highlightId)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Only update if we got valid dimensions
          if (rect.width > 0 && rect.height > 0) {
            setHighlightElement(rect)
            console.log('Highlight updated:', step.highlightId, rect)
          } else if (retryCount < maxRetries) {
            // Retry if dimensions are zero
            retryCount++
            setTimeout(updateHighlight, 100)
          }
        } else if (retryCount < maxRetries) {
          // Retry if element not found
          retryCount++
          console.log('Element not found, retrying:', step.highlightId)
          setTimeout(updateHighlight, 100)
        }
      } else {
        setHighlightElement(null)
      }
    }
    
    updateHighlight()
    
    // Force update after a delay to ensure animations have completed
    const forceUpdateTimer = setTimeout(updateHighlight, 500)
    
    // Update on window resize
    window.addEventListener('resize', updateHighlight)
    
    return () => {
      clearTimeout(forceUpdateTimer)
      window.removeEventListener('resize', updateHighlight)
    }
  }, [currentStep, step.highlightId])

  // Streaming text effect
  useEffect(() => {
    if (step.description) {
      setIsStreaming(true)
      setStreamingText("")
      let index = 0
      const interval = setInterval(() => {
        if (index < step.description.length) {
          setStreamingText(step.description.slice(0, index + 1))
          index++
        } else {
          setIsStreaming(false)
          clearInterval(interval)
        }
      }, 30) // 30ms per character for smooth streaming

      return () => clearInterval(interval)
    }
  }, [step.description])

  const handleNext = () => {
    // Complete current step before advancing
    if (onStepComplete && currentStep > 0) {
      const currentStepData = ONBOARDING_STEPS[currentStep]
      if (currentStepData.id !== "terminal") { // Terminal is handled separately
        onStepComplete(currentStepData.id)
      }
    }
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleIconClick = (iconId: string) => {
    setVisitedIcons((prev) => new Set(prev).add(iconId))
    
    // Hide guide when clicking terminal in step 1, auto advance to step 2 when closed
    if (iconId === "terminal" && currentStep === 1) {
      setIsGuideHidden(true)
      // Listen for terminal close to advance step
      const checkTerminalClosed = () => {
        const terminalModal = document.querySelector('[data-modal="terminal"]')
        if (!terminalModal) {
          setIsGuideHidden(false)
          setCurrentStep(2) // Go to OUTRO (step 2)
          
          // Notify parent that terminal step is complete - unlock ALL icons
          if (onStepComplete) {
            onStepComplete("terminal")
          }
          return
        }
        setTimeout(checkTerminalClosed, 500)
      }
      setTimeout(checkTerminalClosed, 1000)
    }
    
    if (onIconClick) {
      onIconClick(iconId)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        }}
      />

      {highlightElement && currentStep > 0 && !isGuideHidden && (
        <>
          {/* Main highlight box with enhanced glow */}
          <div
            className="fixed z-40 pointer-events-none animate-pulse"
            style={{
              left: highlightElement.left - 30,
              top: highlightElement.top - 30,
              width: highlightElement.width + 60,
              height: highlightElement.height + 60,
              borderRadius: "20px",
              boxShadow: `
                0 0 0 9999px rgba(0, 0, 0, 0.9),
                inset 0 0 30px rgba(0, 255, 255, 0.2),
                0 0 40px rgba(0, 255, 255, 0.8),
                0 0 80px rgba(0, 255, 255, 0.6),
                0 0 120px rgba(0, 255, 255, 0.4)
              `,
              background:
                "radial-gradient(ellipse at center, rgba(0,255,255,0.1) 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)",
              filter: "drop-shadow(0 0 60px rgba(0, 255, 255, 0.5))",
              border: "2px solid rgba(0, 255, 255, 0.6)"
            }}
          />

          {/* Central icon in highlight box with virtual terminal */}
          <div
            className="fixed z-50 flex flex-col items-center justify-center gap-4"
            style={{
              left: highlightElement.left - 30 + (highlightElement.width + 60) / 2,
              top: highlightElement.top - 30 + (highlightElement.height + 60) / 2,
              transform: "translate(-50%, -50%)",
              animation: "float 2s ease-in-out infinite"
            }}
          >
            {/* Centered Glowing Icon */}
            <div 
              className="relative z-[60] bg-gradient-to-br from-cyan-400 to-blue-500 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-cyan-300 cursor-pointer hover:scale-110 transition-all duration-300"
              style={{
                animation: "animate-bounce-slow 1s ease-in-out infinite"
              }}
              onClick={(e) => {
                e.stopPropagation()
                console.log(`${step.id} icon clicked!`)
                handleIconClick(step.id)
              }}
            >
              <div 
                className="text-black drop-shadow-lg pointer-events-none"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))"
                }}
              >
                {step.id === "terminal" ? (
                  <Terminal className="w-12 h-12 sm:w-16 sm:h-16 stroke-[3px]" />
                ) : (
                  React.cloneElement(getStepIcon(step.id) as React.ReactElement, { className: "w-12 h-12 sm:w-16 sm:h-16" } as any)
                )}
              </div>
              {/* Glow ring around icon */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-400/40 to-blue-500/40 animate-ping pointer-events-none"></div>
              {/* Click indicator */}
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce pointer-events-none">
                <span className="text-black text-xs sm:text-sm font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Step badge */}
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: highlightElement.left - 30 + (highlightElement.width + 60) / 2,
              top: highlightElement.top - 80,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg whitespace-nowrap shadow-2xl animate-pulse">
              Step {currentStep}
            </div>
          </div>
        </>
      )}

      {/* Tutorial Guide - Hidden when terminal is open */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-all duration-500 ${
        isGuideHidden ? "opacity-0 scale-75 translate-y-full" : "opacity-100 scale-100 translate-y-0"
      }`}>
        <div
          className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-2 border-cyan-500/40 rounded-xl sm:rounded-2xl shadow-2xl w-[95vw] sm:w-[600px] max-w-[95vw] sm:max-w-[600px] pointer-events-auto transform hover:scale-105 transition-all duration-300"
          style={{
            animation: isGuideHidden ? "none" : "gameSlideIn 0.6s ease-out, gamePulse 2s ease-in-out infinite",
            boxShadow: "0 0 40px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)"
          }}
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border border-cyan-300 flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm shadow-lg shrink-0">
                {currentStep}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-2">{step.title}</h3>
                <p className="text-cyan-300 text-[0.65rem] sm:text-xs">Tutorial</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-red-500/20 rounded-full shrink-0">
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Compact Content */}
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Streaming text container */}
            <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-cyan-500/30 rounded-lg p-3 sm:p-4 min-h-[100px] sm:min-h-[120px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-lg"></div>
              <div className="relative z-10">
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                  {streamingText}
                  {isStreaming && <span className="animate-pulse text-cyan-400">|</span>}
                </p>
              </div>
            </div>

            {/* Compact action box */}
            <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-2.5 sm:p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 animate-pulse"></div>
              <div className="relative z-10 flex items-center gap-2">
                <div className="text-cyan-300 animate-bounce shrink-0">
                  {React.cloneElement(getStepIcon(step.id) as React.ReactElement, { className: "w-4 h-4 sm:w-4 sm:h-4" } as any)}
                </div>
                <p className="text-cyan-300 text-xs sm:text-sm font-mono font-semibold">{step.action}</p>
              </div>
            </div>

            {/* Compact Progress bar */}
            <div className="w-full bg-gray-700/70 h-2 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%`,
                  boxShadow: "0 0 6px rgba(0, 255, 255, 0.6)"
                }}
              />
            </div>

            {/* Compact Navigation */}
            <div className="flex items-center justify-between pt-2 gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-gray-700/50 rounded-lg text-xs sm:text-sm font-semibold"
              >
                ← Prev
              </button>

              <div className="flex gap-1">
                {ONBOARDING_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep 
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-5 sm:w-6 shadow-lg" 
                        : "bg-gray-600/50 w-1.5 sm:w-2 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 text-xs sm:text-sm"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Done" : "Next"} →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        
        @keyframes gameSlideIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          60% {
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes gamePulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 60px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
        
        @keyframes animate-pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes animate-bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </>
  )
}
