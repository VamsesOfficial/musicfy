/* API Constants */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const YOUTUBE_MUSIC_API = 'https://music.youtube.com'
export const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2'
export const LRCLIB_API = 'https://lrclib.net/api'
export const COVER_ART_ARCHIVE_API = 'https://coverartarchive.org'
export const THEAUDIODB_API = 'https://www.theaudiodb.com/api/v1/json'

/* Music Constants */
export const GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Jazz', 'Classical',
  'Electronic', 'K-Pop', 'Indie', 'Metal', 'Latin', 'Soul', 'Reggae'
]

export const REPEAT_MODES = ['off', 'one', 'all'] as const

/* Pagination */
export const DEFAULT_PAGE_SIZE = 50
export const INITIAL_PAGE = 1

/* Cache Duration (in minutes) */
export const CACHE_DURATION = {
  TRACKS: 60,
  ARTISTS: 120,
  ALBUMS: 120,
  PLAYLISTS: 30,
  SEARCH: 10,
}

/* UI Constants */
export const MINI_PLAYER_HEIGHT = 72
export const PLAYER_HEIGHT = 80
export const SIDEBAR_WIDTH = 256
export const SIDEBAR_COLLAPSED_WIDTH = 64

/* Animation Durations (in ms) */
export const ANIMATION_DURATION = {
  FAST: 150,
  BASE: 300,
  SLOW: 500,
  VERY_SLOW: 800,
}

/* Breakpoints */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
}

/* Local Storage Keys */
export const STORAGE_KEYS = {
  PLAYER_VOLUME: 'musicify_player_volume',
  PLAYER_REPEAT: 'musicify_player_repeat',
  PLAYER_SHUFFLE: 'musicify_player_shuffle',
  SIDEBAR_COLLAPSED: 'musicify_sidebar_collapsed',
  THEME: 'musicify_theme',
  RECENT_SEARCHES: 'musicify_recent_searches',
  PLAYBACK_HISTORY: 'musicify_playback_history',
  LIKED_TRACKS: 'musicify_liked_tracks',
}

/* API Routes */
export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  TRACKS: '/api/tracks',
  ARTISTS: '/api/artists',
  ALBUMS: '/api/albums',
  PLAYLISTS: '/api/playlists',
  SEARCH: '/api/search',
  RECOMMENDATIONS: '/api/recommendations',
  LYRICS: '/api/lyrics',
  LIBRARY: '/api/library',
}
