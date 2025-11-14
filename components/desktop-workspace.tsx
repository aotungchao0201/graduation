"use client"

import { useState, useEffect } from "react"
import DesktopIcon from "@/components/desktop-icon"
import TaskBar from "@/components/taskbar"
import TerminalModal from "@/components/terminal-modal"
import JourneyModal from "@/components/journey-modal"
import ThanksModal from "@/components/thanks-modal"
import GraduationModal from "@/components/graduation-modal"
import InteractiveOnboarding from "@/components/interactive-onboarding"
import { LabDialog, AchievementsDialog, MemoriesDialog, OJTDialog } from "@/components/journey-dialogs"

export default function DesktopWorkspace() {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set())
  const [startInteractiveOnboarding, setStartInteractiveOnboarding] = useState(false)
  const [openJourneyDialogs, setOpenJourneyDialogs] = useState<Set<string>>(new Set())
  const [unlockedIcons, setUnlockedIcons] = useState<string[]>(["terminal"]) // Terminal có sẵn từ đầu
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null)

  useEffect(() => {
    setStartInteractiveOnboarding(true)
  }, [])

  // Unlock icon with animation
  const unlockIcon = (iconId: string) => {
    if (!unlockedIcons.includes(iconId)) {
      setUnlockedIcons(prev => [...prev, iconId])
      setNewlyUnlocked(iconId)
      // Clear animation after 2 seconds
      setTimeout(() => setNewlyUnlocked(null), 2000)
    }
  }

  const toggleModal = (id: string) => {
    const newModals = new Set(openModals)
    if (newModals.has(id)) {
      newModals.delete(id)
    } else {
      newModals.add(id)
    }
    setOpenModals(newModals)
  }

  const closeModal = (id: string) => {
    const newModals = new Set(openModals)
    newModals.delete(id)
    setOpenModals(newModals)
  }

  const toggleJourneyDialog = (id: string) => {
    const newDialogs = new Set(openJourneyDialogs)
    if (newDialogs.has(id)) {
      newDialogs.delete(id)
    } else {
      newDialogs.add(id)
    }
    setOpenJourneyDialogs(newDialogs)
  }

  const handleIconClickInOnboarding = (iconId: string) => {
    toggleModal(iconId)
  }

  const handleStepComplete = (stepId: string) => {
    // Terminal complete -> unlock ALL icons at once
    if (stepId === "terminal") {
      setTimeout(() => unlockIcon("handbook"), 200)
      setTimeout(() => unlockIcon("journey"), 400)
    }
  }

  // Icon configuration - order matches tutorial steps
  const iconConfigs = [
    { id: "terminal", name: "Terminal", icon: "terminal", onClick: () => toggleModal("terminal") },
    { id: "handbook", name: "Hand Book", icon: "document", onClick: () => toggleModal("thanks") },
    { id: "journey", name: "Graduation.exe", icon: "folder", onClick: () => toggleModal("graduation") }
  ]

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 animate-subtle-drift"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dai-hoc-fpt-tp-hcm-1-H4qB478cfQgTjRCUbBTzZy2u02x3Wu.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-900/30 to-gray-900/60 pointer-events-none" />

      {/* Main Icon Grid */}
      <div className="relative z-20 p-4 sm:p-6 md:p-8 h-full flex flex-col overflow-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 bg-linear-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            Trần Tiến Cường - SE172522
          </h1>
          <p className="text-cyan-300 text-sm sm:text-base">Graduation Invite Workspace</p>
        </div>

        {/* Quick Access Title */}
        <div className="mb-4">
          <h2 className="text-white text-base sm:text-lg font-semibold opacity-70">Quick Access</h2>
        </div>

        {/* Icon Highlights Section - 4 icons including terminal when in grid */}
        <div className="mb-8 sm:mb-12 w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-12">
          <div className="flex justify-between items-start gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            {iconConfigs.map((iconConfig) => {
              const isUnlocked = unlockedIcons.includes(iconConfig.id)
              const isNewlyUnlocked = newlyUnlocked === iconConfig.id
              
              // Terminal always shows in grid (ô đầu tiên)
              const showInGrid = iconConfig.id === "terminal" ? true : isUnlocked
              
              // Always show placeholder, but reveal content when unlocked
              return (
                <div 
                  key={iconConfig.id}
                  id={`icon-${iconConfig.id}`}
                  className="relative"
                >
                  {showInGrid ? (
                    <div 
                      className={`transform transition-all duration-700 ${
                        isNewlyUnlocked 
                          ? "animate-[slideIn_0.7s_ease-out,glow_2s_ease-in-out]" 
                          : ""
                      }`}
                    >
                      <DesktopIcon 
                        name={iconConfig.name} 
                        icon={iconConfig.icon} 
                        onClick={iconConfig.onClick} 
                      />
                    </div>
                  ) : (
                    /* Locked placeholder box */
                    <div className="w-20 h-28 sm:w-24 sm:h-32 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gray-800/30 border-2 border-gray-700/30 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group locked-icon-pulse">
                        {/* Lock icon */}
                        <svg 
                          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600/50" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                          />
                        </svg>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-600/10 to-transparent animate-shimmer" 
                             style={{ transform: 'translateX(-100%)' }}></div>
                      </div>
                      <p className="text-gray-600/50 text-[0.65rem] sm:text-xs mt-2 font-medium">Locked</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Journey Section */}
        <div id="journey-section">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-white text-base sm:text-lg font-semibold opacity-80">My Journey</h2>
              <p className="text-cyan-200/70 text-[0.65rem] sm:text-xs mt-1">
                Chạm vào từng chương để mở tài liệu, ảnh và câu chuyện của mình tại FPT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 journey-grid">
            {[
              {
                id: "lab",
                icon: "🧪",
                title: "Capstone Project",
                subtitle: "Final build & documents",
                badge: "4 FILES",
                badgeColor: "from-cyan-500/20 to-emerald-500/20",
                badgeTextColor: "text-cyan-200",
                badgeBorderColor: "border-cyan-400/35",
                accent: "from-cyan-400/35 via-transparent to-transparent",
              },
              {
                id: "achievements",
                icon: "🏆",
                title: "Achievements",
                subtitle: "Certificates & recognitions",
                badge: "8 HIGHLIGHTS",
                badgeColor: "from-yellow-500/20 to-amber-500/20",
                badgeTextColor: "text-yellow-200",
                badgeBorderColor: "border-yellow-400/35",
                accent: "from-yellow-300/30 via-transparent to-transparent",
              },
              {
                id: "memories",
                icon: "👥",
                title: "Memories",
                subtitle: "Friends & campus life",
                badge: "20+ PHOTOS",
                badgeColor: "from-fuchsia-500/20 to-pink-500/20",
                badgeTextColor: "text-fuchsia-200",
                badgeBorderColor: "border-fuchsia-400/35",
                accent: "from-fuchsia-400/30 via-transparent to-transparent",
              },
              {
                id: "ojt",
                icon: "🎓",
                title: "OJT Journey",
                subtitle: "Internship experience",
                badge: "3 DOCUMENTS",
                badgeColor: "from-emerald-500/20 to-teal-500/20",
                badgeTextColor: "text-emerald-200",
                badgeBorderColor: "border-emerald-400/35",
                accent: "from-emerald-400/30 via-transparent to-transparent",
              },
            ].map((card) => (
              <button
                key={card.id}
                onClick={() => toggleJourneyDialog(card.id)}
                className="journey-card text-left"
              >
                <div className={`journey-card__accent bg-linear-to-br ${card.accent}`} />
                <div className="journey-card__header">
                  <span className="journey-card__icon">{card.icon}</span>
                  <span 
                    className={`journey-card__badge bg-linear-to-r ${card.badgeColor} ${card.badgeTextColor} ${card.badgeBorderColor}`}
                  >
                    {card.badge}
                  </span>
                </div>
                <div className="journey-card__body">
                  <p className="journey-card__title">{card.title}</p>
                  <p className="journey-card__subtitle">{card.subtitle}</p>
                </div>
                <div className="journey-card__footer">
                  <span>OPEN CHAPTER</span>
                  <span className="journey-card__footer-icon">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {openModals.has("terminal") && <TerminalModal onClose={() => closeModal("terminal")} />}
      {openModals.has("journey") && <JourneyModal onClose={() => closeModal("journey")} />}
      {openModals.has("thanks") && <ThanksModal onClose={() => closeModal("thanks")} />}
      {openModals.has("graduation") && <GraduationModal onClose={() => closeModal("graduation")} />}

      {/* Journey Dialogs */}
      <LabDialog
        open={openJourneyDialogs.has("lab")}
        onOpenChange={(open) => {
          if (!open) toggleJourneyDialog("lab")
        }}
      />
      <AchievementsDialog
        open={openJourneyDialogs.has("achievements")}
        onOpenChange={(open) => {
          if (!open) toggleJourneyDialog("achievements")
        }}
      />
      <MemoriesDialog
        open={openJourneyDialogs.has("memories")}
        onOpenChange={(open) => {
          if (!open) toggleJourneyDialog("memories")
        }}
      />

      <OJTDialog
        open={openJourneyDialogs.has("ojt")}
        onOpenChange={(open) => {
          if (!open) toggleJourneyDialog("ojt")
        }}
      />

      {/* Interactive Onboarding Overlay */}
      {startInteractiveOnboarding && (
        <InteractiveOnboarding
          onClose={() => setStartInteractiveOnboarding(false)}
          onIconClick={handleIconClickInOnboarding}
          onStepComplete={handleStepComplete}
        />
      )}

      <TaskBar />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
          50% {
            transform: translateY(-5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .journey-grid {
          position: relative;
        }

        .journey-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.4rem;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.68);
          border: 1px solid rgba(94, 234, 212, 0.12);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          backdrop-filter: blur(18px);
        }

        .journey-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 32px 55px rgba(14, 116, 144, 0.35),
            0 0 40px rgba(94, 234, 212, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(94, 234, 212, 0.5);
        }

        .journey-card__accent {
          position: absolute;
          inset: -30%;
          z-index: 0;
          opacity: 0.9;
          filter: blur(60px);
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .journey-card:hover .journey-card__accent {
          opacity: 1;
        }

        .journey-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .journey-card__icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 8px 18px rgba(51, 65, 85, 0.45));
          transition: transform 0.3s ease;
        }

        .journey-card:hover .journey-card__icon {
          transform: scale(1.1);
        }

        .journey-card__badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          font-weight: 600;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .journey-card:hover .journey-card__badge {
          transform: scale(1.05);
          opacity: 1;
        }

        .journey-card__body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .journey-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .journey-card__subtitle {
          font-size: 0.82rem;
          color: rgba(226, 232, 240, 0.75);
          line-height: 1.4;
        }

        .journey-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          color: rgba(165, 243, 252, 0.9);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .journey-card__footer-icon {
          transition: transform 0.3s ease;
          font-size: 1rem;
        }

        .journey-card:hover .journey-card__footer-icon {
          transform: translateX(8px);
        }

        /* Locked icon pulse animation */
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 10px rgba(148, 163, 184, 0.2);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(148, 163, 184, 0.4);
          }
        }

        .locked-icon-pulse {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .journey-card {
            padding: 1.2rem;
          }

          .journey-card__title {
            font-size: 1rem;
          }

          .journey-card__subtitle {
            font-size: 0.78rem;
          }

          .journey-card__badge {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  )
}
