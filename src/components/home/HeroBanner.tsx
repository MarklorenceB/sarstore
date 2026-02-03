"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface HeroBannerProps {
  onSubscribe?: (email: string) => void;
}

export default function HeroBanner({ onSubscribe }: HeroBannerProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (onSubscribe && email) {
      onSubscribe(email);
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/mobile-view.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        paddingTop: "6rem",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 md:bg-black/50" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 "
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight font-display"
              style={{ marginTop: "-4rem" }}
            >
              Your daily
              <span className="text-primary-600"> essentials, simplified.</span>
            </h2>

            <p className="text-lg text-white">
              Fresh essentials delivered to your door
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </motion.div>

          {/* Images */}
          {/* ... your image grid stays the same */}
        </div>
      </div>
    </section>
  );
}
