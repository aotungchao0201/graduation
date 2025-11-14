"use client"

import BaseModal from "./base-modal"

interface JourneyCard {
  title: string
  description: string
  image: string
}

const JOURNEY_CARDS: JourneyCard[] = [
  {
    title: "Cột Mốc 1: OJT",
    description: "Thực tập tại các công ty công nghệ hàng đầu, học hỏi kinh nghiệm thực tế",
    image: "/internship-office-learning.jpg",
  },
  {
    title: "Cột Mốc 2: Chinh Chiến CTF",
    description: "Tham gia các cuộc thi Capture The Flag, hone security skills",
    image: "/cybersecurity-ctf-competition.jpg",
  },
  {
    title: "Cột Mốc 3: The Lab (Đồ Án)",
    description: "Phát triển project an toàn thông tin, ứng dụng công nghệ hiện đại",
    image: "/development-lab-project.jpg",
  },
  {
    title: "Cột Mốc 4: Thành Tích",
    description: "Đạt được các chứng chỉ và giải thưởng về bảo mật thông tin",
    image: "/certificates-achievements-awards.jpg",
  },
  {
    title: "Cột Mốc 5: Bảo Vệ Thành Công",
    description: "Bảo vệ khóa luận tốt nghiệp với kết quả xuất sắc",
    image: "/thesis-defense-presentation.jpg",
  },
  {
    title: "Cột Mốc 6: Đồng Đội",
    description: "Cảm ơn những bạn bè, thầy cô đã đồng hành suốt chặng đường",
    image: "/team-celebration-together.jpg",
  },
]

export default function JourneyModal({ onClose }: { onClose: () => void }) {
  return (
    <BaseModal title="Hành Trình Chuyên Gia" onClose={onClose}>
      <div className="p-6 h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JOURNEY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 
                        transition-colors duration-200"
            >
              <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2">{card.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  )
}
