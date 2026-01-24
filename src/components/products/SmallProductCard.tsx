'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { StarRating } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface SmallProductCardProps {
  product: Product
  className?: string
}

export default function SmallProductCard({ product, className = '' }: SmallProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} added!`, { icon: '🛒', duration: 1500 })
  }

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`group ${className}`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
      >
        {/* Image */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-2xl sm:text-3xl">{product.image_emoji || '📦'}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
            {product.name}
          </h4>
          {product.rating && (
            <StarRating rating={product.rating} reviews={product.review_count} size="sm" />
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-primary-600 text-sm">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </Link>
    </motion.div>
  )
}
