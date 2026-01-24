import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/types'
import { DELIVERY_CONFIG } from '@/lib/constants'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const { items } = get()
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                id: `cart-${product.id}-${Date.now()}`,
                product,
                quantity: 1,
              },
            ],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sari-store-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartIsOpen = () => useCartStore((state) => state.isOpen)

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  )

export const useCartDeliveryFee = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
    return subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold
      ? 0
      : DELIVERY_CONFIG.baseFee
  })

export const useCartTotal = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
    const deliveryFee =
      subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold
        ? 0
        : DELIVERY_CONFIG.baseFee
    return subtotal + deliveryFee
  })
