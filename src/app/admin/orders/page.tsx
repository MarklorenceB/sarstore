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
  Search,
  Shield,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAllOrders, updateOrderStatus } from "@/lib/api";
import { isAdmin } from "@/lib/constants";
import { formatPrice, formatRelativeTime, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

type FilterTab = "all" | OrderStatus;

export default function AdminOrdersPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Load orders (extracted so real-time can call it without resetting loading)
  const refreshOrders = async () => {
    const allOrders = await getAllOrders();
    setOrders(allOrders);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user || !isAdmin(user.email)) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);
      await refreshOrders();
      setIsLoading(false);
    };

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });
    return () => subscription.unsubscribe();
  }, []);

  // Real-time subscription for orders table
  useEffect(() => {
    if (!isAuthorized) return;

    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          toast.success(
            `New order from ${(payload.new as any).customer_name || "a customer"}!`,
            { duration: 5000 },
          );
          refreshOrders();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => {
          refreshOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    setUpdatingOrderId(orderId);
    setOpenDropdownId(null);

    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
            : o,
        ),
      );
      toast.success(`Order status updated to ${getStatusLabel(newStatus)}`);
    } else {
      toast.error("Failed to update order status");
    }

    setUpdatingOrderId(null);
  };

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

  // Not logged in or not admin
  if (!isLoading && (!user || !isAuthorized)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-500 mb-6">
            You don&apos;t have permission to access this page.
          </p>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl">Admin Orders</h1>
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                Admin
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
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
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
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
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "Orders will appear here when customers place them."}
            </p>
          </motion.div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const statusConfig =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const itemCount = order.items?.length || 0;
              const firstItems = order.items?.slice(0, 2) || [];
              const remainingCount = itemCount > 2 ? itemCount - 2 : 0;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={`/order/${order.order_number}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-primary-600 transition-colors"
                      >
                        #{order.order_number}
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatRelativeTime(order.created_at)}
                      </p>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === order.id ? null : order.id,
                          )
                        }
                        disabled={updatingOrderId === order.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50`}
                      >
                        {updatingOrderId === order.id ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          statusConfig.icon
                        )}
                        <span>{getStatusLabel(order.status)}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openDropdownId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                          >
                            {ALL_STATUSES.map((status) => {
                              const config = STATUS_CONFIG[status];
                              const isActive = order.status === status;
                              return (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(order.id, status)
                                  }
                                  disabled={isActive}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                    isActive
                                      ? "bg-gray-50 text-gray-400 cursor-default"
                                      : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  <span className={config.color}>
                                    {config.icon}
                                  </span>
                                  <span>{getStatusLabel(status)}</span>
                                  {isActive && (
                                    <span className="ml-auto text-xs text-gray-400">
                                      Current
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {order.customer_address}
                    </p>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-1.5 mb-3">
                    {firstItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700 truncate flex-1">
                          {item.product_name} x{item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium ml-2">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <p className="text-xs text-gray-400">
                        +{remainingCount} more item
                        {remainingCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </p>
                    <p className="font-bold text-primary-600 text-base sm:text-lg">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Click outside to close dropdowns */}
      {openDropdownId && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenDropdownId(null)}
        />
      )}
    </div>
  );
}
