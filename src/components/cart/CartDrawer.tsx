"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCartStore, useCartSubtotal, useCartItemCount } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_CONFIG } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { PRODUCT_IMAGES } from "@/lib/product-images";

export default function CartDrawer() {
  const router = useRouter();
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartSubtotal();
  const itemCount = useCartItemCount();

  const deliveryFee =
    subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold
      ? 0
      : DELIVERY_CONFIG.baseFee;
  const serviceFee = 0;
  const total = subtotal + deliveryFee + serviceFee;
  const amountForFreeDelivery =
    DELIVERY_CONFIG.freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min(
    (subtotal / DELIVERY_CONFIG.freeDeliveryThreshold) * 100,
    100,
  );

  // Helper function to get product image
  const getProductImage = (slug: string, image_url?: string) => {
    return PRODUCT_IMAGES[slug] || image_url || null;
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-gray-900">
                    My Basket
                  </h2>
                  <p className="text-sm text-gray-500">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your basket
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-primary-300" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                    Your basket is empty
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Add some products to get started!
                  </p>
                  <Button onClick={closeCart}>Continue Shopping</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Free Delivery Progress */}
                  {amountForFreeDelivery > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm shadow-green-900/5">
                      <p className="text-sm text-primary-700 mb-2">
                        Add{" "}
                        <span className="font-bold">
                          {formatPrice(amountForFreeDelivery)}
                        </span>{" "}
                        more for FREE delivery!
                      </p>
                      <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                          style={{ width: `${freeDeliveryProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {items.map((item) => {
                    const imageUrl = getProductImage(
                      item.product.slug,
                      item.product.image_url,
                    );

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-4 shadow-sm shadow-green-900/5 flex items-center gap-3"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">
                              {item.product.image_emoji || "📦"}
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-sm text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.product.unit || "per piece"}
                          </p>
                          <p className="text-primary-600 font-bold text-sm mt-1">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="bg-gray-100 rounded-full px-2 py-1 flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Minus className="w-3 h-3 text-primary-600" />
                            </button>
                            <span className="font-bold text-sm w-5 text-center text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Plus className="w-3 h-3 text-primary-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-sm text-gray-400 hover:text-red-500 py-2 transition-colors"
                  >
                    Clear Cart
                  </button>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-[2rem] p-8 mt-8">
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-700">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span
                          className={
                            deliveryFee === 0
                              ? "text-primary-600 font-medium"
                              : "font-medium text-gray-700"
                          }
                        >
                          {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Fee</span>
                        <span className="font-medium text-gray-700">
                          {serviceFee === 0 ? "FREE" : formatPrice(serviceFee)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                        <span className="font-bold text-xl text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl text-primary-600 font-extrabold">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Checkout Button */}
            {items.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg px-6 pt-4 pb-6 shadow-[0_-4px_24px_rgba(0,110,47,0.08)] rounded-t-[2.5rem]">
                <button
                  onClick={handleCheckout}
                  className="signature-gradient w-full py-5 rounded-full text-white font-bold text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
