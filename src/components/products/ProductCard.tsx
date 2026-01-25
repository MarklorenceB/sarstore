"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Badge, DiscountBadge, StarRating } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const discount = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);

    // Custom styled toast
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: t.visible ? 1 : 0,
            scale: t.visible ? 1 : 0.8,
            y: t.visible ? 0 : 20,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-sm w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">{product.image_emoji || "📦"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  Added to Cart!
                </span>
              </div>
              <p className="font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-primary-600 font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
            <Link
              href="/checkout"
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors text-center"
            >
              Checkout
            </Link>
          </div>
        </motion.div>
      ),
      { duration: 3000, position: "top-center" },
    );

    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      updateQuantity(product.id, quantity + 1);
      toast.success(`${product.name} (${quantity + 1})`, {
        icon: "➕",
        duration: 1000,
      });
    } else {
      handleAddToCart(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 1) {
      // Custom remove confirmation toast
      toast.custom(
        (t) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: t.visible ? 1 : 0, scale: t.visible ? 1 : 0.8 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-sm w-full text-center"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Remove Item?</h3>
            <p className="text-gray-500 text-sm mb-4">
              Remove {product.name} from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeItem(product.id);
                  toast.dismiss(t.id);
                  toast.success("Removed from cart", {
                    icon: "✓",
                    duration: 1500,
                  });
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ),
        { duration: 10000, position: "top-center" },
      );
    } else {
      updateQuantity(product.id, quantity - 1);
      toast.success(`${product.name} (${quantity - 1})`, {
        icon: "➖",
        duration: 1000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative p-3 sm:p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.badge && (
            <Badge variant={product.badge}>{product.badge}</Badge>
          )}
          {discount > 0 && <DiscountBadge discount={discount} />}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-4xl sm:text-5xl md:text-6xl">
                {product.image_emoji || "📦"}
              </span>
            )}
          </div>
        </Link>

        {/* Out of Stock Overlay */}
        {!product.is_available && (
          <div className="absolute inset-3 sm:inset-4 bg-black/50 rounded-xl flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 pt-0 flex-1 flex flex-col">
        {/* Unit */}
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
          {product.unit}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-primary-600 transition-colors mb-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="mb-2">
            <StarRating
              rating={product.rating}
              reviews={product.review_count}
              size="sm"
            />
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Section */}
          {product.is_available !== false && (
            <div className="w-full">
              {isInCart ? (
                /* Quantity Controls */
                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={handleDecrement}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-gray-900 text-base sm:text-lg min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                /* Add to Cart Button */
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-10 sm:h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? "bg-green-500 text-white"
                      : "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/20"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
