'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react'
import { TopBar, Header, Footer } from '@/components/layout'
import { ProductGrid } from '@/components/products'
import { CartDrawer } from '@/components/cart'
import { Button, Input } from '@/components/ui'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { searchProducts } from '@/lib/api'
import { debounce } from '@/lib/utils'
import type { Product } from '@/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setHasSearched(false)
        return
      }

      setIsLoading(true)
      setHasSearched(true)

      try {
        const products = await searchProducts(searchQuery)
        setResults(products)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery, performSearch])

  const handleSearch = (value: string) => {
    setQuery(value)
    performSearch(value)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Quick Suggestions */}
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Rice', 'Eggs', 'Cooking Oil', 'Chicken', 'Milk', 'Bread'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : hasSearched ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {results.length > 0 ? (
                  <>
                    Found <span className="font-semibold text-gray-900">{results.length}</span> results
                    for "<span className="font-semibold text-gray-900">{query}</span>"
                  </>
                ) : (
                  <>No results found for "<span className="font-semibold">{query}</span>"</>
                )}
              </p>
              {results.length > 0 && (
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <ProductGrid products={results} columns={4} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your search. Try different keywords or browse our categories.
                </p>
                <Link href="/">
                  <Button>Browse Products</Button>
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <span className="text-6xl mb-4 block">🛒</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-500">
              Type something to search for products
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block animate-bounce">🔍</span>
          <p className="text-gray-500">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
