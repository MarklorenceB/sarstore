'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { TopBar, Header, Footer } from '@/components/layout'
import { ProductGrid } from '@/components/products'
import { CategoryCard } from '@/components/categories'
import { CartDrawer } from '@/components/cart'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { getCategoryBySlug, getProducts } from '@/lib/api'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants'
import type { Product, Category } from '@/types'

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [categoryData, productsData] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts({ categorySlug: slug, sortBy }),
        ])
        setCategory(categoryData)
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading category:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [slug, sortBy])

  const categoryIcon = CATEGORY_ICONS[slug] || '📦'

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-primary-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category?.name || 'Loading...'}</span>
        </motion.div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl">
              {categoryIcon}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{category?.name || 'Category'}</h1>
              <p className="text-primary-100">
                {products.length} products available
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Sidebar (Horizontal on Mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Browse Categories</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  cat.slug === slug
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="font-medium text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
              >
                Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        sortBy === option.value ? 'text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              This category doesn't have any products yet.
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors">
                Browse All Products
              </button>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
