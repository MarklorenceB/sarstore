"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
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
  const total = subtotal + deliveryFee;
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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-lg">
                  Shopping Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-6xl mb-4">🛒</span>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some products to get started!
                  </p>
                  <Button onClick={closeCart}>Continue Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const imageUrl = getProductImage(
                      item.product.slug,
                      item.product.image_url,
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        {/* Image / Emoji */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden">
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

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {item.product.name}
                          </h4>

                          <p className="text-primary-600 font-bold text-sm">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="font-medium w-6 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-7 h-7 rounded bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="ml-auto p-1.5 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-gray-900 text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-sm text-gray-500 hover:text-red-500 py-2"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Free Delivery Progress */}
                {amountForFreeDelivery > 0 && (
                  <div className="bg-primary-50 p-3 rounded-xl">
                    <p className="text-sm text-primary-700 mb-2">
                      Add{" "}
                      <span className="font-bold">
                        {formatPrice(amountForFreeDelivery)}
                      </span>{" "}
                      more for FREE delivery!
                    </p>
                    <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span
                      className={
                        deliveryFee === 0 ? "text-primary-600 font-medium" : ""
                      }
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button onClick={handleCheckout} size="lg" className="w-full">
                  Checkout → {formatPrice(total)}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
