'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores/playerStore';
import { getAudioEngine } from '@/lib/services/audioEngine';
import { formatDuration } from '@/lib/utils/helpers';

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffle,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    setCurrentTime
  } = usePlayerStore();

  const [displayDuration, setDisplayDuration] = useState(0);
  const audioEngineRef = useRef(getAudioEngine());

  useEffect(() => {
    const audio = audioEngineRef.current.getAudioElement();
    if (!audio) return;

    const updateDuration = () => {
      setDisplayDuration(audio.duration);
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    return () => audio.removeEventListener('loadedmetadata', updateDuration);
  }, []);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = displayDuration ? (currentTime / displayDuration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass border-t z-40"
    >
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <span>{formatDuration(currentTime)}</span>
          <motion.div
            className="flex-1 h-1 bg-secondary rounded-full overflow-hidden cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const newTime = percent * displayDuration;
              setCurrentTime(newTime);
            }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-green-400"
              style={{ width: `${progressPercent}%` }}
              layoutId="progress"
            />
          </motion.div>
          <span>{formatDuration(displayDuration)}</span>
        </div>

        {/* Track info and controls */}
        <div className="flex items-center gap-4">
          {/* Album art */}
          <motion.img
            src={currentTrack.coverUrl || '/placeholder-album.png'}
            alt={currentTrack.album}
            className="w-12 h-12 rounded-lg object-cover shadow-lg"
            layoutId="albumArt"
          />

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-muted truncate">
              {currentTrack.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleShuffle}
              className={`p-2 rounded-lg transition-colors ${
                isShuffle ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Shuffle size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previousTrack}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
            >
              <SkipBack size={20} fill="currentColor" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="p-2.5 rounded-lg bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTrack}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
            >
              <SkipForward size={20} fill="currentColor" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRepeat}
              className={`p-2 rounded-lg transition-colors ${
                repeatMode !== 'off' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Repeat size={18} />
            </motion.button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 w-32">
            <Volume2 size={18} className="text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
