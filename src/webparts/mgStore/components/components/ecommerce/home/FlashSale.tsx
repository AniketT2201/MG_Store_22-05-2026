import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useFeaturedProducts } from "../../../hooks/useProducts";
import { ProductCard } from "../product/ProductCard";

interface ITimer {
  hours: number;
  minutes: number;
  seconds: number;
}

const CARD_WIDTH = 192; // matches lg:w-48 (48 * 4px)
const CARD_GAP = 12; // matches gap-3 (3 * 4px)
const SCROLL_AMOUNT = (CARD_WIDTH + CARD_GAP) * 2; // scroll ~2 cards per click

export function FlashSale() {
  const { data: products, isLoading } = useFeaturedProducts();
  const [time, setTime] = useState<ITimer>({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  // Track scroll position so we can disable arrows at the edges
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
        updateScrollState();
    });
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 lg:py-16 bg-secondary/45 border-y border-border">
      {/* min-w-0 prevents this row from stretching the page width when its
          children (the card track) are wider than the viewport */}
      <div className="container mx-auto px-4 min-w-0">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Flash Sale
              </h2>
              <p className="text-sm text-muted-foreground">
                Limited time offers, easy to compare.
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
            <span className="text-xs font-medium text-muted-foreground">
              Ends in:
            </span>
            <div className="flex gap-1 items-center font-semibold text-foreground tabular-nums">
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
            className="relative min-w-0"
          >
            <div className="hidden lg:flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* min-w-0 + overflow-x-auto here is what actually contains the
                card track. Without min-w-0 a flex/grid ancestor will size
                itself to fit the track's full content width instead of
                letting this element scroll internally. */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto scrollbar-hide"
            >
              <div className="flex gap-3 pb-2">
                {products?.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.ID}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-none w-48"
                  >
                    <div className="relative group">
                      {/* Flash Sale Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Sale
                      </div>
                      <ProductCard product={product} index={index} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden gap-2 mt-4 justify-center">
              <button
                type="button"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="p-2 rounded-lg bg-white hover:bg-secondary transition border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}