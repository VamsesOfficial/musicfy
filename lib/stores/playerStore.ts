import { create } from 'zustand'
import { PlayerState, Track } from '@/lib/types'

interface PlayerStore extends PlayerState {
  currentTime: number
  isShuffle: boolean
  playbackSpeed: number
  currentTrackIndex: number
  setTrack: (track: Track | null) => void
  setQueue: (queue: Track[]) => void
  setPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
  setCurrentTime: (time: number) => void
  setPlaybackSpeed: (speed: number) => void
  setVolume: (volume: number) => void
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void
  setShuffle: (shuffle: boolean) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  setBuffering: (buffering: boolean) => void
  nextTrack: () => void
  previousTrack: () => void
  playTrack: (track: Track, queue?: Track[]) => void
  pauseTrack: () => void
  togglePlayPause: () => void
  clearQueue: () => void
  removeFromQueue: (index: number) => void
  moveQueueTrack: (from: number, to: number) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  progress: 0,
  duration: 0,
  currentTime: 0,
  playbackSpeed: 1,
  currentTrackIndex: 0,
  volume: 0.8,
  isMuted: false,
  repeatMode: 'off',
  shuffle: false,
  isShuffle: false,
  buffering: false,

  setTrack: (track) => set({ currentTrack: track }),
  setQueue: (queue) => set({ queue }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setShuffle: (shuffle) => set({ shuffle, isShuffle: shuffle }),
  toggleShuffle: () => {
    const { isShuffle } = get()
    set({ isShuffle: !isShuffle, shuffle: !isShuffle })
  },
  toggleRepeat: () => {
    const { repeatMode } = get()
    const next = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
    set({ repeatMode: next })
  },
  setBuffering: (buffering) => set({ buffering }),

  nextTrack: () => {
    const { currentIndex, queue, repeatMode } = get()
    if (queue.length === 0) return

    let nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0
      } else {
        return
      }
    }

    set({
      currentIndex: nextIndex,
      currentTrackIndex: nextIndex,
      currentTrack: queue[nextIndex],
      progress: 0,
    })
  },

  previousTrack: () => {
    const { currentIndex, queue } = get()
    if (queue.length === 0) return

    const prevIndex = Math.max(0, currentIndex - 1)
    set({
      currentIndex: prevIndex,
      currentTrackIndex: prevIndex,
      currentTrack: queue[prevIndex],
      progress: 0,
    })
  },

  playTrack: (track, queue) => {
    const idx = queue ? queue.indexOf(track) : 0
    set({
      currentTrack: track,
      queue: queue || [track],
      currentIndex: idx,
      currentTrackIndex: idx,
      isPlaying: true,
      progress: 0,
    })
  },

  pauseTrack: () => set({ isPlaying: false }),

  togglePlayPause: () => {
    const { isPlaying } = get()
    set({ isPlaying: !isPlaying })
  },

  clearQueue: () => set({
    queue: [],
    currentIndex: 0,
    currentTrack: null,
    isPlaying: false,
  }),

  removeFromQueue: (index) => {
    const { queue, currentIndex } = get()
    const newQueue = queue.filter((_, i) => i !== index)
    let newIndex = currentIndex

    if (index < currentIndex) {
      newIndex = currentIndex - 1
    } else if (index === currentIndex) {
      newIndex = Math.min(newIndex, newQueue.length - 1)
    }

    set({
      queue: newQueue,
      currentIndex: newIndex,
      currentTrack: newIndex >= 0 ? newQueue[newIndex] : null,
    })
  },

  moveQueueTrack: (from, to) => {
    const { queue } = get()
    const newQueue = [...queue]
    const [removed] = newQueue.splice(from, 1)
    newQueue.splice(to, 0, removed)
    set({ queue: newQueue })
  },
}))
