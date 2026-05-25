import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { WishlistItem, Product } from '../types';

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (!state.items.find(item => item.ProductId === product.ID)) {
            state.items.push({
              ID: Date.now(),
              ProductId: product.ID,
              SavedAt: new Date().toISOString(),
              Product: product,
            });
          }
        });
      },
      
      removeItem: (productId) => {
        set((state) => {
          state.items = state.items.filter(item => item.ProductId !== productId);
        });
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.ProductId === productId);
      },
      
      toggleItem: (product) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(product.ID)) {
          removeItem(product.ID);
        } else {
          addItem(product);
        }
      },
      
      clearWishlist: () => {
        set((state) => {
          state.items = [];
        });
      },
    })),
    {
      name: 'spfx-ecommerce-wishlist',
    }
  )
);
