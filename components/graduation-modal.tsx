"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { WISH_WEBHOOK_URL } from "@/lib/wish-config"

interface GraduationModalProps {
  onClose: () => void
}

const MAP_URL = "https://maps.app.goo.gl/E2gdbHmuG1kkE2Wt7"
const MAP_QUICK_ROUTE_URL = "https://maps.app.goo.gl/E2gdbHmuG1kkE2Wt7"
const EVENT_DATE = new Date("2025-11-21T10:30:00+07:00")

type BootLineVariant = "prompt" | "boot" | "info" | "ok" | "default"

type BootLine = {
  text: string
  variant?: BootLineVariant
  showProgress?: boolean
}


export default function GraduationModal({ onClose }: GraduationModalProps) {
  const [showImageZoom, setShowImageZoom] = useState(false)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [envelopeDismissed, setEnvelopeDismissed] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [envelopeReady, setEnvelopeReady] = useState(false)
  const [bootLines, setBootLines] = useState<BootLine[]>([])
  const [bootTypingLine, setBootTypingLine] = useState<BootLine | null>(null)
  const [bootProgress, setBootProgress] = useState(0)
  const [progressActive, setProgressActive] = useState(false)
  const [bootOverlayState, setBootOverlayState] = useState<"visible" | "exiting" | "hidden">("visible")
  const hasBootFinishedRef = useRef(false)
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", minutes: "00" })
  const [isMapHovered, setIsMapHovered] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [formFeedback, setFormFeedback] = useState("")
  const [showWishModal, setShowWishModal] = useState(false)

  useEffect(() => {
    if (isEnvelopeOpen) {
      const timer = setTimeout(() => setEnvelopeDismissed(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isEnvelopeOpen])

  useEffect(() => {
    if (envelopeDismissed) {
      const timer = setTimeout(() => setContentVisible(true), 50)
      return () => clearTimeout(timer)
    }
  }, [envelopeDismissed])

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const diff = EVENT_DATE.getTime() - now

      if (diff <= 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00" })
        return
      }

      const totalMinutes = Math.floor(diff / (1000 * 60))
      const days = Math.floor(totalMinutes / (60 * 24))
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
      const minutes = totalMinutes % 60

      setCountdown({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let cancelled = false

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
      })

    const typeLine = async (text: string, options?: Partial<BootLine>) => {
      if (cancelled) return
      const baseOptions: BootLine = {
        variant: options?.variant ?? "default",
        showProgress: options?.showProgress ?? false,
        text: "",
      }

      setBootTypingLine({ ...baseOptions, text: "" })

      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return
        await sleep(18)
        if (cancelled) return
        setBootTypingLine((prev) =>
          prev
            ? { ...prev, text: text.slice(0, i) }
            : { ...baseOptions, text: text.slice(0, i) }
        )
      }

      if (cancelled) return
      setBootTypingLine(null)
      setBootLines((prev) => [...prev, { text, variant: baseOptions.variant, showProgress: baseOptions.showProgress }])
    }

    const animateProgress = async () => {
      if (cancelled) return
      setProgressActive(true)
      setBootProgress(0)

      for (let value = 0; value <= 100; value += 4) {
        if (cancelled) return
        setBootProgress(value)
        await sleep(value >= 80 ? 85 : 45)
      }

      if (cancelled) return
      setBootProgress(100)
      await sleep(220)

      if (!cancelled) {
        setProgressActive(false)
      }
    }

    const runBootSequence = async () => {
      await typeLine("cuongtt@fpt-university:~$ ./Graduation.exe", { variant: "prompt" })
      await sleep(280)
      await typeLine("[BOOT] Initializing Graduation.exe...", { variant: "boot" })
      await sleep(220)
      await typeLine("[BOOT] Loading celebration assets...", { variant: "boot", showProgress: true })
      await animateProgress()
      await sleep(160)
      await typeLine("[INFO] Decrypting invitation.dat...", { variant: "info" })
      await sleep(260)
      await typeLine("[OK] Execution complete. Launching invitation...", { variant: "ok" })
      await sleep(360)

      if (cancelled) return
      hasBootFinishedRef.current = true
      setBootOverlayState("exiting")
      await sleep(220)
      if (cancelled) return
      setEnvelopeReady(true)
      await sleep(420)
      if (cancelled) return
      setBootOverlayState("hidden")
    }

    runBootSequence()

    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (field: "name" | "email" | "message") => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formStatus === "error") {
      setFormStatus("idle")
      setFormFeedback("")
    }
  }

  const handleWishSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.message.trim()) {
      setFormStatus("error")
      setFormFeedback("Vui lòng viết lời nhắn trước khi gửi nhé!")
      return
    }

    setFormStatus("submitting")
    setFormFeedback("")

    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorMessage = await response.text().catch(() => "")
        throw new Error(errorMessage || "Request failed")
      }

      setFormStatus("success")
      setFormFeedback("Đã gửi lời chúc! Cảm ơn bạn rất nhiều ❤️")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => {
        setFormStatus("idle")
        setFormFeedback("")
      }, 2000)
      setTimeout(() => {
        setShowWishModal(false)
      }, 1800)
    } catch (error) {
      console.error(error)
      setFormStatus("error")
      setFormFeedback("Gửi không thành công, thử lại giúp mình nhé!")
    }
  }

  const isSubmitting = formStatus === "submitting"
  const handleOpenMap = () => {
    if (typeof window !== "undefined") {
      window.open(MAP_URL, "_blank", "noopener")
    }
  }

  useEffect(() => {
    if (!showWishModal) {
      setFormStatus("idle")
      setFormFeedback("")
    }
  }, [showWishModal])

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative max-w-[95vw] sm:max-w-2xl md:max-w-4xl w-full mx-4 rounded-[24px] sm:rounded-[32px] shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden md:scrollbar-hide border border-yellow-500/60 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-500/90 hover:bg-red-400 flex items-center justify-center text-white font-bold transition-colors text-sm sm:text-base"
        >
          ✕
        </button>

        <div className="relative">
          {bootOverlayState !== "hidden" && (
            <div className={`boot-overlay ${bootOverlayState === "exiting" ? "boot-overlay--exit" : ""}`}>
              <div className="boot-overlay__glow" />
              <div className="boot-console">
                <div className="boot-console__header">
                  <span className="boot-console__dot boot-console__dot--red" />
                  <span className="boot-console__dot boot-console__dot--yellow" />
                  <span className="boot-console__dot boot-console__dot--green" />
                  <span className="boot-console__title">Graduation.exe</span>
                </div>
                <div className="boot-console__body">
                  {bootLines.map((line, idx) => (
                    <div key={`boot-line-${idx}`} className={`boot-line boot-line--${line.variant ?? "default"}`}>
                      <span>{line.text}</span>
                      {line.showProgress && (
                        <div className="boot-progress">
                          <div
                            className={`boot-progress__bar ${
                              bootProgress >= 100 ? "boot-progress__bar--complete" : ""
                            } ${progressActive ? "boot-progress__bar--active" : ""}`}
                            style={{ width: `${Math.min(bootProgress, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {bootTypingLine && (
                    <div className={`boot-line boot-line--${bootTypingLine.variant ?? "default"} boot-line--typing`}>
                      <span>{bootTypingLine.text}</span>
                      <span className="boot-cursor">▌</span>
                    </div>
                  )}

                  {!bootTypingLine && hasBootFinishedRef.current && (
                    <div className="boot-line boot-line--prompt boot-line__cursor">
                      <span>cuongtt@fpt-university:~$</span>
                      <span className="boot-cursor">▌</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            className={`transition-all duration-500 ${
              envelopeReady ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {envelopeReady && !envelopeDismissed && (
              <div className={`envelope-overlay ${isEnvelopeOpen ? "envelope-overlay--fade" : ""}`}>
                <div
                  className={`envelope-wrapper ${isEnvelopeOpen ? "open" : ""}`}
                  onClick={() => setIsEnvelopeOpen(true)}
                >
                  <div className="envelope envelope--lux">
                    <div className="envelope__shadow" />
                    <div className="envelope__body">
                      <div className="envelope__fold envelope__fold--left" />
                      <div className="envelope__fold envelope__fold--right" />
                      <div className="envelope__fold envelope__fold--top" />
                      <div className="envelope__seal">
                        <span>🎓</span>
                      </div>
                      <div className="envelope__glow" />
                    </div>
                    <div className="envelope__letter">
                      <p className="envelope__title">Graduation Gala</p>
                      <span>Nhấn để mở thiệp</span>
                    </div>
                  </div>
                  <p className="envelope__hint">Chạm để mở thư mời</p>
                </div>
              </div>
            )}

            <div
              className={`invitation-content ${contentVisible ? "show" : ""} ${
                envelopeReady ? "" : "pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.12fr] min-h-96">
                {/* Left column - Information */}
                <div className="relative flex flex-col justify-center gap-4 sm:gap-6 p-5 sm:p-7 md:p-8 text-center md:text-left bg-linear-to-br from-yellow-500/12 via-transparent to-transparent">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-500/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-36 h-36 bg-cyan-400/10 blur-3xl" />
                  </div>

                  <div className={`space-y-2 invitation-animate ${contentVisible ? "show delay-100" : ""}`}>
                    <span className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.5em] text-yellow-300/80">
                      You are cordially invited
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                      Graduation Ceremony
                    </h1>
                    <div className="w-12 sm:w-16 h-[2px] sm:h-[3px] bg-linear-to-r from-yellow-400 to-transparent mx-auto md:mx-0" />
                    <div className="space-y-1 text-white">
                      <p className="text-sm sm:text-base md:text-lg font-semibold">Trần Tiến Cường</p>
                      <p className="text-[0.65rem] sm:text-xs md:text-sm text-gray-300">Information Technology · FPT University</p>
                    </div>
                    <p className="text-[0.65rem] sm:text-xs md:text-sm text-gray-300 italic max-w-xl mx-auto md:mx-0">
                      "Khi từng trang ký ức khép lại, một chương mới đang mở ra. Hẹn gặp bạn để cùng viết tiếp câu chuyện của chúng ta."
                    </p>
                  </div>

                  <div className={`space-y-2 text-left invitation-animate ${contentVisible ? "show delay-250" : ""}`}>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-gray-200">
                      <span className="text-yellow-300 text-base sm:text-lg md:text-xl">📅</span>
                      <span className="text-xs sm:text-sm md:text-base">21.11.2025</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-gray-200">
                      <span className="text-yellow-300 text-base sm:text-lg md:text-xl">🕘</span>
                      <span className="text-xs sm:text-sm md:text-base">10:30 AM</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-gray-200">
                      <span className="text-yellow-300 text-base sm:text-lg md:text-xl">📍</span>
                      <span className="text-xs sm:text-sm md:text-base">FPT University · Hồ Chí Minh City</span>
                    </div>
                  </div>

                  <div className={`countdown-card invitation-animate ${contentVisible ? "show delay-350" : ""}`}>
                    <div className="countdown-card__header">
                      <span>Countdown to Graduation</span>
                      <div className="countdown-card__pins">
                        <span />
                        <span />
                      </div>
                    </div>
                    <div className="countdown-card__body">
                      <div className="countdown-card__digits">
                        <span className="countdown-card__digit">{countdown.days}</span>
                        <span className="countdown-card__colon">:</span>
                        <span className="countdown-card__digit">{countdown.hours}</span>
                        <span className="countdown-card__colon">:</span>
                        <span className="countdown-card__digit">{countdown.minutes}</span>
                      </div>
                      <div className="countdown-card__labels">
                        <span>Days</span>
                        <span>Hours</span>
                        <span>Minutes</span>
                      </div>
                    </div>
                    <div className="countdown-card__footer">
                      Until 21.11.2025 · 10:30 AM
                    </div>
                  </div>

                  <div
                    className={`map-cta invitation-animate ${contentVisible ? "show delay-420" : ""}`}
                    onMouseEnter={() => setIsMapHovered(true)}
                    onMouseLeave={() => setIsMapHovered(false)}
                  >
                    <button
                      type="button"
                      onClick={handleOpenMap}
                      onFocus={() => setIsMapHovered(true)}
                      onBlur={() => setIsMapHovered(false)}
                      className="map-cta__button"
                    >
                      <span className="map-cta__icon">📍</span>
                      <span>View Map</span>
                      <span className="map-cta__arrow">→</span>
                    </button>

                    <div className={`map-popover ${isMapHovered ? "show" : ""}`}>
                      <div className="map-popover__map">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15674.422757891525!2d106.8098268!3d10.8414575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1763024464458!5m2!1svi!2s"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                          title="FPT University map preview"
                        />
                      </div>
                      <div className="map-popover__content">
                        <p className="map-popover__title">FPT University · Hồ Chí Minh City</p>
                        <p className="map-popover__address">7 D1, Long Thạnh Mỹ, Thủ Đức, TP.HCM</p>
                        <div className="map-popover__actions">
                          <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
                            Mở Google Maps
                          </a>
                          <a href={MAP_QUICK_ROUTE_URL} target="_blank" rel="noopener noreferrer">
                            Đường đi nhanh
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`wish-trigger-container invitation-animate ${contentVisible ? "show delay-520" : ""}`}
                  >
                    <button
                      type="button"
                      className="wish-trigger"
                      onClick={() => setShowWishModal(true)}
                    >
                      <span className="wish-trigger__icon">💌</span>
                      <div className="wish-trigger__text">
                        <span>Send a Wish</span>
                        <p>Gửi lời nhắn cho mình để cùng lưu giữ kỷ niệm nhé!</p>
                      </div>
                      <span className="wish-trigger__arrow">→</span>
                    </button>
                  </div>
                </div>

                {/* Right column - Image */}
                <div className={`relative overflow-hidden flex items-center justify-center invitation-animate ${contentVisible ? "show delay-250" : ""}`}>
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-400/20 via-transparent to-cyan-500/20" />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SE172522_2-qWSfuqHrtucH9SpCwGyEqUN7rXdLZ8.jpg"
                    alt="Trần Tiến Cường Graduation"
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setShowImageZoom(true)}
                  />
                  <div className="absolute inset-0 pointer-events-none border-l border-yellow-500/30" />
                  <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-black/40 text-yellow-200 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-md">
                    Class of 2025
                  </div>
                  <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-black/40 text-yellow-200 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-md animate-bounce-slow max-w-[calc(100%-1.5rem)] sm:max-w-none">
                    <span className="hidden sm:inline">RSVP: Let's Celebrate Together!</span>
                    <span className="sm:hidden">RSVP</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showImageZoom && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 backdrop-blur-sm p-4"
          onClick={() => setShowImageZoom(false)}
        >
          <div className="relative max-w-[95vw] sm:max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SE172522_2-qWSfuqHrtucH9SpCwGyEqUN7rXdLZ8.jpg"
              alt="Trần Tiến Cường Graduation"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {showWishModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowWishModal(false)}
        >
          <div
            className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWishModal(false)}
              className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>
            <div className="wish-card">
              <div className="wish-card__header">
                <h3>Send a Wish</h3>
                <p>Gửi lời nhắn cho mình để mình lưu giữ lại nhé!</p>
              </div>
              <form className="wish-card__form" onSubmit={handleWishSubmit}>
                <div className="wish-card__grid">
                  <input
                    type="text"
                    placeholder="Tên của bạn (không bắt buộc)"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    className="wish-card__input"
                  />
                  <input
                    type="email"
                    placeholder="Email (để mình liên lạc lại, tùy chọn)"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    className="wish-card__input"
                  />
                </div>
                <textarea
                  placeholder="Viết lời nhắn cho Cường..."
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  className="wish-card__textarea"
                  rows={5}
                  maxLength={600}
                />
                <button type="submit" className="wish-card__submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Send Note"}
                </button>
              </form>
              {formFeedback && (
                <div
                  className={`wish-card__feedback ${
                    formStatus === "error" ? "wish-card__feedback--error" : "wish-card__feedback--success"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {formFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .boot-overlay {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(2, 6, 23, 0.88);
          backdrop-filter: blur(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .boot-overlay--exit {
          opacity: 0;
          transform: scale(0.96);
        }

        .boot-overlay__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(250, 204, 21, 0.18), rgba(2, 6, 23, 0) 70%);
          filter: blur(30px);
          pointer-events: none;
        }

        .boot-console {
          position: relative;
          width: min(460px, 95vw);
          max-width: 460px;
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.96));
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          box-shadow: 0 32px 65px rgba(0, 0, 0, 0.55), 0 0 120px rgba(253, 224, 71, 0.18);
          overflow: hidden;
        }

        .boot-console__header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.75rem 1.1rem;
          background: rgba(15, 23, 42, 0.92);
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
          font-family: "Fira Code", "Source Code Pro", monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.7);
        }

        .boot-console__title {
          margin-left: auto;
        }

        .boot-console__dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }

        .boot-console__dot--red {
          background: #f87171;
        }

        .boot-console__dot--yellow {
          background: #facc15;
        }

        .boot-console__dot--green {
          background: #4ade80;
        }

        .boot-console__body {
          position: relative;
          padding: 1.6rem 1.4rem;
          background: radial-gradient(circle at 15% 20%, rgba(14, 165, 233, 0.18), transparent 60%);
          color: rgba(241, 245, 249, 0.92);
          font-family: "Fira Code", "Source Code Pro", monospace;
          font-size: 0.85rem;
          min-height: 220px;
        }

        .boot-line {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 0.7rem;
          line-height: 1.45;
          letter-spacing: 0.01em;
        }

        .boot-line:last-child {
          margin-bottom: 0;
        }

        .boot-line--prompt {
          color: #a5b4fc;
        }

        .boot-line--boot {
          color: #facc15;
        }

        .boot-line--info {
          color: #38bdf8;
        }

        .boot-line--ok {
          color: #4ade80;
        }

        .boot-line__cursor {
          flex-direction: row;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.6rem;
        }

        .boot-line--typing {
          flex-direction: row;
          align-items: center;
          gap: 0.4rem;
        }

        .boot-cursor {
          animation: bootCursorBlink 0.9s steps(1) infinite;
          color: #fef9c3;
        }

        .boot-progress {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.25);
          overflow: hidden;
        }

        .boot-progress__bar {
          height: 100%;
          background: linear-gradient(90deg, #22d3ee, #2563eb);
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
          transition: width 0.25s ease;
        }

        .boot-progress__bar--active {
          animation: bootProgressPulse 1.2s ease-in-out infinite alternate;
        }

        .boot-progress__bar--complete {
          background: linear-gradient(90deg, #4ade80, #22c55e);
          box-shadow: 0 0 22px rgba(74, 222, 128, 0.55);
        }

        @keyframes bootCursorBlink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes bootProgressPulse {
          0% {
            filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.45));
          }
          100% {
            filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.7));
          }
        }

        .countdown-card {
          position: relative;
          padding: 1.2rem 1rem 1rem;
          border-radius: 18px;
          background: linear-gradient(160deg, rgba(8, 47, 73, 0.85), rgba(8, 47, 73, 0.65));
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 20px 35px rgba(8, 47, 73, 0.35);
          overflow: hidden;
          color: #f8fafc;
        }

        @media (min-width: 640px) {
          .countdown-card {
            padding: 1.6rem 1.4rem 1.3rem;
            border-radius: 22px;
          }
        }

        .countdown-card::after {
          content: "";
          position: absolute;
          inset: -60% -40% auto;
          height: 160%;
          background: radial-gradient(circle at top left, rgba(248, 250, 252, 0.14), transparent 60%);
          opacity: 0.8;
          pointer-events: none;
        }

        .countdown-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 640px) {
          .countdown-card__header {
            font-size: 0.78rem;
            letter-spacing: 0.22em;
          }
        }

        .countdown-card__pins {
          display: flex;
          gap: 0.35rem;
        }

        .countdown-card__pins span {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(145deg, #facc15, #f97316);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35);
        }

        .countdown-card__body {
          margin-top: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          position: relative;
          z-index: 1;
        }

        .countdown-card__digits {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          font-weight: 700;
        }

        .countdown-card__digit {
          flex: 1;
          font-size: clamp(2rem, 3.4vw, 2.6rem);
          line-height: 1;
          background: rgba(15, 23, 42, 0.8);
          padding: 0.6rem 0.8rem;
          text-align: center;
          border-radius: 14px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: inset 0 0 18px rgba(148, 163, 184, 0.25);
        }

        .countdown-card__colon {
          font-size: clamp(1.8rem, 3vw, 2.3rem);
          font-weight: 700;
          color: rgba(248, 250, 252, 0.6);
        }

        .countdown-card__labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(241, 245, 249, 0.6);
        }

        @media (min-width: 640px) {
          .countdown-card__labels {
            font-size: 0.75rem;
            letter-spacing: 0.28em;
          }
        }

        .countdown-card__labels span {
          flex: 1;
          text-align: center;
        }

        .countdown-card__footer {
          margin-top: 1rem;
          font-size: 0.78rem;
          color: rgba(226, 232, 240, 0.75);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .map-cta {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .map-cta__button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #facc15, #f59e0b);
          color: #1f2937;
          font-weight: 600;
          padding: 0.75rem 1.2rem;
          border-radius: 999px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 18px 30px rgba(250, 204, 21, 0.35);
        }

        .map-cta__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 38px rgba(250, 204, 21, 0.45);
        }

        .map-cta__icon {
          font-size: 1.1rem;
        }

        .map-cta__arrow {
          font-size: 1.1rem;
          transition: transform 0.25s ease;
        }

        .map-cta__button:hover .map-cta__arrow {
          transform: translateX(4px);
        }

        .map-popover {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translate(-50%, -100%) scale(0.96);
          width: min(360px, 90vw);
          max-width: 360px;
          background: rgba(2, 6, 23, 0.96);
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          box-shadow: 0 24px 55px rgba(15, 23, 42, 0.7);
          padding: 0.75rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.24s ease, transform 0.24s ease;
          z-index: 15;
        }

        @media (min-width: 640px) {
          .map-popover {
            border-radius: 18px;
            padding: 0.9rem;
          }
        }

        .map-popover::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0 10px;
          border-style: solid;
          border-color: rgba(2, 6, 23, 0.96) transparent transparent transparent;
        }

        .map-popover.show {
          opacity: 1;
          transform: translate(-50%, -110%) scale(1);
          pointer-events: auto;
        }

        .map-popover__map {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.6);
        }

        .map-popover__map iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .map-popover__content {
          margin-top: 0.7rem;
          color: rgba(226, 232, 240, 0.9);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .map-popover__title {
          font-weight: 600;
        }

        .map-popover__address {
          font-size: 0.85rem;
          color: rgba(148, 163, 184, 0.85);
        }

        .map-popover__actions {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: 0.3rem;
        }

        .map-popover__actions a {
          flex: 1;
          font-size: 0.8rem;
          font-weight: 600;
          color: #facc15;
          background: rgba(251, 191, 36, 0.12);
          padding: 0.55rem 0.6rem;
          border-radius: 999px;
          text-align: center;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .map-popover__actions a:hover {
          background: rgba(251, 191, 36, 0.22);
          color: #fde68a;
        }

        .wish-trigger-container {
          width: 100%;
        }

        .wish-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.1rem;
          border-radius: 18px;
          background: rgba(2, 6, 23, 0.55);
          border: 1px solid rgba(148, 163, 184, 0.25);
          color: #f8fafc;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .wish-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(14, 165, 233, 0.24);
          border-color: rgba(14, 165, 233, 0.5);
        }

        .wish-trigger__icon {
          font-size: 1.3rem;
        }

        .wish-trigger__text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-align: left;
        }

        .wish-trigger__text span {
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        .wish-trigger__text p {
          font-size: 0.75rem;
          color: rgba(226, 232, 240, 0.7);
        }

        .wish-trigger__arrow {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        .wish-trigger:hover .wish-trigger__arrow {
          transform: translateX(4px);
        }

        .wish-card {
          background: rgba(2, 6, 23, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 22px;
          padding: 1.5rem;
          box-shadow: 0 20px 45px rgba(8, 47, 73, 0.35);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .wish-card__header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .wish-card__header p {
          font-size: 0.85rem;
          color: rgba(226, 232, 240, 0.7);
          margin-top: 0.3rem;
        }

        .wish-card__form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .wish-card__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.6rem;
        }

        @media (min-width: 640px) {
          .wish-card__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .wish-card__input,
        .wish-card__textarea {
          width: 100%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 14px;
          padding: 0.75rem 1rem;
          color: #e2e8f0;
          font-size: 0.9rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .wish-card__input::placeholder,
        .wish-card__textarea::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }

        .wish-card__input:focus,
        .wish-card__textarea:focus {
          outline: none;
          border-color: rgba(250, 204, 21, 0.65);
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.15);
        }

        .wish-card__textarea {
          resize: vertical;
        }

        .wish-card__submit {
          align-self: flex-end;
          background: linear-gradient(135deg, #22d3ee, #2563eb);
          border: none;
          border-radius: 999px;
          padding: 0.65rem 1.4rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .wish-card__submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(37, 99, 235, 0.4);
        }

        .wish-card__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wish-card__feedback {
          font-size: 0.85rem;
          border-radius: 12px;
          padding: 0.6rem 0.8rem;
        }

        .wish-card__feedback--success {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .wish-card__feedback--error {
          background: rgba(248, 113, 113, 0.12);
          color: #fda4af;
          border: 1px solid rgba(248, 113, 113, 0.35);
        }

        .envelope-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.66);
          backdrop-filter: blur(6px);
          transition: opacity 0.6s ease;
        }

        .envelope-overlay--fade {
          opacity: 0;
        }

        .envelope-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          animation: float 3s ease-in-out infinite;
        }

        .envelope {
          position: relative;
          width: min(240px, 60vw);
          height: min(170px, 42.5vw);
          max-width: 240px;
          max-height: 170px;
          perspective: 1100px;
          transform-style: preserve-3d;
        }

        .envelope--lux {
          filter: drop-shadow(0 24px 35px rgba(0, 0, 0, 0.4));
        }

        .envelope__body {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fef3c7, #f59e0b);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .envelope__glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle, rgba(255, 247, 210, 0.7) 0%, rgba(252, 211, 77, 0.05) 60%);
          mix-blend-mode: screen;
          opacity: 0.8;
          pointer-events: none;
        }

        .envelope__shadow {
          position: absolute;
          inset: 16px 12px -30px;
          background: radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.35), transparent 70%);
          transform: translateZ(-30px) scale(0.9);
          filter: blur(8px);
        }

        .envelope__fold {
          position: absolute;
          background: linear-gradient(135deg, rgba(255, 189, 8, 0.92), rgba(234, 179, 8, 0.82));
          transition: transform 0.7s ease;
          transform-style: preserve-3d;
        }

        .envelope__fold--left {
          inset: 20% 50% 8% 8%;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          filter: brightness(0.97);
        }

        .envelope__fold--right {
          inset: 20% 8% 8% 50%;
          clip-path: polygon(0 50%, 100% 0, 100% 100%);
          filter: brightness(1.05);
        }

        .envelope__fold--top {
          z-index: 5;
          inset: 0 10% 45%;
          background: linear-gradient(145deg, rgba(253, 224, 71, 1), rgba(234, 179, 8, 0.9));
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top;
          box-shadow: inset 0 -6px 12px rgba(181, 101, 29, 0.25);
        }

        .envelope__seal {
          position: absolute;
          z-index: 6;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fef9c3, #fbbf24);
          border: 1px solid rgba(209, 136, 49, 0.6);
          display: grid;
          place-items: center;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.35);
          transition: transform 0.7s ease;
        }

        .envelope__seal span {
          font-size: 1.5rem;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
        }

        .envelope__letter {
          position: absolute;
          z-index: 4;
          left: 26px;
          right: 26px;
          bottom: 24px;
          height: 118px;
          background: linear-gradient(135deg, #fff, #fef3c7);
          border-radius: 16px;
          padding: 3.4rem 1.2rem 1.4rem;
          text-align: center;
          color: #1f2937;
          font-weight: 600;
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.25);
          transform: translateY(46px);
          transition: transform 0.7s ease 0.2s;
          backface-visibility: hidden;
        }

        .envelope__title {
          font-size: 1.05rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #b45309;
        }

        .envelope__letter span {
          display: block;
          margin-top: 0.75rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(30, 41, 59, 0.65);
        }

        .envelope-wrapper:hover .envelope__fold--top:not(.open) {
          transform: rotateX(-18deg);
        }

        .envelope-wrapper.open .envelope__fold--top {
          transform: rotateX(-180deg);
        }

        .envelope-wrapper.open .envelope__seal {
          transform: translate(-50%, -50%) scale(0.9);
        }

        .envelope-wrapper.open .envelope__letter {
          transform: translateY(-62px);
        }

        .envelope__hint {
          font-size: 0.9rem;
          font-weight: 500;
          color: #fcd34d;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          letter-spacing: 0.08em;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .invitation-content {
          opacity: 0;
          transform: translateY(20px) scale(0.97);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .invitation-content.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .invitation-animate {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .invitation-animate.show {
          opacity: 1;
          transform: translateY(0);
        }

        .invitation-animate.delay-100 {
          transition-delay: 0.1s;
        }

        .invitation-animate.delay-250 {
          transition-delay: 0.25s;
        }

        .invitation-animate.delay-350 {
          transition-delay: 0.35s;
        }

        .invitation-animate.delay-450 {
          transition-delay: 0.45s;
        }

        .invitation-animate.delay-420 {
          transition-delay: 0.42s;
        }

        .invitation-animate.delay-520 {
          transition-delay: 0.52s;
        }

        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  )
}
