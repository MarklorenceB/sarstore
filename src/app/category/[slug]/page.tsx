'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Store, Plus, Filter, ChevronDown, ChevronLeft, ChevronRight, Leaf, ToggleLeft, ToggleRight } from 'lucide-react'
import { BottomTabNav, Header, Footer } from '@/components/layout'
import { CartDrawer } from '@/components/cart'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { getCategoryBySlug, getProducts } from '@/lib/api'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants'
import { PRODUCT_IMAGES } from '@/lib/product-images'
import { formatPrice } from '@/lib/utils'
import { useCartItemCount, useCartStore } from '@/store/cart'
import type { Product, Category } from '@/types'

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
]

const BADGE_STYLES: Record<string, string> = {
  sale: 'bg-red-500 text-white',
  hot: 'bg-orange-500 text-white',
  fresh: 'bg-green-500 text-white',
  new: 'bg-blue-500 text-white',
  popular: 'bg-purple-500 text-white',
  'best-seller': 'bg-yellow-500 text-white',
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [organicOnly, setOrganicOnly] = useState(false)
  const [priceRange, setPriceRange] = useState(1000)
  const [currentPage, setCurrentPage] = useState(1)

  const cartItemCount = useCartItemCount()
  const { addItem, openCart } = useCartStore()

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

  const getProductImage = (product: Product) => {
    if (PRODUCT_IMAGES[product.slug]) return PRODUCT_IMAGES[product.slug]
    if (product.image_url) return product.image_url
    return null
  }

  const totalPages = Math.max(1, Math.ceil(products.length / 12))

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Glass Morphism Header - Mobile Only */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 md:hidden">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">Sari-Store</span>
          </Link>
          <button
            onClick={openCart}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary-500 text-white text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="pt-14 pb-24 md:pt-20 md:pb-0">
        {/* Desktop: Two-column layout wrapper */}
        <div className="md:max-w-7xl md:mx-auto md:px-6 md:flex md:gap-8 md:py-8">

          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-4">Categories</h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-3 w-full"
                      >
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          cat.slug === slug
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 group-hover:border-green-400'
                        }`}>
                          {cat.slug === slug && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm text-gray-600">{cat.icon}</span>
                        <span className={`text-sm ${cat.slug === slug ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {cat.name}
                        </span>
                      </Link>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-4">Price Range</h3>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>&#8369;0</span>
                  <span>&#8369;1,000+</span>
                </div>
              </div>

              {/* Organic Toggle */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">Organic Only</span>
                  </div>
                  <button
                    onClick={() => setOrganicOnly(!organicOnly)}
                    className="text-green-600"
                  >
                    {organicOnly ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-4">Availability</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white">
                    In Stock
                  </button>
                  <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-green-50 transition-colors">
                    On Sale
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow min-w-0">
            {/* Editorial Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 pt-8 pb-6 md:px-0 md:pt-0 md:pb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{categoryIcon}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl md:font-extrabold md:tracking-tighter">
                {category?.name || 'Category'}
              </h1>
              <p className="mt-2 text-gray-500 text-base">
                {category?.description || `${products.length} products available`}
              </p>

              {/* Desktop: Showing count + Sort dropdown */}
              <div className="hidden md:flex md:items-center md:justify-between md:mt-4 md:pt-4 md:border-t md:border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{products.length}</span> fresh items
                </p>
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-green-300 transition-colors"
                  >
                    Sort: {sortOptions.find((o) => o.value === sortBy)?.label || 'Popular'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setShowSortDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            sortBy === option.value ? 'text-green-600 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Filter & Sort Bar - Sticky - Mobile Only */}
            <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 md:hidden">
              <div className="flex items-center gap-3 px-5 py-3 overflow-x-auto scrollbar-hide">
                {/* Filters Chip */}
                <button className="flex-shrink-0 flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Chip */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700"
                  >
                    Sort: {sortOptions.find((o) => o.value === sortBy)?.label || 'Popular'}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setShowSortDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            sortBy === option.value ? 'text-primary-600 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Pills */}
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      cat.slug === slug
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="px-4 pt-6 md:px-0">
              {isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                  {products.map((product, index) => {
                    const productImage = getProductImage(product)
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col gap-3 group"
                      >
                        {/* Image */}
                        <Link href={`/product/${product.slug}`}>
                          <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
                            {productImage ? (
                              <Image
                                src={productImage}
                                alt={product.name}
                                fill
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl">
                                {product.image_emoji || '📦'}
                              </div>
                            )}
                            {product.badge && (
                              <div
                                className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide md:backdrop-blur-sm ${
                                  BADGE_STYLES[product.badge] || 'bg-gray-800 text-white'
                                }`}
                              >
                                {product.badge}
                              </div>
                            )}
                            {product.discount_percent && product.discount_percent > 0 && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                                -{product.discount_percent}%
                              </div>
                            )}

                            {/* Desktop hover add-to-cart button */}
                            <div className="hidden md:flex absolute inset-x-0 bottom-0 p-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  addItem(product)
                                }}
                                className="w-full signature-gradient text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                              >
                                <Plus className="w-4 h-4" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="px-1">
                          <span className="text-[11px] md:text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                            {category?.name || 'Product'}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-col">
                              <span className="text-lg font-black md:font-extrabold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.old_price && product.old_price > product.price && (
                                <span className="text-xs text-red-400 line-through">
                                  {formatPrice(product.old_price)}
                                </span>
                              )}
                            </div>
                            {/* Mobile add-to-cart button */}
                            <button
                              onClick={() => addItem(product)}
                              className="md:hidden signature-gradient h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <span className="text-6xl mb-4 block">📦</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    This category doesn&apos;t have any products yet.
                  </p>
                  <Link href="/">
                    <button className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors">
                      Browse All Products
                    </button>
                  </Link>
                </motion.div>
              )}

              {/* Load More Button - Mobile Only */}
              {!isLoading && products.length > 0 && (
                <div className="flex justify-center mt-10 mb-4 md:hidden">
                  <button className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors">
                    Load More
                  </button>
                </div>
              )}

              {/* Pagination - Desktop Only */}
              {!isLoading && products.length > 0 && (
                <div className="hidden md:flex items-center justify-center gap-2 mt-12 mb-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        page === currentPage
                          ? 'bg-green-700 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Tab Nav - Mobile Only */}
      <BottomTabNav />
      <CartDrawer />

      {/* Footer - Desktop Only */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
