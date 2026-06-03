'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Play, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import MiniPlayer from '@/components/player/MiniPlayer';

interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  duration: number;
}

export default function LibraryPage() {
  const [likedTracks, setLikedTracks] = useState<LibraryTrack[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists'>('liked');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      const [libRes, playlistRes] = await Promise.all([
        fetch('/api/library'),
        fetch('/api/playlists')
      ]);

      const libData = await libRes.json();
      const playlistData = await playlistRes.json();

      if (libData.library?.liked_track_ids) {
        // Load liked tracks from IDs
        setLikedTracks([]);
      }

      setPlaylists(playlistData.playlists || []);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-background text-text-primary pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 glass-card backdrop-blur-xl border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gradient">Your Library</h1>
              <p className="text-sm text-text-secondary mt-1">Your saved music and playlists</p>
            </div>
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-28">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('liked')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'liked'
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Liked Songs
            {activeTab === 'liked' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t"
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('playlists')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'playlists'
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Playlists
            {activeTab === 'playlists' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t"
              />
            )}
          </motion.button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                <div className="h-40 bg-tertiary rounded-lg mb-4" />
                <div className="h-4 bg-tertiary rounded mb-2" />
                <div className="h-3 bg-tertiary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : activeTab === 'liked' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {likedTracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                  <Heart size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No liked songs yet</h3>
                <p className="text-text-secondary">Start liking songs to see them here</p>
              </div>
            ) : (
              likedTracks.map((track) => (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="glass-card p-4 rounded-lg flex items-center gap-4 group cursor-pointer hover:shadow-xl transition-all"
                >
                  <img
                    src={track.coverUrl || '/placeholder-album.png'}
                    alt={track.title}
                    className="w-14 h-14 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{track.title}</p>
                    <p className="text-sm text-text-secondary truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-text-secondary">{Math.floor(track.duration / 60)}:00</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 hover:bg-accent/20 rounded-lg text-text-secondary hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Play size={20} fill="currentColor" />
                  </motion.button>
                  <button className="p-2 hover:bg-tertiary rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-text-secondary" />
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center col-span-full py-16 text-center">
                <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                  <Music size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                <p className="text-text-secondary">Create your first playlist to get started</p>
              </div>
            ) : (
              playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-accent/20 to-green-400/20 flex items-center justify-center">
                    {playlist.image_url ? (
                      <img
                        src={playlist.image_url}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Music size={64} className="text-accent/50" />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play size={24} className="text-background fill-background ml-0.5" />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-text-primary truncate mb-1">{playlist.title}</h4>
                    {playlist.description && (
                      <p className="text-sm text-text-secondary truncate">{playlist.description}</p>
                    )}
                    <p className="text-xs text-text-secondary/50 mt-2">Playlist • {playlist.is_public ? 'Public' : 'Private'}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </main>

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}
