'use client'

import { motion } from 'framer-motion'
import TrackCard from '@/components/cards/TrackCard'

const mockTracks = Array(8).fill(null).map((_, i) => ({
  id: `recent-${i}`,
  title: `Recently Played Track ${i + 1}`,
  artist: `Artist ${i + 1}`,
  album: `Album ${i + 1}`,
  duration: 200 + Math.random() * 100,
  coverUrl: `https://images.unsplash.com/photo-${1490000 + i}?w=400&h=400&fit=crop`,
}))

export default function RecentlyPlayedSection() {
  return (
    <section className="px-6 py-12 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Recently Played</h2>
        <p className="text-muted-foreground">Your listening history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TrackCard track={track} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
