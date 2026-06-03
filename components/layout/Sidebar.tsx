'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, Search, Library, Plus, Heart, LogOut, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/common/Logo'
import UserMenu from '@/components/auth/UserMenu'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Library, label: 'Library', href: '/library' },
]

const playlistActions = [
  { icon: Plus, label: 'Create Playlist', action: 'create' },
  { icon: Heart, label: 'Liked Songs', href: '/liked-songs' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-card rounded-lg transition-smooth"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:relative w-64 h-full bg-secondary border-r border-border flex flex-col overflow-y-auto scrollbar-thin z-40 lg:z-auto"
      >
        {/* Header */}
        <div className="p-6 space-y-6">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <Logo />
          </Link>

          {/* Primary Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-smooth group"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} className="group-hover:text-primary transition-smooth" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Playlist Section */}
        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Playlists
            </h3>
            <button
              className="p-1 hover:bg-card rounded-lg transition-smooth text-muted-foreground hover:text-primary"
              title="Create new playlist"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Playlist Items */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link
                key={i}
                href={`/playlist/${i}`}
                className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-smooth truncate"
              >
                My Playlist {i}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 space-y-4 border-t border-border">
          <UserMenu />
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
