"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { TopBar, Header, Footer } from "@/components/layout";
import { CartDrawer } from "@/components/cart";
import { Button, StarRating } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/lib/api";
import { DELIVERY_CONFIG } from "@/lib/constants";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const cartItem = product
    ? cartItems.find((item) => item.product.id === product.id)
    : null;
  const cartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();
        const found = products.find((p) => p.slug === slug);
        setProduct(found || null);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

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
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-md w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl">{product.image_emoji || "📦"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </span>
                <span className="text-green-600 font-bold">Added to Cart!</span>
              </div>
              <p className="font-semibold text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-sm text-gray-500">Quantity: {quantity}</p>
              <p className="text-primary-600 font-bold text-lg">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
            <Link
              href="/checkout"
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
            >
              Checkout →
            </Link>
          </div>
        </motion.div>
      ),
      { duration: 4000, position: "top-center" },
    );

    setQuantity(1);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const discount = product?.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block animate-bounce">🛒</span>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😢</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Shop</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="aspect-square bg-white rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[120px] sm:text-[180px]">
                    {product.image_emoji || "📦"}
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-lg capitalize">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Unit */}
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {product.unit}
            </span>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3">
                <StarRating
                  rating={product.rating}
                  reviews={product.review_count}
                  size="lg"
                />
                <span className="text-sm text-gray-500">
                  ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.old_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.old_price)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Save {formatPrice(product.old_price! - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.is_available !== false ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600 font-medium">In Stock</span>
                  {product.stock_quantity && (
                    <span className="text-gray-400 text-sm">
                      ({product.stock_quantity} available)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.is_available !== false && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    isAdding
                      ? "bg-green-500 text-white"
                      : "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-6 h-6" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart - {formatPrice(product.price * quantity)}
                    </>
                  )}
                </motion.button>

                {/* Already in cart indicator */}
                {cartQuantity > 0 && (
                  <p className="text-center text-sm text-gray-500">
                    ✓ You have{" "}
                    <span className="font-bold text-primary-600">
                      {cartQuantity}
                    </span>{" "}
                    in your cart
                  </p>
                )}
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Over ₱{DELIVERY_CONFIG.freeDeliveryThreshold}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Fresh Guarantee
                  </p>
                  <p className="text-xs text-gray-500">100% quality</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    {DELIVERY_CONFIG.estimatedTime}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
