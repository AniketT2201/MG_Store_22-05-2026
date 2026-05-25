'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/mockData';
import { queryKeys } from '../utils/queryKeys';
import { Product } from '../types';

export function useProductDetail(productId: number) {
  return useQuery<Product | null>({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => ProductService.getById(productId),
    enabled: productId > 0,
  });
}
