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
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Handpicked for you
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover our carefully curated selection of premium products
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products?.slice(0, 6).map((product, index) => (
              <motion.div key={product.ID} variants={fadeUp}>
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
