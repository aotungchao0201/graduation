"use client"

import { useState } from "react"
import IntroScreen from "@/components/intro-screen"
import DesktopWorkspace from "@/components/desktop-workspace"
import ClientOnly from "@/components/client-only"

export default function Home() {
  const [showWorkspace, setShowWorkspace] = useState(false)

  return (
    <ClientOnly 
      fallback={
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center" suppressHydrationWarning>
          <div className="animate-pulse" suppressHydrationWarning>
            <div className="text-cyan-400 text-2xl font-bold" suppressHydrationWarning>Loading Graduation Workspace...</div>
            <div className="flex justify-center mt-4" suppressHydrationWarning>
              <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" suppressHydrationWarning></div>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-screen h-screen overflow-hidden perspective">
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in ${
            showWorkspace ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            transform: showWorkspace ? "scale(0) translate(50%, 50%)" : "scale(1) translate(0, 0)",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <IntroScreen onEnter={() => setShowWorkspace(true)} />
        </div>

        <div
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            showWorkspace ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            transform: showWorkspace
              ? "perspective(1200px) scale(1) rotateX(0deg)"
              : "perspective(1200px) scale(1.2) rotateX(15deg)",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <DesktopWorkspace />
        </div>
      </div>
    </ClientOnly>
  )
}
