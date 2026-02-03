"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Delivery Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 text-white overflow-hidden group cursor-pointer"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <span className="inline-block text-sm font-semibold bg-white/20 px-3 py-1 rounded-full mb-4">
                FREE
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                Free delivery
              </h3>
              <p className="text-primary-100 mb-6 max-w-xs">
                Shop your favorite products and get free delivery anywhere.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors group-hover:gap-3"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Floating emoji */}
            <div className="absolute bottom-4 right-4 text-6xl opacity-20">
              🚚
            </div>
          </motion.div>

          {/* Discount Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-r from-accent-400 to-accent-500 rounded-3xl p-8 text-white overflow-hidden group cursor-pointer"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <span className="inline-block text-sm font-semibold bg-white/20 px-3 py-1 rounded-full mb-4">
                60% OFF
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                Fresh Products
              </h3>
              <p className="text-orange-100 mb-6 max-w-xs">
                Save up to 60% off on your first order. Limited time offer!
              </p>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent-600 font-semibold rounded-xl hover:bg-accent-50 transition-colors group-hover:gap-3"
              >
                Order Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Floating emoji */}
            <div className="absolute bottom-4 right-4 text-6xl opacity-20">
              🥬
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
