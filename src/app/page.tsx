"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TopBar, Header, Footer } from "@/components/layout";
import {
  ProductCard,
  SmallProductCard,
  ProductGrid,
} from "@/components/products";
import { CategoryCard } from "@/components/categories";
import { CartDrawer } from "@/components/cart";
import { LoginModal } from "@/components/auth";
import { HeroBanner, PromoBanners } from "@/components/home";
import { Button, CountdownTimer } from "@/components/ui";
import { STORE_INFO, CATEGORIES, STATS } from "@/lib/constants";
import {
  getProducts,
  getFeaturedProducts,
  getDailyBestSellers,
  getTopProducts,
} from "@/lib/api";
import type { Product } from "@/types";
import type { User } from "@supabase/supabase-js";

// ============================================
// LANDING PAGE (Before Login)
// ============================================

function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "signup">("login");

  const handleStartShopping = () => {
    setLoginMode("signup");
    setShowLogin(true);
  };

  const handleLogin = () => {
    setLoginMode("login");
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🛒</span>
            <div>
              <h1 className="font-bold text-2xl text-primary-600 font-display">
                {STORE_INFO.name}
              </h1>
              <p className="text-xs text-gray-500">{STORE_INFO.tagline}</p>
            </div>
          </div>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="w-full py-16 md:py-24"
        style={{
          backgroundImage: "url('/images/land-banner.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                🎉 Free delivery on orders
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight font-display">
                Fresh Groceries
                <span className="text-primary-500"> Delivered</span> to Your
                Door
              </h1>
              <p
                className="relative inline-block text-lg text-white px-4 py-2 rounded-xl
  bg-gradient-to-r from-black/40 via-black/20 to-transparent backdrop-blur-sm"
              >
                Shop from your favorite local sari-sari store online. Fresh
                products, great prices, and fast delivery right to your
                barangay.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleStartShopping}
                  className="shadow-lg shadow-primary-500/30"
                >
                  Start Shopping →
                </Button>
                <Button size="lg" variant="secondary">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              {/* <div className="flex gap-8 pt-8">
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Free Delivery",
                desc: "On orders over ₱1,000",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Fresh Guarantee",
                desc: "100% quality products",
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Secure Payment",
                desc: "COD & GCash accepted",
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-display">
            Shop by Category
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-4 justify-center flex-wrap">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={handleStartShopping}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleStartShopping}>View All Categories →</Button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={onLogin}
        initialMode={loginMode}
      />
    </div>
  );
}

// ============================================
// MAIN SHOPPING PAGE (After Login)
// ============================================

function MainPage({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dailyBestSells, setDailyBestSells] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<{
    topSells: Product[];
    topRated: Product[];
    trending: Product[];
    recentlyAdded: Product[];
  }>({ topSells: [], topRated: [], trending: [], recentlyAdded: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [featured, bestSells, top] = await Promise.all([
          getFeaturedProducts(),
          getDailyBestSellers(),
          getTopProducts(),
        ]);
        setFeaturedProducts(featured);
        setDailyBestSells(bestSells);
        setTopProducts(top);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header onLogout={handleLogout} />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories Section */}

      {/* Categories Section */}
      {/* Categories Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto ">
          {/* Header */}
          <div className="flex items-center justify-center md:justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-display">
              Explore Categories
            </h2>

            {/* Desktop filters */}
            <div className="hidden lg:flex items-center gap-2">
              {["All", "Cooking", "Meat", "Dairy", "Beverages"].map(
                (filter, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFilter(filter.toLowerCase())}
                    className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
                      (i === 0 && activeFilter === "all") ||
                      activeFilter === filter.toLowerCase()
                        ? "bg-primary-500 text-white"
                        : "text-gray-600 hover:text-primary-600"
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Mobile Slider */}
          <div className="relative md:hidden">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById("categories-slider");
                el?.scrollBy({ left: -140, behavior: "smooth" });
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 shadow rounded-full flex items-center justify-center border border-gray-200"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Slider */}
            <div
              id="categories-slider"
              className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide scroll-smooth"
            >
              {CATEGORIES.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById("categories-slider");
                el?.scrollBy({ left: 140, behavior: "smooth" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 shadow rounded-full flex items-center justify-center border border-gray-200"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-9 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Featured Products
            </h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} columns={5} />
          )}
        </div>
      </section>

      {/* Promo Banners */}
      <PromoBanners />

      {/* Daily Best Sells */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Daily Best Sells
            </h2>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex gap-2">
                {["Featured", "Popular", "New"].map((tab, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      i === 0
                        ? "bg-primary-100 text-primary-600"
                        : "text-gray-600 hover:text-primary-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <CountdownTimer />
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dailyBestSells.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        setIsLoading(false);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl mb-4 block animate-bounce">🛒</span>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show main page if logged in, otherwise landing page
  return user ? (
    <MainPage user={user} onLogout={() => setUser(null)} />
  ) : (
    <LandingPage onLogin={() => {}} />
  );
}
