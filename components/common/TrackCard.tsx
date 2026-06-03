'use client';

import { motion } from 'framer-motion';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { Track } from '@/lib/types';
import { usePlayerStore } from '@/lib/stores/playerStore';
import { useState } from 'react';

interface TrackCardProps {
  track: Track;
  isCurrentTrack?: boolean;
  onLike?: (track: Track) => void;
  isLiked?: boolean;
}

export function TrackCard({
  track,
  isCurrentTrack,
  onLike,
  isLiked = false
}: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { playTrack } = usePlayerStore();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`glass-card rounded-lg overflow-hidden group cursor-pointer transition-all ${
        isCurrentTrack ? 'ring-2 ring-accent' : 'hover:shadow-xl'
      }`}
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-accent/20 to-green-400/20">
        {track.cover_url ? (
          <motion.img
            src={track.cover_url}
            alt={track.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-accent/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v9.28c-.47-.46-.97-.88-1.48-1.25-.79-.61-1.63-1.08-2.5-1.38-.87-.30-1.75-.45-2.52-.45-1.95 0-3.77.77-5.14 2.14C.77 12.23 0 14.05 0 16s.77 3.77 2.14 5.14C3.51 22.51 5.33 23.28 7.28 23.28c.77 0 1.65-.15 2.52-.45.87-.30 1.71-.77 2.5-1.38.51-.37 1.01-.79 1.48-1.25V21c0 1.1.9 2 2 2s2-.9 2-2v-9.28c.47.46.97.88 1.48 1.25.79.61 1.63 1.08 2.5 1.38.87.30 1.75.45 2.52.45 1.95 0 3.77-.77 5.14-2.14 1.37-1.37 2.14-3.19 2.14-5.14s-.77-3.77-2.14-5.14C22.51 3.77 20.69 3 18.74 3c-.77 0-1.65.15-2.52.45-.87.30-1.71.77-2.5 1.38-.51.37-1.01.79-1.48 1.25V3c0-1.1-.9-2-2-2s-2 .9-2 2z" />
            </svg>
          </div>
        )}
        <div className={`absolute inset-0 bg-black/40 transition-all duration-300 ${
          isHovered ? 'bg-black/20' : ''
        }`} />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            playTrack(track);
          }}
          className="absolute bottom-4 right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={24} className="text-background fill-background ml-0.5" />
        </motion.button>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-text-primary truncate mb-1 text-sm">
          {track.title}
        </h4>
        <p className="text-xs text-text-secondary truncate mb-3">
          {track.artist}
        </p>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(track);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-accent/20 text-accent'
                : 'hover:bg-tertiary text-text-secondary'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          <button className="p-2 hover:bg-tertiary rounded-lg transition-colors text-text-secondary ml-auto">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
