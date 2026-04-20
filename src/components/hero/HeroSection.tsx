'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2,
    },
  },
}

const wordVariants = {
  hidden: {
    y: '110%',
    opacity: 0,
    skewY: 8,
  },
  visible: {
    y: '0%',
    opacity: 1,
    skewY: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 1.2,
      ease: 'easeOut',
    },
  },
}

const taglineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 1.3,
    },
  },
}

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ALLROUND */}
        <div className="overflow-hidden relative">
          <motion.h1
            className="text-[clamp(5rem,15vw,14rem)] font-black text-white leading-none tracking-tighter text-center"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            variants={wordVariants}
          >
            ALLROUND
          </motion.h1>
        </div>

        {/* TRAINING */}
        <div className="overflow-hidden relative mt-2">
          <motion.h1
            className="text-[clamp(5rem,15vw,14rem)] font-black text-white/95 leading-none tracking-tighter text-center"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            variants={wordVariants}
          >
            TRAINING
          </motion.h1>
        </div>

        {/* Bottom Line */}
        <motion.div
          className="w-48 h-0.5 bg-white mt-12 origin-left"
          variants={lineVariants}
        />

        {/* Tagline */}
        <motion.p
          className="mt-6 text-sm tracking-widest text-white/60 uppercase"
          variants={taglineVariants}
        >
          All-Around Athletic Training Club
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  )
}
