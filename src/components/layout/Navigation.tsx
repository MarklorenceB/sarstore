'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { STORE_INFO } from '@/lib/constants'
import { Button } from '@/components/ui'

interface NavigationProps {
  onLogin?: () => void
}

export default function Navigation({ onLogin }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛒</span>
          <div>
            <Link href="/" className="font-bold text-2xl text-primary-600 font-display">
              {STORE_INFO.name}
            </Link>
            <p className="text-xs text-gray-500">{STORE_INFO.tagline}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</Link>
          <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Products</Link>
          <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">About</Link>
          <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {onLogin && <Button onClick={onLogin}>Login</Button>}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="min-h-[44px] flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">Home</Link>
            <Link href="/products" className="min-h-[44px] flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">Products</Link>
            <Link href="/about" className="min-h-[44px] flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">About</Link>
            <Link href="/contact" className="min-h-[44px] flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
