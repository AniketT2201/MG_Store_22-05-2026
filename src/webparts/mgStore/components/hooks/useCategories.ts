'use client';

import { useQuery } from '@tanstack/react-query';
import { CategoryService } from "../services/SharePointService";
import { queryKeys } from '../utils/queryKeys';
import { Category } from '../types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories.all,
    queryFn: () => CategoryService.getAll(),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category | null>({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => CategoryService.getBySlug(slug),
    enabled: !!slug,
  });
}
