import { NextResponse } from "next/server"
import { WISH_WEBHOOK_URL } from "@/lib/wish-config"

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const response = await fetch(WISH_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: text || "Failed to send wish" },
        { status: response.status || 500 }
      )
    }

    let data: { status?: string } = {}
    try {
      data = JSON.parse(text)
    } catch {
      data = { status: "ok" }
    }

    return NextResponse.json({ status: data.status ?? "ok" })
  } catch (error) {
    console.error("Wish submission failed:", error)
    return NextResponse.json({ status: "error", message: "Unexpected error" }, { status: 500 })
  }
}






