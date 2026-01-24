'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category | { name: string; icon: string; slug: string; item_count?: number }
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export default function CategoryCard({ category, isActive, onClick, className }: CategoryCardProps) {
  const content = (
    <div className={cn('flex flex-col items-center cursor-pointer group', className)}>
      <div
        className={cn(
          'w-24 h-24 md:w-28 md:h-28 rounded-full',
          'bg-gradient-to-br from-primary-50 to-primary-100',
          'border-2 transition-all duration-300',
          'flex items-center justify-center mb-3',
          'group-hover:shadow-lg group-hover:scale-105',
          isActive
            ? 'border-primary-500 shadow-lg shadow-primary-500/20'
            : 'border-primary-100 group-hover:border-primary-400'
        )}
      >
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </span>
      </div>
      <h3 className={cn(
        'font-semibold text-sm text-center transition-colors',
        isActive ? 'text-primary-600' : 'text-gray-800 group-hover:text-primary-600'
      )}>
        {category.name}
      </h3>
      {category.item_count !== undefined && (
        <p className="text-xs text-gray-400">{category.item_count} items</p>
      )}
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="flex-shrink-0">
        {content}
      </button>
    )
  }

  return (
    <Link href={`/category/${category.slug}`} className="flex-shrink-0">
      {content}
    </Link>
  )
}

// Category Bar - horizontal scrolling list of categories
interface CategoryBarProps {
  categories: Array<Category | { name: string; icon: string; slug: string; item_count?: number }>
  activeCategory?: string | null
  onCategoryChange?: (slug: string | null) => void
  className?: string
}

export function CategoryBar({ categories, activeCategory, onCategoryChange, className }: CategoryBarProps) {
  return (
    <div className={cn('flex overflow-x-auto gap-6 pb-4 scrollbar-hide', className)}>
      {categories.map((category) => (
        <CategoryCard
          key={category.slug}
          category={category}
          isActive={activeCategory === category.slug}
          onClick={onCategoryChange ? () => onCategoryChange(category.slug) : undefined}
        />
      ))}
    </div>
  )
}
