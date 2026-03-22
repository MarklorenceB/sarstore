'use client'

import { motion } from 'framer-motion'
import { HOMEPAGE_STATS } from '@/lib/constants'

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {HOMEPAGE_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <p className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</p>
              <p className="text-primary-100 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
