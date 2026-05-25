import * as React from "react";
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FilterState } from '../types';

interface FilterStoreState extends FilterState {
  // Actions
  setCategoryId: (categoryId: number | undefined) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setInStock: (inStock: boolean | undefined) => void;
  setRating: (rating: number | undefined) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSearchQuery: (query: string | undefined) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const initialState: FilterState = {
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  rating: undefined,
  sortBy: 'newest',
  searchQuery: undefined,
};

export const useFilterStore = create<FilterStoreState>()(
  immer((set, get) => ({
    ...initialState,
    
    setCategoryId: (categoryId) => set((state) => {
      state.categoryId = categoryId;
    }),
    
    setPriceRange: (min, max) => set((state) => {
      state.minPrice = min;
      state.maxPrice = max;
    }),
    
    setInStock: (inStock) => set((state) => {
      state.inStock = inStock;
    }),
    
    setRating: (rating) => set((state) => {
      state.rating = rating;
    }),
    
    setSortBy: (sortBy) => set((state) => {
      state.sortBy = sortBy;
    }),
    
    setSearchQuery: (query) => set((state) => {
      state.searchQuery = query;
    }),
    
    resetFilters: () => set(() => initialState),
    
    hasActiveFilters: () => {
      const state = get();
      return !!(
        state.categoryId ||
        state.minPrice ||
        state.maxPrice ||
        state.inStock !== undefined ||
        state.rating ||
        state.searchQuery
      );
    },
  }))
);
