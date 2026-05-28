import * as React from "react";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../../../hooks/useProducts';
import { ProductCard } from '../product/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { stagger, fadeUp } from '../../../utils/animations';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <>
      <style>
        {`
          .CanvasComponent.LCS .grid {
            display: grid !important;
          }

          .CanvasComponent.LCS .grid::before,
          .CanvasComponent.LCS .grid::after {
            content: none !important;
            display: none !important;
          }
        `}  
      </style>
      <section className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-6"
          >
            <div>
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Handpicked for you
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-1 max-w-lg text-sm">
                Discover our carefully curated selection of premium products
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {products?.slice(0, 6).map((product, index) => (
                <motion.div key={product.ID} variants={fadeUp}>
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
