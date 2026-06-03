import axios from 'axios'

interface CoverArtImage {
  approved: boolean
  back: boolean
  comment: string
  edit: number
  front: boolean
  id: number
  image: string
  thumbnails: {
    large: string
    small: string
  }
  types: string[]
}

interface CoverArtResponse {
  images: CoverArtImage[]
  release: string
}

class CoverArtService {
  private baseURL = 'https://coverartarchive.org'

  async getCoverByMBID(mbid: string): Promise<string | null> {
    try {
      const response = await axios.get<CoverArtResponse>(
        `${this.baseURL}/release/${mbid}`,
        {
          headers: { 'User-Agent': 'Musicify/1.0' },
        }
      )

      const frontCover = response.data.images.find(img => img.front)
      return frontCover?.image || response.data.images[0]?.image || null
    } catch (error) {
      console.error('Get cover by MBID error:', error)
      return null
    }
  }

  async getCoverThumbnail(mbid: string, size: 'small' | 'large' = 'large'): Promise<string | null> {
    try {
      const response = await axios.get<CoverArtResponse>(
        `${this.baseURL}/release/${mbid}`,
        {
          headers: { 'User-Agent': 'Musicify/1.0' },
        }
      )

      const frontCover = response.data.images.find(img => img.front)
      const cover = frontCover || response.data.images[0]

      if (!cover) return null

      return size === 'small' ? cover.thumbnails.small : cover.thumbnails.large
    } catch (error) {
      console.error('Get cover thumbnail error:', error)
      return null
    }
  }

  async getAllCovers(mbid: string): Promise<CoverArtImage[]> {
    try {
      const response = await axios.get<CoverArtResponse>(
        `${this.baseURL}/release/${mbid}`,
        {
          headers: { 'User-Agent': 'Musicify/1.0' },
        }
      )

      return response.data.images
    } catch (error) {
      console.error('Get all covers error:', error)
      return []
    }
  }

  async getFrontCover(mbid: string): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/release/${mbid}/front`,
        {
          headers: { 'User-Agent': 'Musicify/1.0' },
          responseType: 'arraybuffer',
        }
      )

      return Buffer.from(response.data, 'binary').toString('base64')
    } catch (error) {
      console.error('Get front cover error:', error)
      return null
    }
  }
}

export const coverArtService = new CoverArtService()
