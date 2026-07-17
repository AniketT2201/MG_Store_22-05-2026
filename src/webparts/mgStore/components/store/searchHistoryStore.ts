import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT_SEARCHES = 8;

interface SearchHistoryState {
  /** Search terms, most recent first. */
  recentSearches: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      recentSearches: [],

      addSearch: (term) => {
        const trimmed = term.trim();
        if (trimmed.length < 2) return;
        const withoutDuplicate = get().recentSearches.filter(
          (t) => t.toLowerCase() !== trimmed.toLowerCase()
        );
        set({ recentSearches: [trimmed, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES) });
      },

      removeSearch: (term) => {
        set({ recentSearches: get().recentSearches.filter((t) => t !== term) });
      },

      clear: () => set({ recentSearches: [] }),
    }),
    {
      name: 'spfx-ecommerce-search-history',
    }
  )
);
