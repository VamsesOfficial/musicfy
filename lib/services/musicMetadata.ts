import axios from 'axios';
import { Track, Artist, Album } from '@/lib/types';

const YOUTUBE_MUSIC_API = 'https://www.youtube.com/youtubei/v1';
const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2';
const LRCLIB_API = 'https://lrclib.net/api';
const COVER_ART_API = 'https://coverartarchive.org';

// YouTube Music Search
export async function searchYouTubeMusic(query: string) {
  try {
    // Using public YouTube search endpoints
    const response = await axios.get(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('YouTube Music search error:', error);
    return null;
  }
}

// MusicBrainz Search - Track info and metadata
export async function searchMusicBrainz(query: string, type: 'recording' | 'artist' | 'release' = 'recording') {
  try {
    const response = await axios.get(`${MUSICBRAINZ_API}/${type}`, {
      params: {
        query,
        fmt: 'json',
        limit: 10
      },
      headers: {
        'User-Agent': 'Musicify/1.0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('MusicBrainz search error:', error);
    return null;
  }
}

// Get lyrics from LRCLIB
export async function getLyrics(trackName: string, artistName: string) {
  try {
    const response = await axios.get(`${LRCLIB_API}/get`, {
      params: {
        track_name: trackName,
        artist_name: artistName
      }
    });
    return response.data;
  } catch (error) {
    console.error('LRCLIB error:', error);
    return null;
  }
}

// Get cover art
export async function getCoverArt(mbid: string) {
  try {
    const response = await axios.get(`${COVER_ART_API}/release/${mbid}/front-250.jpg`);
    return response.config.url;
  } catch (error) {
    console.error('Cover art error:', error);
    return null;
  }
}

// Search Spotify for better metadata (if API key available)
export async function searchSpotify(query: string, type: 'track' | 'artist' | 'album' = 'track') {
  try {
    const token = process.env.SPOTIFY_API_TOKEN;
    if (!token) return null;

    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type,
        limit: 10
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Spotify search error:', error);
    return null;
  }
}

// Get track recommendations (related tracks)
export async function getRelatedTracks(trackId: string) {
  try {
    const token = process.env.SPOTIFY_API_TOKEN;
    if (!token) return null;

    const response = await axios.get(`https://api.spotify.com/v1/recommendations`, {
      params: {
        seed_tracks: trackId,
        limit: 20
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data?.tracks || [];
  } catch (error) {
    console.error('Related tracks error:', error);
    return null;
  }
}

// Get artist info
export async function getArtistInfo(artistName: string) {
  try {
    const token = process.env.SPOTIFY_API_TOKEN;
    if (!token) return null;

    // First search for the artist
    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: artistName,
        type: 'artist',
        limit: 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (searchResponse.data?.artists?.items?.[0]) {
      const artist = searchResponse.data.artists.items[0];
      return {
        id: artist.id,
        name: artist.name,
        image_url: artist.images?.[0]?.url,
        followers: artist.followers?.total,
        genres: artist.genres,
        spotify_url: artist.external_urls?.spotify
      };
    }
    return null;
  } catch (error) {
    console.error('Artist info error:', error);
    return null;
  }
}
