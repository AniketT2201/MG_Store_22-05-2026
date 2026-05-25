import * as React from "react";
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Review } from '../../../types';

interface RatingSummaryProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function RatingSummary({ reviews, averageRating, totalReviews }: RatingSummaryProps) {
  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.Rating === rating).length,
    percentage: totalReviews > 0
      ? (reviews.filter((r) => r.Rating === rating).length / totalReviews) * 100
      : 0,
  }));

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12 flex items-center gap-1">
                {rating} <Star className="w-3 h-3 fill-current" />
              </span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
