import * as React from "react";
import { motion } from 'framer-motion';
import { ThumbsUp, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from '../ui/Toast';
import { Review } from '../../../types';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { useCurrentUser } from '../../providers/CurrentUserContext';
import { useMarkHelpful, useDeleteReview } from '../../../hooks/useReviews';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
}

export function ReviewCard({ review, onEdit }: ReviewCardProps) {
  const currentUser = useCurrentUser();
  const { mutate: markHelpful, hasMarkedHelpful, isLoading: isMarking } = useMarkHelpful();
  const deleteReview = useDeleteReview();

  const isOwnReview =
    !!currentUser.email &&
    review.Author.email?.toLowerCase() === currentUser.email.toLowerCase();
  const alreadyMarkedHelpful = hasMarkedHelpful(review.ID);

  const handleHelpful = () => {
    if (alreadyMarkedHelpful || isMarking) return;
    markHelpful(review.ID);
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm("Delete your review? This can't be undone.");
    if (!confirmed) return;

    deleteReview.mutate(
      { reviewId: review.ID, productId: review.ProductId },
      {
        onSuccess: () => toast.success("Your review was deleted"),
        onError: () => toast.error("We couldn't delete your review. Please try again."),
      }
    );
  };

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
            {isOwnReview && (
              <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Your review
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
      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
        {review.Body}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleHelpful}
          disabled={alreadyMarkedHelpful || isMarking}
          className={`flex items-center gap-2 text-sm transition-colors ${
            alreadyMarkedHelpful
              ? 'text-primary cursor-default'
              : 'text-muted-foreground hover:text-foreground'
          } disabled:opacity-70`}
          aria-pressed={alreadyMarkedHelpful}
        >
          <ThumbsUp className={`w-4 h-4 ${alreadyMarkedHelpful ? 'fill-current' : ''}`} />
          {alreadyMarkedHelpful ? 'Marked helpful' : 'Helpful'} ({review.HelpfulCount})
        </button>

        {isOwnReview && (
          <>
            <button
              onClick={() => onEdit?.(review)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteReview.isLoading}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
