"use client"

import { useEffect, useState } from "react"
import BaseModal from "./base-modal"

interface TerminalModalProps {
  onClose: () => void
}

const TERMINAL_LINES = [
  '$ ./compile_journey.sh --user "Trần Tiến Cường"',
  "",
  "[INFO] Analyzing 4-year journey...",
  "[INFO] Checking dependencies: Network_Security, Threat_Analysis, Ethical_Hacking... [OK]",
  "[INFO] Compiling modules...",
  "[25%] OJT_HPT... [SUCCESS]",
  "[50%] CTF_Challenges... [SUCCESS]", 
  "[75%] Project_SIEM_Lab... [SUCCESS]",
  "[100%] Thesis_Defense... [PASSED]",
  "",
  "[SUCCESS] Build complete! Executable: 'Graduation.exe'",
  "[ACTION] You are cordially invited.",
  "",
  "[ALERT] This terminal will self-destruct in 3s...",
  "",
  "$ _",
]

// Helper function to extract percentage from line
const getPercentage = (line: string): number => {
  const match = line.match(/\[(\d+)%\]/)
  return match ? parseInt(match[1]) : 0
}

// Helper function to check if line has percentage
const hasPercentage = (line: string): boolean => {
  return /\[\d+%\]/.test(line)
}

// Helper function to render line with appropriate styling
const renderLine = (line: string) => {
  if (line.includes("[SUCCESS]") || line.includes("[OK]") || line.includes("[PASSED]")) {
    return <span className="text-green-500">{line}</span>
  } else if (line.includes("[ERROR]") || line.includes("[FAILED]")) {
    return <span className="text-red-400">{line}</span>
  } else if (line.includes("[ALERT]")) {
    return <span className="text-red-500 font-bold animate-pulse">{line}</span>
  } else if (line.includes("[INFO]")) {
    return <span className="text-blue-400">{line}</span>
  } else if (line.includes("[ACTION]")) {
    return <span className="text-cyan-300 font-extrabold text-lg">{line}</span>
  } else if (line.startsWith("$")) {
    return <span className="text-green-400">{line}</span>
  } else {
    return <span className="text-gray-300">{line}</span>
  }
}

export default function TerminalModal({ onClose }: TerminalModalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentProgress, setCurrentProgress] = useState<{[key: number]: number}>({})
  const [typingLines, setTypingLines] = useState<{[key: number]: string}>({})
  const [isTyping, setIsTyping] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < TERMINAL_LINES.length) {
        const currentLine = TERMINAL_LINES[lineIndex]
        
        // Start typing animation for this line
        if (currentLine.trim() !== "") {
          setIsTyping(prev => ({...prev, [lineIndex]: true}))
          animateTyping(lineIndex, currentLine)
        } else {
          // For empty lines, just add them immediately
          setDisplayedLines((prev) => [...prev, currentLine])
        }
        
        lineIndex++
      } else {
        clearInterval(interval)
      }
    }, 800) // Slower to allow typing animation to complete

    return () => clearInterval(interval)
  }, [])

  const animateTyping = (lineIndex: number, fullText: string) => {
    let charIndex = 0
    setTypingLines(prev => ({...prev, [lineIndex]: ""}))
    
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        const currentText = fullText.slice(0, charIndex)
        setTypingLines(prev => ({...prev, [lineIndex]: currentText}))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(prev => ({...prev, [lineIndex]: false}))
        setDisplayedLines((prev) => [...prev, fullText])
        
        // If line has percentage, start progress animation
        if (hasPercentage(fullText)) {
          const percentage = getPercentage(fullText)
          setTimeout(() => animateProgress(lineIndex, percentage), 200)
        }
      }
    }, 20) // 20ms per character for smooth typing
  }

  const animateProgress = (lineIndex: number, targetPercent: number) => {
    let currentPercent = 0
    const step = targetPercent === 100 ? 1 : 2 // Slower for 100%
    const progressInterval = setInterval(() => {
      if (currentPercent <= targetPercent) {
        setCurrentProgress(prev => ({...prev, [lineIndex]: currentPercent}))
        currentPercent += step
      } else {
        // Ensure we hit exactly the target
        setCurrentProgress(prev => ({...prev, [lineIndex]: targetPercent}))
        clearInterval(progressInterval)
      }
    }, targetPercent === 100 ? 15 : 20) // Slower animation for 100%
  }

  return (
    <div data-modal="terminal">
      <BaseModal title="cuongttse172522@fpt-university: ~/graduation" onClose={onClose}>
        <div className="bg-black p-3 sm:p-4 font-mono text-[0.65rem] sm:text-xs rounded-lg overflow-hidden">
        {/* Render completed lines */}
        {displayedLines.map((line, idx) => (
          <div key={`completed-${idx}`} className="text-green-400 mb-1 leading-relaxed">
            {line === "" ? (
              <div className="h-3"></div>
            ) : hasPercentage(line) ? (
              <div className="space-y-1">
                <div>
                  {line.includes("[SUCCESS]") || line.includes("[PASSED]") ? (
                    <span className="text-green-500">{line}</span>
                  ) : (
                    <span className="text-yellow-400">{line}</span>
                  )}
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden ml-4 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ease-out ${
                      currentProgress[idx] >= 100 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse' 
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(currentProgress[idx] || 0, 100)}%`,
                      boxShadow: currentProgress[idx] >= 100 
                        ? '0 0 15px rgba(0, 255, 150, 0.8), 0 0 30px rgba(0, 255, 150, 0.4)' 
                        : currentProgress[idx] > 0 
                        ? '0 0 8px rgba(0, 255, 255, 0.5)' 
                        : ''
                    }}
                  />
                  {/* Completion spark effect */}
                  {currentProgress[idx] >= 100 && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-white animate-ping rounded-full opacity-75" />
                  )}
                </div>
              </div>
            ) : renderLine(line)}
          </div>
        ))}
        
        {/* Render currently typing lines */}
        {Object.entries(typingLines).map(([lineIdx, text]) => {
          const idx = parseInt(lineIdx)
          if (isTyping[idx] && text !== undefined) {
            return (
              <div key={`typing-${idx}`} className="text-green-400 mb-1 leading-relaxed">
                {renderLine(text)}
                <span className="animate-pulse text-cyan-400">|</span>
              </div>
            )
          }
          return null
        })}
        
        {/* Cursor for overall typing */}
        {displayedLines.length < TERMINAL_LINES.length && !Object.values(isTyping).some(Boolean) && (
          <div className="text-green-400 animate-pulse">▊</div>
        )}
        </div>
      </BaseModal>
    </div>
  )
}

