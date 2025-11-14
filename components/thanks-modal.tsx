"use client"

import { useEffect, useState } from "react"
import BaseModal from "./base-modal"

export default function ThanksModal({ onClose }: { onClose: () => void }) {
  const letterBody = `Chào các bạn,

Cảm ơn các bạn đã dành thời gian ghé tham quan workspace của mình hôm nay. Sự hiện diện, lời chúc và cả những câu chuyện ngắn với mọi người tiếp thêm cho mình rất nhiều năng lượng trước ngày tốt nghiệp.

Biết ai cũng bận, nên mình trân trọng lắm việc các bạn vẫn sắp xếp ghé qua—từ bạn bè FPTU đồng hành suốt 4 năm đến những người bạn lâu ngày mới gặp lại.

Nếu thu xếp được, mình sẽ cực kỳ vui khi được gặp các bạn ở buổi lễ tốt nghiệp nữa; chúng ta chụp vài tấm ảnh, nói vài câu chúc mừng, coi như khép lại một chặng đường gọn gàng. Sau lễ, rảnh thì mình mời mọi người cà phê, đi chơi cho đủ bộ.

Một lần nữa, cảm ơn vì đã đến và dành thời gian cho nhau hôm nay!`

  const signatureText = `Trân trọng,
Trần Tiến Cường.`

  const [displayBody, setDisplayBody] = useState("")
  const [displaySignature, setDisplaySignature] = useState("")
  const [bodyDone, setBodyDone] = useState(false)

  useEffect(() => {
    setDisplayBody("")
    setDisplaySignature("")
    setBodyDone(false)

    let index = 0
    const interval = setInterval(() => {
      if (index <= letterBody.length) {
        setDisplayBody(letterBody.slice(0, index))
        index += 1
      } else {
        clearInterval(interval)
        setBodyDone(true)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [letterBody])

  useEffect(() => {
    if (!bodyDone) return

    let index = 0
    const interval = setInterval(() => {
      if (index <= signatureText.length) {
        setDisplaySignature(signatureText.slice(0, index))
        index += 1
      } else {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [bodyDone, signatureText])

  return (
    <BaseModal title="Lời Cảm Ơn (README.md)" onClose={onClose}>
      <div className="p-6">
        <div
          className="text-gray-200 leading-relaxed whitespace-pre-line"
          style={{ fontFamily: '"Caveat", "Patrick Hand", "Comic Sans MS", cursive' }}
        >
          {displayBody}
        </div>
        <div
          className="mt-6 text-gray-200 whitespace-pre-line text-right"
          style={{ fontFamily: '"Caveat", "Patrick Hand", "Comic Sans MS", cursive' }}
        >
          {displaySignature}
        </div>
        <div className="text-cyan-400 text-sm mt-4 uppercase tracking-widest animate-pulse">-- cảm ơn vì đã ghé --</div>
      </div>
    </BaseModal>
  )
}
