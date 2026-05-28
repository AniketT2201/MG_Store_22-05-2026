// Types matching SharePoint List Schema from blueprint

export interface Product {
  ID: number;
  Title: string;
  Description: string;
  Price: number;
  CompareAtPrice?: number;
  SKU: string;
  Stock: number;
  CategoryId: number;
  Tags: string[];
  IsFeatured: boolean;
  IsActive: boolean;
  Weight?: number;
  Dimensions?: { width: number; height: number; depth: number };
  Attributes?: Record<string, string>;
  AverageRating: number;
  ReviewCount: number;
  SortOrder: number;
  Images: ProductImage[];
}

export interface Category {
  ID: number;
  Title: string;
  Slug: string;
  Description: string;
  ParentCategoryId?: number;
  ImageUrl?: { Url: string; Description?: string };
  IconName: string;
  SortOrder: number;
  IsActive: boolean;
  ProductCount: number;
}

export interface Review {
  ID: number;
  ProductId: number;
  Rating: number;
  Title: string;
  Body: string;
  Author: {
    name: string;
    email: string;
  };
  IsVerified: boolean;
  HelpfulCount: number;
  CreatedAt: string;
}

export interface CartItem {
  ID: number;
  SessionId: string;
  ProductId: number;
  Quantity: number;
  SnapshotPrice: number;
  VariantData?: Record<string, string>;
  Product: Product;
}

export interface WishlistItem {
  ID: number;
  ProductId: number;
  SavedAt: string;
  Product: Product;
}

export interface ProductImage {
  ID: number;
  ProductId: number;
  Url: string;
  AltText: string;
  IsPrimary: boolean;
  SortOrder: number;
  Width: number;
  Height: number;
  ThumbnailUrl: string;
}

export interface FilterState {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
  searchQuery?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
