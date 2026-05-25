import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  // Modal state
  isQuickViewOpen: boolean;
  quickViewProductId: number | null;
  
  // Search state
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Toast notifications handled by react-hot-toast
  
  // Actions
  openQuickView: (productId: number) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    isQuickViewOpen: false,
    quickViewProductId: null,
    isSearchOpen: false,
    searchQuery: '',
    isMobileMenuOpen: false,
    
    openQuickView: (productId) => set((state) => {
      state.isQuickViewOpen = true;
      state.quickViewProductId = productId;
    }),
    
    closeQuickView: () => set((state) => {
      state.isQuickViewOpen = false;
      state.quickViewProductId = null;
    }),
    
    openSearch: () => set((state) => {
      state.isSearchOpen = true;
    }),
    
    closeSearch: () => set((state) => {
      state.isSearchOpen = false;
      state.searchQuery = '';
    }),
    
    setSearchQuery: (query) => set((state) => {
      state.searchQuery = query;
    }),
    
    toggleMobileMenu: () => set((state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    }),
    
    closeMobileMenu: () => set((state) => {
      state.isMobileMenuOpen = false;
    }),
  }))
);
