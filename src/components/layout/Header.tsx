"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  Shield,
  Store,
} from "lucide-react";
import { useCartStore, useCartItemCount } from "@/store/cart";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, isAdmin } from "@/lib/constants";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  onLogout?: () => void;
}

// Nav categories matching the mockup
const NAV_CATEGORIES = CATEGORIES.slice(0, 5);

export default function Header({ onLogout }: HeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatar_url: string;
  } | null>(null);

  const cartItemCount = useCartItemCount();
  const openCart = useCartStore((state) => state.openCart);

  // Get user info
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";
        const avatar =
          user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
        setUserProfile({ name, avatar_url: avatar });
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "User";
        const avatar =
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture ||
          "";
        setUserProfile({ name, avatar_url: avatar });
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    if (onLogout) onLogout();
  };

  const displayName = userProfile?.name?.split(" ")[0] || "User";

  return (
    <>
      {/* ============================================
          MOBILE HEADER - Clean glass morphism design
          ============================================ */}
      <header className="md:hidden fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl shadow-sm shadow-green-900/5">
        <div className="flex justify-between items-center px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-5 h-5 text-green-600" />
            <span className="text-xl font-black tracking-tighter text-green-700 font-display">
              Sari-Store
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </Link>
            <button
              onClick={openCart}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] text-white font-bold">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="bg-gray-100/50 h-[1px] w-full" />
      </header>

      {/* ============================================
          DESKTOP HEADER - Mockup style clean nav
          ============================================ */}
      <nav className="hidden md:block fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-8 py-4 max-w-screen-2xl mx-auto">
          {/* Left: Brand + Nav Links */}
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold text-green-700 font-display tracking-tight">
              Sari-Store
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {NAV_CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`py-1 transition-colors ${
                    i === 0
                      ? "text-green-700 border-b-2 border-green-600 font-semibold"
                      : "text-slate-600 hover:text-green-600"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search + Cart + Account */}
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curated goods..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {/* Cart */}
            <button
              onClick={openCart}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95 duration-200 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-green-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95 duration-200"
                aria-label="Account"
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={displayName}
                    className="w-7 h-7 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <User className="w-5 h-5 text-green-700" />
                )}
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {userProfile?.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {userProfile?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isAdmin(user?.email) && (
                      <Link
                        href="/admin/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          Admin Orders
                        </span>
                      </Link>
                    )}

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">My Orders</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isUserMenuOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
}
