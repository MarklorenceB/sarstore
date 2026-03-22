'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Settings,
  ClipboardList,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Package,
  ShoppingCart,
  Star,
  Shield,
  Award,
  TrendingUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { BottomTabNav, Header, Footer } from '@/components/layout'
import { CartDrawer } from '@/components/cart'

interface UserProfile {
  name: string
  email: string
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activeSidebarItem, setActiveSidebarItem] = useState('Overview')

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            'Sari-Store User',
          email: authUser.email || '',
          avatar_url: authUser.user_metadata?.avatar_url || null,
        })
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const menuItems = [
    {
      icon: ClipboardList,
      label: 'Order History',
      description: 'View your recent orders',
      href: '/checkout',
      badge: '2 ACTIVE',
    },
    {
      icon: MapPin,
      label: 'Saved Addresses',
      description: 'Home, Work, and more',
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Cash on Delivery, GCash',
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Preferences and alerts',
      hasRedDot: true,
    },
    {
      icon: HelpCircle,
      label: 'Help Center',
      description: 'FAQ and Customer Support',
    },
  ]

  const sidebarNavItems = [
    { icon: User, label: 'Overview' },
    { icon: Package, label: 'Order History' },
    { icon: MapPin, label: 'Addresses' },
    { icon: CreditCard, label: 'Payment Methods' },
    { icon: Settings, label: 'Settings' },
  ]

  const sidebarBottomItems = [
    { icon: HelpCircle, label: 'Help Center' },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ]

  const statsCards = [
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: '42',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Active Orders',
      value: '2',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Star,
      label: 'Reward Points',
      value: '850',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  const recentOrders = [
    {
      id: '#ORD-2024-1847',
      date: 'Mar 18, 2026',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      amount: '₱1,245.00',
    },
    {
      id: '#ORD-2024-1832',
      date: 'Mar 15, 2026',
      status: 'On the Way',
      statusColor: 'bg-amber-100 text-amber-700',
      amount: '₱867.50',
    },
    {
      id: '#ORD-2024-1819',
      date: 'Mar 12, 2026',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      amount: '₱2,130.00',
    },
    {
      id: '#ORD-2024-1805',
      date: 'Mar 8, 2026',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      amount: '₱543.75',
    },
  ]

  const settingsShortcuts = [
    {
      icon: MapPin,
      label: 'Saved Addresses',
      description: 'Manage delivery locations',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Cards and wallets',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Alerts and preferences',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Shield,
      label: 'Security',
      description: 'Password and 2FA',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Account</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Content */}
      <div className="pt-16 pb-24 px-4 md:hidden">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 p-1">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400">
                  {(user?.name?.[0] || 'S').toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            {user?.name || 'Sari-Store User'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {user?.email || 'user@saristore.com'}
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => item.href && router.push(item.href)}
                className="w-full flex items-center gap-4 bg-white rounded-xl p-5 hover:bg-green-50 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.hasRedDot && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            )
          })}

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 bg-red-50 rounded-xl p-5 hover:bg-red-100 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-red-500">Log Out</p>
              <p className="text-xs text-red-400">Sign out of your account</p>
            </div>
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-[10px] text-gray-400 mt-8">
          Sari-Store v1.0.0
        </p>
      </div>

      {/* Desktop Two-Column Layout */}
      <div className="hidden md:flex pt-24 min-h-screen">
        {/* Left Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 sticky top-16 h-[calc(100vh-64px)] bg-slate-50 p-6">
          {/* Sidebar Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 p-0.5">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-400">
                    {(user?.name?.[0] || 'S').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <h3 className="mt-3 text-sm font-bold text-gray-900">
              {user?.name || 'Sari-Store User'}
            </h3>
            <p className="text-xs text-green-600 font-medium mt-0.5">
              Premium Member
            </p>
            <button className="mt-2 text-xs text-green-700 font-semibold hover:underline">
              View Rewards
            </button>
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSidebarItem === item.label
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveSidebarItem(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'text-green-700 font-bold bg-white shadow-sm'
                      : 'text-gray-600 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-green-700' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Sidebar Bottom */}
          <div className="border-t border-slate-200 pt-4 space-y-1">
            {sidebarBottomItems.map((item) => {
              const Icon = item.icon
              const isLogout = item.label === 'Logout'
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-slate-200/50 ${
                    isLogout ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isLogout ? 'text-red-400' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
          {/* Profile Header */}
          <div className="flex items-end justify-between mb-12">
            {/* Left Side */}
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl shadow-2xl rotate-3 bg-gradient-to-br from-primary-500 to-primary-400 p-1 overflow-hidden">
                  <div className="w-full h-full rounded-3xl bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl text-gray-400">
                        {(user?.name?.[0] || 'S').toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {/* Gold Tier Badge */}
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Gold Tier
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {user?.name || 'Sari-Store User'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.email || 'user@saristore.com'}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    Member since Jan 2024
                  </span>
                  <button className="text-xs text-green-600 font-semibold hover:underline">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Balance */}
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Current Balance</p>
              <p className="text-3xl font-black text-green-600">₱1,250.40</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {statsCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-white p-6 rounded-3xl shadow-lg flex items-center gap-4"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Orders Table */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button className="text-sm text-green-600 font-semibold hover:underline">
                View All History
              </button>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${order.statusColor}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                        {order.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Settings Shortcuts */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Account Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {settingsShortcuts.map((shortcut) => {
                const Icon = shortcut.icon
                return (
                  <button
                    key={shortcut.label}
                    className="bg-white p-6 rounded-3xl shadow-md hover:-translate-y-1 transition-transform text-left"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${shortcut.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {shortcut.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {shortcut.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomTabNav />
    </div>
  )
}
