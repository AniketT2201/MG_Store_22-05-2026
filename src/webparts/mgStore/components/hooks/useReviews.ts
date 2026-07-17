'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from "../services/SharePointService";
import { queryKeys } from '../utils/queryKeys';
import { Review } from '../types';
import { useReviewInteractionStore } from '../store/reviewInteractionStore';

export function useReviews(productId: number) {
  return useQuery<Review[]>({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => ReviewService.getByProductId(productId),
    enabled: productId > 0,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (review: Omit<Review, 'ID' | 'CreatedAt' | 'HelpfulCount'>) => 
      ReviewService.addReview(review),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ 
        queryKey: queryKeys.reviews.byProduct(variables.ProductId) 
      });
      // A new review changes AverageRating/ReviewCount on the product too.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.ProductId),
      });
    },
  });
}

interface UpdateReviewInput {
  reviewId: number;
  productId: number;
  updates: Partial<Pick<Review, 'Rating' | 'Title' | 'Body'>>;
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId, updates }: UpdateReviewInput) =>
      ReviewService.update(reviewId, productId, updates),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
    },
  });
}

interface DeleteReviewInput {
  reviewId: number;
  productId: number;
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId }: DeleteReviewInput) =>
      ReviewService.delete(reviewId, productId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
    },
  });
}

/**
 * Marks a review as helpful. Guards against the same browser incrementing
 * the count more than once (see reviewInteractionStore for why this is
 * client-side rather than server-enforced).
 */
export function useMarkHelpful() {
  const queryClient = useQueryClient();
  const { markHelpful: recordLocally, hasMarkedHelpful } = useReviewInteractionStore();

  const mutation = useMutation({
    mutationFn: (reviewId: number) => ReviewService.markHelpful(reviewId),
    onSuccess: (_, reviewId) => {
      recordLocally(reviewId);
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });

  return {
    ...mutation,
    hasMarkedHelpful,
  };
}
