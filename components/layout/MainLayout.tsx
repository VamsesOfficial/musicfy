'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useMusicStore } from '@/lib/stores/musicStore'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const currentTrack = useMusicStore((state) => state.currentTrack)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  )
}
