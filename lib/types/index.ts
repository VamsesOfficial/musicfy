/* Music and Track Types */
export interface Track {
  id: string
  title: string
  artist: string
  artistId?: string
  album: string
  albumId?: string
  duration: number
  coverUrl?: string
  spotifyUrl?: string
  youtubeUrl?: string
  preview?: string
  isrc?: string
  releaseDate?: string
  genre?: string[]
  lyrics?: SyncedLyrics
  explicit?: boolean
}

export interface Artist {
  id: string
  name: string
  image?: string
  bio?: string
  followers?: number
  monthlyListeners?: number
  genres?: string[]
  verified?: boolean
  externalUrls?: {
    spotify?: string
    youtube?: string
  }
}

export interface Album {
  id: string
  title: string
  artist: string
  artistId?: string
  coverUrl?: string
  releaseDate?: string
  totalTracks: number
  genre?: string[]
  label?: string
  tracks?: Track[]
  externalUrls?: {
    spotify?: string
    youtube?: string
  }
}

export interface Playlist {
  id: string
  title: string
  description?: string
  image?: string
  owner: string
  ownerId?: string
  isPublic: boolean
  tracks: Track[]
  trackCount: number
  createdAt: Date
  updatedAt: Date
  followers?: number
}

/* User and Auth Types */
export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  premiumTier?: 'free' | 'pro' | 'family'
  settings?: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  audioQuality: 'low' | 'normal' | 'high' | 'lossless'
  autoplay: boolean
  notificationsEnabled: boolean
  privateSession: boolean
}

export interface UserSession {
  user: User
  token: string
  expiresAt: Date
}

/* Player Types */
export interface PlayerState {
  isPlaying: boolean
  currentTrack: Track | null
  queue: Track[]
  currentIndex: number
  progress: number
  duration: number
  volume: number
  isMuted: boolean
  repeatMode: 'off' | 'one' | 'all'
  shuffle: boolean
  buffering: boolean
}

export interface PlaybackSettings {
  volume: number
  speed: number
  crossfade: number
  gaplessPlayback: boolean
  equalizerPreset?: string
  normalizeAudio?: boolean
}

export interface PlaybackSession {
  id: string
  trackId: string
  userId?: string
  startTime: number
  currentTime: number
  duration: number
  completionPercentage: number
  sessionId: string
  createdAt: Date
}

/* Search Types */
export interface SearchResult {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
}

/* Library Types */
export interface UserLibrary {
  id: string
  userId: string
  liked: Track[]
  recentlyPlayed: Track[]
  history: Track[]
  playlists: Playlist[]
  favorites: Track[]
  downloadedTracks?: Track[]
}

export interface ListeningHistory {
  id: string
  userId: string
  trackId: string
  track?: Track
  playedAt: Date
  duration: number
  completionPercentage: number
}

/* Recommendation Types */
export interface Recommendation {
  track: Track
  reason: string
  score: number
}

/* Lyrics Types */
export interface Lyric {
  timestamp: number
  text: string
}

export interface SyncedLyrics {
  trackId: string
  lyrics: Lyric[]
  language?: string
  synced: boolean
}

/* API Response Types */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/* Cache Types */
export interface CacheConfig {
  ttl: number
  key: string
  strategy: 'memory' | 'local' | 'session'
}

/* Queue Types */
export interface QueueState {
  tracks: Track[]
  currentIndex: number
  history: Track[]
  historyIndex: number
}

/* Trending Types */
export interface TrendingContent {
  type: 'track' | 'artist' | 'album' | 'playlist'
  items: Track[] | Artist[] | Album[] | Playlist[]
  category?: string
  timeRange: 'day' | 'week' | 'month'
}
