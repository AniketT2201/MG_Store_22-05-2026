// TanStack Query key factory from blueprint

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (id: number) => ['products', 'detail', id] as const,
    featured: () => ['products', 'featured'] as const,
    search: (query: string) => ['products', 'search', query] as const,
    infinite: (filters?: Record<string, unknown>) => ['products', 'infinite', filters] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: number) => ['categories', 'detail', id] as const,
    bySlug: (slug: string) => ['categories', 'slug', slug] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: number) => ['reviews', 'product', productId] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
  },
};
