'use client'

import { useState } from 'react'
import { Heart, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Track } from '@/lib/types'
import { useMusicStore } from '@/lib/stores/musicStore'

interface TrackCardProps {
  track: Track
}

export default function TrackCard({ track }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isLiked = useMusicStore((state) => state.isTrackLiked(track.id))
  const toggleLike = useMusicStore((state) => state.addToLiked)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-card">
        <Image
          src={track.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'}
          alt={track.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2"
        >
          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-smooth"
          >
            <Play size={20} fill="currentColor" />
          </motion.button>

          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleLike(track)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-smooth ${
              isLiked
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/80 text-foreground hover:bg-card'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
        </motion.div>
      </div>

      {/* Track Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
          {track.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {track.artist}
        </p>
      </div>
    </motion.div>
  )
}
