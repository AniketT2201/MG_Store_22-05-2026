'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from "../services/SharePointService";
import { queryKeys } from '../utils/queryKeys';
import { Product } from '../types';

export function useProducts(categoryId?: number) {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.list({ categoryId }),
    queryFn: () => ProductService.getAll(categoryId),
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.featured(),
    queryFn: () => ProductService.getFeatured(),
  });
}

export function useProductSearch(searchTerm: string) {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.search(searchTerm),
    queryFn: () => ProductService.search(searchTerm),
    enabled: searchTerm.length > 2,
  });
}
