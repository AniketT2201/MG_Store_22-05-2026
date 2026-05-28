import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useFeaturedProducts } from "../../../hooks/useProducts";
import { ProductCard } from "../product/ProductCard";

interface ITimer {
  hours: number;
  minutes: number;
  seconds: number;
}

export function FlashSale() {
  const { data: products, isLoading } = useFeaturedProducts();
  const [time, setTime] = React.useState<ITimer>({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });
  const swiperRef = React.useRef<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;

        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-orange-50 to-red-50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Flash Sale
              </h2>
              <p className="text-xs text-muted-foreground">Limited time offers</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">
              Ends in:
            </span>
            <div className="flex gap-1 items-center font-bold text-orange-600">
              <span className="text-lg">
                {String(time.hours).padStart(2, "0")}
              </span>
              <span className="text-xs">:</span>
              <span className="text-lg">
                {String(time.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs">:</span>
              <span className="text-lg">
                {String(time.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Product Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="hidden lg:flex gap-2 mb-4">
              <button className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2">
                {products?.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.ID}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-none w-full sm:w-56 lg:w-48"
                  >
                    <div className="relative group">
                      {/* Flash Sale Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Flash Sale
                      </div>
                      <ProductCard product={product} index={index} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden gap-2 mt-4 justify-center">
              <button className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
