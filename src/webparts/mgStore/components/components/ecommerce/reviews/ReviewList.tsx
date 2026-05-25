import * as React from "react";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '../../../hooks/useReviews';
import { ReviewCard } from './ReviewCard';
import { RatingSummary } from './RatingSummary';
import { Skeleton } from '../ui/Skeleton';
import { stagger, fadeUp } from '../../../utils/animations';

interface ReviewListProps {
  productId: number;
  averageRating: number;
  totalReviews: number;
}

export function ReviewList({ productId, averageRating, totalReviews }: ReviewListProps) {
  const { data: reviews, isLoading } = useReviews(productId);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest' | 'lowest'>('newest');

  const sortedReviews = reviews ? [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
      case 'helpful':
        return b.HelpfulCount - a.HelpfulCount;
      case 'highest':
        return b.Rating - a.Rating;
      case 'lowest':
        return a.Rating - b.Rating;
      default:
        return 0;
    }
  }) : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <RatingSummary
        reviews={reviews || []}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />

      {/* Sort & Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Customer Reviews ({reviews?.length || 0})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews */}
      {sortedReviews.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {sortedReviews.map((review) => (
            <motion.div key={review.ID} variants={fadeUp}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground mb-4">No reviews yet</p>
          <p className="text-sm text-muted-foreground">
            Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
