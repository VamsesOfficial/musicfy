'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, PlayCircle, Heart, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import MiniPlayer from '@/components/player/MiniPlayer';

const FEATURED_PLAYLISTS = [
  { id: '1', title: 'Summer Vibes', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', description: 'Feel the summer energy' },
  { id: '2', title: 'Focus Beats', cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400', description: 'Deep concentration mode' },
  { id: '3', title: 'Late Night', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', description: 'Chill evening playlist' },
  { id: '4', title: 'Workout Mix', cover: 'https://images.unsplash.com/photo-1498038432885-96d35ce61db0?w=400', description: 'Get pumped up' },
];

const TRENDING_TRACKS = Array.from({ length: 8 }, (_, i) => ({
  id: `track-${i}`,
  title: `Track Title ${i + 1}`,
  artist: `Artist Name ${i + 1}`,
  cover: `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80`
}));

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-card text-foreground">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-30 glass border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-gradient">
              Musicify
            </h1>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                Search
              </Link>
              <Link href="/library" className="text-sm font-medium hover:text-primary transition-colors">
                Library
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search songs, artists, playlists..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-full text-sm placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="glass-lg rounded-2xl p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-black mb-4 text-gradient"
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-muted max-w-2xl"
                >
                  Discover new music, create playlists, and enjoy seamless streaming with Musicify.
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary to-green-400 rounded-full font-semibold text-primary-foreground hover:shadow-lg transition-all mt-8"
                >
                  <PlayCircle size={20} />
                  Start Playing
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* Featured Playlists */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <h3 className="text-2xl font-black mb-6 text-foreground">Featured Playlists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_PLAYLISTS.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass rounded-xl overflow-hidden group cursor-pointer transition-all hover:shadow-premium"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PlayCircle size={24} className="text-primary-foreground fill-primary-foreground" />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground truncate">{playlist.title}</h4>
                    <p className="text-sm text-muted truncate">{playlist.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Trending Now */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <h3 className="text-2xl font-black mb-6 text-foreground">Trending Now</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRENDING_TRACKS.map((track) => (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="glass p-4 rounded-lg group cursor-pointer transition-all hover:shadow-premium"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover shadow-lg group-hover:shadow-glow transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors ml-auto"
                    >
                      <PlayCircle size={24} className="fill-current" />
                    </motion.button>
                  </div>
                  <h4 className="font-semibold text-foreground truncate text-sm">{track.title}</h4>
                  <p className="text-xs text-muted truncate">{track.artist}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Recently Played */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-black mb-6 text-foreground">Recently Played</h3>
            <div className="space-y-3">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="glass p-4 rounded-lg flex items-center gap-4 group cursor-pointer hover:shadow-premium transition-all"
                >
                  <img
                    src={TRENDING_TRACKS[i % TRENDING_TRACKS.length].cover}
                    alt="Track"
                    className="w-14 h-14 rounded-lg object-cover shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">Track Title {i + 1}</p>
                    <p className="text-sm text-muted truncate">Artist Name {i + 1}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart size={20} />
                    </motion.button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}
