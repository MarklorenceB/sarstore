'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviews?: number
  size?: 'sm' | 'md' | 'lg'
  showReviews?: boolean
  className?: string
}

export default function StarRating({
  rating,
  reviews,
  size = 'sm',
  showReviews = true,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizes[size],
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - rating < 1 && star - rating > 0
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      {showReviews && reviews !== undefined && (
        <span className="text-xs text-gray-500">({reviews})</span>
      )}
    </div>
  )
}
