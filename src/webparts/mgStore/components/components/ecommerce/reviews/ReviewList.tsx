import * as React from "react";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { useReviews } from '../../../hooks/useReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { RatingSummary } from './RatingSummary';
import { Skeleton } from '../ui/Skeleton';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { Pagination, PageInfo } from '../ui/Pagination';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { stagger, fadeUp } from '../../../utils/animations';
import { useCurrentUser } from '../../providers/CurrentUserContext';
import { Review } from '../../../types';

interface ReviewListProps {
  productId: number;
  averageRating: number;
  totalReviews: number;
}

const PAGE_SIZE = 5;

export function ReviewList({ productId, averageRating, totalReviews }: ReviewListProps) {
  const { data: reviews, isLoading, isError } = useReviews(productId);
  const currentUser = useCurrentUser();
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest' | 'lowest'>('newest');
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editingReview, setEditingReview] = useState<Review | undefined>(undefined);

  const myReview = useMemo(
    () =>
      reviews?.find(
        (r) => r.Author.email?.toLowerCase() === currentUser.email?.toLowerCase()
      ),
    [reviews, currentUser.email]
  );

  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews].sort((a, b) => {
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
    });
  }, [reviews, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedReviews = sortedReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSortChange = (value: typeof sortBy) => {
    setSortBy(value);
    setPage(1);
  };

  const openWriteReview = () => {
    if (myReview) {
      setEditingReview(myReview);
      setFormMode('edit');
    } else {
      setEditingReview(undefined);
      setFormMode('create');
    }
  };

  const openEditReview = (review: Review) => {
    setEditingReview(review);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode('closed');
    setEditingReview(undefined);
  };

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

  if (isError) {
    return (
      <EmptyState
        icon="reviews"
        title="We couldn't load reviews right now"
        description="Please refresh the page or try again in a moment."
      />
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

      {/* Write a review CTA */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-card border border-border rounded-xl p-5">
        <div>
          <h4 className="font-semibold text-foreground">
            {myReview ? 'You already reviewed this product' : 'Share your experience'}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {myReview
              ? 'You can edit or delete your review at any time.'
              : 'Help other shoppers by writing an honest review.'}
          </p>
        </div>
        <button
          onClick={openWriteReview}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <PenLine className="w-4 h-4" />
          {myReview ? 'Edit your review' : 'Write a review'}
        </button>
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Customer Reviews ({reviews?.length || 0})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews */}
      {pagedReviews.length > 0 ? (
        <>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {pagedReviews.map((review) => (
              <motion.div key={review.ID} variants={fadeUp}>
                <ErrorBoundary section="this review">
                  <ReviewCard review={review} onEdit={openEditReview} />
                </ErrorBoundary>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <PageInfo
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={sortedReviews.length}
                itemsPerPage={PAGE_SIZE}
              />
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="reviews"
          title="No reviews yet"
          description="Be the first to share what you think of this product."
          action={{ label: 'Write a review', onClick: openWriteReview }}
        />
      )}

      {/* Write / Edit Review Modal */}
      <Modal
        isOpen={formMode !== 'closed'}
        onClose={closeForm}
        title={formMode === 'edit' ? 'Edit your review' : 'Write a review'}
        size="lg"
      >
        <div className="p-6">
          <ReviewForm
            productId={productId}
            existingReview={formMode === 'edit' ? editingReview : undefined}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </div>
      </Modal>
    </div>
  );
}
