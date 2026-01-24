'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Truck, Shield, CreditCard, Headphones } from 'lucide-react'
import { STORE_INFO, CATEGORIES, STATS, FEATURES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import { CategoryCard } from '@/components/categories'

interface LandingPageProps {
  onOpenLogin: (mode?: 'login' | 'signup') => void
}

const featureIcons: Record<string, React.ReactNode> = {
  truck: <Truck className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  'credit-card': <CreditCard className="w-8 h-8" />,
  headphones: <Headphones className="w-8 h-8" />,
}

export default function LandingPage({ onOpenLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🛒</span>
            <div>
              <h1 className="font-bold text-2xl text-primary-600 font-display">
                {STORE_INFO.name}
              </h1>
              <p className="text-xs text-gray-500">{STORE_INFO.tagline}</p>
            </div>
          </div>
          <Button onClick={() => onOpenLogin('login')}>
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              🎉 Free delivery on orders over ₱1,000
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight font-display">
              Fresh Groceries
              <span className="text-primary-500"> Delivered</span> to Your Door
            </h1>
            <p className="text-lg text-gray-600">
              Shop from your favorite local sari-sari store online. Fresh products, 
              great prices, and fast delivery right to your barangay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => onOpenLogin('signup')}
                className="shadow-lg shadow-primary-500/30"
              >
                Start Shopping →
              </Button>
              <Button
                variant="secondary"
                size="lg"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-3xl opacity-20 scale-75" />
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                {['🥬', '🍅', '🥕', '🥚', '🍗', '🥩', '🍞', '🥛', '🍎'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl cursor-pointer"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                  {featureIcons[feature.icon]}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12 font-display"
          >
            Shop by Category
          </motion.h2>
          <div className="flex overflow-x-auto gap-6 pb-4 justify-center flex-wrap">
            {CATEGORIES.slice(0, 6).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <CategoryCard
                  category={{
                    ...cat,
                    id: `cat-${cat.id}`,
                    sort_order: i,
                    is_active: true,
                    created_at: '',
                    updated_at: '',
                  }}
                  onClick={() => onOpenLogin('signup')}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={() => onOpenLogin('signup')}>
              View All Categories →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
              Ready to Start Shopping?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Join thousands of happy customers who trust Sari-Store for their daily grocery needs.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onOpenLogin('signup')}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Create Free Account →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-xl text-primary-600">{STORE_INFO.name}</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
