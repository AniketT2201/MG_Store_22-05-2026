import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENTLY_VIEWED = 12;

interface RecentlyViewedState {
  /** Product IDs, most recently viewed first. */
  productIds: number[];
  addProduct: (productId: number) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addProduct: (productId) => {
        if (!productId) return;
        const current = get().productIds.filter((id) => id !== productId);
        set({ productIds: [productId, ...current].slice(0, MAX_RECENTLY_VIEWED) });
      },

      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'spfx-ecommerce-recently-viewed',
    }
  )
);
