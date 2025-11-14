"use client"

import type React from "react"
import { Terminal, GraduationCap, FileText, Folder } from "lucide-react"

interface DesktopIconProps {
  name: string
  icon: string
  onClick: () => void
}

const GradientIconWrapper = ({ children, color = "cyan" }: { children: React.ReactNode, color?: string }) => {
  const colorMap = {
    cyan: {
      from: "from-cyan-400",
      to: "to-blue-500",
      border: "border-cyan-300/50",
      glowFrom: "from-cyan-400/30",
      glowTo: "to-blue-500/30",
      hoverGlow: "from-cyan-300/20 to-blue-400/20",
      dropShadow: "group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]",
      hoverShadow: "group-hover:shadow-cyan-400/50",
      hoverBorder: "group-hover:border-cyan-300"
    },
    purple: {
      from: "from-purple-400",
      to: "to-pink-500",
      border: "border-purple-300/50",
      glowFrom: "from-purple-400/30",
      glowTo: "to-pink-500/30",
      hoverGlow: "from-purple-300/20 to-pink-400/20",
      dropShadow: "group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]",
      hoverShadow: "group-hover:shadow-purple-400/50",
      hoverBorder: "group-hover:border-purple-300"
    },
    green: {
      from: "from-green-400",
      to: "to-emerald-500",
      border: "border-green-300/50",
      glowFrom: "from-green-400/30",
      glowTo: "to-emerald-500/30",
      hoverGlow: "from-green-300/20 to-emerald-400/20",
      dropShadow: "group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]",
      hoverShadow: "group-hover:shadow-green-400/50",
      hoverBorder: "group-hover:border-green-300"
    },
    orange: {
      from: "from-orange-400",
      to: "to-amber-500",
      border: "border-orange-300/50",
      glowFrom: "from-orange-400/30",
      glowTo: "to-amber-500/30",
      hoverGlow: "from-orange-300/20 to-amber-400/20",
      dropShadow: "group-hover:drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]",
      hoverShadow: "group-hover:shadow-orange-400/50",
      hoverBorder: "group-hover:border-orange-300"
    }
  }
  
  const colors = colorMap[color as keyof typeof colorMap] || colorMap.cyan

  return (
    <div className={`relative ${colors.dropShadow} transition-all duration-300`}>
      <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-xl border-2 ${colors.border} relative overflow-hidden ${colors.hoverShadow} ${colors.hoverBorder} transition-all duration-300`}>
        <div className="text-black stroke-[2.5px] relative z-10">
          {children}
        </div>
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.glowFrom} ${colors.glowTo} animate-pulse rounded-lg sm:rounded-xl`} />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-lg sm:rounded-xl" />
        {/* Hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.hoverGlow} rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>
    </div>
  )
}

const IconComponents: { [key: string]: React.FC<{ className: string }> } = {
  terminal: () => (
    <GradientIconWrapper color="cyan">
      <Terminal className="w-8 h-8 sm:w-10 sm:h-10" />
    </GradientIconWrapper>
  ),
  graduation: () => (
    <GradientIconWrapper color="purple">
      <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
    </GradientIconWrapper>
  ),
  document: () => (
    <GradientIconWrapper color="green">
      <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
    </GradientIconWrapper>
  ),
  folder: () => (
    <GradientIconWrapper color="orange">
      <Folder className="w-8 h-8 sm:w-10 sm:h-10" />
    </GradientIconWrapper>
  ),
}

export default function DesktopIcon({ name, icon, onClick }: DesktopIconProps) {
  const IconComponent = IconComponents[icon]

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg 
                 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer 
                 active:scale-95 group"
      style={{
        perspective: "1000px",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = "rotateY(-8deg) rotateX(5deg) translateZ(20px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)"
      }}
    >
      {IconComponent && (
        <div className="mb-1.5 sm:mb-2 transition-transform duration-300 group-hover:scale-105">
          <IconComponent className="" />
        </div>
      )}
      <span
        className="text-[0.65rem] sm:text-xs text-white text-center leading-tight max-w-16 sm:max-w-20 
                      group-hover:text-cyan-300 transition-colors line-clamp-2"
      >
        {name}
      </span>
    </button>
  )
}
