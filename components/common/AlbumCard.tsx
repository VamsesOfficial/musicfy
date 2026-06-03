'use client';

import { motion } from 'framer-motion';
import { Play, Disc3 } from 'lucide-react';
import { useState } from 'react';

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  cover_url?: string;
  releaseDate?: string;
  totalTracks?: number;
  onPlay?: () => void;
}

export function AlbumCard({
  id,
  title,
  artist,
  cover_url,
  releaseDate,
  totalTracks = 0,
  onPlay
}: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-accent/20 to-green-400/20 flex items-center justify-center">
        {cover_url ? (
          <motion.img
            src={cover_url}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Disc3 size={56} className="text-accent/40" />
            <p className="text-xs text-accent/50 font-medium">ALBUM</p>
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
        <p className="text-sm text-text-secondary truncate mb-3">
          {artist}
        </p>
        <div className="flex items-center justify-between text-xs text-text-secondary/70">
          <span>{totalTracks} tracks</span>
          {releaseYear && <span>{releaseYear}</span>}
        </div>
      </div>
    </motion.div>
  );
}
