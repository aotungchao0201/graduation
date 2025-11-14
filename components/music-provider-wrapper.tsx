"use client"

import { MusicProvider } from "@/contexts/music-context"

export default function MusicProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>
}
