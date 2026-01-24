'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface HeroBannerProps {
  onSubscribe?: (email: string) => void
}

export default function HeroBanner({ onSubscribe }: HeroBannerProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    if (onSubscribe && email) {
      onSubscribe(email)
    }
  }

  return (
    <section className="bg-gradient-to-r from-primary-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-display">
              Don't miss our daily
              <span className="text-primary-600"> amazing deals.</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Save up to 60% off on your first order
            </p>
            
            {/* Email Subscribe Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md pt-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </motion.div>

          {/* Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Background Circle */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
              
              {/* Product Grid */}
              <div className="relative grid grid-cols-2 gap-4">
                {['🥬', '🍊', '🥕', '🍅'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
