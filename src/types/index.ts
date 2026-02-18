// ============================================
// DATABASE TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  image_url?: string;
  item_count?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  old_price?: number;
  unit: string;
  image_url?: string;
  image_emoji?: string;
  category_id: string;
  category?: Category;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  badge?: ProductBadge;
  rating?: number;
  review_count?: number;
  discount_percent?: number;
  created_at: string;
  updated_at: string;
}

export type ProductBadge =
  | "sale"
  | "hot"
  | "fresh"
  | "new"
  | "popular"
  | "best-seller";

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes?: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items?: OrderItem[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = "cod" | "gcash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isOpen: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface CheckoutData {
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  gcashReference?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  badge?: ProductBadge;
  sortBy?: "price_asc" | "price_desc" | "name" | "newest" | "rating";
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// UI TYPES
// ============================================

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showBadge?: boolean;
  showRating?: boolean;
  compact?: boolean;
}

export interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "circle" | "card";
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
