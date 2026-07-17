import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewInteractionState {
  /** IDs of reviews this browser has already marked "helpful". */
  helpfulReviewIds: number[];
  markHelpful: (reviewId: number) => void;
  hasMarkedHelpful: (reviewId: number) => boolean;
}

/**
 * NOTE: the "Reviews" SharePoint list only stores a single HelpfulCount
 * number — there's no per-user helpful-vote list to check server-side.
 * This store is a client-side guard (persisted per-browser) so a single
 * visitor can't inflate a review's count by repeat-clicking. It is not a
 * substitute for real per-user vote tracking; if that's needed later, add
 * a "ReviewHelpfulVotes" list (ReviewId, UserId) and check it server-side.
 */
export const useReviewInteractionStore = create<ReviewInteractionState>()(
  persist(
    (set, get) => ({
      helpfulReviewIds: [],

      markHelpful: (reviewId) => {
        if (get().helpfulReviewIds.indexOf(reviewId) !== -1) return;
        set({ helpfulReviewIds: [...get().helpfulReviewIds, reviewId] });
      },

      hasMarkedHelpful: (reviewId) => get().helpfulReviewIds.indexOf(reviewId) !== -1,
    }),
    {
      name: 'spfx-ecommerce-review-interactions',
    }
  )
);
