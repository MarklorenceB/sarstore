"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Wallet,
  ArrowLeft,
  Check,
  Headphones,
} from "lucide-react";
import {
  useCartStore,
  useCartSubtotal,
  useCartItemCount,
  useCartDeliveryFee,
  useCartTotal,
} from "@/store/cart";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { STORE_INFO, DELIVERY_CONFIG } from "@/lib/constants";
import { formatPrice, isValidPhoneNumber } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import toast from "react-hot-toast";

type PaymentMethod = "cod" | "gcash";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartSubtotal();
  const itemCount = useCartItemCount();
  const deliveryFee = useCartDeliveryFee();
  const total = useCartTotal();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    gcashReference: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const name =
          user.user_metadata?.full_name || user.user_metadata?.name || "";
        if (name && !formData.name) {
          setFormData((prev) => ({ ...prev, name }));
        }
      }
    };
    getUser();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid Philippine phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    if (paymentMethod === "gcash" && !formData.gcashReference.trim()) {
      newErrors.gcashReference = "GCash reference number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
        },
        paymentMethod,
        gcashReference: formData.gcashReference,
        userId: userId || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
        })),
      });

      const orderDetails = {
        orderNumber: order.order_number,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerNotes: formData.notes,
        items: items.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          emoji: item.product.image_emoji,
          slug: item.product.slug,
          image_url: item.product.image_url,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        gcashReference: formData.gcashReference,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `order_${order.order_number}`,
          JSON.stringify(orderDetails),
        );
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/${order.order_number}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductImage = (slug: string, image_url?: string) => {
    return PRODUCT_IMAGES[slug] || image_url || null;
  };

  const estimatedTax = subtotal * 0.12;

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
        <div className="hidden lg:block">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <span className="text-6xl mb-4 block">🛒</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-6">Add some products to checkout</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </motion.div>
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>
    );
  }

  // Checkout form view
  if (showCheckoutForm) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex flex-col overflow-x-hidden">
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile header */}
        <header className="lg:hidden bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setShowCheckoutForm(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-xl">Secure Checkout</h1>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 lg:pt-24 lg:pb-20">
          {/* Page Header */}
          <div className="mb-6 lg:mb-10">
            <button
              onClick={() => setShowCheckoutForm(false)}
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Cart</span>
            </button>
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-1 lg:mb-2">Secure Checkout</h1>
            <p className="text-gray-500 text-sm lg:text-base">Review your items and select your preferred delivery options.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
              {/* Left Column - Forms */}
              <div className="lg:col-span-7 space-y-8 lg:space-y-10">
                {/* Delivery Details Section */}
                <section>
                  <div className="flex items-center gap-3 mb-4 lg:mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Delivery Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 p-5 lg:p-8 bg-white rounded-xl shadow-sm">
                    <div className="space-y-2">
                      <label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Juan Dela Cruz"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-sm lg:text-base ${errors.name ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="09XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-sm lg:text-base ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Shipping Address</label>
                      <textarea
                        placeholder="House/Unit No., Street, Barangay, City"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className={`w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all font-medium resize-none text-sm lg:text-base ${errors.address ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Delivery Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="Leave at the front desk, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-sm lg:text-base"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method Section */}
                <section>
                  <div className="flex items-center gap-3 mb-4 lg:mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-700">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Payment Method</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* COD Option */}
                    <label
                      className={`relative flex items-center p-4 lg:p-6 bg-white rounded-xl cursor-pointer border-2 transition-all hover:bg-gray-50 ${
                        paymentMethod === "cod"
                          ? "border-green-600 bg-green-50/50"
                          : "border-transparent shadow-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center ${paymentMethod === "cod" ? "text-green-700" : "text-gray-500"}`}>
                          <Wallet className="w-6 h-6 lg:w-7 lg:h-7" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm lg:text-base">Cash on Delivery</p>
                          <p className="text-xs lg:text-sm text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                      {paymentMethod === "cod" && (
                        <Check className="absolute right-4 lg:right-6 w-5 h-5 text-green-600" />
                      )}
                    </label>

                    {/* GCash Option */}
                    <label
                      className={`relative flex items-center p-4 lg:p-6 bg-white rounded-xl cursor-pointer border-2 transition-all hover:bg-gray-50 ${
                        paymentMethod === "gcash"
                          ? "border-green-600 bg-green-50/50"
                          : "border-transparent shadow-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="gcash"
                        checked={paymentMethod === "gcash"}
                        onChange={() => setPaymentMethod("gcash")}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center ${paymentMethod === "gcash" ? "text-green-700" : "text-gray-500"}`}>
                          <Wallet className="w-6 h-6 lg:w-7 lg:h-7" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm lg:text-base">GCash / E-Wallet</p>
                          <p className="text-xs lg:text-sm text-gray-500">Fast & secure payment</p>
                        </div>
                      </div>
                      {paymentMethod === "gcash" && (
                        <Check className="absolute right-4 lg:right-6 w-5 h-5 text-green-600" />
                      )}
                    </label>
                  </div>

                  {/* GCash Reference Input */}
                  {paymentMethod === "gcash" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-5 lg:p-8 bg-white rounded-xl shadow-sm"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">GCash Reference Number</label>
                        <p className="text-xs text-gray-500 ml-1 mb-2">Send to {STORE_INFO.gcashNumber}</p>
                        <input
                          type="text"
                          placeholder="Enter reference number after payment"
                          value={formData.gcashReference}
                          onChange={(e) => setFormData({ ...formData, gcashReference: e.target.value })}
                          className={`w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-sm lg:text-base ${errors.gcashReference ? 'ring-2 ring-red-400' : ''}`}
                        />
                        {errors.gcashReference && <p className="text-xs text-red-500 ml-1">{errors.gcashReference}</p>}
                      </div>
                    </motion.div>
                  )}
                </section>
              </div>

              {/* Right Column - Order Summary (Sticky) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="bg-white rounded-xl p-5 lg:p-8 shadow-sm overflow-hidden relative">
                  {/* Subtle background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-8 -mt-8"></div>

                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6 lg:mb-8 relative">Order Summary</h2>

                  {/* Product List */}
                  <div className="space-y-5 lg:space-y-6 mb-6 lg:mb-8 relative max-h-72 overflow-y-auto">
                    {items.map((item) => {
                      const imageUrl = getProductImage(item.product.slug, item.product.image_url);
                      return (
                        <div key={item.id} className="flex gap-3 lg:gap-4">
                          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {imageUrl ? (
                              <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl lg:text-3xl">{item.product.image_emoji || "📦"}</span>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-gray-900 leading-tight text-sm lg:text-base max-w-[180px] truncate">{item.product.name}</h3>
                              <p className="font-bold text-gray-900 text-sm lg:text-base whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] lg:text-xs font-semibold text-gray-500">Qty: {item.quantity}</span>
                              <span className="text-[10px] lg:text-xs text-gray-400 italic">{formatPrice(item.product.price)} / pc</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 pt-6 border-t border-dashed border-gray-200 mb-6 lg:mb-8">
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Delivery Fee</span>
                      <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Service Fee</span>
                      <span className="font-medium text-gray-900">{formatPrice(estimatedTax)}</span>
                    </div>
                    <div className="flex justify-between pt-4 text-lg font-bold text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-green-700">{formatPrice(total + estimatedTax)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full signature-gradient text-white font-bold text-base lg:text-lg shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Placing Order..." : "Place Order"}</span>
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                    Encrypted & Secure Checkout
                  </p>
                </div>

                {/* Assistance Card */}
                <div className="mt-4 lg:mt-6 p-4 lg:p-6 bg-gray-100 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Need help with your order?</p>
                    <p className="text-xs text-gray-500">Chat with our support team 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>

        <div className="hidden lg:block">
          <Footer />
        </div>

      </div>
    );
  }

  // Main cart/basket view
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-xl">My Basket</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-12 lg:pt-24">
        {/* Page Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="hidden lg:block text-5xl font-extrabold tracking-tight text-gray-900">
            My Basket
          </h1>
          <p className="text-gray-500 mt-1 lg:mt-3 text-sm lg:text-lg">
            {itemCount} {itemCount === 1 ? "item" : "items"} selected
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const imageUrl = getProductImage(
                  item.product.slug,
                  item.product.image_url,
                );
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-4 lg:gap-8 bg-white p-4 lg:p-6 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 lg:w-40 lg:h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl lg:text-6xl">
                          {item.product.image_emoji || "📦"}
                        </span>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-base lg:text-xl font-bold text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs lg:text-sm text-gray-500 mt-0.5">
                            {item.product.unit ? `per ${item.product.unit}` : ""}
                            {item.product.description
                              ? ` - ${item.product.description}`
                              : ""}
                          </p>
                        </div>
                        <p className="text-base lg:text-xl font-bold text-green-700 whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Bottom Row: Quantity Controls + Remove */}
                      <div className="flex items-center justify-between mt-3 lg:mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                              )
                            }
                            className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
                          </button>
                          <span className="w-8 lg:w-10 text-center font-semibold text-sm lg:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                              )
                            }
                            className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden lg:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium text-sm mt-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 lg:p-8 shadow-sm"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm lg:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm lg:text-base">
                  <span className="text-gray-600">Standard Delivery</span>
                  <span className="font-medium text-green-600">
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm lg:text-base">
                  <span className="text-gray-600">Estimated Taxes</span>
                  <span className="font-medium">
                    {formatPrice(estimatedTax)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg lg:text-xl font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {formatPrice(total + estimatedTax)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button - Desktop only (mobile uses sticky bar) */}
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="hidden lg:flex signature-gradient w-full py-4 lg:py-5 rounded-full text-white font-bold text-base lg:text-lg shadow-lg items-center justify-center gap-2 hover:opacity-95 transition-opacity active:scale-[0.98] mt-6"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Scheduled Delivery Info */}
              <div className="mt-6 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Scheduled Delivery
                  </p>
                  <p className="text-xs lg:text-sm text-green-700 mt-0.5">
                    Earliest: Tomorrow, 8:00 AM - 10:00 AM
                  </p>
                </div>
              </div>

              {/* Accepted Payments */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3">Accepted Payments</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Wallet className="w-6 h-6" />
                    <span className="text-xs font-medium">COD</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-medium">GCash</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile bottom sticky checkout bar */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-extrabold text-gray-900">
            {formatPrice(total + estimatedTax)}
          </span>
        </div>
        <button
          onClick={() => setShowCheckoutForm(true)}
          className="signature-gradient w-full py-3.5 rounded-full text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-opacity active:scale-[0.98]"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
