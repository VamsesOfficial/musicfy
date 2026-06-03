'use client'

import { motion } from 'framer-motion'
import TrackCard from '@/components/cards/TrackCard'

const mockTracks = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷',
    duration: 234,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Dynamite',
    artist: 'BTS',
    album: 'Be',
    duration: 229,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Sweater Weather',
    artist: 'The Neighborhood',
    album: 'I Love You.',
    duration: 236,
    coverUrl: 'https://images.unsplash.com/photo-1514872087322-7b16e54445df?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 228,
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 173,
    coverUrl: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    title: 'Vampire',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    duration: 238,
    coverUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop',
  },
]

export default function TrendingSection() {
  return (
    <section className="px-6 py-12 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Trending Now</h2>
        <p className="text-muted-foreground">Check out the hottest tracks this week</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TrackCard track={track} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
