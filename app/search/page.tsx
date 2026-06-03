'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Music, Disc3, User } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores/playerStore';
import MiniPlayer from '@/components/player/MiniPlayer';

interface SearchResult {
  tracks?: any[];
  artists?: any[];
  albums?: any[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { playTrack } = usePlayerStore();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({});
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search songs, artists, albums, playlists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-full text-sm placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              autoFocus
            />
            {query && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setQuery('');
                  setResults({});
                  setHasSearched(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-tertiary rounded-lg transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-28">
        {!hasSearched ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-accent to-green-400 rounded-full flex items-center justify-center shadow-2xl">
                <Music size={48} className="text-background" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-black mb-3">Find Your Next Favorite</h2>
            <p className="text-text-secondary text-lg max-w-md">
              Search for songs, artists, albums, and playlists to discover and enjoy music.
            </p>
          </motion.div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                <div className="h-40 bg-tertiary rounded-lg mb-4" />
                <div className="h-4 bg-tertiary rounded mb-2" />
                <div className="h-3 bg-tertiary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Tracks */}
            {results.tracks && results.tracks.length > 0 && (
              <section>
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl font-black mb-6 flex items-center gap-3"
                >
                  <Music size={28} className="text-accent" />
                  Songs
                </motion.h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {results.tracks.slice(0, 8).map((track: any) => (
                    <motion.div
                      key={track.id}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      onClick={() => playTrack(track)}
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
                      <span className="text-xs text-text-secondary">{track.duration}s</span>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Artists */}
            {results.artists && results.artists.length > 0 && (
              <section>
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl font-black mb-6 flex items-center gap-3"
                >
                  <User size={28} className="text-accent" />
                  Artists
                </motion.h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {results.artists.slice(0, 8).map((artist: any) => (
                    <motion.div
                      key={artist.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="glass-card p-6 rounded-xl text-center group cursor-pointer hover:shadow-xl transition-all"
                    >
                      <img
                        src={artist.image_url || '/placeholder-artist.png'}
                        alt={artist.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all"
                      />
                      <h4 className="font-semibold text-text-primary mb-1 truncate">{artist.name}</h4>
                      {artist.followers && (
                        <p className="text-xs text-text-secondary">
                          {(artist.followers / 1000).toFixed(0)}K followers
                        </p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Albums */}
            {results.albums && results.albums.length > 0 && (
              <section>
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl font-black mb-6 flex items-center gap-3"
                >
                  <Disc3 size={28} className="text-accent" />
                  Albums
                </motion.h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {results.albums.slice(0, 8).map((album: any) => (
                    <motion.div
                      key={album.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                    >
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={album.coverUrl || '/placeholder-album.png'}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-text-primary truncate mb-1">{album.title}</h4>
                        <p className="text-sm text-text-secondary truncate">{album.artist}</p>
                        {album.release_date && (
                          <p className="text-xs text-text-secondary/50 mt-2">
                            {new Date(album.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* No Results */}
            {(!results.tracks || results.tracks.length === 0) &&
              (!results.artists || results.artists.length === 0) &&
              (!results.albums || results.albums.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-text-secondary">Try a different search term</p>
                </motion.div>
              )}
          </motion.div>
        )}
      </main>

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}
