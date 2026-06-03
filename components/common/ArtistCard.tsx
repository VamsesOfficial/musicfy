'use client';

import { motion } from 'framer-motion';
import { Play, User } from 'lucide-react';
import { useState } from 'react';

interface ArtistCardProps {
  id: string;
  name: string;
  image_url?: string;
  followers?: number;
  genres?: string[];
  onPlay?: () => void;
}

export function ArtistCard({
  id,
  name,
  image_url,
  followers = 0,
  genres = [],
  onPlay
}: ArtistCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all p-6 text-center"
    >
      <div className="relative mb-4">
        <motion.div
          className="relative mx-auto w-24 h-24 overflow-hidden rounded-full shadow-lg"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent to-green-400 flex items-center justify-center">
              <User size={40} className="text-background" />
            </div>
          )}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={18} className="text-background fill-background ml-0.5" />
        </motion.button>
      </div>

      <h4 className="font-semibold text-text-primary mb-2 truncate">
        {name}
      </h4>

      {followers > 0 && (
        <p className="text-xs text-text-secondary mb-3">
          {formatFollowers(followers)} followers
        </p>
      )}

      {genres && genres.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {genres.slice(0, 2).map((genre, idx) => (
            <span
              key={idx}
              className="inline-block text-xs px-2 py-1 bg-accent/20 text-accent rounded-full"
            >
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className="inline-block text-xs px-2 py-1 text-text-secondary">
              +{genres.length - 2} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
