"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { TopBar, Header, Footer } from "@/components/layout";
import { HeroBanner, PromoBanners } from "@/components/home";
import { CategoryCard, CategoryBar } from "@/components/categories";
import {
  ProductCard,
  ProductGrid,
  SmallProductCard,
} from "@/components/products";
import { CartDrawer } from "@/components/cart";
import { CountdownTimer } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";
import {
  getProducts,
  getFeaturedProducts,
  getDailyBestSellers,
  getTopProducts,
} from "@/lib/api";
import type { Product } from "@/types";

interface MainStorePageProps {
  onLogout: () => void;
}

export default function MainStorePage({ onLogout }: MainStorePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dailyBestSells, setDailyBestSells] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<{
    topSells: Product[];
    topRated: Product[];
    trending: Product[];
    recentlyAdded: Product[];
  }>({ topSells: [], topRated: [], trending: [], recentlyAdded: [] });
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filterTabs = ["All", "Cooking", "Meat", "Dairy", "Snacks"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar />

      {/* Header */}
      <Header onLogout={onLogout} />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Explore Categories
            </h2>
            <div className="hidden sm:flex items-center gap-2">
              {["All", "Cooking", "Meat", "Dairy", "Beverages"].map(
                (filter, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      i === 0
                        ? "bg-primary-500 text-white"
                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={{
                  id: `cat-${cat.id}`,
                  name: cat.name,
                  slug: cat.slug,
                  icon: cat.icon,
                  item_count: cat.itemCount,
                  sort_order: i,
                  is_active: true,
                  created_at: "",
                  updated_at: "",
                }}
              />
            ))}
            <button className="flex flex-col items-center justify-center flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 hover:bg-primary-100 transition-colors">
                <ChevronRight className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">View All</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Featured Products
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto">
              {filterTabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab.toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === tab.toLowerCase()
                      ? "bg-primary-500 text-white"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3" />
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
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
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                {["Featured", "Popular", "New"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3" />
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
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

      {/* Top Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Top Sells", products: topProducts.topSells },
              { title: "Top Rated", products: topProducts.topRated },
              { title: "Trending", products: topProducts.trending },
              { title: "Recently Added", products: topProducts.recentlyAdded },
            ].map(({ title, products }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-2">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-2 animate-pulse">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                          <div className="flex-1">
                            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                            <div className="bg-gray-200 h-3 rounded w-1/2" />
                          </div>
                        </div>
                      ))
                    : products.map((product) => (
                        <SmallProductCard key={product.id} product={product} />
                      ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
