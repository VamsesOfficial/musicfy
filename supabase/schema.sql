-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  premium_tier VARCHAR(50) DEFAULT 'free' CHECK (premium_tier IN ('free', 'pro', 'family')),
  private_session BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mbid VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  bio TEXT,
  monthly_listeners INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  genres TEXT[],
  external_urls JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mbid VARCHAR(255) UNIQUE,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  coverUrl TEXT,
  release_date DATE,
  total_tracks INTEGER DEFAULT 0,
  genres TEXT[],
  label VARCHAR(255),
  external_urls JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id VARCHAR(255) UNIQUE,
  mbid VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  coverUrl TEXT,
  preview_url TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  isrc VARCHAR(255),
  release_date DATE,
  genres TEXT[],
  explicit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  track_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist tracks (junction table)
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

-- User library (liked songs, favorites)
CREATE TABLE IF NOT EXISTS user_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  library_type VARCHAR(50) NOT NULL CHECK (library_type IN ('liked', 'favorite', 'playlist', 'album', 'artist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id, library_type)
);

-- Listening history table
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER,
  completion_percentage DECIMAL(5, 2),
  session_id VARCHAR(255)
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seed_track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  reason VARCHAR(255),
  score DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lyrics table
CREATE TABLE IF NOT EXISTS lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  synced_lyrics JSONB NOT NULL,
  plain_lyrics TEXT,
  language VARCHAR(10),
  synced BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(track_id)
);

-- Playback sessions table
CREATE TABLE IF NOT EXISTS playback_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  progress INTEGER,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  theme VARCHAR(50) DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  language VARCHAR(10) DEFAULT 'en',
  audio_quality VARCHAR(50) DEFAULT 'normal' CHECK (audio_quality IN ('low', 'normal', 'high', 'lossless')),
  autoplay BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  private_session BOOLEAN DEFAULT FALSE,
  crossfade_duration INTEGER DEFAULT 0,
  gapless_playback BOOLEAN DEFAULT TRUE,
  normalize_audio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_albums_artist_id ON albums(artist_id);
CREATE INDEX idx_playlists_owner_id ON playlists(owner_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX idx_user_library_user_id ON user_library(user_id);
CREATE INDEX idx_user_library_track_id ON user_library(track_id);
CREATE INDEX idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX idx_listening_history_track_id ON listening_history(track_id);
CREATE INDEX idx_listening_history_played_at ON listening_history(played_at);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_track_id ON recommendations(track_id);
CREATE INDEX idx_lyrics_track_id ON lyrics(track_id);
CREATE INDEX idx_tracks_youtube_id ON tracks(youtube_id);

-- Full-text search indexes
CREATE INDEX idx_tracks_title_fts ON tracks USING GIN(to_tsvector('english', title));
CREATE INDEX idx_artists_name_fts ON artists USING GIN(to_tsvector('english', name));
CREATE INDEX idx_albums_title_fts ON albums USING GIN(to_tsvector('english', title));
CREATE INDEX idx_playlists_title_fts ON playlists USING GIN(to_tsvector('english', title));

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Public playlists visible to all, private only to owner
CREATE POLICY "playlists_select" ON playlists
  FOR SELECT USING (is_public OR owner_id::text = auth.uid()::text);

-- Users can only modify their own playlists
CREATE POLICY "playlists_update" ON playlists
  FOR UPDATE USING (owner_id::text = auth.uid()::text);

CREATE POLICY "playlists_delete" ON playlists
  FOR DELETE USING (owner_id::text = auth.uid()::text);

-- Users can only view their own library
CREATE POLICY "user_library_select" ON user_library
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "user_library_insert" ON user_library
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "user_library_delete" ON user_library
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Users can only view their own favorites
CREATE POLICY "user_favorites_select" ON user_favorites
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "user_favorites_insert" ON user_favorites
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "user_favorites_delete" ON user_favorites
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Users can only view/modify their own settings
CREATE POLICY "user_settings_select" ON user_settings
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "user_settings_update" ON user_settings
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Users can only view their own listening history
CREATE POLICY "listening_history_select" ON listening_history
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "listening_history_insert" ON listening_history
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);
