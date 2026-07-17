import * as React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useProducts } from "../../../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "../ui/Skeleton";
import { stagger, fadeUp } from "../../../utils/animations";
import type { Product } from "../../../types";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

interface RelatedProductsProps {
  currentProductId: number;
  categoryId: number;
  tags?: string[];
  limit?: number;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  tags = [],
  limit = 8,
}: RelatedProductsProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: products, isLoading } = useProducts();

  // Filter related products by category or tags, excluding current product
  const relatedProducts = products
    ?.filter((product: Product) => {
      if (product.ID === currentProductId) return false;
      
      // Same category
      if (product.CategoryId === categoryId) return true;
      
      // Shared tags
      if (tags.length > 0 && product.Tags) {
        return product.Tags.some(tag => tags.includes(tag));
      }
      
      return false;
    })
    .slice(0, limit) || [];

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-foreground">
              You May Also Like
            </h2>
            <p className="text-muted-foreground mt-1">
              Products similar to what you&apos;re viewing
            </p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors disabled:opacity-50"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors disabled:opacity-50"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.2}
            freeMode={{ enabled: true, sticky: true }}
            breakpoints={{
              480: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
              1280: { slidesPerView: 4.5 },
            }}
            className="!overflow-visible"
          >
            {relatedProducts.map((product: Product) => (
              <SwiperSlide key={product.ID}>
                <motion.div variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link
            to={`/products?category=${categoryId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all in this category
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface RecentlyViewedProps {
  productIds: number[];
  limit?: number;
}

export function RecentlyViewed({ productIds, limit = 6 }: RecentlyViewedProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: products, isLoading } = useProducts();

  const recentProducts = products
    ?.filter((product: Product) => productIds.includes(product.ID))
    .slice(0, limit) || [];

  if (isLoading || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-foreground">
              Recently Viewed
            </h2>
            <p className="text-muted-foreground mt-1">
              Continue where you left off
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.2}
          freeMode={{ enabled: true, sticky: true }}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
          }}
        >
          {recentProducts.map((product: Product) => (
            <SwiperSlide key={product.ID}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
