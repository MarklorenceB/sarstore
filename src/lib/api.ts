import { supabase, isSupabaseConfigured } from './supabase'
import type { Product, Category, ProductFilters, Order, OrderItem, PaymentMethod } from '@/types'
import { CATEGORIES, DELIVERY_CONFIG } from '@/lib/constants'

// ============================================
// MOCK DATA (Used when Supabase is not configured)
// ============================================

const mockCategories: Category[] = CATEGORIES.map((cat, index) => ({
  id: `cat-${cat.id}`,
  name: cat.name,
  slug: cat.slug,
  icon: cat.icon,
  item_count: cat.itemCount,
  sort_order: index,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

const mockProducts: Product[] = [
  // Cooking Essentials
  { id: 'p1', name: 'Cooking Oil 1L', slug: 'cooking-oil-1l', price: 89, old_price: 105, unit: 'bottle', image_emoji: '🫒', category_id: 'cat-1', stock_quantity: 50, is_available: true, is_featured: true, badge: 'sale', rating: 4.7, review_count: 256, created_at: '', updated_at: '' },
  { id: 'p2', name: 'Jasmine Rice 5kg', slug: 'jasmine-rice-5kg', price: 285, old_price: 320, unit: 'sack', image_emoji: '🍚', category_id: 'cat-1', stock_quantity: 30, is_available: true, is_featured: true, badge: 'popular', rating: 4.9, review_count: 312, created_at: '', updated_at: '' },
  { id: 'p3', name: 'Sugar 1kg', slug: 'sugar-1kg', price: 65, old_price: 72, unit: 'pack', image_emoji: '🧂', category_id: 'cat-1', stock_quantity: 40, is_available: true, is_featured: false, rating: 4.5, review_count: 89, created_at: '', updated_at: '' },
  { id: 'p4', name: 'Salt 250g', slug: 'salt-250g', price: 15, unit: 'pack', image_emoji: '🧂', category_id: 'cat-1', stock_quantity: 100, is_available: true, is_featured: false, rating: 4.3, review_count: 45, created_at: '', updated_at: '' },
  { id: 'p5', name: 'All-Purpose Flour 1kg', slug: 'flour-1kg', price: 55, old_price: 62, unit: 'pack', image_emoji: '🌾', category_id: 'cat-1', stock_quantity: 35, is_available: true, is_featured: false, rating: 4.6, review_count: 78, created_at: '', updated_at: '' },

  // Eggs & Dairy
  { id: 'p6', name: 'Fresh Eggs (30pcs)', slug: 'fresh-eggs-30', price: 195, old_price: 220, unit: 'tray', image_emoji: '🥚', category_id: 'cat-2', stock_quantity: 25, is_available: true, is_featured: true, badge: 'best-seller', rating: 4.8, review_count: 124, created_at: '', updated_at: '' },
  { id: 'p7', name: 'Fresh Milk 1L', slug: 'fresh-milk-1l', price: 85, old_price: 95, unit: 'carton', image_emoji: '🥛', category_id: 'cat-2', stock_quantity: 20, is_available: true, is_featured: true, rating: 4.6, review_count: 78, created_at: '', updated_at: '' },
  { id: 'p8', name: 'Butter 225g', slug: 'butter-225g', price: 95, old_price: 110, unit: 'pack', image_emoji: '🧈', category_id: 'cat-2', stock_quantity: 15, is_available: true, is_featured: false, badge: 'new', rating: 4.7, review_count: 56, created_at: '', updated_at: '' },
  { id: 'p9', name: 'Cheese Slices (10pcs)', slug: 'cheese-slices', price: 85, old_price: 98, unit: 'pack', image_emoji: '🧀', category_id: 'cat-2', stock_quantity: 18, is_available: true, is_featured: false, rating: 4.5, review_count: 67, created_at: '', updated_at: '' },
  { id: 'p10', name: 'Yogurt 125ml', slug: 'yogurt-125ml', price: 35, old_price: 42, unit: 'cup', image_emoji: '🥛', category_id: 'cat-2', stock_quantity: 30, is_available: true, is_featured: false, rating: 4.6, review_count: 89, created_at: '', updated_at: '' },

  // Meat & Poultry
  { id: 'p11', name: 'Pork Belly 1kg', slug: 'pork-belly-1kg', price: 380, old_price: 420, unit: 'kg', image_emoji: '🥩', category_id: 'cat-3', stock_quantity: 15, is_available: true, is_featured: true, badge: 'fresh', rating: 4.9, review_count: 89, created_at: '', updated_at: '' },
  { id: 'p12', name: 'Whole Chicken', slug: 'whole-chicken', price: 220, old_price: 260, unit: 'kg', image_emoji: '🍗', category_id: 'cat-3', stock_quantity: 12, is_available: true, is_featured: true, badge: 'hot', rating: 4.8, review_count: 156, created_at: '', updated_at: '' },
  { id: 'p13', name: 'Ground Beef 500g', slug: 'ground-beef-500g', price: 195, old_price: 220, unit: 'pack', image_emoji: '🥩', category_id: 'cat-3', stock_quantity: 10, is_available: true, is_featured: false, rating: 4.7, review_count: 67, created_at: '', updated_at: '' },
  { id: 'p14', name: 'Pork Chop 500g', slug: 'pork-chop-500g', price: 165, old_price: 185, unit: 'pack', image_emoji: '🥩', category_id: 'cat-3', stock_quantity: 8, is_available: true, is_featured: false, rating: 4.6, review_count: 45, created_at: '', updated_at: '' },
  { id: 'p15', name: 'Chicken Wings 500g', slug: 'chicken-wings-500g', price: 145, old_price: 165, unit: 'pack', image_emoji: '🍗', category_id: 'cat-3', stock_quantity: 14, is_available: true, is_featured: false, rating: 4.5, review_count: 78, created_at: '', updated_at: '' },
  { id: 'p16', name: 'Tocino 250g', slug: 'tocino-250g', price: 95, old_price: 110, unit: 'pack', image_emoji: '🥩', category_id: 'cat-3', stock_quantity: 25, is_available: true, is_featured: false, badge: 'popular', rating: 4.8, review_count: 134, created_at: '', updated_at: '' },
  { id: 'p17', name: 'Longganisa 250g', slug: 'longganisa-250g', price: 85, old_price: 98, unit: 'pack', image_emoji: '🌭', category_id: 'cat-3', stock_quantity: 30, is_available: true, is_featured: false, rating: 4.7, review_count: 112, created_at: '', updated_at: '' },

  // Canned & Packaged
  { id: 'p18', name: 'Corned Beef 260g', slug: 'corned-beef-260g', price: 65, old_price: 75, unit: 'can', image_emoji: '🥫', category_id: 'cat-4', stock_quantity: 40, is_available: true, is_featured: true, rating: 4.5, review_count: 98, created_at: '', updated_at: '' },
  { id: 'p19', name: 'Sardines 155g', slug: 'sardines-155g', price: 25, old_price: 30, unit: 'can', image_emoji: '🐟', category_id: 'cat-4', stock_quantity: 60, is_available: true, is_featured: false, rating: 4.4, review_count: 134, created_at: '', updated_at: '' },
  { id: 'p20', name: 'Instant Noodles', slug: 'instant-noodles', price: 12, old_price: 15, unit: 'pack', image_emoji: '🍜', category_id: 'cat-4', stock_quantity: 100, is_available: true, is_featured: false, rating: 4.5, review_count: 256, created_at: '', updated_at: '' },
  { id: 'p21', name: 'Tuna Flakes 180g', slug: 'tuna-flakes-180g', price: 45, old_price: 52, unit: 'can', image_emoji: '🐟', category_id: 'cat-4', stock_quantity: 35, is_available: true, is_featured: false, rating: 4.6, review_count: 87, created_at: '', updated_at: '' },
  { id: 'p22', name: 'Spam 340g', slug: 'spam-340g', price: 185, old_price: 210, unit: 'can', image_emoji: '🥫', category_id: 'cat-4', stock_quantity: 20, is_available: true, is_featured: false, badge: 'popular', rating: 4.7, review_count: 123, created_at: '', updated_at: '' },

  // Frozen Foods
  { id: 'p23', name: 'Hotdog 500g', slug: 'hotdog-500g', price: 125, old_price: 145, unit: 'pack', image_emoji: '🌭', category_id: 'cat-5', stock_quantity: 25, is_available: true, is_featured: true, rating: 4.4, review_count: 89, created_at: '', updated_at: '' },
  { id: 'p24', name: 'Chicken Nuggets 250g', slug: 'chicken-nuggets-250g', price: 95, old_price: 110, unit: 'pack', image_emoji: '🍗', category_id: 'cat-5', stock_quantity: 18, is_available: true, is_featured: false, rating: 4.5, review_count: 67, created_at: '', updated_at: '' },
  { id: 'p25', name: 'Fish Fillet 500g', slug: 'fish-fillet-500g', price: 165, old_price: 185, unit: 'pack', image_emoji: '🐟', category_id: 'cat-5', stock_quantity: 12, is_available: true, is_featured: false, rating: 4.6, review_count: 45, created_at: '', updated_at: '' },
  { id: 'p26', name: 'Ice Cream 1L', slug: 'ice-cream-1l', price: 145, old_price: 165, unit: 'tub', image_emoji: '🍦', category_id: 'cat-5', stock_quantity: 15, is_available: false, is_featured: false, rating: 4.7, review_count: 123, created_at: '', updated_at: '' },

  // Bakery & Snacks
  { id: 'p27', name: 'Pandesal (10pcs)', slug: 'pandesal-10pcs', price: 50, old_price: 60, unit: 'pack', image_emoji: '🥖', category_id: 'cat-6', stock_quantity: 30, is_available: true, is_featured: true, badge: 'fresh', rating: 4.7, review_count: 234, created_at: '', updated_at: '' },
  { id: 'p28', name: 'Sliced Bread', slug: 'sliced-bread', price: 55, old_price: 62, unit: 'loaf', image_emoji: '🍞', category_id: 'cat-6', stock_quantity: 25, is_available: true, is_featured: false, rating: 4.5, review_count: 156, created_at: '', updated_at: '' },
  { id: 'p29', name: 'Potato Chips 150g', slug: 'potato-chips-150g', price: 65, old_price: 75, unit: 'pack', image_emoji: '🥔', category_id: 'cat-6', stock_quantity: 40, is_available: true, is_featured: false, rating: 4.4, review_count: 189, created_at: '', updated_at: '' },
  { id: 'p30', name: 'Cookies 200g', slug: 'cookies-200g', price: 45, old_price: 52, unit: 'pack', image_emoji: '🍪', category_id: 'cat-6', stock_quantity: 35, is_available: true, is_featured: false, rating: 4.6, review_count: 98, created_at: '', updated_at: '' },

  // Beverages
  { id: 'p31', name: 'Coke 1.5L', slug: 'coke-1.5l', price: 65, old_price: 75, unit: 'bottle', image_emoji: '🥤', category_id: 'cat-7', stock_quantity: 50, is_available: true, is_featured: true, rating: 4.6, review_count: 189, created_at: '', updated_at: '' },
  { id: 'p32', name: 'Coffee 3-in-1 (10pcs)', slug: 'coffee-3in1-10pcs', price: 80, old_price: 95, unit: 'pack', image_emoji: '☕', category_id: 'cat-7', stock_quantity: 45, is_available: true, is_featured: false, rating: 4.6, review_count: 234, created_at: '', updated_at: '' },
  { id: 'p33', name: 'Orange Juice 1L', slug: 'orange-juice-1l', price: 85, old_price: 98, unit: 'carton', image_emoji: '🍊', category_id: 'cat-7', stock_quantity: 20, is_available: true, is_featured: false, rating: 4.5, review_count: 67, created_at: '', updated_at: '' },
  { id: 'p34', name: 'Bottled Water 500ml (6-pack)', slug: 'water-500ml-6pack', price: 45, unit: 'pack', image_emoji: '💧', category_id: 'cat-7', stock_quantity: 60, is_available: true, is_featured: false, rating: 4.3, review_count: 45, created_at: '', updated_at: '' },

  // Condiments & Sauces
  { id: 'p35', name: 'Soy Sauce 1L', slug: 'soy-sauce-1l', price: 55, old_price: 65, unit: 'bottle', image_emoji: '🫙', category_id: 'cat-8', stock_quantity: 35, is_available: true, is_featured: true, rating: 4.9, review_count: 145, created_at: '', updated_at: '' },
  { id: 'p36', name: 'Vinegar 1L', slug: 'vinegar-1l', price: 35, old_price: 42, unit: 'bottle', image_emoji: '🍶', category_id: 'cat-8', stock_quantity: 40, is_available: true, is_featured: false, rating: 4.8, review_count: 98, created_at: '', updated_at: '' },
  { id: 'p37', name: 'Fish Sauce 750ml', slug: 'fish-sauce-750ml', price: 45, old_price: 52, unit: 'bottle', image_emoji: '🥫', category_id: 'cat-8', stock_quantity: 30, is_available: true, is_featured: false, rating: 4.7, review_count: 87, created_at: '', updated_at: '' },
  { id: 'p38', name: 'Ketchup 320g', slug: 'ketchup-320g', price: 45, old_price: 52, unit: 'bottle', image_emoji: '🍅', category_id: 'cat-8', stock_quantity: 25, is_available: true, is_featured: false, rating: 4.5, review_count: 76, created_at: '', updated_at: '' },
  { id: 'p39', name: 'Mayonnaise 220ml', slug: 'mayonnaise-220ml', price: 55, old_price: 65, unit: 'jar', image_emoji: '🥫', category_id: 'cat-8', stock_quantity: 20, is_available: true, is_featured: false, rating: 4.6, review_count: 89, created_at: '', updated_at: '' },

  // Household Essentials
  { id: 'p40', name: 'Dish Soap 500ml', slug: 'dish-soap-500ml', price: 45, old_price: 52, unit: 'bottle', image_emoji: '🧴', category_id: 'cat-9', stock_quantity: 40, is_available: true, is_featured: false, rating: 4.5, review_count: 67, created_at: '', updated_at: '' },
  { id: 'p41', name: 'Laundry Detergent 1kg', slug: 'laundry-detergent-1kg', price: 85, old_price: 98, unit: 'pack', image_emoji: '🧺', category_id: 'cat-9', stock_quantity: 30, is_available: true, is_featured: true, rating: 4.6, review_count: 123, created_at: '', updated_at: '' },
  { id: 'p42', name: 'Toilet Paper (4 rolls)', slug: 'toilet-paper-4rolls', price: 65, old_price: 75, unit: 'pack', image_emoji: '🧻', category_id: 'cat-9', stock_quantity: 50, is_available: true, is_featured: false, rating: 4.4, review_count: 89, created_at: '', updated_at: '' },
  { id: 'p43', name: 'Garbage Bags (10pcs)', slug: 'garbage-bags-10pcs', price: 35, old_price: 42, unit: 'pack', image_emoji: '🗑️', category_id: 'cat-9', stock_quantity: 45, is_available: true, is_featured: false, rating: 4.3, review_count: 56, created_at: '', updated_at: '' },
  { id: 'p44', name: 'Alcohol 500ml', slug: 'alcohol-500ml', price: 85, old_price: 95, unit: 'bottle', image_emoji: '🧴', category_id: 'cat-9', stock_quantity: 40, is_available: true, is_featured: false, rating: 4.7, review_count: 123, created_at: '', updated_at: '' },
]

// ============================================
// CATEGORY API
// ============================================

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) throw error
    
    // Add item_count from products
    const categoriesWithCount = await Promise.all(
      (data || []).map(async (cat) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)
          .eq('is_available', true)
        
        return {
          ...cat,
          item_count: count || 0,
        } as Category
      })
    )

    return categoriesWithCount
  } catch (error) {
    console.error('Error fetching categories:', error)
    return mockCategories
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return mockCategories.find((cat) => cat.slug === slug) || null
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data as Category
  } catch (error) {
    console.error('Error fetching category:', error)
    return mockCategories.find((cat) => cat.slug === slug) || null
  }
}

// ============================================
// PRODUCT API
// ============================================

/**
 * Get products with optional filters
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return filterMockProducts(filters)
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug, icon)
      `)

    // Apply filters
    if (filters?.categorySlug) {
      const category = await getCategoryBySlug(filters.categorySlug)
      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters?.isAvailable !== undefined) {
      query = query.eq('is_available', filters.isAvailable)
    }

    if (filters?.isFeatured) {
      query = query.eq('is_featured', true)
    }

    if (filters?.badge) {
      query = query.eq('badge', filters.badge)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    // Sorting
    switch (filters?.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'rating':
        query = query.order('rating', { ascending: false, nullsFirst: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Error fetching products:', error)
    return filterMockProducts(filters)
  }
}

// Helper function to filter mock products
function filterMockProducts(filters?: ProductFilters): Product[] {
  let products = [...mockProducts]

  if (filters?.categorySlug) {
    const categoryIndex = CATEGORIES.findIndex((cat) => cat.slug === filters.categorySlug)
    if (categoryIndex !== -1) {
      products = products.filter((p) => p.category_id === `cat-${categoryIndex + 1}`)
    }
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    products = products.filter((p) => p.name.toLowerCase().includes(searchLower))
  }

  if (filters?.isAvailable !== undefined) {
    products = products.filter((p) => p.is_available === filters.isAvailable)
  }

  if (filters?.isFeatured) {
    products = products.filter((p) => p.is_featured)
  }

  if (filters?.badge) {
    products = products.filter((p) => p.badge === filters.badge)
  }

  // Sorting
  switch (filters?.sortBy) {
    case 'price_asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'rating':
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
  }

  // Pagination
  if (filters?.limit) {
    const offset = filters.offset || 0
    products = products.slice(offset, offset + filters.limit)
  }

  return products
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return mockProducts.find((p) => p.slug === slug) || null
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug, icon)
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    return mockProducts.find((p) => p.slug === slug) || null
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  return getProducts({ search: query })
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ isFeatured: true, limit: 10 })
}

/**
 * Get daily best sellers
 */
export async function getDailyBestSellers(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts
      .filter((p) => p.badge === 'hot' || p.badge === 'best-seller' || p.badge === 'popular')
      .slice(0, 4)
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('badge', ['hot', 'best-seller', 'popular'])
      .eq('is_available', true)
      .limit(4)

    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Error fetching best sellers:', error)
    return mockProducts.filter((p) => p.badge === 'hot' || p.badge === 'best-seller').slice(0, 4)
  }
}

/**
 * Get top products grouped by type
 */
export async function getTopProducts(): Promise<{
  topSells: Product[]
  topRated: Product[]
  trending: Product[]
  recentlyAdded: Product[]
}> {
  if (!isSupabaseConfigured()) {
    const sortedByRating = [...mockProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    const sortedByReviews = [...mockProducts].sort((a, b) => (b.review_count || 0) - (a.review_count || 0))

    return {
      topSells: sortedByReviews.slice(0, 3),
      topRated: sortedByRating.slice(0, 3),
      trending: mockProducts.filter((p) => p.badge === 'hot' || p.badge === 'popular').slice(0, 3),
      recentlyAdded: mockProducts.filter((p) => p.badge === 'new').slice(0, 3),
    }
  }

  try {
    const [topSells, topRated, trending, recentlyAdded] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('review_count', { ascending: false, nullsFirst: false })
        .limit(3),
      supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(3),
      supabase
        .from('products')
        .select('*')
        .in('badge', ['hot', 'popular'])
        .eq('is_available', true)
        .limit(3),
      supabase
        .from('products')
        .select('*')
        .eq('badge', 'new')
        .eq('is_available', true)
        .limit(3),
    ])

    return {
      topSells: (topSells.data || []) as Product[],
      topRated: (topRated.data || []) as Product[],
      trending: (trending.data || []) as Product[],
      recentlyAdded: (recentlyAdded.data || []) as Product[],
    }
  } catch (error) {
    console.error('Error fetching top products:', error)
    return { topSells: [], topRated: [], trending: [], recentlyAdded: [] }
  }
}

// ============================================
// ORDER API
// ============================================

interface CreateOrderData {
  customer: {
    name: string
    phone: string
    address: string
    notes?: string
  }
  paymentMethod: PaymentMethod
  gcashReference?: string
  items: Array<{
    productId: string
    productName: string
    productPrice: number
    quantity: number
  }>
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  )
  const deliveryFee =
    subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : DELIVERY_CONFIG.baseFee
  const total = subtotal + deliveryFee

  let order: Order

  if (!isSupabaseConfigured()) {
    // Return mock order
    const orderNumber = `SS-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    
    order = {
      id: `order-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.customer.name,
      customer_phone: orderData.customer.phone,
      customer_address: orderData.customer.address,
      customer_notes: orderData.customer.notes,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } else {
    try {
      // Create order
      const { data: orderData2, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customer.name,
          customer_phone: orderData.customer.phone,
          customer_address: orderData.customer.address,
          customer_notes: orderData.customer.notes,
          status: 'pending',
          subtotal,
          delivery_fee: deliveryFee,
          total,
        })
        .select()
        .single()

      if (orderError) throw orderError

      order = orderData2 as Order

      // Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_price: item.productPrice,
        quantity: item.quantity,
        subtotal: item.productPrice * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          method: orderData.paymentMethod,
          status: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
          amount: total,
          reference_number: orderData.gcashReference,
        })

      if (paymentError) throw paymentError
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // Send email notification (non-blocking)
  sendOrderNotification({
    orderNumber: order.order_number,
    customerName: orderData.customer.name,
    customerPhone: orderData.customer.phone,
    customerAddress: orderData.customer.address,
    customerNotes: orderData.customer.notes,
    items: orderData.items.map((item) => ({
      name: item.productName,
      price: item.productPrice,
      quantity: item.quantity,
    })),
    subtotal,
    deliveryFee,
    total,
    paymentMethod: orderData.paymentMethod,
    gcashReference: orderData.gcashReference,
  }).catch((err) => console.error('Failed to send notification:', err))

  return order
}

/**
 * Send order notification email
 */
async function sendOrderNotification(data: {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes?: string
  items: Array<{ name: string; price: number; quantity: number }>
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  gcashReference?: string
}) {
  try {
    const response = await fetch('/api/send-order-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to send notification')
    }

    return await response.json()
  } catch (error) {
    console.error('Notification error:', error)
    throw error
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        payment:payments(*)
      `)
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data as Order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        payment:payments(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as Order[]
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}
