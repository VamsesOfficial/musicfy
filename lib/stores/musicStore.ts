import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track, PlayerState, PlaybackSettings } from '../types'

interface MusicStore {
  /* Playback State */
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  duration: number
  volume: number
  isMuted: boolean
  repeatMode: 'off' | 'one' | 'all'
  isShuffle: boolean
  queue: Track[]
  queueIndex: number
  history: Track[]
  isLoading: boolean
  error?: string

  /* Playback Settings */
  playbackSpeed: number
  crossfadeDuration: number
  gaplessPlayback: boolean
  audioQuality: 'low' | 'normal' | 'high' | 'lossless'

  /* Recently Played */
  recentlyPlayed: Track[]
  
  /* User Favorites */
  likedTracks: Track[]
  likedArtists: string[]
  likedAlbums: string[]

  /* Actions */
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setIsMuted: (muted: boolean) => void
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void
  setIsShuffle: (shuffle: boolean) => void
  
  setQueue: (tracks: Track[], index?: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  
  nextTrack: () => void
  previousTrack: () => void
  
  addToRecentlyPlayed: (track: Track) => void
  clearRecentlyPlayed: () => void
  
  addToLiked: (track: Track) => void
  removeFromLiked: (trackId: string) => void
  isTrackLiked: (trackId: string) => boolean
  
  setPlaybackSettings: (settings: Partial<PlaybackSettings>) => void
  setError: (error?: string) => void
  setIsLoading: (loading: boolean) => void
  
  reset: () => void
}

const initialState = {
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  repeatMode: 'off' as const,
  isShuffle: false,
  queue: [],
  queueIndex: 0,
  history: [],
  isLoading: false,
  error: undefined,
  playbackSpeed: 1,
  crossfadeDuration: 0,
  gaplessPlayback: true,
  audioQuality: 'normal' as const,
  recentlyPlayed: [],
  likedTracks: [],
  likedArtists: [],
  likedAlbums: [],
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setIsShuffle: (shuffle) => set({ isShuffle: shuffle }),

      setQueue: (tracks, index = 0) => set({ queue: tracks, queueIndex: index }),
      addToQueue: (track) => set((state) => ({
        queue: [...state.queue, track],
      })),
      removeFromQueue: (index) => set((state) => ({
        queue: state.queue.filter((_, i) => i !== index),
      })),
      clearQueue: () => set({ queue: [], queueIndex: 0 }),

      nextTrack: () => set((state) => {
        let nextIndex = state.queueIndex + 1
        if (nextIndex >= state.queue.length) {
          if (state.repeatMode === 'all') {
            nextIndex = 0
          } else {
            return {}
          }
        }
        return { queueIndex: nextIndex }
      }),

      previousTrack: () => set((state) => {
        let prevIndex = state.queueIndex - 1
        if (prevIndex < 0) {
          prevIndex = Math.max(0, state.queue.length - 1)
        }
        return { queueIndex: prevIndex }
      }),

      addToRecentlyPlayed: (track) => set((state) => ({
        recentlyPlayed: [track, ...state.recentlyPlayed].slice(0, 50),
      })),

      clearRecentlyPlayed: () => set({ recentlyPlayed: [] }),

      addToLiked: (track) => set((state) => ({
        likedTracks: state.likedTracks.some(t => t.id === track.id)
          ? state.likedTracks
          : [...state.likedTracks, track],
      })),

      removeFromLiked: (trackId) => set((state) => ({
        likedTracks: state.likedTracks.filter(t => t.id !== trackId),
      })),

      isTrackLiked: (trackId) => {
        const state = get()
        return state.likedTracks.some(t => t.id === trackId)
      },

      setPlaybackSettings: (settings) => set((state) => ({
        playbackSpeed: settings.speed ?? state.playbackSpeed,
        crossfadeDuration: settings.crossfade ?? state.crossfadeDuration,
        gaplessPlayback: settings.gaplessPlayback ?? state.gaplessPlayback,
        audioQuality: settings.audioQuality ?? state.audioQuality,
      })),

      setError: (error) => set({ error }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      reset: () => set(initialState),
    }),
    {
      name: 'musicify-player-store',
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        isShuffle: state.isShuffle,
        playbackSpeed: state.playbackSpeed,
        crossfadeDuration: state.crossfadeDuration,
        gaplessPlayback: state.gaplessPlayback,
        audioQuality: state.audioQuality,
        likedTracks: state.likedTracks,
        recentlyPlayed: state.recentlyPlayed,
      }),
    }
  )
)
