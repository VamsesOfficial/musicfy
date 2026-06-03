'use client'

import { motion } from 'framer-motion'

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Section Header Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 bg-card rounded-lg animate-shimmer" />

        {/* Track Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              className="space-y-3"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Cover */}
              <div className="w-full aspect-square bg-card rounded-lg animate-shimmer" />

              {/* Title */}
              <div className="h-4 w-full bg-card rounded animate-shimmer" />

              {/* Artist */}
              <div className="h-3 w-3/4 bg-card rounded animate-shimmer" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
