import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* Type-safe queries */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url?: string
          bio?: string
          created_at: string
          updated_at: string
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          artist: string
          artist_id?: string
          album: string
          album_id?: string
          duration: number
          cover_url?: string
          spotify_url?: string
          youtube_url?: string
          preview_url?: string
          isrc?: string
          release_date?: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
