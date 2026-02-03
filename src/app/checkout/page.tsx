"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  FileText,
  CreditCard,
  Check,
} from "lucide-react";
import {
  useCartStore,
  useCartSubtotal,
  useCartDeliveryFee,
  useCartTotal,
} from "@/store/cart";
import { Button, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/Input";
import { STORE_INFO, DELIVERY_CONFIG } from "@/lib/constants";
import { formatPrice, isValidPhoneNumber } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import toast from "react-hot-toast";

type PaymentMethod = "cod" | "gcash";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartSubtotal();
  const deliveryFee = useCartDeliveryFee();
  const total = useCartTotal();

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
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
        })),
      });

      // Save order details for confirmation page
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

      // Store in localStorage for order confirmation page
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

  // Helper function to get product image
  const getProductImage = (slug: string, image_url?: string) => {
    return PRODUCT_IMAGES[slug] || image_url || null;
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
    );
  }

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
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Juan Dela Cruz"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="09XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    error={errors.phone}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <Textarea
                    label="Complete Address"
                    placeholder="House/Unit No., Street, Barangay, City"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    error={errors.address}
                    rows={3}
                  />
                  <Textarea
                    label="Delivery Notes (Optional)"
                    placeholder="Landmarks, special instructions, etc."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <span className="text-3xl">💵</span>
                    <div className="flex-1">
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">
                        Pay when you receive your order
                      </p>
                    </div>
                    {paymentMethod === "cod" && (
                      <Check className="w-5 h-5 text-primary-500" />
                    )}
                  </label>

                  {/* GCash Option */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "gcash"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="gcash"
                      checked={paymentMethod === "gcash"}
                      onChange={() => setPaymentMethod("gcash")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "gcash"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "gcash" && (
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <span className="text-3xl">📱</span>
                    <div className="flex-1">
                      <p className="font-semibold">GCash</p>
                      <p className="text-sm text-gray-500">
                        Send to {STORE_INFO.gcashNumber}
                      </p>
                    </div>
                    {paymentMethod === "gcash" && (
                      <Check className="w-5 h-5 text-primary-500" />
                    )}
                  </label>

                  {/* GCash Reference Input */}
                  {paymentMethod === "gcash" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2"
                    >
                      <Input
                        label="GCash Reference Number"
                        placeholder="Enter reference number after payment"
                        value={formData.gcashReference}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gcashReference: e.target.value,
                          })
                        }
                        error={errors.gcashReference}
                        leftIcon={<FileText className="w-4 h-4" />}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24"
              >
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const imageUrl = getProductImage(
                      item.product.slug,
                      item.product.image_url,
                    );
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.name}
                              className="w-full  object-cover"
                            />
                          ) : (
                            <span className="text-2xl">
                              {item.product.image_emoji || "📦"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(item.product.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span
                      className={
                        deliveryFee === 0 ? "text-primary-600 font-medium" : ""
                      }
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {subtotal < DELIVERY_CONFIG.freeDeliveryThreshold && (
                    <p className="text-xs text-gray-500">
                      Add{" "}
                      {formatPrice(
                        DELIVERY_CONFIG.freeDeliveryThreshold - subtotal,
                      )}{" "}
                      more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  isLoading={isSubmitting}
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
