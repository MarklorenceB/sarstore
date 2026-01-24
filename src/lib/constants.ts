// Store Information
export const STORE_INFO = {
  name: 'Sari-Store',
  tagline: 'Your neighborhood grocery',
  description: 'Fresh groceries delivered to your door',
  phone: '0917-123-4567',
  email: 'hello@sari-store.ph',
  address: '123 Sample St, Manila, Philippines',
  hours: '8:00 AM - 10:00 PM',
  gcashNumber: '0917 123 4567',
}

// Categories with icons
export const CATEGORIES = [
  { id: 1, name: 'Cooking Essentials', icon: '🍳', slug: 'cooking-essentials', itemCount: 45 },
  { id: 2, name: 'Eggs & Dairy', icon: '🥚', slug: 'eggs-dairy', itemCount: 32 },
  { id: 3, name: 'Meat & Poultry', icon: '🥩', slug: 'meat-poultry', itemCount: 28 },
  { id: 4, name: 'Canned & Packaged', icon: '🥫', slug: 'canned-packaged', itemCount: 56 },
  { id: 5, name: 'Frozen Foods', icon: '🧊', slug: 'frozen-foods', itemCount: 24 },
  { id: 6, name: 'Bakery & Snacks', icon: '🍞', slug: 'bakery-snacks', itemCount: 38 },
  { id: 7, name: 'Beverages', icon: '🥤', slug: 'beverages', itemCount: 41 },
  { id: 8, name: 'Condiments & Sauces', icon: '🫙', slug: 'condiments-sauces', itemCount: 29 },
  { id: 9, name: 'Household Essentials', icon: '🧹', slug: 'household', itemCount: 35 },
]

// Category icons map
export const CATEGORY_ICONS: Record<string, string> = {
  'cooking-essentials': '🍳',
  'eggs-dairy': '🥚',
  'meat-poultry': '🥩',
  'canned-packaged': '🥫',
  'frozen-foods': '🧊',
  'bakery-snacks': '🍞',
  'beverages': '🥤',
  'condiments-sauces': '🫙',
  'household': '🧹',
}

// Payment methods
export const PAYMENT_METHODS = {
  cod: {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: '💵',
  },
  gcash: {
    id: 'gcash',
    name: 'GCash',
    description: `Send to ${STORE_INFO.gcashNumber}`,
    icon: '📱',
  },
}

// Order statuses
export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  preparing: { label: 'Preparing', color: 'purple' },
  out_for_delivery: { label: 'Out for Delivery', color: 'orange' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

// Delivery configuration
export const DELIVERY_CONFIG = {
  baseFee: 50,
  freeDeliveryThreshold: 1000,
  estimatedTime: '30-45 minutes',
}

// Product units
export const PRODUCT_UNITS = [
  'pc',
  'kg',
  'g',
  'liter',
  'ml',
  'pack',
  'bottle',
  'can',
  'box',
  'bundle',
  'tray',
  'sack',
  'carton',
  'dozen',
]

// Product badges
export const PRODUCT_BADGES: Record<string, { label: string; color: string }> = {
  sale: { label: 'Sale', color: 'red' },
  hot: { label: 'Hot', color: 'orange' },
  fresh: { label: 'Fresh', color: 'green' },
  new: { label: 'New', color: 'blue' },
  popular: { label: 'Popular', color: 'purple' },
  'best-seller': { label: 'Best Seller', color: 'yellow' },
}

// Navigation links
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Hot Deals', href: '/deals' },
  { name: 'Promotions', href: '/promos' },
  { name: 'New Products', href: '/new' },
]

// Footer links
export const FOOTER_LINKS = {
  account: [
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Cart', href: '/cart' },
    { name: 'Track Order', href: '/track' },
    { name: 'Shipping Details', href: '/shipping' },
  ],
  useful: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Hot Deals', href: '/deals' },
    { name: 'Promotions', href: '/promos' },
  ],
  help: [
    { name: 'Payments', href: '/help/payments' },
    { name: 'Refund', href: '/help/refund' },
    { name: 'Checkout', href: '/help/checkout' },
    { name: 'FAQ', href: '/faq' },
  ],
}

// Features for landing page
export const FEATURES = [
  {
    icon: 'truck',
    title: 'Free Delivery',
    description: 'On orders over ₱1,000',
  },
  {
    icon: 'shield',
    title: 'Fresh Guarantee',
    description: '100% quality products',
  },
  {
    icon: 'credit-card',
    title: 'Secure Payment',
    description: 'COD & GCash accepted',
  },
  {
    icon: 'headphones',
    title: '24/7 Support',
    description: 'Always here to help',
  },
]

// Stats for landing page
export const STATS = [
  { value: '500+', label: 'Products' },
  { value: '10k+', label: 'Happy Customers' },
  { value: '30min', label: 'Avg Delivery' },
]

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
}

// SEO defaults
export const SEO_DEFAULTS = {
  title: 'Sari-Store - Fresh Groceries Delivered',
  description: 'Shop fresh groceries online from your neighborhood sari-sari store. Fast delivery, great prices, quality products.',
  keywords: 'grocery, sari-sari store, online shopping, Philippines, delivery, fresh food',
}
