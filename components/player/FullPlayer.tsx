'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Share2, MoreVertical, Mic2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores/playerStore';
import { formatTime } from '@/lib/utils/helpers';

interface FullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullPlayer({ isOpen, onClose }: FullPlayerProps) {
  const {
    currentTrack,
    queue,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    previousTrack
  } = usePlayerStore();

  const [displayDuration, setDisplayDuration] = useState(0);
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [showLyrics, setShowLyrics] = useState(true);

  useEffect(() => {
    if (currentTrack?.duration) {
      setDisplayDuration(currentTrack.duration);
    }
  }, [currentTrack]);

  if (!currentTrack || !isOpen) {
    return null;
  }

  const progressPercent = displayDuration ? (currentTime / displayDuration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 bg-gradient-to-b from-background via-secondary to-tertiary z-50 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 backdrop-blur-md bg-white/5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronDown size={28} />
            </motion.button>

            <h2 className="text-sm font-semibold text-text-secondary tracking-wider">NOW PLAYING</h2>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreVertical size={24} />
            </motion.button>
          </div>

          {/* Album Art Section - Large */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <motion.div
              layoutId="albumArt"
              className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={currentTrack.cover_url || '/placeholder-album.png'}
                alt={currentTrack.album}
                className="w-full h-full object-cover"
                animate={{ scale: isPlaying ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Track Info */}
            <motion.div
              className="mt-12 text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 line-clamp-2">
                {currentTrack.title}
              </h1>
              <p className="text-lg text-text-secondary mb-1">{currentTrack.artist}</p>
              <p className="text-sm text-text-secondary/70">{currentTrack.album}</p>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full hover:bg-accent/20 transition-colors"
              >
                <Heart size={24} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full hover:bg-accent/20 transition-colors"
              >
                <Share2 size={24} />
              </motion.button>

              {showLyrics && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="p-3 rounded-full bg-accent/20 text-accent transition-colors"
                >
                  <Mic2 size={24} />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Lyrics Section */}
          {showLyrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-4 h-32 overflow-y-auto glass-card mx-6 mb-4 rounded-xl"
            >
              <p className="text-center text-sm text-text-secondary italic">
                Lyrics not available for this track
              </p>
            </motion.div>
          )}

          {/* Controls Section */}
          <div className="px-6 pb-8 space-y-6">
            {/* Progress */}
            <div>
              <motion.div
                className="flex-1 h-2 bg-tertiary rounded-full overflow-hidden cursor-pointer mb-2"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const newTime = percent * displayDuration;
                  usePlayerStore.setState({ currentTime: newTime });
                }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-green-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </motion.div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(displayDuration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={previousTrack}
                className="p-3 hover:bg-tertiary rounded-full transition-colors"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayPause}
                className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-accent to-green-400 rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-background" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-background ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextTrack}
                className="p-3 hover:bg-tertiary rounded-full transition-colors"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
                </svg>
              </motion.button>
            </div>

            {/* Queue Preview */}
            {queue.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-4 rounded-xl"
              >
                <p className="text-xs font-semibold text-text-secondary mb-3 tracking-wider">UP NEXT</p>
                <div className="space-y-2">
                  {queue.slice(1, 4).map((track, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-xs text-text-secondary w-6">{idx + 2}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate font-medium">{track.title}</p>
                        <p className="text-xs text-text-secondary truncate">{track.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
