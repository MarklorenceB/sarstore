import { createBrowserClient } from '@supabase/ssr'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check for required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Using mock data mode.\n' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

// Create Supabase client for browser/client-side usage
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google sign in error:', error)
    throw error
  }

  return data
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Email sign in error:', error)
    throw error
  }

  return data
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    console.error('Sign up error:', error)
    throw error
  }

  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Get user error:', error)
    return null
  }
  
  return user
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Get session error:', error)
    return null
  }
  
  return session
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// ============================================
// DATABASE TYPES (for TypeScript)
// ============================================

export type Tables = {
  categories: {
    id: string
    name: string
    slug: string
    icon: string
    description: string | null
    image_url: string | null
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
  }
  products: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    old_price: number | null
    unit: string
    image_url: string | null
    image_emoji: string | null
    category_id: string | null
    stock_quantity: number
    is_available: boolean
    is_featured: boolean
    badge: string | null
    rating: number | null
    review_count: number | null
    created_at: string
    updated_at: string
  }
  profiles: {
    id: string
    email: string | null
    name: string | null
    phone: string | null
    address: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
  orders: {
    id: string
    order_number: string
    user_id: string | null
    customer_name: string
    customer_phone: string
    customer_address: string
    customer_notes: string | null
    status: string
    subtotal: number
    delivery_fee: number
    total: number
    created_at: string
    updated_at: string
  }
  order_items: {
    id: string
    order_id: string
    product_id: string | null
    product_name: string
    product_price: number
    quantity: number
    subtotal: number
    created_at: string
  }
  payments: {
    id: string
    order_id: string
    method: string
    status: string
    amount: number
    reference_number: string | null
    created_at: string
    updated_at: string
  }
}
