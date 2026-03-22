"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORY_IMAGES } from "@/lib/product-images";
import type { Category } from "@/types";

interface CategoryCardProps {
  category:
    | Category
    | { name: string; icon: string; slug: string; item_count?: number };
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CategoryCard({
  category,
  isActive,
  onClick,
  className,
}: CategoryCardProps) {
  const categoryImage = CATEGORY_IMAGES[category.slug] || null;

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center cursor-pointer group min-h-[120px] p-4",
        className,
      )}
    >
      <div
        className={cn(
          "w-28 h-28 md:w-32 md:h-32 rounded-full",
          "border-2 transition-all duration-300 overflow-hidden",
          "flex items-center justify-center mb-3",
          "group-hover:shadow-lg group-hover:scale-105",
          categoryImage
            ? "bg-white p-1.5"
            : "bg-gradient-to-br from-primary-50 to-primary-100",
          isActive
            ? "border-primary-500 shadow-lg shadow-primary-500/20"
            : "border-primary-100 group-hover:border-primary-400",
        )}
      >
        {categoryImage ? (
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
            <img
              src={categoryImage}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </span>
        )}
      </div>
      <h3
        className={cn(
          "font-semibold text-sm md:text-base text-center transition-colors mt-1",
          isActive
            ? "text-primary-600"
            : "text-gray-800 group-hover:text-primary-600",
        )}
      >
        {category.name}
      </h3>
      {category.item_count !== undefined && (
        <p className="text-xs text-gray-400">{category.item_count} items</p>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="flex-shrink-0">
        {content}
      </button>
    );
  }

  return (
    <Link href={`/category/${category.slug}`} className="flex-shrink-0">
      {content}
    </Link>
  );
}

// Category Bar - horizontal scrolling list of categories
interface CategoryBarProps {
  categories: Array<
    Category | { name: string; icon: string; slug: string; item_count?: number }
  >;
  activeCategory?: string | null;
  onCategoryChange?: (slug: string | null) => void;
  className?: string;
}

export function CategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryBarProps) {
  return (
    <div
      className={cn(
        "flex overflow-x-auto gap-4 pb-4 scrollbar-hide",
        className,
      )}
    >
      {categories.map((category) => (
        <CategoryCard
          key={category.slug}
          category={category}
          isActive={activeCategory === category.slug}
          onClick={
            onCategoryChange ? () => onCategoryChange(category.slug) : undefined
          }
        />
      ))}
    </div>
  );
}
