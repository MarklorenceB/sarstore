'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Badge, DiscountBadge, StarRating } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  
  const cartItems = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  
  const cartItem = cartItems.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity || 0
  const isInCart = quantity > 0

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem(product)
    setJustAdded(true)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    })
    setTimeout(() => setJustAdded(false), 1500)
  }

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1)
    } else {
      handleAddToCart()
    }
  }

  const handleDecrement = () => {
    if (quantity === 1) {
      // Show confirmation toast before removing
      toast((t) => (
        <div className="flex items-center gap-3">
          <span>Remove {product.name}?</span>
          <button
            onClick={() => {
              if (cartItem) {
                removeItem(cartItem.id)
                toast.dismiss(t.id)
                toast.success('Removed from cart', { icon: '🗑️', duration: 1500 })
              }
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ), { duration: 5000 })
    } else if (cartItem) {
      updateQuantity(cartItem.id, quantity - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative p-3 sm:p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.badge && <Badge variant={product.badge}>{product.badge}</Badge>}
          {discount > 0 && <DiscountBadge discount={discount} />}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl sm:text-5xl md:text-6xl">
                {product.image_emoji || '📦'}
              </span>
            )}
          </div>
        </Link>

        {/* Out of Stock Overlay */}
        {!product.is_available && (
          <div className="absolute inset-3 sm:inset-4 bg-black/50 rounded-xl flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 pt-0 flex-1 flex flex-col">
        {/* Unit */}
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
          {product.unit}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-primary-600 transition-colors mb-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="mb-2">
            <StarRating rating={product.rating} reviews={product.review_count} size="sm" />
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Section */}
          {product.is_available !== false && (
            <div className="w-full">
              {isInCart ? (
                /* Quantity Controls */
                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={handleDecrement}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="font-bold text-gray-900 text-base sm:text-lg min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                /* Add to Cart Button */
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-10 sm:h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/20'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
