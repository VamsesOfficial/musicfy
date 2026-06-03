import axios from 'axios'
import type { SyncedLyrics, Lyric } from '../types'

interface LRCLIBResponse {
  name: string
  artist: {
    name: string
  }
  album: {
    name: string
  }
  duration: number
  instrumental: boolean
  plainLyrics: string
  syncedLyrics: string
}

class LyricsService {
  private baseURL = 'https://lrclib.net/api'

  async getLyrics(artistName: string, trackTitle: string, albumName?: string): Promise<SyncedLyrics | null> {
    try {
      const params = new URLSearchParams({
        artist_name: artistName,
        track_name: trackTitle,
        ...(albumName && { album_name: albumName }),
      })

      const response = await axios.get<LRCLIBResponse>(
        `${this.baseURL}/get?${params}`,
        {
          headers: {
            'User-Agent': 'Musicify/1.0',
          },
        }
      )

      if (!response.data) return null

      const lyrics = this.parseSyncedLyrics(response.data.syncedLyrics)

      return {
        trackId: `${artistName}-${trackTitle}`.toLowerCase().replace(/\s+/g, '-'),
        lyrics,
        synced: true,
        language: 'en',
      }
    } catch (error) {
      console.error('Get lyrics error:', error)
      return null
    }
  }

  async searchLyrics(query: string): Promise<SyncedLyrics[]> {
    try {
      const response = await axios.get<LRCLIBResponse[]>(
        `${this.baseURL}/search`,
        {
          params: { q: query },
          headers: {
            'User-Agent': 'Musicify/1.0',
          },
        }
      )

      return response.data
        .filter(item => item.syncedLyrics)
        .map(item => ({
          trackId: `${item.artist.name}-${item.name}`.toLowerCase().replace(/\s+/g, '-'),
          lyrics: this.parseSyncedLyrics(item.syncedLyrics),
          synced: true,
          language: 'en',
        }))
    } catch (error) {
      console.error('Search lyrics error:', error)
      return []
    }
  }

  private parseSyncedLyrics(lrcString: string): Lyric[] {
    if (!lrcString) return []

    const lines = lrcString.split('\n')
    const lyrics: Lyric[] = []

    lines.forEach(line => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.+)/)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const centiseconds = parseInt(match[3])
        const timestamp = minutes * 60 + seconds + centiseconds / 100

        lyrics.push({
          timestamp,
          text: match[4].trim(),
        })
      }
    })

    return lyrics
  }

  formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const centiseconds = Math.floor((seconds % 1) * 100)

    return `[${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`
  }

  getCurrentLyric(lyrics: Lyric[], currentTime: number): Lyric | null {
    let currentLyric: Lyric | null = null

    for (const lyric of lyrics) {
      if (lyric.timestamp <= currentTime) {
        currentLyric = lyric
      } else {
        break
      }
    }

    return currentLyric
  }

  getNextLyric(lyrics: Lyric[], currentTime: number): Lyric | null {
    for (const lyric of lyrics) {
      if (lyric.timestamp > currentTime) {
        return lyric
      }
    }

    return null
  }
}

export const lyricsService = new LyricsService()
