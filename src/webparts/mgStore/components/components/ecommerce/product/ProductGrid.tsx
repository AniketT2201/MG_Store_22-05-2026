import * as React from "react";
import { motion } from 'framer-motion';
import { Product } from '../../../types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { stagger, fadeUp } from '../../../utils/animations';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
}

export function ProductGrid({
  products,
  isLoading,
  emptyMessage = 'No products found',
  emptyDescription = "We couldn't find anything matching your criteria. Try adjusting your filters or search for something else.",
  emptyAction,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="search"
        title={emptyMessage}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product, index) => (
        <motion.div key={product.ID} variants={fadeUp}>
          <ProductCard product={product} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}
