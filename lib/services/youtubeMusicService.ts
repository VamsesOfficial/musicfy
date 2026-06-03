import axios, { AxiosError } from 'axios'
import type { Track, Artist, Album, SearchResult } from '../types'

const YOUTUBE_MUSIC_BASE = 'https://music.youtube.com'

interface YouTubeMusicTrack {
  videoId: string
  title: string
  artists: Array<{ name: string; id?: string }>
  album?: { name: string; id?: string }
  duration?: string
  thumbnails?: Array<{ url: string; width: number; height: number }>
  isExplicit?: boolean
}

interface YouTubeMusicArtist {
  artistId: string
  name: string
  description?: string
  thumbnail?: { url: string }
  subscribers?: string
}

// ─── API Key Rotation ────────────────────────────────────────────────────────

function loadApiKeys(): string[] {
  const keys: string[] = []

  // Support single key (YOUTUBE_API_KEY) and multiple keys (YOUTUBE_API_KEY_1 .. _N)
  if (process.env.YOUTUBE_API_KEY) {
    keys.push(process.env.YOUTUBE_API_KEY)
  }

  let i = 1
  while (true) {
    const key = process.env[`YOUTUBE_API_KEY_${i}`]
    if (!key) break
    if (!keys.includes(key)) keys.push(key) // avoid duplicate if _1 === single key
    i++
  }

  if (keys.length === 0) {
    console.warn('[YouTubeMusicService] No API keys found in environment variables.')
  }

  return keys
}

class ApiKeyRotator {
  private keys: string[]
  private currentIndex: number = 0
  private exhaustedKeys: Set<number> = new Set()

  constructor(keys: string[]) {
    this.keys = keys
  }

  get current(): string {
    return this.keys[this.currentIndex] ?? ''
  }

  get totalKeys(): number {
    return this.keys.length
  }

  get hasAvailableKey(): boolean {
    return this.exhaustedKeys.size < this.keys.length
  }

  /** Mark current key as quota-exceeded, rotate to next available key. Returns true if rotated. */
  rotateOnQuotaExceeded(): boolean {
    this.exhaustedKeys.add(this.currentIndex)

    // Find next non-exhausted key
    for (let i = 0; i < this.keys.length; i++) {
      const nextIndex = (this.currentIndex + 1 + i) % this.keys.length
      if (!this.exhaustedKeys.has(nextIndex)) {
        const prevIndex = this.currentIndex
        this.currentIndex = nextIndex
        console.warn(
          `[YouTubeMusicService] Key #${prevIndex + 1} quota exceeded. ` +
          `Rotating to key #${nextIndex + 1} (${this.exhaustedKeys.size}/${this.keys.length} exhausted).`
        )
        return true
      }
    }

    console.error('[YouTubeMusicService] All API keys exhausted for today. Quota limit reached.')
    return false
  }

  /** Reset exhausted keys (e.g. call at midnight / daily reset). */
  reset(): void {
    this.exhaustedKeys.clear()
    this.currentIndex = 0
    console.info('[YouTubeMusicService] API key rotation reset.')
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

class YouTubeMusicService {
  private rotator: ApiKeyRotator
  private baseURL = 'https://www.googleapis.com/youtube/v3'

  constructor() {
    this.rotator = new ApiKeyRotator(loadApiKeys())
  }

  /**
   * Core request wrapper — automatically retries with the next key
   * when a 403 quota-exceeded error is returned by YouTube.
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, unknown>,
    attempt: number = 0
  ): Promise<T> {
    if (!this.rotator.hasAvailableKey) {
      throw new Error('All YouTube API keys have exceeded their daily quota.')
    }

    try {
      const response = await axios.get<T>(`${this.baseURL}${endpoint}`, {
        params: { ...params, key: this.rotator.current },
      })
      return response.data
    } catch (err) {
      const error = err as AxiosError
      const status = error.response?.status
      const reason = (error.response?.data as any)?.error?.errors?.[0]?.reason

      // 403 with quotaExceeded or dailyLimitExceeded → rotate key and retry
      if (
        status === 403 &&
        (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') &&
        attempt < this.rotator.totalKeys
      ) {
        const rotated = this.rotator.rotateOnQuotaExceeded()
        if (rotated) {
          return this.request<T>(endpoint, params, attempt + 1)
        }
      }

      throw error
    }
  }

  async searchTracks(query: string, maxResults: number = 10): Promise<Track[]> {
    try {
      const data = await this.request<any>('/search', {
        q: query,
        type: 'video',
        maxResults,
        part: 'snippet',
        regionCode: 'US',
      })

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        album: 'YouTube Music',
        duration: 0,
        coverUrl: item.snippet.thumbnails?.high?.url,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        releaseDate: item.snippet.publishedAt,
      }))
    } catch (error) {
      console.error('YouTube Music search error:', error)
      return []
    }
  }

  async getTrackDetails(videoId: string): Promise<Track | null> {
    try {
      const data = await this.request<any>('/videos', {
        id: videoId,
        part: 'snippet,contentDetails,statistics',
      })

      if (!data.items.length) return null

      const item = data.items[0]
      const duration = this.parseDuration(item.contentDetails.duration)

      return {
        id: videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        album: 'YouTube Music',
        duration,
        coverUrl: item.snippet.thumbnails?.high?.url,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        releaseDate: item.snippet.publishedAt,
      }
    } catch (error) {
      console.error('Get track details error:', error)
      return null
    }
  }

  async searchArtists(query: string, maxResults: number = 5): Promise<Artist[]> {
    try {
      const data = await this.request<any>('/search', {
        q: query,
        type: 'channel',
        maxResults,
        part: 'snippet',
      })

      return data.items.map((item: any) => ({
        id: item.id.channelId,
        name: item.snippet.title,
        image: item.snippet.thumbnails?.high?.url,
        bio: item.snippet.description,
        externalUrls: {
          youtube: `https://www.youtube.com/channel/${item.id.channelId}`,
        },
      }))
    } catch (error) {
      console.error('Search artists error:', error)
      return []
    }
  }

  async getRelatedTracks(videoId: string, maxResults: number = 5): Promise<Track[]> {
    try {
      const data = await this.request<any>('/search', {
        relatedToVideoId: videoId,
        type: 'video',
        maxResults,
        part: 'snippet',
      })

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        album: 'YouTube Music',
        duration: 0,
        coverUrl: item.snippet.thumbnails?.high?.url,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }))
    } catch (error) {
      console.error('Get related tracks error:', error)
      return []
    }
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 0

    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0

    return hours * 3600 + minutes * 60 + seconds
  }
}

export const youtubeMusicService = new YouTubeMusicService()
