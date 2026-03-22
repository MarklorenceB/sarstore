"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  Headphones,
  Gift,
  ChevronRight,
  Plus,
  Mail,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import { Header, Footer, BottomTabNav } from "@/components/layout";
import { CartDrawer } from "@/components/cart";
import { CATEGORIES } from "@/lib/constants";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import {
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) { toast.error(error.message); return; }
        if (data.user && !data.session) {
          toast.success("Check your email for confirmation link!");
        } else if (data.session) {
          toast.success("Account created successfully!");
          onLogin();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { toast.error(error.message); return; }
        if (data.session) {
          toast.success("Welcome back!");
          onLogin();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Icon SVG
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-sans text-gray-900 antialiased flex flex-col">

      {/* ═══ MOBILE VIEW ═══ */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Brand Header */}
        <header className="w-full flex justify-center pt-12 pb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 signature-gradient rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-3xl">🛒</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-green-700">Sari-Store</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-12 w-full max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="mb-10 text-center">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-2 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 font-medium">
              {isSignUp ? "Sign up to start shopping" : "Fresh flavors and organic goodness await."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">👤</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600/20 transition-all outline-none"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600/20 transition-all outline-none"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="text-xs font-semibold text-gray-500">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-bold text-green-700 hover:opacity-80 transition-opacity">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600/20 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full signature-gradient text-white font-display font-bold py-4 rounded-full shadow-[0_8px_24px_rgba(0,110,47,0.15)] active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="flex items-center justify-center gap-2 bg-white py-3.5 rounded-xl border border-gray-200 shadow-sm active:scale-95 transition-transform disabled:opacity-50 w-full"
            >
              {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              <span className="text-sm font-bold text-gray-900">Google</span>
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isSignUp ? "Already have an account?" : "New to the store?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-green-700 font-bold ml-1 hover:underline">
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </main>

        {/* Decorative Bottom */}
        <div className="mt-auto h-32 w-full relative overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* ═══ DESKTOP VIEW ═══ */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* Desktop Nav */}
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-8 py-4">
            <div className="text-2xl font-bold text-green-700 font-display tracking-tight">
              Sari-Store
            </div>
            <div className="flex items-center gap-8">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <span key={cat.id} className="text-gray-600 font-medium hover:text-green-600 transition-colors cursor-default">
                  {cat.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">🛒</span>
              <span className="text-green-700">👤</span>
            </div>
          </div>
          <div className="bg-gray-100/50 h-[1px]" />
        </nav>

        {/* Login Card */}
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center px-4">
          <div className="w-full max-w-[480px] bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(21,28,39,0.06)] relative overflow-hidden">
            {/* Asymmetric Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-400/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <header className="mb-10">
                <h1 className="font-display text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {isSignUp ? "Sign up to start shopping fresh groceries." : "Fresh flavors and organic goodness await."}
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-green-600/20 transition-all placeholder:text-gray-400 outline-none"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-green-600/20 transition-all placeholder:text-gray-400 outline-none"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-gray-900">Password</label>
                    {!isSignUp && (
                      <button type="button" className="text-xs font-bold text-green-700 hover:opacity-80 transition-colors">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-green-600/20 transition-all placeholder:text-gray-400 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 signature-gradient text-white font-bold rounded-full shadow-lg shadow-green-600/20 hover:shadow-green-600/40 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-10 flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">OR CONTINUE WITH</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              {/* Social Logins */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 w-full"
                >
                  {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                  <span className="text-sm font-semibold text-gray-900">Google</span>
                </button>
              </div>

              {/* Toggle Mode */}
              <footer className="mt-10 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  {isSignUp ? "Already have an account?" : "New to the store?"}{" "}
                  <button onClick={() => setIsSignUp(!isSignUp)} className="text-green-700 font-bold ml-1 hover:underline underline-offset-4">
                    {isSignUp ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </footer>
            </div>
          </div>
        </main>

        {/* Desktop Footer */}
        <footer className="bg-gray-50 w-full pt-16 pb-8">
          <div className="bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px mb-12" />
          <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-8">
            <div className="text-lg font-bold text-gray-900 font-display">Sari-Store</div>
            <div className="flex flex-wrap justify-center gap-8">
              <span className="text-gray-500 text-sm">Privacy Policy</span>
              <span className="text-gray-500 text-sm">Terms of Service</span>
              <span className="text-gray-500 text-sm">Shipping Info</span>
              <span className="text-gray-500 text-sm">Contact Us</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              © {new Date().getFullYear()} Sari-Store. Fresh Groceries Delivered.
            </p>
          </div>
        </footer>
      </div>
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

  const addItem = useCartStore((state) => state.addItem);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header onLogout={handleLogout} />

      {/* Hero Section - Mobile */}
      <div className="px-6 mb-10 pt-20 md:hidden">
        <div className="relative overflow-hidden rounded-[2rem] signature-gradient p-8 min-h-[420px] flex flex-col justify-center">
          <div className="relative z-10 max-w-[280px]">
            <h1 className="font-display text-4xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Fresh Groceries Delivered to Your Door
            </h1>
            <button className="bg-white text-green-700 font-bold px-8 py-4 rounded-full text-sm active:scale-95 transition-all shadow-xl shadow-black/10">
              Start Shopping
            </button>
          </div>
          {/* Abstract Organic Background Element */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 h-48 opacity-90">
            <img
              src="/images/land-banner.png"
              alt="Fresh Produce"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Hero Section - Desktop */}
      <div className="hidden md:block max-w-screen-2xl mx-auto px-8 mb-20 pt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#e7eefe] h-[600px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/land-banner.png"
              alt="Fresh produce market display"
              className="w-full h-full object-cover opacity-90 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#e7eefe] via-[#e7eefe]/40 to-transparent" />
          </div>
          <div className="relative z-10 pl-20 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest mb-6">
              Hand-Selected Daily
            </span>
            <h1 className="text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-8 font-display">
              Fresh Groceries <br /><span className="text-green-600 italic">Delivered.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-sans">
              Curating the finest organic produce and artisanal pantry staples from local sustainable farms directly to your kitchen.
            </p>
            <div className="flex items-center gap-6">
              <button className="signature-gradient text-white px-10 py-5 rounded-full font-semibold shadow-lg hover:shadow-green-500/20 transition-all active:scale-95">
                Start Shopping
              </button>
              <Link href="/category" className="flex items-center gap-2 font-semibold text-green-700 hover:gap-4 transition-all group">
                Explore Collections
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="mb-10 md:mb-24">
        <div className="max-w-7xl md:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 md:hidden px-2">
            <h2 className="font-display text-xl font-bold tracking-tight text-gray-900">
              Categories
            </h2>
            <Link
              href="/category"
              className="text-green-700 text-xs font-bold uppercase tracking-widest"
            >
              See All
            </Link>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 font-display mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-500 text-lg font-sans">Carefully organized for your daily needs.</p>
            </div>
          </div>

          {/* Mobile Slider */}
          <div className="flex overflow-x-auto gap-4 px-2 scrollbar-hide md:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex-none flex flex-col items-center gap-3 active:scale-90 transition-transform"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl">{cat.icon}</span>
                </div>
                <span className="text-xs font-semibold text-gray-500">{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-square bg-gray-50 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center hover:bg-white transition-all editorial-shadow border border-transparent hover:border-gray-200/50"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="font-bold text-xl text-gray-900 font-display">{cat.name}</span>
                <span className="text-sm text-gray-500 mt-2">{cat.itemCount} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner - Mobile */}
      <div className="px-6 mb-12 md:hidden">
        <div className="bg-blue-100/50 rounded-3xl p-6 flex items-center justify-between">
          <div className="max-w-[60%]">
            <p className="text-green-700 font-bold text-xs uppercase tracking-widest mb-1">Weekly Special</p>
            <h3 className="font-display text-lg font-bold text-gray-800 leading-tight mb-2">
              20% Off Your First Harvest Box
            </h3>
            <p className="text-xs text-gray-500">Use code: FRESH20</p>
          </div>
          <div className="w-24 h-24 bg-white/40 rounded-2xl flex items-center justify-center rotate-12">
            <Gift className="w-10 h-10 text-green-600 -rotate-12" />
          </div>
        </div>
      </div>

      {/* Weekly Special Banner - Desktop */}
      <div className="hidden md:block max-w-screen-2xl mx-auto px-8 mb-24">
        <div className="relative bg-gray-900 text-white p-16 rounded-[2rem] overflow-hidden">
          {/* Background Image */}
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <img
              src="/images/land-banner.png"
              alt="Fresh vegetables"
              className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 text-xl">&#9733;</span>
              <span className="font-bold tracking-widest text-sm uppercase text-green-400">Special Selection</span>
            </div>
            <h3 className="text-5xl font-bold mb-6 font-display leading-tight">
              Seasonal Harvest Box
            </h3>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-sans">
              Get 12 essential produce items selected by our head curator. Perfectly ripened and delivered within 4 hours of picking.
            </p>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-extrabold text-white font-display">&#8369;1,699.00</span>
              <span className="text-xl text-slate-500 line-through">&#8369;2,400.00</span>
            </div>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-green-100 transition-colors active:scale-95">
              Claim My Box
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="mb-10 md:mb-24 bg-white py-8 md:py-16">
        <div className="max-w-7xl md:max-w-screen-2xl mx-auto px-4 md:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 md:hidden px-2">
            <h2 className="font-display text-xl font-bold tracking-tight text-gray-900">
              Featured Products
            </h2>
            <Link href="/category" className="text-green-700 text-xs font-bold uppercase tracking-widest">
              View All
            </Link>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 font-display mb-2">
                Community Favorites
              </h2>
              <p className="text-gray-500 text-lg font-sans">The most loved items in our store this week.</p>
            </div>
            <Link
              href="/category"
              className="text-base font-medium text-primary-600 hover:text-primary-700 flex items-center gap-2"
            >
              View All Products <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Product Grid - Mockup Style */}
              <div className="grid grid-cols-2 gap-4 md:hidden">
                {featuredProducts.slice(0, 8).map((product) => {
                  const imageUrl = PRODUCT_IMAGES[product.slug] || product.image_url;
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`} className="bg-white rounded-3xl p-4 flex flex-col shadow-sm shadow-green-900/5 group">
                      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-5xl">{product.image_emoji || "🛒"}</span>
                        )}
                        {product.badge && (
                          <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md px-2 py-1 rounded-full">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{product.badge}</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-display text-sm font-bold text-gray-900 mb-1 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500 mb-4">{product.unit}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="font-bold text-green-700">₱{product.price.toFixed(2)}</span>
                          {product.old_price && (
                            <span className="text-[10px] text-slate-400 line-through">₱{product.old_price.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                            toast.success(`${product.name} added!`, { icon: "🛒", duration: 1500 });
                          }}
                          className="w-8 h-8 rounded-full signature-gradient flex items-center justify-center text-white active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Product Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 8).map((product) => {
                  const deskImageUrl = PRODUCT_IMAGES[product.slug] || product.image_url;
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`} className="group">
                      <div className="relative aspect-[4/5] bg-gray-100 rounded-[1.5rem] overflow-hidden mb-4">
                        {deskImageUrl ? (
                          <img
                            src={deskImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {product.image_emoji || "🛒"}
                          </div>
                        )}
                        {product.badge && (
                          <span className="absolute top-4 left-4 glass-effect bg-green-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            {product.badge}
                          </span>
                        )}
                        <button className="absolute bottom-4 right-4 w-12 h-12 signature-gradient rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 font-display">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">per {product.unit}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-green-700">&#8369;{product.price.toFixed(2)}</span>
                        <div className="h-1 w-20 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mb-10 md:mb-24 bg-white py-8 md:py-16">
        <div className="max-w-7xl md:max-w-screen-2xl mx-auto px-4 md:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 md:hidden px-2">
            <h2 className="font-display text-xl font-bold tracking-tight text-gray-900">
              Best Sellers
            </h2>
            <Link href="/category" className="text-green-700 text-xs font-bold uppercase tracking-widest">
              Explore All
            </Link>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 font-display mb-2">
                Best Sellers
              </h2>
              <p className="text-gray-500 text-lg font-sans">The most popular items this week.</p>
            </div>
            <Link
              href="/category"
              className="text-base font-medium text-primary-600 hover:text-primary-700 flex items-center gap-2"
            >
              Explore All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Product Grid - Mockup Style */}
              <div className="grid grid-cols-2 gap-4 md:hidden">
                {dailyBestSells.map((product) => {
                  const imageUrl = PRODUCT_IMAGES[product.slug] || product.image_url;
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`} className="bg-white rounded-3xl p-4 flex flex-col shadow-sm shadow-green-900/5 group">
                      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-5xl">{product.image_emoji || "🛒"}</span>
                        )}
                        {product.badge && (
                          <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md px-2 py-1 rounded-full">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{product.badge}</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-display text-sm font-bold text-gray-900 mb-1 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500 mb-4">{product.unit}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="font-bold text-green-700">₱{product.price.toFixed(2)}</span>
                          {product.old_price && (
                            <span className="text-[10px] text-slate-400 line-through">₱{product.old_price.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                            toast.success(`${product.name} added!`, { icon: "🛒", duration: 1500 });
                          }}
                          className="w-8 h-8 rounded-full signature-gradient flex items-center justify-center text-white active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Product Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dailyBestSells.map((product) => {
                  const deskImageUrl = PRODUCT_IMAGES[product.slug] || product.image_url;
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`} className="group">
                      <div className="relative aspect-[4/5] bg-gray-100 rounded-[1.5rem] overflow-hidden mb-4">
                        {deskImageUrl ? (
                          <img
                            src={deskImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {product.image_emoji || "🛒"}
                          </div>
                        )}
                        {product.badge && (
                          <span className="absolute top-4 left-4 glass-effect bg-green-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            {product.badge}
                          </span>
                        )}
                        <button className="absolute bottom-4 right-4 w-12 h-12 signature-gradient rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 font-display">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">per {product.unit}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-green-700">&#8369;{product.price.toFixed(2)}</span>
                        <div className="h-1 w-20 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Shop With Us - Mobile */}
      <section className="px-6 mb-16 md:hidden">
        <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 mb-8">Why Shop with Us?</h2>
        <div className="space-y-6">
          {[
            {
              icon: <Truck className="w-6 h-6" />,
              title: "Free & Fast Delivery",
              desc: "On all orders above ₱1,500. Your groceries arrive in under 2 hours.",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Freshness Guaranteed",
              desc: "If it's not fresh, we'll replace it for free. No questions asked.",
            },
            {
              icon: <Headphones className="w-6 h-6" />,
              title: "24/7 Concierge Support",
              desc: "Our friendly support team is here to help anytime.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5">
              <div className="w-12 h-12 flex-none rounded-2xl bg-green-700/10 flex items-center justify-center text-green-700">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Freshness Promised - Desktop */}
      <section className="hidden md:block mb-20">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="bg-gray-50 rounded-[3rem] py-24 px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 font-display mb-4">
                Freshness Promised, <br />Quality Delivered.
              </h2>
              <div className="w-24 h-1 signature-gradient rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  icon: <Truck className="w-8 h-8" />,
                  title: "Free & Fast Delivery",
                  desc: "Swift delivery on orders over ₱1,000, maintaining the cold chain from farm to your doorstep.",
                  bg: "bg-green-100",
                  color: "text-green-700",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Freshness Guaranteed",
                  desc: "If your produce isn't restaurant-quality fresh, we'll replace it immediately, no questions asked.",
                  bg: "bg-emerald-50",
                  color: "text-emerald-700",
                },
                {
                  icon: <Headphones className="w-8 h-8" />,
                  title: "24/7 Concierge",
                  desc: "Our support team is available around the clock to help with orders or product queries.",
                  bg: "bg-blue-50",
                  color: "text-blue-700",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomTabNav />
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
