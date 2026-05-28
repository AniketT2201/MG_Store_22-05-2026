'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from "../services/SharePointService";
import { queryKeys } from '../utils/queryKeys';
import { Review } from '../types';

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
    },
  });
}
