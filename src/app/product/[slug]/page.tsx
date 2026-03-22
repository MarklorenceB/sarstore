"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Leaf,
  Package2,
  Heart,
  Star,
  Truck,
  PlayCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/lib/api";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { Header, Footer } from "@/components/layout";
import { CartDrawer } from "@/components/cart";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const cartItem = product
    ? cartItems.find((item) => item.product.id === product.id)
    : null;
  const cartQuantity = cartItem?.quantity || 0;

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();
        setAllProducts(products);
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

  // Get image URL - prioritize local images, then database, then emoji
  const imageUrl = product
    ? PRODUCT_IMAGES[product.slug] || product.image_url
    : null;

  // Related products from same category
  const relatedProducts = product
    ? allProducts
        .filter((p) => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 4)
    : [];

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
            <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
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
              Checkout
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

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package2 className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 signature-gradient text-white px-8 py-3 rounded-full font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-white pb-28 md:pb-0">
      {/* ─── Desktop Navigation ─── */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* ─── Mobile Fixed Header ─── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Sari-Store</h1>
          <Link
            href="/checkout"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 text-gray-800" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ─── Mobile Hero Image ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden relative w-full aspect-[4/5] bg-gray-100 mt-14"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <span className="text-[120px]">{product.image_emoji || "📦"}</span>
          </div>
        )}

        {/* Badge overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize shadow-lg">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </span>
          )}
        </div>
      </motion.div>

      {/* ─── Mobile Content Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="md:hidden -mt-10 relative z-10 bg-white rounded-t-[2.5rem] p-8 shadow-[0_-12px_40px_rgba(0,0,0,0.04)]"
      >
        {/* Product name & unit */}
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
          {product.name}
        </h2>
        <p className="text-gray-500 font-medium mt-1">{product.unit}</p>

        {/* Price row */}
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-2xl font-black text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.old_price && (
            <span className="text-base text-gray-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
          <span className="text-xs text-gray-400 font-medium">Per unit</span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-500 leading-relaxed mt-4 text-sm">
            {product.description}
          </p>
        )}

        {/* Already in cart indicator */}
        {cartQuantity > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-primary-600">
            <Check className="w-4 h-4" />
            <span>
              You have <span className="font-bold">{cartQuantity}</span> in your cart
            </span>
          </div>
        )}

        {/* ─── Info Boxes ─── */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-400 font-medium">Type</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 capitalize">
              {product.badge || "Standard"}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Package2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-400 font-medium">Stock</span>
            </div>
            <span
              className={`text-sm font-semibold ${
                product.is_available !== false
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {product.is_available !== false ? "Available Now" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* ─── Quantity + Add to Cart ─── */}
        {product.is_available !== false && (
          <div className="flex items-center gap-3 mt-6">
            {/* Quantity selector */}
            <div className="flex items-center bg-gray-100 rounded-full p-1.5 h-14">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-10 text-center font-bold text-lg select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Add to Cart button */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all text-white ${
                isAdding
                  ? "bg-green-500"
                  : "signature-gradient shadow-lg shadow-primary-500/25"
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-5 h-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* ─── Accordion Sections ─── */}
        <div className="mt-8">
          {/* Product Details */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleAccordion("details")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="text-base font-semibold text-gray-900">
                Product Details
              </span>
              {openAccordion === "details" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openAccordion === "details" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-4"
              >
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Unit</span>
                    <span className="font-medium text-gray-700">{product.unit}</span>
                  </div>
                  {product.stock_quantity > 0 && (
                    <div className="flex justify-between">
                      <span>Available Quantity</span>
                      <span className="font-medium text-gray-700">
                        {product.stock_quantity}
                      </span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between">
                      <span>Category</span>
                      <span className="font-medium text-gray-700">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Nutrition Information */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleAccordion("nutrition")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="text-base font-semibold text-gray-900">
                Nutrition Information
              </span>
              {openAccordion === "nutrition" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openAccordion === "nutrition" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-4"
              >
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description ||
                    "Nutrition information is not available for this product. Please check the product packaging for detailed nutritional facts."}
                </p>
              </motion.div>
            )}
          </div>

          {/* Storage Tips */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleAccordion("storage")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="text-base font-semibold text-gray-900">
                Storage Tips
              </span>
              {openAccordion === "storage" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openAccordion === "storage" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-4"
              >
                <p className="text-sm text-gray-500 leading-relaxed">
                  Store in a cool, dry place away from direct sunlight. Once opened,
                  refrigerate and consume within the recommended time. Always check
                  the expiry date before use.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ─── You Might Also Like (mobile) ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-extrabold text-gray-900 mb-4">
              You might also like
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((rp) => {
                const rpImage = PRODUCT_IMAGES[rp.slug] || rp.image_url;
                return (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.slug}`}
                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {rpImage ? (
                        <img
                          src={rpImage}
                          alt={rp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl">
                            {rp.image_emoji || "📦"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {rp.name}
                      </p>
                      <p className="text-primary-600 font-bold text-sm mt-0.5">
                        {formatPrice(rp.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ─── Desktop Layout (Matches mockup exactly) ─── */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            {product.category && (
              <>
                <Link href={`/category/${product.category.slug || ''}`} className="hover:text-green-700 transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Product Image Section */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative group bg-white rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                    <span className="text-[120px]">{product.image_emoji || "📦"}</span>
                  </div>
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.badge && (
                    <span className="glass-effect bg-green-500/80 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                      {product.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="glass-effect bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                      {discount}% Off
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Asymmetric Grid */}
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-2 cursor-pointer hover:ring-2 ring-green-500/30 transition-all">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`${product.name} view ${i + 1}`}
                        className="rounded-lg object-cover w-full h-20"
                      />
                    ) : (
                      <div className="rounded-lg w-full h-20 bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl">{product.image_emoji || "📦"}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-white rounded-xl p-2 cursor-pointer border-2 border-green-600 ring-offset-2">
                  <div className="w-full h-20 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <p className="text-green-700 font-bold tracking-widest text-xs uppercase mb-2">Sari-Store&apos;s Selection</p>
                <h1 className="text-5xl font-extrabold tracking-tighter leading-tight mb-4 font-display">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <Star className="w-5 h-5 fill-amber-400/50 text-amber-400" />
                  </div>
                  <span className="text-gray-500 text-sm font-medium">(128 Reviews)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-display">{formatPrice(product.price)}</span>
                  {product.old_price && (
                    <span className="text-gray-400 text-lg line-through ml-2">{formatPrice(product.old_price)}</span>
                  )}
                  <span className="text-gray-500 text-lg">per {product.unit}</span>
                </div>
              </div>

              <div className="space-y-4">
                {product.description && (
                  <p className="text-gray-500 leading-relaxed">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    <Package2 className="w-3.5 h-3.5" />
                    {product.is_available !== false ? "High Stock" : "Out of Stock"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    <Truck className="w-3.5 h-3.5" />
                    Same Day Delivery
                  </div>
                </div>
              </div>

              {/* Already in cart indicator */}
              {cartQuantity > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>
                    You have <span className="font-bold">{cartQuantity}</span> in your cart
                  </span>
                </div>
              )}

              {/* Action Section */}
              {product.is_available !== false && (
                <div className="bg-gray-50 p-8 rounded-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Select Quantity</label>
                    <div className="flex items-center bg-white rounded-full p-1 border border-gray-200/50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors active:scale-90"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold font-display">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleAddToCart}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 h-14 rounded-full font-bold font-display flex items-center justify-center gap-3 transition-all text-white shadow-lg shadow-green-500/20 ${
                        isAdding ? "bg-green-500" : "signature-gradient"
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </motion.button>
                    <button className="w-14 h-14 bg-white text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300 border border-gray-200/50">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Accordions (Product Details) */}
              <div className="space-y-0 border-t border-slate-200/50">
                <details className="group" open>
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-bold font-display text-gray-900 hover:text-green-700 transition-colors">
                    Product Details
                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pb-6 text-sm text-gray-500 leading-relaxed space-y-2">
                    <div className="grid grid-cols-2">
                      <span>Unit</span>
                      <span className="font-bold text-right text-gray-700">{product.unit}</span>
                    </div>
                    {product.stock_quantity > 0 && (
                      <div className="grid grid-cols-2">
                        <span>Available Quantity</span>
                        <span className="font-bold text-right text-gray-700">{product.stock_quantity}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="grid grid-cols-2">
                        <span>Category</span>
                        <span className="font-bold text-right text-gray-700">{product.category.name}</span>
                      </div>
                    )}
                  </div>
                </details>
                <details className="group border-t border-slate-200/50">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-bold font-display text-gray-900 hover:text-green-700 transition-colors">
                    Nutrition Information
                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pb-6 space-y-3">
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-500">Serving Size</span>
                      <span className="font-bold text-right">1 {product.unit}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="font-bold text-right">{product.category?.name || "General"}</span>
                    </div>
                  </div>
                </details>
                <details className="group border-t border-slate-200/50">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-bold font-display text-gray-900 hover:text-green-700 transition-colors">
                    Storage Tips
                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pb-6 text-sm text-gray-500 leading-relaxed">
                    <p>Store in a cool, dry place away from direct sunlight. Once opened, refrigerate and consume within the recommended time. Always check the expiry date before use.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* You Might Also Like Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-32">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-green-700 font-bold tracking-widest text-xs uppercase mb-2">Curated Pairings</p>
                  <h2 className="text-3xl font-extrabold tracking-tighter font-display">You might also like</h2>
                </div>
                <Link
                  href={`/category/${product.category?.slug || ''}`}
                  className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-700 transition-colors"
                >
                  View full selection
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {relatedProducts.map((rp) => {
                  const rpImage = PRODUCT_IMAGES[rp.slug] || rp.image_url;
                  return (
                    <Link key={rp.id} href={`/product/${rp.slug}`} className="group cursor-pointer">
                      <div className="bg-gray-50 rounded-xl aspect-square overflow-hidden mb-4 relative">
                        {rpImage ? (
                          <img
                            src={rpImage}
                            alt={rp.name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl">{rp.image_emoji || "📦"}</span>
                          </div>
                        )}
                        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold font-display text-lg group-hover:text-green-700 transition-colors">{rp.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(rp.price)} · per {rp.unit}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* Desktop Footer */}
        <Footer />
      </div>

      {/* ─── Sticky Bottom Bar (mobile only) ─── */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-slate-900/90 backdrop-blur rounded-[2rem] px-5 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                Total
              </p>
              <p className="text-white font-bold text-lg leading-tight">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
          <Link
            href="/checkout"
            className="signature-gradient text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg"
          >
            Checkout
          </Link>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
