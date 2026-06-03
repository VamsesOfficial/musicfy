'use client'

import { Music } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
        <Music size={24} className="text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-foreground leading-tight">Musicify</span>
        <span className="text-xs text-muted-foreground">Premium Music</span>
      </div>
    </div>
  )
}
