import * as React from "react";
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'bg-secondary animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" variant="text" />
          <Skeleton className="h-4 w-16" variant="text" />
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" variant="circular" />
          ))}
          <Skeleton className="h-4 w-12 ml-2" variant="text" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image gallery skeleton */}
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Product info skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" variant="text" />
          <Skeleton className="h-4 w-1/4" variant="text" />
        </div>
        
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" variant="text" />
          <Skeleton className="h-6 w-20" variant="text" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-full" variant="text" />
          <Skeleton className="h-4 w-2/3" variant="text" />
        </div>
        
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
