"use client"

import { useState } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "terminal",
    title: "Welcome to My Graduation Invite",
    description:
      "Explore my journey through this interactive workspace. Each icon tells a story of my time at FPT University.",
    icon: "terminal", // Assuming icon is used for future steps
  },
  {
    id: "skills",
    title: "Skills & Knowledge",
    description:
      "Discover the technical skills and expertise I've developed through rigorous coursework and hands-on projects.",
    icon: "skills",
  },
  {
    id: "handbook",
    title: "Handbook",
    description: "Review my comprehensive handbook containing important details and information about my graduation.",
    icon: "handbook",
  },
  {
    id: "ojt",
    title: "OJT Experience",
    description:
      "Explore my On-Job Training at CTF for 30 hours - a valuable hands-on experience in real-world applications.",
    icon: "ojt",
  },
  {
    id: "lab",
    title: "Lab & Projects",
    description: "Check out the laboratory work and innovative projects I completed during my academic journey.",
    icon: "lab",
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Celebrate the certificates, awards, and accomplishments I've earned throughout my studies.",
    icon: "achievements",
  },
  {
    id: "memories",
    title: "Class Memories",
    description: "Cherish precious moments with my classmates as we reach this important milestone together.",
    icon: "memories",
  },
  {
    id: "graduation",
    title: "The Grand Finale",
    description: "You're invited! Join me at my graduation ceremony to celebrate this exciting new chapter.",
    icon: "graduation",
  },
]

export default function OnboardingGuide({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showImageZoom, setShowImageZoom] = useState(false)
  const step = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gray-800/50">
          <div>
            <h2 className="text-white text-2xl font-bold">{step.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Graduation photo in first step */}
          {currentStep === 0 && (
            <div className="mb-6 flex justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SE172522_2-qWSfuqHrtucH9SpCwGyEqUN7rXdLZ8.jpg"
                alt="Trần Tiến Cường Graduation"
                className="w-40 h-56 object-cover rounded-lg border-2 border-cyan-400/50 cursor-pointer hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all"
                onClick={() => setShowImageZoom(true)}
              />
            </div>
          )}

          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-cyan-500/10">
            <p className="text-gray-200 text-lg leading-relaxed">{step.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1.5 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="flex gap-1.5">
              {onboardingSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep ? "bg-cyan-400 w-6" : "bg-gray-600 w-2"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Zoomed image modal */}
      {showImageZoom && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm"
          onClick={() => setShowImageZoom(false)}
        >
          <div className="relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SE172522_2-qWSfuqHrtucH9SpCwGyEqUN7rXdLZ8.jpg"
              alt="Trần Tiến Cường Graduation"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
