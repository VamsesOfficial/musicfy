'use client'

import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative h-96 px-6 py-12 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent rounded-2xl" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center space-y-6 max-w-2xl">
        <motion.div variants={item} className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-balance text-foreground leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Musicify</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Discover your favorite music, create playlists, and enjoy seamless playback with our premium music platform.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex items-center gap-4 pt-4">
          <button className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-smooth shadow-lg hover:shadow-glow">
            <Play size={20} />
            <span>Start Listening</span>
          </button>

          <button className="flex items-center gap-2 px-8 py-3 bg-card border border-border text-foreground rounded-full font-medium hover:bg-card/80 transition-smooth">
            <span>Explore</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="flex items-center gap-8 pt-8">
          {[
            { label: 'Songs', value: '100M+' },
            { label: 'Artists', value: '10M+' },
            { label: 'Users', value: '500K+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
