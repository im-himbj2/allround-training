'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  whileHover: { scale: 1.02, y: -4 },
  transition: { duration: 0.3 },
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`}>
      <motion.div
        className="group relative border border-white/20 rounded-lg overflow-hidden bg-zinc-900 hover:border-white/40 transition-colors duration-300 cursor-pointer h-full flex flex-col"
        variants={cardVariants}
        initial="initial"
        whileInView="whileInView"
        whileHover="whileHover"
        transition={cardVariants.transition}
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Image Area */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-zinc-800 to-black overflow-hidden flex items-center justify-center">
          {activity.image_url ? (
            <img
              src={activity.image_url}
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-white/20 text-sm">No image</div>
          )}
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-xs font-semibold text-white rounded-full border border-white/20">
              {activity.category}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/80 transition-colors">
            {activity.title}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2 mb-4 flex-1">
            {activity.summary}
          </p>

          {/* Tags */}
          {activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {activity.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-start p-5">
          <p className="text-sm text-white/80">자세히 보기 →</p>
        </div>
      </motion.div>
    </Link>
  )
}
