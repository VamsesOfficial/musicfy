'use client'

import { useState } from 'react'
import { Search, Bell, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Header() {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <header className="h-16 border-b border-border bg-secondary/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Search */}
        <motion.div
          className="flex-1 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-full text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Right - Actions */}
        <motion.div
          className="flex items-center gap-3 ml-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Notifications */}
          <button className="p-2 hover:bg-card rounded-full transition-smooth text-muted-foreground hover:text-foreground relative group">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="p-2 hover:bg-card rounded-full transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Settings size={20} />
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
