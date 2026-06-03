'use client';

import { motion } from 'framer-motion';
import { Play, Music, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface PlaylistCardProps {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  trackCount?: number;
  isPublic?: boolean;
  onPlay?: () => void;
}

export function PlaylistCard({
  id,
  title,
  description,
  image_url,
  trackCount = 0,
  isPublic = false,
  onPlay
}: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-accent/20 to-green-400/20 flex items-center justify-center">
        {image_url ? (
          <motion.img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Music size={56} className="text-accent/40" />
            <p className="text-xs text-accent/50 font-medium">PLAYLIST</p>
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
            onPlay?.();
          }}
          className="absolute bottom-4 right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={24} className="text-background fill-background ml-0.5" />
        </motion.button>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-text-primary truncate mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-text-secondary truncate mb-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-text-secondary/70">
          <span>{trackCount} songs</span>
          <span>{isPublic ? 'Public' : 'Private'}</span>
        </div>
      </div>
    </motion.div>
  );
}
