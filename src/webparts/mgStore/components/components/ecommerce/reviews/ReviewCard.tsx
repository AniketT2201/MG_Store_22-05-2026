import * as React from "react";
import { motion } from 'framer-motion';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '../../../types';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-card rounded-xl border border-border"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{review.Author.name}</span>
            {review.IsVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.CreatedAt), { addSuffix: true })}
          </p>
        </div>
        <StarRating rating={review.Rating} size="sm" />
      </div>

      {/* Content */}
      <h4 className="font-medium text-foreground mb-2">{review.Title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{review.Body}</p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.HelpfulCount})
        </button>
      </div>
    </motion.div>
  );
}
