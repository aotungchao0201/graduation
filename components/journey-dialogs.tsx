"use client"

import { useState, useEffect, useRef } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type CapstoneChapterMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "gradient"; gradient: string; alt: string }

type CapstoneChapter = {
  id: string
  sequence: string
  icon: string
  title: string
  tagline: string
  description: string
  focus: string
  tags: string[]
  cta: { label: string; href: string }
  media: CapstoneChapterMedia
  gallery?: Array<{ src: string; alt: string }>
  badge?: string
  highlight?: string
}

const CAPSTONE_CHAPTERS: CapstoneChapter[] = [
  {
    id: "research-doc",
    sequence: "01",
    icon: "📄",
    title: "Khởi động dự án",
    tagline: "Research kick-off",
    description:
      "Bọn mình đào sâu mô hình mạng và bóc tách từng điểm yếu của IDS truyền thống. Document này ghi lại toàn bộ phát hiện ban đầu và lý do tụi mình chọn n8n để tự động hóa báo cáo.",
    focus: "Mô hình mạng · IDS truyền thống",
    tags: ["Research", "Network model", "n8n"],
    cta: {
      label: "Mở tài liệu",
      href: "https://drive.google.com/file/d/1stkIqPNFn9g5m5xDxmaSWCbTjOCuAHQW/view?usp=sharing",
    },
    media: {
      type: "gradient",
      gradient: "linear-gradient(135deg, rgba(8, 47, 73, 0.9), rgba(30, 64, 175, 0.85))",
      alt: "Ghi chú nghiên cứu IDS truyền thống",
    },
    highlight: "Đặt nền tảng so sánh IDS truyền thống và định hướng tự động hóa bằng n8n.",
  },
  {
    id: "slides",
    sequence: "02",
    icon: "📊",
    title: "Đêm trắng với slide",
    tagline: "Data storytelling",
    description:
      "Tụi mình kể câu chuyện dữ liệu với biểu đồ và insight rõ ràng – có đêm chỉnh slide tới 2-3h sáng. Bộ slide này tổng hợp mọi con số và kết luận chính.",
    focus: "Trình bày số liệu · UX của slide",
    tags: ["Visualization", "Benchmark", "Pitch"],
    cta: {
      label: "Xem slide",
      href: "https://drive.google.com/file/d/1XsFTcRfCgowANrZDBLa4T8WRqArVt6v5/view?usp=sharing",
    },
    media: {
      type: "gradient",
      gradient: "linear-gradient(135deg, rgba(76, 29, 149, 0.9), rgba(6, 182, 212, 0.85))",
      alt: "Slide biểu đồ và insight capstone",
    },
    badge: "Late-night grind",
    highlight: "Biến dữ liệu thành câu chuyện thuyết phục hội đồng chấm.",
  },
  {
    id: "lab-setup",
    sequence: "03",
    icon: "⚙️",
    title: "Dựng phòng lab",
    tagline: "Hands-on building",
    description:
      "Sau khi thống nhất hướng đi, tụi mình dựng lab IDS: cài n8n, cấu hình rule và mô phỏng traffic. Đây là lúc đang kết nối thiết bị và kiểm log realtime.",
    focus: "Triển khai lab · IDS automation",
    tags: ["Lab setup", "Infrastructure", "n8n"],
    cta: {
      label: "Xem hình",
      href: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855284/581aa8fea2dd2e8377cc_sqp8pe.jpg",
    },
    media: {
      type: "image",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855284/581aa8fea2dd2e8377cc_sqp8pe.jpg",
      alt: "Đội dự án đang setup hệ thống IDS trong phòng lab",
    },
    gallery: [
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855284/581aa8fea2dd2e8377cc_sqp8pe.jpg",
        alt: "Setup lab IDS với thiết bị mạng",
      },
    ],
  },
  {
    id: "workflow",
    sequence: "04",
    icon: "🧪",
    title: "Rehearsal & Workflow",
    tagline: "Fine tuning",
    description:
      "Trước ngày bảo vệ, tụi mình rehearsal liên tục và chạy lại workflow n8n để chắc chắn mọi cảnh báo đều đẩy về báo cáo đúng. Đây là những lần tổng duyệt cuối cùng.",
    focus: "Tối ưu workflow · Demo rehearsal",
    tags: ["Automation", "Monitoring", "Teamwork"],
    cta: {
      label: "Xem hình",
      href: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/24cc080a02298e77d738_b3kyxj.jpg",
    },
    media: {
      type: "image",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/24cc080a02298e77d738_b3kyxj.jpg",
      alt: "Test workflow n8n trong phòng lab",
    },
    gallery: [
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/24cc080a02298e77d738_b3kyxj.jpg",
        alt: "Test workflow n8n với dashboard",
      },
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/b2ca502c5a0fd6518f1e_iletao.jpg",
        alt: "Chuẩn bị rehearsal trình bày capstone",
      },
    ],
  },
  {
    id: "defense",
    sequence: "05",
    icon: "🏆",
    title: "Ngày bảo vệ",
    tagline: "Mission complete",
    description:
      "Khoảnh khắc đứng trước hội đồng, mọi công sức đều xứng đáng. Không chụp đủ cả team nhưng ai cũng tự hào vì đã hoàn thành mục tiêu capstone.",
    focus: "Demo chính thức · Tổng kết dự án",
    tags: ["Presentation", "Achievement", "Team spirit"],
    cta: {
      label: "Xem hình",
      href: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855285/da32de17d2345e6a0725_kvih9o.jpg",
    },
    media: {
      type: "image",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855285/da32de17d2345e6a0725_kvih9o.jpg",
      alt: "Ảnh sau buổi bảo vệ capstone",
    },
    gallery: [
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855285/da32de17d2345e6a0725_kvih9o.jpg",
        alt: "Ăn mừng sau buổi bảo vệ capstone",
      },
    ],
    badge: "Mission Complete",
    highlight: "Capstone chính thức hoàn thành – báo cáo & demo đạt kết quả tốt.",
  },
]

type Achievement = {
  id: string
  icon: string
  title: string
  tagline: string
  description: string
  year: string
  type: "academic" | "ceremony" | "competition" | "team" | "award"
  image: string
  badge: string
  highlight: string
  points?: number
  prize?: string
  funNote?: string
  teammates?: boolean
  story?: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "excellence-certificates",
    icon: "🏆",
    title: "Sinh viên Giỏi",
    tagline: "Academic Excellence",
    description: "Tổng hợp các giấy khen sinh viên giỏi qua các năm học, công nhận thành tích học tập tốt.",
    year: "2022-2024",
    type: "academic",
    image: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855285/69bd57e6c2c54e9b17d4_s9xjll.jpg",
    badge: "Multiple Awards",
    highlight: "Được công nhận thành tích học tập tốt nhiều kỳ liên tiếp",
    story: "Ban đầu chỉ định học cho vui, ai ngờ vui quá trường cấp cho mấy cái giấy chứng nhận 'vui vẻ' luôn 🤣",
  },
  {
    id: "ctf-competition",
    icon: "🛡️",
    title: "CTF Competition",
    tagline: "400 Points Victory",
    description: "Tham gia cuộc thi CTF trong trường và đạt được 400 điểm - một thành tích đáng tự hào thể hiện kỹ năng bảo mật thực tế!",
    year: "2024",
    type: "competition",
    image: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/8731b2fbb8d834866dc9_ihgh28.jpg",
    badge: "400 Points",
    highlight: "Đi thi cho vuivui",
    points: 400,
    story: "Lần đầu thử sức, dù chỉ dừng ở top 30 nhưng mình rất vui vì đã hoàn thành được 400 điểm. Một trải nghiệm mệt nhưng mà rất 'đã' và học được nhiều điều! 🎊",
  },
  {
    id: "club-competition",
    icon: "👥",
    title: "Cuộc thi CLB",
    tagline: "Team Spirit",
    description: "Tham gia cuộc thi cùng các anh em , cùng nhau nỗ lực và học hỏi từ những trải nghiệm thực tế.",
    year: "2024",
    type: "team",
    image: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763100388/487416109_1093856206093110_4394394479757083836_n_tbwjc3.jpg",
    badge: "Team Event",
    highlight: "Kỷ niệm đẹp với đội nhóm trong cuộc thi của CLB",
    teammates: true,
    story: "Cuộc thi CLB mà cứ ngỡ là 'Cuộc Đua Kỳ Thú' phiên bản FPT! 😅 Cả team chạy sấp mặt vòng quanh trường, 'check-in' từng trạm. Đứa thì căng não giải mã, đứa 'liên lạc' thì cặm cụi ghép kết quả, đứa 'biết tuốt' thì search Google không ngừng nghỉ. Tụi mình đúng kiểu 'ba đầu sáu tay', đứa nào việc nấy, phối hợp 'căng đét'. Nhớ nhất là lúc tìm ra đáp án cuối cùng, cả đám la lên như 'trúng số'. Kỷ niệm này đúng là không bao giờ quên, mệt mà vui 'hết nấc'! 🥳",
  },
  {
    id: "second-place",
    icon: "🥈",
    title: "Giải Nhì",
    tagline: "Second Place Winner",
    description: "Đạt giải Nhì trong cuộc thi và nhận giải thưởng 1 triệu đồng. (Lưu ý: BTC in sai tên trên giấy khen nhưng vẫn tự hào về thành tích này! 😅)",
    year: "2024",
    type: "award",
    image: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763100387/487312504_1093855962759801_1804202960042720567_n_fug2ws.jpg",
    badge: "🥈 2nd Place",
    highlight: "Giành giải Nhì và nhận giải thưởng 1,000,000 VNĐ",
    prize: "1,000,000 VNĐ",
    funNote: "BTC in sai tên nhưng vẫn tự hào về thành tích này! 😊",
    story: "Giải Nhì + 1 củ tiền thưởng = combo hoàn hảo! 🎉 Nhưng mà có một chuyện buồn cười là... Trần Tiến là ai ?",
  },
]

type ViewMode = "showcase" | "story"

// Skills Dialog
export function SkillsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/90 border border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle>Technical Skills</DialogTitle>
          <DialogDescription className="text-gray-300">
            Các chứng chỉ và kỹ năng công nghệ tôi đã đạt được.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-32 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 flex items-center justify-center"
            >
              <img
                src={`/certificate-.jpg?height=128&width=100%&query=Certificate+${i}`}
                alt={`Certificate ${i}`}
                className="rounded-lg object-cover h-full w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <p className="text-white font-semibold">Certificate {i}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// OJT Chapters Data
type OJTChapter = {
  id: string
  sequence: string
  icon: string
  title: string
  tagline: string
  description: string
  focus: string
  tags: string[]
  media: {
    type: "video" | "image" | "certificate"
    src?: string
    videoId?: string
    alt: string
  }
  gallery?: Array<{ src: string; alt: string }>
  badge?: string
  highlight?: string
  note?: string
}

const OJT_CHAPTERS: OJTChapter[] = [
  {
    id: "project-overview",
    sequence: "01",
    icon: "🎯",
    title: "Project Overview",
    tagline: "Phishing Demo Project",
    description:
      "Dự án demo cuối kỳ OJT: Xây dựng một trang web login giả mạo Microsoft và sử dụng kỹ thuật phishing để chiếm cookie, từ đó có thể truy cập vào tài khoản của người dùng mà họ không hề hay biết. Đây là một dự án thực tế về bảo mật web và nhận thức an ninh mạng.",
    focus: "Phishing Attack · Cookie Hijacking · Security Demo",
    tags: ["Security", "Phishing", "Demo", "Web Security"],
    media: {
      type: "video",
      videoId: "mNNLxn2dke4",
      alt: "OJT Demo Video - Phishing Attack",
    },
    badge: "Final Demo",
    highlight: "Demo thực tế về kỹ thuật phishing và cookie hijacking - một bài học quan trọng về bảo mật web.",
  },
  {
    id: "technical-slides",
    sequence: "02",
    icon: "📊",
    title: "Technical Slides",
    tagline: "Presentation Materials",
    description:
      "Các slide trình bày kỹ thuật chi tiết về cách thức hoạt động của phishing attack, phương pháp chiếm cookie, và các biện pháp phòng chống. Tài liệu này được sử dụng để trình bày cho team và mentor tại HPT.",
    focus: "Technical Documentation · Security Analysis",
    tags: ["Presentation", "Technical", "Documentation"],
    media: {
      type: "image",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763106816/60a658f5-68e4-4607-8544-94cb2f05e5b6.png",
      alt: "OJT Technical Slides - Page 1",
    },
    gallery: [
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763106816/60a658f5-68e4-4607-8544-94cb2f05e5b6.png",
        alt: "OJT Technical Slides - Page 1",
      },
      {
        src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763106794/bbdded84-194d-49e1-81c2-4fa061f3b9d6.png",
        alt: "OJT Technical Slides - Page 2",
      },
    ],
  },
  {
    id: "school-certificate",
    sequence: "03",
    icon: "🏫",
    title: "School Certificate",
    tagline: "University Recognition",
    description:
      "Giấy chứng nhận OJT chính thức từ trường Đại học FPT, công nhận việc hoàn thành 30 giờ thực tập tại HPT. Đây là một phần quan trọng trong chương trình đào tạo, giúp sinh viên có cơ hội áp dụng kiến thức vào thực tế.",
    focus: "Academic Recognition · 30 Hours OJT",
    tags: ["Certificate", "Academic", "Recognition"],
    media: {
      type: "certificate",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763107073/ae19864e-b33f-4039-b6c9-1759a0409894.png",
      alt: "FPT University OJT Certificate",
    },
    badge: "Official Certificate",
  },
  {
    id: "hpt-certificate",
    sequence: "04",
    icon: "🏢",
    title: "HPT Certificate",
    tagline: "Company Recognition",
    description:
      "Chứng nhận từ công ty HPT công nhận thành tích và đóng góp trong quá trình thực tập. Đây là minh chứng cho sự nỗ lực và học hỏi trong 30 giờ làm việc tại một môi trường chuyên nghiệp.",
    focus: "Company Recognition · Professional Experience",
    tags: ["Certificate", "Company", "Recognition"],
    media: {
      type: "certificate",
      src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855283/70be72067825f47bad34_xz5oeb.jpg",
      alt: "HPT Company Certificate",
    },
    badge: "Company Recognition",
    highlight: "Cảm ơn HPT đã cho tôi cơ hội học hỏi. Hẹn gặp lại trong tương lai! 💚",
    note: "Cảm ơn HPT đã cho tôi cơ hội học hỏi. Hẹn gặp lại trong tương lai! 💚",
  },
]

// OJT Dialog với Story-driven Layout
export function OJTDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const activeChapter = OJT_CHAPTERS[activeChapterIndex]
  const progressPercent = Math.round(((activeChapterIndex + 1) / OJT_CHAPTERS.length) * 100)

  // Extract YouTube video ID and create embed URL
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-950/95 border border-emerald-500/30 text-white max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 max-h-[90vh] overflow-y-auto md:scrollbar-hide">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🎓
              </span>
              OJT Journey
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-300">
              Internship experience tại HPT - 30 giờ thực tập với vai trò Security Engineer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 min-h-[440px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-4 md:w-auto">
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70 w-full sm:w-48">
                  <div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                  {String(activeChapterIndex + 1).padStart(2, "0")} / {String(OJT_CHAPTERS.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Chapter Cards Selector */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-4">
              {OJT_CHAPTERS.map((chapter, idx) => {
                const isActive = idx === activeChapterIndex
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    className={`group flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border px-3 py-3 sm:px-4 sm:py-4 text-left transition-all ${
                      isActive
                        ? "border-emerald-400/70 bg-emerald-500/15 shadow-lg shadow-emerald-500/10"
                        : "border-slate-700/60 bg-slate-900/60 hover:border-emerald-400/50 hover:bg-slate-900/80"
                    }`}
                    onClick={() => setActiveChapterIndex(idx)}
                    onMouseEnter={() => setActiveChapterIndex(idx)}
                    onFocus={() => setActiveChapterIndex(idx)}
                    aria-current={isActive}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div
                          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl text-xl sm:text-2xl shrink-0 ${
                            isActive ? "bg-emerald-500/25" : "bg-slate-800/80 group-hover:bg-emerald-500/10"
                          }`}
                          aria-hidden="true"
                        >
                          {chapter.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                            {chapter.sequence}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{chapter.title}</p>
                        </div>
                      </div>
                      <span className="text-base sm:text-lg text-emerald-200/70 shrink-0 hidden sm:inline" aria-hidden="true">
                        →
                      </span>
                    </div>
                    <p className="text-[0.65rem] sm:text-xs text-emerald-200/70 line-clamp-1">{chapter.tagline}</p>
                  </button>
                )
              })}
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="order-2 lg:w-[45%] space-y-6 lg:order-1">
                <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-emerald-200/80">
                  <span className="rounded-full border border-emerald-500/30 px-3 py-1">Focus</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-100">{activeChapter.focus}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">{activeChapter.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{activeChapter.description}</p>
                  {activeChapter.highlight && (
                    <p className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 sm:p-3 text-[0.65rem] sm:text-xs leading-relaxed text-emerald-100">
                      {activeChapter.highlight}
                    </p>
                  )}
                  {activeChapter.note && (
                    <div className="rounded-xl sm:rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm leading-relaxed text-emerald-100 font-medium italic">
                        {activeChapter.note}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeChapter.tags.map((tag) => (
                    <span
                      key={`${activeChapter.id}-${tag}`}
                      className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-100/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:flex-1 space-y-4 lg:order-2">
                {/* Video Embed */}
                {activeChapter.media.type === "video" && activeChapter.media.videoId && (
                  <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[32px] border border-emerald-500/20 bg-slate-900/80 shadow-xl shadow-emerald-500/10">
                    <iframe
                      src={getYouTubeEmbedUrl(activeChapter.media.videoId)}
                      title={activeChapter.media.alt}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                    {activeChapter.badge && (
                      <span className="absolute left-3 top-3 sm:left-5 sm:top-5 rounded-full bg-slate-950/75 px-2 sm:px-4 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                        {activeChapter.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Image/Certificate Display */}
                {(activeChapter.media.type === "image" || activeChapter.media.type === "certificate") &&
                  activeChapter.media.src && (
                    <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[32px] border border-emerald-500/20 bg-slate-900/80 shadow-xl shadow-emerald-500/10">
                      <img
                        src={activeChapter.media.src}
                        alt={activeChapter.media.alt}
                        className="h-full w-full object-contain transition-transform duration-500 hover:scale-105 cursor-pointer bg-slate-800/50"
                        onClick={() => setSelectedImage(activeChapter.media.src!)}
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-slate-950/55 via-transparent to-transparent pointer-events-none" />
                      {activeChapter.badge && (
                        <span className="absolute left-3 top-3 sm:left-5 sm:top-5 rounded-full bg-slate-950/75 px-2 sm:px-4 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                          {activeChapter.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 left-3 sm:bottom-4 sm:left-5 rounded-full bg-slate-950/70 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-emerald-200/80">
                        {activeChapter.tagline}
                      </span>
                    </div>
                  )}

                {/* Gallery for Slides */}
                {activeChapter.gallery && activeChapter.gallery.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.24em] text-emerald-200/80">Slides Gallery</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {activeChapter.gallery.map((item, galleryIdx) => (
                        <a
                          key={`${activeChapter.id}-gallery-${galleryIdx}`}
                          href={item.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-emerald-500/20 aspect-square sm:aspect-video"
                        >
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="h-full w-full object-cover brightness-90 transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-2 py-1 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.18em] text-emerald-200/90">
                            View
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-black/95 border border-emerald-500/30 p-0 max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:scrollbar-hide">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Lab Dialog
export function LabDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const activeChapter = CAPSTONE_CHAPTERS[activeChapterIndex]
  const progressPercent = Math.round(((activeChapterIndex + 1) / CAPSTONE_CHAPTERS.length) * 100)

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950/95 border border-cyan-500/30 text-white max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 max-h-[90vh] overflow-y-auto md:scrollbar-hide">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">
              🧪
            </span>
            Capstone Journey
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-300">
            Chạm vào từng chương để xem tài liệu, ảnh và câu chuyện tụi mình hoàn thiện đồ án IDS.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 min-h-[440px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-4 md:w-auto">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70 w-full sm:w-48">
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-cyan-400 via-cyan-300 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                {String(activeChapterIndex + 1).padStart(2, "0")} / {String(CAPSTONE_CHAPTERS.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {CAPSTONE_CHAPTERS.map((chapter, idx) => {
              const isActive = idx === activeChapterIndex
              return (
                <button
                  key={chapter.id}
                  type="button"
                  className={`group flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border px-3 py-3 sm:px-4 sm:py-4 text-left transition-all ${
                    isActive
                      ? "border-cyan-400/70 bg-cyan-500/15 shadow-lg shadow-cyan-500/10"
                      : "border-slate-700/60 bg-slate-900/60 hover:border-cyan-400/50 hover:bg-slate-900/80"
                  }`}
                  onClick={() => setActiveChapterIndex(idx)}
                  onMouseEnter={() => setActiveChapterIndex(idx)}
                  onFocus={() => setActiveChapterIndex(idx)}
                  aria-current={isActive}
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl text-xl sm:text-2xl shrink-0 ${
                          isActive ? "bg-cyan-500/25" : "bg-slate-800/80 group-hover:bg-cyan-500/10"
                        }`}
                        aria-hidden="true"
                      >
                        {chapter.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                          {chapter.sequence}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{chapter.title}</p>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg text-cyan-200/70 shrink-0 hidden sm:inline" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <p className="text-[0.65rem] sm:text-xs text-cyan-200/70 line-clamp-1">{chapter.tagline}</p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="order-2 lg:w-[45%] space-y-6 lg:order-1">
              <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">
                <span className="rounded-full border border-cyan-500/30 px-3 py-1">Focus</span>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-100">{activeChapter.focus}</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">{activeChapter.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{activeChapter.description}</p>
                {activeChapter.highlight && (
                  <p className="rounded-xl sm:rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 sm:p-3 text-[0.65rem] sm:text-xs leading-relaxed text-cyan-100">
                    {activeChapter.highlight}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {activeChapter.tags.map((tag) => (
                  <span
                    key={`${activeChapter.id}-${tag}`}
                    className="rounded-full border border-cyan-500/30 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs text-cyan-100/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={activeChapter.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-400 to-emerald-400 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 transition-transform hover:translate-x-1"
                >
                  <span>{activeChapter.cta.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <span className="text-[0.65rem] sm:text-xs text-gray-400">Mở trong tab mới để xem tài liệu hoặc ảnh full-size.</span>
              </div>
            </div>

            <div className="order-1 lg:flex-1 space-y-4 lg:order-2">
              <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[32px] border border-cyan-500/20 bg-slate-900/80 shadow-xl shadow-cyan-500/10">
                {activeChapter.media.type === "image" ? (
                  <img
                    src={activeChapter.media.src}
                    alt={activeChapter.media.alt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl md:text-5xl"
                    style={{ background: activeChapter.media.gradient }}
                    aria-hidden="true"
                  >
                    {activeChapter.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-tr from-slate-950/55 via-transparent to-transparent" />
                {activeChapter.badge && (
                  <span className="absolute left-3 top-3 sm:left-5 sm:top-5 rounded-full bg-slate-950/75 px-2 sm:px-4 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    {activeChapter.badge}
                  </span>
                )}
                <span className="absolute bottom-2 left-3 sm:bottom-4 sm:left-5 rounded-full bg-slate-950/70 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-cyan-200/80">
                  {activeChapter.tagline}
                </span>
              </div>

              {activeChapter.gallery && activeChapter.gallery.length > 1 && (
                <div className="space-y-2">
                  <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">Khoảnh khắc hậu trường</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {activeChapter.gallery.map((item, galleryIdx) => (
                      <a
                        key={`${activeChapter.id}-gallery-${galleryIdx}`}
                        href={item.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-cyan-500/20 aspect-square"
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="h-full w-full object-cover brightness-90 transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-2 py-1 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.18em] text-cyan-200/90">
                          View
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Achievements Dialog với 2 view modes
export function AchievementsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>("story")
  const [activeAchievementIndex, setActiveAchievementIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const activeAchievement = ACHIEVEMENTS[activeAchievementIndex]
  const progressPercent = Math.round(((activeAchievementIndex + 1) / ACHIEVEMENTS.length) * 100)

  // Auto-play slideshow cho Showcase view - luôn chạy khi ở showcase mode
  useEffect(() => {
    if (viewMode === "showcase") {
      intervalRef.current = setInterval(() => {
        setActiveAchievementIndex((prev) => {
          const next = (prev + 1) % ACHIEVEMENTS.length
          return next
        })
      }, 4000) // Chuyển ảnh mỗi 4 giây

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [viewMode])

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getTypeColor = (type: Achievement["type"]) => {
    switch (type) {
      case "academic":
        return "from-yellow-400/30 to-amber-500/30 border-yellow-400/40 text-yellow-200"
      case "ceremony":
        return "from-purple-400/30 to-pink-500/30 border-purple-400/40 text-purple-200"
      case "competition":
        return "from-cyan-400/30 to-blue-500/30 border-cyan-400/40 text-cyan-200"
      case "team":
        return "from-emerald-400/30 to-teal-500/30 border-emerald-400/40 text-emerald-200"
      case "award":
        return "from-orange-400/30 to-red-500/30 border-orange-400/40 text-orange-200"
      default:
        return "from-gray-400/30 to-gray-500/30 border-gray-400/40 text-gray-200"
    }
  }

  const getTypeIcon = (type: Achievement["type"]) => {
    switch (type) {
      case "academic":
        return "📚"
      case "ceremony":
        return "🎉"
      case "competition":
        return "⚔️"
      case "team":
        return "🤝"
      case "award":
        return "🏅"
      default:
        return "⭐"
    }
  }

  // Trophy Showcase View - Auto-play Slideshow với slide effect
  const ShowcaseView = () => {
    const handleNext = () => {
      setActiveAchievementIndex((prev) => {
        const next = (prev + 1) % ACHIEVEMENTS.length
        return next
      })
    }

    const handlePrev = () => {
      setActiveAchievementIndex((prev) => {
        const prevIndex = prev === 0 ? ACHIEVEMENTS.length - 1 : prev - 1
        return prevIndex
      })
    }

    return (
      <div className="space-y-6">
        {/* Auto-play Slideshow với slide effect */}
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/80 shadow-xl group">
          {/* Slide container - tất cả images */}
          <div 
            className="flex h-full w-full transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${activeAchievementIndex * (100 / ACHIEVEMENTS.length)}%)`,
              width: `${ACHIEVEMENTS.length * 100}%`,
            }}
          >
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                className="relative h-full shrink-0"
                style={{ width: `${100 / ACHIEVEMENTS.length}%`, minWidth: `${100 / ACHIEVEMENTS.length}%` }}
              >
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="h-full w-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(achievement.image)}
                  onError={(e) => {
                    console.error('Image failed to load:', achievement.image)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Gradient overlay - giảm opacity để hình rõ hơn */}
          <div className="absolute inset-0 bg-linear-to-tr from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          
          {/* Content overlay - chỉ hiển thị cho active achievement */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-black/95 via-black/80 to-transparent pointer-events-none">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl shrink-0">{activeAchievement.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">{activeAchievement.title}</h3>
                    <p className="text-xs sm:text-sm text-cyan-200/80 line-clamp-1">{activeAchievement.tagline}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{activeAchievement.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-semibold">
                  {activeAchievement.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Badge ở góc trên */}
          {activeAchievement.badge && (
            <span className="absolute top-3 left-3 sm:top-5 sm:left-5 rounded-full bg-slate-950/75 px-2 sm:px-4 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-sm pointer-events-none">
              {activeAchievement.badge}
            </span>
          )}

          {/* Progress indicator ở góc trên phải */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 pointer-events-none">
            <span className="text-[0.65rem] sm:text-xs font-semibold text-white/80">
              {activeAchievementIndex + 1} / {ACHIEVEMENTS.length}
            </span>
          </div>

          {/* Controls - chỉ Previous và Next, bỏ Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {/* Previous button */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white transition-all hover:scale-110 pointer-events-auto"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              className="p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white transition-all hover:scale-110 pointer-events-auto"
              aria-label="Next"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress bar ở dưới cùng */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 pointer-events-none">
            <div
              className="h-full bg-linear-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{
                width: `${((activeAchievementIndex + 1) / ACHIEVEMENTS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Dots indicator - giữ lại */}
        <div className="flex items-center justify-center gap-2">
          {ACHIEVEMENTS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveAchievementIndex(idx)
              }}
              className={`h-2 rounded-full transition-all ${
                idx === activeAchievementIndex
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Story-driven View (similar to LabDialog)
  const StoryView = () => (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70 w-full sm:w-48">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-cyan-400 via-cyan-300 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-200/80">
          {String(activeAchievementIndex + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Achievement cards selector */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {ACHIEVEMENTS.map((achievement, idx) => {
          const isActive = idx === activeAchievementIndex
          const isLast = idx === ACHIEVEMENTS.length - 1
          return (
            <div key={achievement.id} className="flex items-center gap-2 md:gap-4 flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-0 shrink-0 md:shrink">
              <button
                type="button"
                className={`group flex flex-col gap-2 rounded-2xl border px-3 sm:px-4 py-3 sm:py-4 text-left transition-all w-full ${
                  isActive
                    ? `border-cyan-400/70 bg-linear-to-br ${getTypeColor(achievement.type)} shadow-lg shadow-cyan-500/10`
                    : "border-slate-700/60 bg-slate-900/60 hover:border-cyan-400/50 hover:bg-slate-900/80"
                }`}
                onClick={() => setActiveAchievementIndex(idx)}
                onMouseEnter={() => setActiveAchievementIndex(idx)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl text-xl sm:text-2xl shrink-0 ${
                        isActive ? "bg-cyan-500/25" : "bg-slate-800/80 group-hover:bg-cyan-500/10"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-200/80">
                        {achievement.year}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{achievement.title}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[0.65rem] sm:text-xs text-cyan-200/70 line-clamp-1">{achievement.tagline}</p>
              </button>
              {!isLast && (
                <span className="text-cyan-200/50 text-lg sm:text-xl shrink-0 hidden sm:inline" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="order-2 lg:w-[45%] space-y-6 lg:order-1">
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-wider text-cyan-200/80">
            <span className="rounded-full border border-cyan-500/30 px-3 py-1">Type</span>
            <span className={`rounded-full bg-linear-to-r ${getTypeColor(activeAchievement.type)} px-3 py-1 text-cyan-100`}>
              {getTypeIcon(activeAchievement.type)} {activeAchievement.type}
            </span>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">{activeAchievement.title}</h3>
            
            {/* Story tự sự - hiển thị thay vì description nghiêm túc */}
            {activeAchievement.story ? (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm leading-relaxed text-gray-200 italic">
                  "{activeAchievement.story}"
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{activeAchievement.description}</p>
            )}

            {/* Fun note nếu có */}
            {activeAchievement.funNote && (
              <div className="rounded-xl sm:rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3 sm:p-4">
                <p className="text-xs sm:text-sm leading-relaxed text-orange-100">💡 {activeAchievement.funNote}</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-100/90">
              {activeAchievement.year}
            </span>
            <span className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-100/90">
              {activeAchievement.badge}
            </span>
            {activeAchievement.points && (
              <span className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-100/90">
                {activeAchievement.points} Points
              </span>
            )}
            {activeAchievement.prize && (
              <span className="rounded-full border border-orange-500/30 px-3 py-1 text-xs text-orange-100/90">
                🎁 {activeAchievement.prize}
              </span>
            )}
          </div>
        </div>

        <div className="order-1 lg:flex-1 space-y-4 lg:order-2">
          <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[32px] border border-cyan-500/20 bg-slate-900/80 shadow-xl shadow-cyan-500/10">
            <img
              src={activeAchievement.image}
              alt={activeAchievement.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedImage(activeAchievement.image)}
            />
            <div className="absolute inset-0 bg-linear-to-tr from-slate-950/55 via-transparent to-transparent" />
            {activeAchievement.badge && (
              <span className="absolute left-3 top-3 sm:left-5 sm:top-5 rounded-full bg-slate-950/75 px-2 sm:px-4 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider text-cyan-200">
                {activeAchievement.badge}
              </span>
            )}
            <span className="absolute bottom-2 left-3 sm:bottom-4 sm:left-5 rounded-full bg-slate-950/70 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider text-cyan-200/80">
              {activeAchievement.tagline}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-950/95 border border-cyan-500/30 text-white max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 max-h-[90vh] overflow-y-auto md:scrollbar-hide">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🏆
              </span>
              Achievements
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-300">
              Certificates & recognitions - Những thành tích đáng tự hào trong hành trình học tập
            </DialogDescription>
          </DialogHeader>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewMode("story")}
              className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === "story"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📖 Story
            </button>
            <button
              type="button"
              onClick={() => setViewMode("showcase")}
              className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === "showcase"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🏅 Showcase
            </button>
          </div>

          {/* Content based on view mode */}
          <div className="mt-6 min-h-[400px]">
            {viewMode === "story" && <StoryView />}
            {viewMode === "showcase" && <ShowcaseView />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-black/95 border border-cyan-500/30 p-0 max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:scrollbar-hide">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-1.5 sm:p-2 transition-colors text-sm sm:text-base"
              >
                ✕
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Memories Photo Gallery
const MEMORIES_PHOTOS = [
  {
    id: 7,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763104831/e25c9c7e1a44961acf55_f0d92e.jpg",
    alt: "Kỷ niệm cùng bạn bè #7",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855284/2571b314be3732696b26_qsac6f.jpg",
    alt: "Kỷ niệm cùng bạn bè #2",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855286/ac6242074f24c37a9a35_anwety.jpg",
    alt: "Kỷ niệm cùng bạn bè #3",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763104388/320ed9df4fe5c3bb9af4_mtomqn.jpg",
    alt: "Kỷ niệm cùng bạn bè #4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763104460/de22da7d5047dc198556_keya3k.jpg",
    alt: "Kỷ niệm cùng bạn bè #5",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763104559/8ab05604df3e53600a2f_qhdfpe.jpg",
    alt: "Kỷ niệm cùng bạn bè #6",
  },
  {
    id: 1,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1762855284/0052d631db12574c0e03_znryom.jpg",
    alt: "Kỷ niệm cùng bạn bè #1",
  },
  {
    id: 8,
    src: "https://res.cloudinary.com/ds5zljulv/image/upload/v1763104895/ee412abd96871ad94396_m9hody.jpg",
    alt: "Kỷ niệm cùng bạn bè #8",
  },
]

// Memories Dialog với Pinterest Masonry Layout
export function MemoriesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleImageClick = (src: string, index: number) => {
    setSelectedImage(src)
    setSelectedImageIndex(index)
  }

  const handleNextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % MEMORIES_PHOTOS.length
    setSelectedImageIndex(nextIndex)
    setSelectedImage(MEMORIES_PHOTOS[nextIndex].src)
  }

  const handlePrevImage = () => {
    const prevIndex = selectedImageIndex === 0 ? MEMORIES_PHOTOS.length - 1 : selectedImageIndex - 1
    setSelectedImageIndex(prevIndex)
    setSelectedImage(MEMORIES_PHOTOS[prevIndex].src)
  }

  // Masonry grid sizes pattern - varied sizes for visual interest
  const getMasonrySize = (index: number) => {
    const patterns = [
      { col: "col-span-1", row: "row-span-1" }, // Square
      { col: "col-span-1", row: "row-span-2" }, // Tall
      { col: "col-span-2", row: "row-span-1" }, // Wide
      { col: "col-span-1", row: "row-span-1" }, // Square
      { col: "col-span-1", row: "row-span-1" }, // Square
      { col: "col-span-2", row: "row-span-2" }, // Large
      { col: "col-span-1", row: "row-span-1" }, // Square
      { col: "col-span-1", row: "row-span-1" }, // Square
    ]
    return patterns[index % patterns.length]
  }

  const featuredPhoto = MEMORIES_PHOTOS[0]
  const remainingPhotos = MEMORIES_PHOTOS.slice(1)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-950/95 border border-fuchsia-500/30 text-white max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 max-h-[90vh] overflow-y-auto md:scrollbar-hide">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                👥
              </span>
              Memories
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-300">
              Những kỷ niệm đáng nhớ cùng bạn bè & cuộc sống campus
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Featured Hero Image */}
            <button
              type="button"
              onClick={() => handleImageClick(featuredPhoto.src, 0)}
              className="group relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-xl sm:rounded-2xl border border-fuchsia-500/20 bg-slate-900/60 hover:border-fuchsia-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-500/30"
            >
              <img
                src={featuredPhoto.src}
                alt={featuredPhoto.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                onError={(e) => {
                  console.error('Image failed to load:', featuredPhoto.src)
                  e.currentTarget.style.display = 'none'
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Featured Badge */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-fuchsia-500/30 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-fuchsia-100 border border-fuchsia-400/50">
                  <span>⭐</span>
                  <span>Featured Memory</span>
                </span>
              </div>

              {/* View Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="rounded-full bg-white/20 backdrop-blur-md p-3 sm:p-4 border border-white/30 transform group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {/* Masonry Grid Gallery */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-fuchsia-200/80 mb-3 sm:mb-4">
                More Memories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-[100px] sm:auto-rows-[120px] md:auto-rows-[150px]">
                {remainingPhotos.map((photo, index) => {
                  const actualIndex = index + 1 // +1 because we skipped first photo
                  const size = getMasonrySize(index)
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => handleImageClick(photo.src, actualIndex)}
                      className={`group relative ${size.col} ${size.row} overflow-hidden rounded-xl border border-fuchsia-500/20 bg-slate-900/60 hover:border-fuchsia-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/20 hover:-translate-y-1`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', photo.src)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* View Icon on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 border border-white/30">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Photo Index Badge */}
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="rounded-full bg-black/60 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 text-[0.65rem] sm:text-xs font-semibold text-white border border-white/20">
                          {actualIndex + 1}/{MEMORIES_PHOTOS.length}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Photo Count Badge */}
            <div className="flex items-center justify-center pt-2">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-fuchsia-200">
                <span>📸</span>
                <span>{MEMORIES_PHOTOS.length} Photos</span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-black/95 border border-fuchsia-500/30 p-0 max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[95vh] md:scrollbar-hide">
            <div className="relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 text-white bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 transition-all hover:scale-110 border border-white/20 backdrop-blur-sm"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image */}
              <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh] p-4">
                <img
                  src={selectedImage}
                  alt={MEMORIES_PHOTOS[selectedImageIndex]?.alt || "Memory photo"}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />

                {/* Navigation Buttons */}
                {MEMORIES_PHOTOS.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 transition-all hover:scale-110 border border-white/20 backdrop-blur-sm"
                      aria-label="Previous"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 transition-all hover:scale-110 border border-white/20 backdrop-blur-sm"
                      aria-label="Next"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Image Info Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-6 pointer-events-none">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-sm sm:text-base line-clamp-1">{MEMORIES_PHOTOS[selectedImageIndex]?.alt}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Photo {selectedImageIndex + 1} of {MEMORIES_PHOTOS.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {MEMORIES_PHOTOS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 sm:h-1.5 rounded-full transition-all ${
                          idx === selectedImageIndex ? "w-5 sm:w-6 bg-fuchsia-400" : "w-1 sm:w-1.5 bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Graduation Invitation Card (for Step 4)
export function GraduationInvitationCard() {
  return (
    <Card className="bg-gray-800/80 border-cyan-500/50 text-white max-w-sm">
      <CardHeader>
        <CardTitle className="text-cyan-300">Lời mời Lễ Tốt nghiệp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Thời gian:</p>
          <p className="text-white font-semibold">08:00 AM, Ngày 30/11/2025</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Địa điểm:</p>
          <p className="text-white font-semibold">Trường Đại học FPT, Khu Công nghệ cao, TP. Thủ Đức</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold flex items-center gap-2">
          <MapPin size={16} />
          Xem bản đồ
        </Button>
      </CardFooter>
    </Card>
  )
}
