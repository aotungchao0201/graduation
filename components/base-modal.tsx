"use client"

import type { ReactNode } from "react"

interface BaseModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: string
  noBorder?: boolean
}

export default function BaseModal({
  title,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  noBorder = false,
}: BaseModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`${maxWidth} w-full max-w-[95vw] mx-4 bg-gray-800 rounded-lg shadow-2xl overflow-hidden`}
        style={{ border: noBorder ? "none" : "" }}
      >
        {/* Header */}
        <div className="bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          <h3 className="text-white font-semibold text-base sm:text-lg truncate flex-1">{title}</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 hover:bg-red-600 
                      flex items-center justify-center text-white font-bold 
                      transition-colors shrink-0 text-sm sm:text-base"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800">{children}</div>
      </div>
    </div>
  )
}
