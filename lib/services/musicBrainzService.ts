import axios from 'axios'
import type { Track, Artist, Album } from '../types'

interface MusicBrainzArtist {
  id: string
  name: string
  type?: string
  'life-span'?: {
    begin?: string
    end?: string
    ended?: boolean
  }
  relations?: any[]
}

interface MusicBrainzRecording {
  id: string
  title: string
  length?: number
  'release-group-primary-type'?: string
  'first-release-date'?: string
  artists?: MusicBrainzArtist[]
  releases?: Array<{
    id: string
    title: string
    date?: string
    'cover-front'?: boolean
  }>
}

interface MusicBrainzRelease {
  id: string
  title: string
  date?: string
  media?: Array<{
    tracks: Array<{
      id: string
      position: number
      title: string
      length?: number
    }>
  }>
}

class MusicBrainzService {
  private baseURL = 'https://musicbrainz.org/ws/2'
  private userAgent = 'Musicify/1.0 (https://musicify.vercel.app)'

  async searchArtist(artistName: string): Promise<Artist | null> {
    try {
      const response = await axios.get<{ artists: MusicBrainzArtist[] }>(
        `${this.baseURL}/artist`,
        {
          params: {
            query: `artist:"${artistName}"`,
            limit: 1,
            fmt: 'json',
          },
          headers: { 'User-Agent': this.userAgent },
        }
      )

      if (!response.data.artists.length) return null

      const artist = response.data.artists[0]
      return {
        id: artist.id,
        name: artist.name,
        bio: `Artist from MusicBrainz`,
        genres: [],
      }
    } catch (error) {
      console.error('MusicBrainz search artist error:', error)
      return null
    }
  }

  async searchRecording(trackTitle: string, artistName?: string): Promise<Track | null> {
    try {
      let query = `recording:"${trackTitle}"`
      if (artistName) {
        query += ` AND artist:"${artistName}"`
      }

      const response = await axios.get<{ recordings: MusicBrainzRecording[] }>(
        `${this.baseURL}/recording`,
        {
          params: {
            query,
            limit: 1,
            fmt: 'json',
          },
          headers: { 'User-Agent': this.userAgent },
        }
      )

      if (!response.data.recordings.length) return null

      const recording = response.data.recordings[0]
      const artist = recording.artists?.[0]?.name || 'Unknown Artist'

      return {
        id: recording.id,
        title: recording.title,
        artist,
        album: recording.releases?.[0]?.title || 'Unknown Album',
        duration: recording.length ? Math.floor(recording.length / 1000) : 0,
        releaseDate: recording['first-release-date'],
        isrc: recording.id,
      }
    } catch (error) {
      console.error('MusicBrainz search recording error:', error)
      return null
    }
  }

  async searchRelease(albumTitle: string, artistName?: string): Promise<Album | null> {
    try {
      let query = `release:"${albumTitle}"`
      if (artistName) {
        query += ` AND artist:"${artistName}"`
      }

      const response = await axios.get<{ releases: MusicBrainzRelease[] }>(
        `${this.baseURL}/release`,
        {
          params: {
            query,
            limit: 1,
            fmt: 'json',
          },
          headers: { 'User-Agent': this.userAgent },
        }
      )

      if (!response.data.releases.length) return null

      const release = response.data.releases[0]
      const totalTracks = release.media?.reduce(
        (acc, media) => acc + media.tracks.length,
        0
      ) || 0

      return {
        id: release.id,
        title: release.title,
        artist: artistName || 'Unknown Artist',
        releaseDate: release.date,
        totalTracks,
      }
    } catch (error) {
      console.error('MusicBrainz search release error:', error)
      return null
    }
  }

  async getArtistInfo(mbid: string): Promise<Partial<Artist> | null> {
    try {
      const response = await axios.get<MusicBrainzArtist>(
        `${this.baseURL}/artist/${mbid}`,
        {
          params: {
            fmt: 'json',
            inc: 'url-rels',
          },
          headers: { 'User-Agent': this.userAgent },
        }
      )

      return {
        id: response.data.id,
        name: response.data.name,
        bio: `Artist information from MusicBrainz`,
      }
    } catch (error) {
      console.error('Get artist info error:', error)
      return null
    }
  }

  async getReleaseInfo(mbid: string): Promise<Partial<Album> | null> {
    try {
      const response = await axios.get<MusicBrainzRelease>(
        `${this.baseURL}/release/${mbid}`,
        {
          params: {
            fmt: 'json',
            inc: 'recordings',
          },
          headers: { 'User-Agent': this.userAgent },
        }
      )

      const totalTracks = response.data.media?.reduce(
        (acc, media) => acc + media.tracks.length,
        0
      ) || 0

      return {
        id: response.data.id,
        title: response.data.title,
        releaseDate: response.data.date,
        totalTracks,
      }
    } catch (error) {
      console.error('Get release info error:', error)
      return null
    }
  }
}

export const musicBrainzService = new MusicBrainzService()
