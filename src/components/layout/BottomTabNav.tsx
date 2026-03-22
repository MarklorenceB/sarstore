'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { useCartItemCount, useCartStore } from '@/store/cart'

const tabs = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Browse', href: '/category/cooking-essentials', icon: LayoutGrid },
  { label: 'Cart', href: null, icon: ShoppingCart },
  { label: 'Profile', href: '/profile', icon: User },
] as const

export default function BottomTabNav() {
  const pathname = usePathname()
  const cartItemCount = useCartItemCount()
  const openCart = useCartStore((state) => state.openCart)

  const isActive = (href: string | null) => {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
        rounded-t-[2rem] bg-white/80 backdrop-blur-lg
        shadow-[0_-4px_20px_rgba(21,28,39,0.06)]
        px-4 pb-6 pt-3"
    >
      <ul className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon
          const isCart = tab.label === 'Cart'

          const content = (
            <span
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition-colors
                ${active ? 'bg-green-100 text-green-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={2} />
                {isCart && cartItemCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {tab.label}
              </span>
            </span>
          )

          if (isCart) {
            return (
              <li key={tab.label}>
                <button type="button" onClick={openCart} className="outline-none">
                  {content}
                </button>
              </li>
            )
          }

          return (
            <li key={tab.label}>
              <Link href={tab.href!}>{content}</Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
