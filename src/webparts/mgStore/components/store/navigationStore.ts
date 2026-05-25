import create from "zustand";

export type PageType =
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "wishlist"
  | "search";

export interface INavigationState {
  page: PageType;

  productId?: number;

  categoryId?: number;

  searchQuery?: string;
}

interface INavigationStore {
  navigation: INavigationState;

  navigate: (
    state: INavigationState
  ) => void;

  goToHome: () => void;

  goToProducts: (
    categoryId?: number
  ) => void;

  goToProduct: (
    productId: number
  ) => void;

  goToCart: () => void;

  goToWishlist: () => void;

  goToSearch: (
    searchQuery?: string
  ) => void;
}

export const useNavigationStore =
  create<INavigationStore>(
    (set) => ({
      navigation: {
        page: "home",
      },

      navigate: (state) => {
        set({
          navigation: state,
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },

      goToHome: () =>
        set({
          navigation: {
            page: "home",
          },
        }),

      goToProducts: (
        categoryId
      ) =>
        set({
          navigation: {
            page: "products",
            categoryId,
          },
        }),

      goToProduct: (
        productId
      ) =>
        set({
          navigation: {
            page:
              "product-detail",
            productId,
          },
        }),

      goToCart: () =>
        set({
          navigation: {
            page: "cart",
          },
        }),

      goToWishlist: () =>
        set({
          navigation: {
            page: "wishlist",
          },
        }),

      goToSearch: (
        searchQuery
      ) =>
        set({
          navigation: {
            page: "search",
            searchQuery,
          },
        }),
    })
  );