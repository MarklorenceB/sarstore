"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChefHat,
  ShoppingBag,
  ChevronRight,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getUserOrders } from "@/lib/api";
import { formatPrice, formatRelativeTime, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import type { Order, OrderStatus } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ─── Smart image finder ─────────────────────────────────────
// Tries multiple strategies to find the product image:
// 1. Direct slug from item.slug (localStorage new orders)
// 2. Product join slug from item.product.slug (Supabase orders)
// 3. Convert product_name → slug format and look up
// 4. Fuzzy match against all PRODUCT_IMAGES keys
// 5. Fall back to item.product.image_url or item.image_url
function findProductImage(item: any): string | null {
  // Strategy 1: direct slug (from localStorage)
  if (item.slug && PRODUCT_IMAGES[item.slug]) {
    return PRODUCT_IMAGES[item.slug];
  }

  // Strategy 2: product join slug (from Supabase)
  if (item.product?.slug && PRODUCT_IMAGES[item.product.slug]) {
    return PRODUCT_IMAGES[item.product.slug];
  }

  // Strategy 3: convert product_name to slug and look up
  const name = item.product_name || item.product?.name || "";
  if (name) {
    const derivedSlug = name
      .toLowerCase()
      .replace(/[()]/g, " ") // remove parentheses
      .replace(/pcs/g, "") // remove "pcs"
      .trim()
      .replace(/\s+/g, "-") // spaces to dashes
      .replace(/-+/g, "-") // collapse multiple dashes
      .replace(/-$/, ""); // remove trailing dash

    if (PRODUCT_IMAGES[derivedSlug]) {
      return PRODUCT_IMAGES[derivedSlug];
    }

    // Strategy 4: fuzzy match — find a key where derivedSlug starts with it
    const keys = Object.keys(PRODUCT_IMAGES);
    for (const key of keys) {
      if (derivedSlug.startsWith(key) || key.startsWith(derivedSlug)) {
        return PRODUCT_IMAGES[key];
      }
    }

    // Strategy 5: check if name contains all parts of a PRODUCT_IMAGES key
    const nameLower = name.toLowerCase();
    for (const key of keys) {
      const keyParts = key.split("-");
      if (
        keyParts.length >= 2 &&
        keyParts.every((part: string) => nameLower.includes(part))
      ) {
        return PRODUCT_IMAGES[key];
      }
    }
  }

  // Strategy 6: image_url from Supabase product join or localStorage
  if (item.product?.image_url) return item.product.image_url;
  if (item.image_url) return item.image_url;

  return null;
}

// Get emoji fallback
function getItemEmoji(item: any): string {
  return item.image_emoji || item.product?.image_emoji || item.emoji || "📦";
}

// ─── Status config ──────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  confirmed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  preparing: {
    icon: <ChefHat className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  out_for_delivery: {
    icon: <Truck className="w-4 h-4" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  delivered: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  cancelled: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

type FilterTab = "all" | OrderStatus;

// ─── Component ──────────────────────────────────────────────
export default function MyOrdersPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setIsLoading(false);
        return;
      }

      // 1) Fetch from Supabase (now includes product join for images)
      const supabaseOrders = await getUserOrders(user.id);

      // 2) Also check localStorage for offline/mock orders
      const localOrders: Order[] = [];
      if (typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("order_")) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || "{}");
              if (data.orderNumber) {
                const localOrder: Order = {
                  id: key,
                  order_number: data.orderNumber,
                  customer_name: data.customerName,
                  customer_phone: data.customerPhone,
                  customer_address: data.customerAddress,
                  customer_notes: data.customerNotes,
                  status: "pending" as OrderStatus,
                  subtotal: data.subtotal,
                  delivery_fee: data.deliveryFee,
                  total: data.total,
                  items: data.items?.map((item: any, idx: number) => ({
                    id: `local-item-${idx}`,
                    order_id: key,
                    product_id: "",
                    product_name: item.name,
                    product_price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                    created_at: data.createdAt,
                    // Carry over image fields from localStorage
                    slug: item.slug || "",
                    image_url: item.image_url || "",
                    image_emoji: item.emoji || "",
                  })),
                  created_at: data.createdAt,
                  updated_at: data.createdAt,
                };
                localOrders.push(localOrder);
              }
            } catch {
              // Skip invalid
            }
          }
        }
      }

      // 3) Merge & deduplicate
      const supabaseNums = new Set(supabaseOrders.map((o) => o.order_number));
      const uniqueLocal = localOrders.filter(
        (o) => !supabaseNums.has(o.order_number),
      );
      const all = [...supabaseOrders, ...uniqueLocal].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setOrders(all);
      setIsLoading(false);
    };

    loadOrders();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadOrders();
    });
    return () => subscription.unsubscribe();
  }, []);

  // Filtered list
  const filteredOrders = orders.filter((order) => {
    const matchFilter = activeFilter === "all" || order.status === activeFilter;
    const matchSearch =
      searchQuery === "" ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: orders.length },
    {
      key: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      count: orders.filter((o) => o.status === "confirmed").length,
    },
    {
      key: "preparing",
      label: "Preparing",
      count: orders.filter((o) => o.status === "preparing").length,
    },
    {
      key: "out_for_delivery",
      label: "On the Way",
      count: orders.filter((o) => o.status === "out_for_delivery").length,
    },
    {
      key: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  // ── Not logged in ──
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view orders
          </h1>
          <p className="text-gray-500 mb-6">
            You need to be logged in to see your order history.
          </p>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Main page ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-xl">My Orders</h1>
            <p className="text-sm text-gray-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-2">
            {filterTabs.map((tab) =>
              tab.count > 0 || tab.key === "all" ? (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === tab.key
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-1.5 text-xs ${
                        activeFilter === tab.key
                          ? "text-primary-100"
                          : "text-gray-400"
                      }`}
                    >
                      ({tab.count})
                    </span>
                  )}
                </button>
              ) : null,
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No orders found" : "No orders yet"}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try a different search term"
                : "When you place an order, it will appear here."}
            </p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </motion.div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const statusConfig =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const itemCount = order.items?.length || 0;
              const firstItems = order.items?.slice(0, 3) || [];
              const remainingCount = itemCount > 3 ? itemCount - 3 : 0;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link href={`/order/${order.order_number}`}>
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-gray-900 text-sm sm:text-base">
                            #{order.order_number}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatRelativeTime(order.created_at)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}
                        >
                          {statusConfig.icon}
                          <span className="hidden sm:inline">
                            {getStatusLabel(order.status)}
                          </span>
                          <span className="sm:hidden">
                            {getStatusLabel(order.status).split(" ")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="space-y-2.5 mb-4">
                        {firstItems.map((item: any, idx: number) => {
                          const imageUrl = findProductImage(item);
                          const emoji = getItemEmoji(item);

                          return (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.product_name}
                                    className="w-full  object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <span className="text-lg sm:text-xl">
                                    {emoji}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(item.product_price)} ×{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-sm text-gray-900">
                                {formatPrice(item.subtotal)}
                              </p>
                            </div>
                          );
                        })}
                        {remainingCount > 0 && (
                          <p className="text-xs text-gray-400 pl-[52px] sm:pl-[60px]">
                            +{remainingCount} more item
                            {remainingCount > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-primary-600 text-base sm:text-lg">
                            {formatPrice(order.total)}
                          </p>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
