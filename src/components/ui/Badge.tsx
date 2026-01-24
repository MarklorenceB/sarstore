'use client'

import { cn } from '@/lib/utils'
import type { ProductBadge } from '@/types'

interface BadgeProps {
  variant?: ProductBadge | 'default'
  children: React.ReactNode
  className?: string
}

const badgeStyles: Record<string, string> = {
  sale: 'bg-red-100 text-red-600',
  hot: 'bg-orange-100 text-orange-600',
  fresh: 'bg-green-100 text-green-600',
  new: 'bg-blue-100 text-blue-600',
  popular: 'bg-purple-100 text-purple-600',
  'best-seller': 'bg-yellow-100 text-yellow-700',
  default: 'bg-gray-100 text-gray-600',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        badgeStyles[variant] || badgeStyles.default,
        className
      )}
    >
      {children}
    </span>
  )
}

// Discount Badge (for product cards)
interface DiscountBadgeProps {
  discount: number
  className?: string
}

export function DiscountBadge({ discount, className }: DiscountBadgeProps) {
  return (
    <span
      className={cn(
        'absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg',
        className
      )}
    >
      -{discount}%
    </span>
  )
}
