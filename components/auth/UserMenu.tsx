'use client'

import { User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  // TODO: Implement authentication
  const isAuthenticated = false

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/login"
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth text-center text-sm"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="space-y-2">
      <Link
        href="/profile"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-smooth text-sm"
      >
        <User size={16} />
        <span>Profile</span>
      </Link>

      <Link
        href="/settings"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-smooth text-sm"
      >
        <Settings size={16} />
        <span>Settings</span>
      </Link>

      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-smooth text-sm">
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  )
}
