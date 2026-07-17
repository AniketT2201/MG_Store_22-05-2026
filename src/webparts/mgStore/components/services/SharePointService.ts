/**
 * SharePointService.ts
 *
 * Complete PnPjs v3 service layer replacing all mock data.
 *
 * SharePoint Lists required:
 *   - "Products"       → columns listed in IProductListItem
 *   - "Categories"     → columns listed in ICategoryListItem
 *   - "Reviews"        → columns listed in IReviewListItem
 *   - "ProductImages"  → Document Library with metadata columns
 *                        OR a regular list (see IProductImageListItem)
 *
 * Setup: call initSP(context) once inside your webpart's onInit().
 */

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/batching";
import "@pnp/sp/site-users/web";

import { Product, Category, Review, ProductImage, Feedback, FeedbackCategory } from "../types";

// ─── SP instance (singleton) ─────────────────────────────────────────────────

let _sp: SPFI;

export const initSP = (context: WebPartContext): void => {
  _sp = spfi().using(SPFx(context));
};

export const getSP = (): SPFI => {
  if (!_sp) throw new Error("SP not initialized. Call initSP(context) first.");
  return _sp;
};

// ─── SharePoint list/column name constants ────────────────────────────────────

const LISTS = {
  PRODUCTS: "ProductMaster",
  CATEGORIES: "Categories",
  REVIEWS: "Reviews",
  PRODUCT_IMAGES: "ProductImages", // Document library name
  FEEDBACK: "SiteFeedback",
} as const;

// ─── Raw SharePoint response shapes ──────────────────────────────────────────
// These match the internal column names in your SharePoint lists.
// Adjust field names if yours differ.

interface IProductListItem {
  ID: number;
  Title: string;                  // Product name
  Description: string;
  Price: number;
  CompareAtPrice: number;
  SKU: string;
  Stock: number;
  CategoryId: number;             // Lookup column ID (or plain Number)
  Tags: string;                   // Stored as comma-separated string
  IsFeatured: boolean;
  IsActive: boolean;
  Weight: number;
  Dimensions: string;             // Stored as JSON string
  Attributes: string;             // Stored as JSON string
  AverageRating: number;
  ReviewCount: number;
  SortOrder: number;
}

interface ICategoryListItem {
  ID: number;
  Title: string;
  Slug: string;
  Description: string;
  ImageUrl: { Url: string; Description?: string }; // Complex field for image metadata
  IconName: string;
  SortOrder: number;
  IsActive: boolean;
  ProductCount: number;
}

interface IReviewListItem {
  ID: number;
  ProductId: number;              // Plain Number column linking to Product
  Rating: number;
  Title: string;
  Body: string;
  Author: {
    Title: string;
    EMail: string;
  };
  IsVerified: boolean;
  HelpfulCount: number;
  Created: string;                // SharePoint built-in Created column
}

interface IProductImageListItem {
  ID: number;
  ProductId: number;
  ServerRelativeUrl: string;      // From file metadata
  FileRef?: string;               // SharePoint internal name for ServerRelativeUrl
  AltText: string;
  IsPrimary: boolean;
  SortOrder: number;
  Width: number;
  Height: number;
}

interface IFeedbackListItem {
  ID: number;
  Category: string;
  Message: string;
  Rating: number | null;
  Author: {
    Title: string;
    EMail: string;
  };
  PageUrl: string;
  Created: string;
}

// ─── Mappers: SP raw → app types ─────────────────────────────────────────────

const toProduct = (item: IProductListItem, images: ProductImage[]): Product => ({
  ID: item.ID,
  Title: item.Title,
  Description: item.Description ?? "",
  Price: item.Price ?? 0,
  CompareAtPrice: item.CompareAtPrice ?? undefined,
  SKU: item.SKU ?? "",
  Stock: item.Stock ?? 0,
  CategoryId: item.CategoryId,
  Tags: item.Tags ? item.Tags.split(",").map((t) => t.trim()) : [],
  IsFeatured: item.IsFeatured ?? false,
  IsActive: item.IsActive ?? true,
  Weight: item.Weight ?? 0,
  Dimensions: item.Dimensions ? JSON.parse(item.Dimensions) : undefined,
  Attributes: item.Attributes ? JSON.parse(item.Attributes) : undefined,
  AverageRating: item.AverageRating ?? 0,
  ReviewCount: item.ReviewCount ?? 0,
  SortOrder: item.SortOrder ?? 0,
  Images: images,
});

const toCategory = (item: ICategoryListItem): Category => ({
  ID: item.ID,
  Title: item.Title,
  Slug: item.Slug ?? "",
  Description: item.Description ?? "",
  ImageUrl: item.ImageUrl ?? { Url: "", Description: undefined },
  IconName: item.IconName ?? "",
  SortOrder: item.SortOrder ?? 0,
  IsActive: item.IsActive ?? true,
  ProductCount: item.ProductCount ?? 0,
});

const toReview = (item: IReviewListItem): Review => ({
  ID: item.ID,
  ProductId: item.ProductId,
  Rating: item.Rating,
  Title: item.Title ?? "",
  Body: item.Body ?? "",
  Author: {
    name: item.Author?.Title ?? "",
    email: item.Author?.EMail ?? "",
  },
  IsVerified: item.IsVerified ?? false,
  HelpfulCount: item.HelpfulCount ?? 0,
  CreatedAt: item.Created,
});

const toProductImage = (
  item: IProductImageListItem,
  siteUrl: string
): ProductImage => ({
  ID: item.ID,
  ProductId: item.ProductId,
  Url: `${siteUrl.split("/sites")[0]}${item.ServerRelativeUrl}`,
  AltText: item.AltText ?? "",
  IsPrimary: item.IsPrimary ?? false,
  SortOrder: item.SortOrder ?? 0,
  Width: item.Width ?? 800,
  Height: item.Height ?? 800,
  ThumbnailUrl: `${siteUrl.split("/sites")[0]}${item.ServerRelativeUrl}?width=200`,
});

const toFeedback = (item: IFeedbackListItem): Feedback => ({
  ID: item.ID,
  Category: (item.Category as FeedbackCategory) ?? "Other",
  Message: item.Message ?? "",
  Rating: item.Rating ?? undefined,
  Author: {
    name: item.Author?.Title ?? "",
    email: item.Author?.EMail ?? "",
  },
  PageUrl: item.PageUrl ?? "",
  CreatedAt: item.Created,
});

// ─── Helper: get absolute site URL ───────────────────────────────────────────

const getSiteUrl = async (): Promise<string> => {
  const web = await getSP().web.select("Url")();
  return web.Url.replace(/\/$/, "");
};

// ─── Helper: fetch images for one or many products ───────────────────────────

const fetchImagesForProducts = async (
  productIds: number[]
): Promise<Map<number, ProductImage[]>> => {
  if (productIds.length === 0) return new Map();

  const siteUrl = await getSiteUrl();

  // Build CAML-style OData filter for multiple IDs
  const filter = productIds.map((id) => `ProductId eq ${id}`).join(" or ");

  const items = await getSP()
    .web.lists.getByTitle(LISTS.PRODUCT_IMAGES)
    .items.select(
      "ID",
      "ProductId",
      "FileRef",           // ServerRelativeUrl equivalent for doc libraries
      "AltText",
      "IsPrimary",
      "SortOrder",
      "Width",
      "Height"
    )
    .filter(filter)
    .orderBy("SortOrder", true)
    .top(500)();

  const map = new Map<number, ProductImage[]>();

  for (const raw of items) {
    const img: ProductImage = {
      ID: raw.ID,
      ProductId: raw.ProductId,
      Url: `${siteUrl.split("/sites")[0]}${raw.FileRef}`,
      AltText: raw.AltText ?? "",
      IsPrimary: raw.IsPrimary ?? false,
      SortOrder: raw.SortOrder ?? 0,
      Width: raw.Width ?? 800,
      Height: raw.Height ?? 800,
      ThumbnailUrl: `${siteUrl.split("/sites")[0]}${raw.FileRef}?width=200`,
    };

    const existing = map.get(raw.ProductId) ?? [];
    map.set(raw.ProductId, [...existing, img]);
  }

  return map;
};

// ─── CategoryService ──────────────────────────────────────────────────────────

export const CategoryService = {

  /**
   * Get all active categories sorted by SortOrder.
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const items: ICategoryListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.select(
          "ID", "Title", "Slug", "Description", "ImageUrl",
          "IconName", "SortOrder", "IsActive", "ProductCount"
        )
        .filter("IsActive eq 'Yes'")
        .orderBy("SortOrder", true)
        .top(100)();

      return items.map(toCategory);
    } catch (err) {
      console.error("[CategoryService.getAll]", err);
      throw err;
    }
  },

  /**
   * Get a single category by its Slug column value.
   */
  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const items: ICategoryListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.select(
          "ID", "Title", "Slug", "Description", "ImageUrl",
          "IconName", "SortOrder", "IsActive", "ProductCount"
        )
        .filter(`Slug eq '${slug}' and IsActive eq 'Yes'`)
        .top(1)();

      return items.length > 0 ? toCategory(items[0]) : null;
    } catch (err) {
      console.error("[CategoryService.getBySlug]", err);
      return null;
    }
  },

  /**
   * Get a single category by ID.
   */
  getById: async (id: number): Promise<Category | null> => {
    try {
      const raw: ICategoryListItem = await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.getById(id)
        .select(
          "ID", "Title", "Slug", "Description", "ImageUrl",
          "IconName", "SortOrder", "IsActive", "ProductCount"
        )();

      return raw ? toCategory(raw) : null;
    } catch (err) {
      console.error("[CategoryService.getById]", err);
      return null;
    }
  },

  /**
   * Create a new category.
   */
  create: async (category: Omit<Category, "ID">): Promise<number> => {
    try {
      const result = await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.add({
          Title: category.Title,
          Slug: category.Slug,
          Description: category.Description,
          ImageUrl: category.ImageUrl,
          IconName: category.IconName,
          SortOrder: category.SortOrder,
          IsActive: category.IsActive,
          ProductCount: category.ProductCount ?? 0,
        });

      return result.data.ID;
    } catch (err) {
      console.error("[CategoryService.create]", err);
      throw err;
    }
  },

  /**
   * Update an existing category.
   */
  update: async (
    id: number,
    updates: Partial<Omit<Category, "ID">>
  ): Promise<void> => {
    try {
      await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.getById(id)
        .update(updates as Record<string, unknown>);
    } catch (err) {
      console.error("[CategoryService.update]", err);
      throw err;
    }
  },

  /**
   * Increment the ProductCount for a category by 1.
   * Called after a new product is created.
   */
    recalculateProductCount: async (categoryId: number): Promise<void> => {
    try {

      const products = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items
        .select("ID")
        .filter(`CategoryId eq ${categoryId} and IsActive eq 1`)
        .top(5000)();

      await getSP()
        .web.lists.getByTitle(LISTS.CATEGORIES)
        .items.getById(categoryId)
        .update({
          ProductCount: products.length,
        });

    } catch (err) {
      console.error("[CategoryService.recalculateProductCount]", err);
    }
  },
};

// ─── ProductService ───────────────────────────────────────────────────────────

export const ProductService = {

  /**
   * Get all active products, optionally filtered by category.
   * Fetches images for all returned products in one batch query.
   */
  getAll: async (categoryId?: number): Promise<Product[]> => {
    try {
      let query = getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.select(
          "ID", "Title", "Description", "Price", "CompareAtPrice",
          "SKU", "Stock", "CategoryId", "Tags", "IsFeatured", "IsActive",
          "Weight", "Dimensions", "Attributes", "AverageRating",
          "ReviewCount", "SortOrder"
        )
        .filter(
          categoryId
            ? `IsActive eq 'Yes' and CategoryId eq ${categoryId}`
            : "IsActive eq 'Yes'"
        )
        .orderBy("SortOrder", true)
        .top(500);

      const rawItems: IProductListItem[] = await query();

      const productIds = rawItems.map((p) => p.ID);
      const imagesMap = await fetchImagesForProducts(productIds);

      return rawItems.map((item) =>
        toProduct(item, imagesMap.get(item.ID) ?? [])
      );
    } catch (err) {
      console.error("[ProductService.getAll]", err);
      throw err;
    }
  },

  /**
   * Get a single product by its SharePoint item ID.
   */
  getById: async (id: number): Promise<Product | null> => {
    try {
      const raw: IProductListItem = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.getById(id)
        .select(
          "ID", "Title", "Description", "Price", "CompareAtPrice",
          "SKU", "Stock", "CategoryId", "Tags", "IsFeatured", "IsActive",
          "Weight", "Dimensions", "Attributes", "AverageRating",
          "ReviewCount", "SortOrder"
        )();

      if (!raw || !raw.IsActive) return null;

      const siteUrl = await getSiteUrl();

      const imageItems = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCT_IMAGES)
        .items.select(
          "ID", "ProductId", "FileRef", "AltText",
          "IsPrimary", "SortOrder", "Width", "Height"
        )
        .filter(`ProductId eq ${id}`)
        .orderBy("SortOrder", true)();

      const images: ProductImage[] = imageItems.map((img: IProductImageListItem) =>
        toProductImage({ ...img, ServerRelativeUrl: img.FileRef || "" }, siteUrl)
      );

      return toProduct(raw, images);
    } catch (err) {
      console.error("[ProductService.getById]", err);
      return null;
    }
  },

  /**
   * Get all featured active products.
   */
  getFeatured: async (): Promise<Product[]> => {
    try {
      const rawItems: IProductListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.select(
          "ID", "Title", "Description", "Price", "CompareAtPrice",
          "SKU", "Stock", "CategoryId", "Tags", "IsFeatured", "IsActive",
          "Weight", "Dimensions", "Attributes", "AverageRating",
          "ReviewCount", "SortOrder"
        )
        .filter("IsFeatured eq 'Yes' and IsActive eq 'Yes'")
        .orderBy("SortOrder", true)
        .top(20)();

      const productIds = rawItems.map((p) => p.ID);
      const imagesMap = await fetchImagesForProducts(productIds);

      return rawItems.map((item) =>
        toProduct(item, imagesMap.get(item.ID) ?? [])
      );
    } catch (err) {
      console.error("[ProductService.getFeatured]", err);
      throw err;
    }
  },

  /**
   * Full-text search across Title, Description, and Tags.
   * SharePoint REST doesn't support OR across columns natively,
   * so we fetch all and filter client-side for reliability.
   */
  search: async (term: string): Promise<Product[]> => {
    try {
      const lower = term.toLowerCase();

      const rawItems: IProductListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.select(
          "ID", "Title", "Description", "Price", "CompareAtPrice",
          "SKU", "Stock", "CategoryId", "Tags", "IsFeatured", "IsActive",
          "Weight", "Dimensions", "Attributes", "AverageRating",
          "ReviewCount", "SortOrder"
        )
        .filter("IsActive eq 'Yes'")
        .top(500)();

      const matched = rawItems.filter(
        (p) =>
          p.Title?.toLowerCase().includes(lower) ||
          p.Description?.toLowerCase().includes(lower) ||
          p.Tags?.toLowerCase().includes(lower) ||
          p.SKU?.toLowerCase().includes(lower)
      );

      const productIds = matched.map((p) => p.ID);
      const imagesMap = await fetchImagesForProducts(productIds);

      return matched.map((item) =>
        toProduct(item, imagesMap.get(item.ID) ?? [])
      );
    } catch (err) {
      console.error("[ProductService.search]", err);
      throw err;
    }
  },

  /**
   * Create a new product in the SharePoint list.
   */
  create: async (
    product: Omit<Product, "ID" | "Images" | "AverageRating" | "ReviewCount">
  ): Promise<number> => {
    try {
      const result = await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.add({
          Title: product.Title,
          Description: product.Description,
          Price: product.Price,
          CompareAtPrice: product.CompareAtPrice ?? null,
          SKU: product.SKU,
          Stock: product.Stock,
          CategoryId: product.CategoryId,
          Tags: Array.isArray(product.Tags) ? product.Tags.join(", ") : "",
          IsFeatured: product.IsFeatured,
          IsActive: product.IsActive,
          Weight: product.Weight ?? null,
          Dimensions: product.Dimensions ? JSON.stringify(product.Dimensions) : null,
          Attributes: product.Attributes ? JSON.stringify(product.Attributes) : null,
          AverageRating: 0,
          ReviewCount: 0,
          SortOrder: product.SortOrder ?? 0,
        });

      const id = result.data.ID;
      await CategoryService.recalculateProductCount(product.CategoryId);
      return id;
    } catch (err) {
      console.error("[ProductService.create]", err);
      throw err;
    }
  },

  /**
   * Update an existing product item.
   */
  update: async (
    id: number,
    updates: Partial<Omit<Product, "ID" | "Images">>
  ): Promise<void> => {
    try {
      const payload: Record<string, unknown> = {};

      if (updates.Title !== undefined) payload.Title = updates.Title;
      if (updates.Description !== undefined) payload.Description = updates.Description;
      if (updates.Price !== undefined) payload.Price = updates.Price;
      if (updates.CompareAtPrice !== undefined) payload.CompareAtPrice = updates.CompareAtPrice;
      if (updates.SKU !== undefined) payload.SKU = updates.SKU;
      if (updates.Stock !== undefined) payload.Stock = updates.Stock;
      if (updates.CategoryId !== undefined) payload.CategoryId = updates.CategoryId;
      if (updates.Tags !== undefined) payload.Tags = updates.Tags.join(", ");
      if (updates.IsFeatured !== undefined) payload.IsFeatured = updates.IsFeatured;
      if (updates.IsActive !== undefined) payload.IsActive = updates.IsActive;
      if (updates.Weight !== undefined) payload.Weight = updates.Weight;
      if (updates.Dimensions !== undefined) payload.Dimensions = JSON.stringify(updates.Dimensions);
      if (updates.Attributes !== undefined) payload.Attributes = JSON.stringify(updates.Attributes);
      if (updates.AverageRating !== undefined) payload.AverageRating = updates.AverageRating;
      if (updates.ReviewCount !== undefined) payload.ReviewCount = updates.ReviewCount;
      if (updates.SortOrder !== undefined) payload.SortOrder = updates.SortOrder;

      const oldProduct = await ProductService.getById(id);
      await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.getById(id)
        .update(payload);
      
      if (
        oldProduct &&
        updates.CategoryId &&
        oldProduct.CategoryId !== updates.CategoryId
      ) {
        await CategoryService.recalculateProductCount(oldProduct.CategoryId);
        await CategoryService.recalculateProductCount(updates.CategoryId);
      }
    } catch (err) {
      console.error("[ProductService.update]", err);
      throw err;
    }
  },

  /**
   * Soft-delete: set IsActive = false rather than deleting the item.
   */
  deactivate: async (id: number): Promise<void> => {
    await ProductService.update(id, { IsActive: false });
    const product = await ProductService.getById(id);
    await ProductService.update(id, { IsActive: false });
    if (product) {
      await CategoryService.recalculateProductCount(product.CategoryId);
    }
  },

  /**
   * Upload a product image to the ProductImages document library.
   * @param productId  The product's SharePoint item ID
   * @param file       The File object from an <input type="file">
   * @param isPrimary  Whether this is the primary/hero image
   * @param sortOrder  Display order (0 = first)
   */
  uploadImage: async (
    productId: number,
    file: File,
    isPrimary = false,
    sortOrder = 0
  ): Promise<ProductImage> => {
    try {
      const siteUrl = await getSiteUrl();
      const folderPath = `${LISTS.PRODUCT_IMAGES}/${productId}`;

      // Ensure per-product folder exists
      await getSP()
        .web.lists.getByTitle(LISTS.PRODUCT_IMAGES)
        .rootFolder.folders.addUsingPath(String(productId))
        .catch(() => { /* folder already exists */ });

      const arrayBuffer = await file.arrayBuffer();
      const uploadResult = await getSP()
        .web.getFolderByServerRelativePath(
          `${(await getSP().web.select("ServerRelativeUrl")()).ServerRelativeUrl}/${folderPath}`
        )
        .files.addUsingPath(file.name, arrayBuffer, { Overwrite: true });

      // Set metadata on the uploaded file's list item
      const fileItem = await uploadResult.file.getItem();
      await fileItem.update({
        ProductId: productId,
        AltText: file.name.replace(/\.[^.]+$/, ""),
        IsPrimary: isPrimary,
        SortOrder: sortOrder,
        Width: 800,
        Height: 800,
      });

      const fileInfo = await uploadResult.file.select("ServerRelativeUrl", "UniqueId")();

      return {
        ID: (await fileItem.select("ID")()).ID,
        ProductId: productId,
        Url: `${siteUrl.split("/sites")[0]}${fileInfo.ServerRelativeUrl}`,
        ThumbnailUrl: `${siteUrl.split("/sites")[0]}${fileInfo.ServerRelativeUrl}?width=200`,
        AltText: file.name.replace(/\.[^.]+$/, ""),
        IsPrimary: isPrimary,
        SortOrder: sortOrder,
        Width: 800,
        Height: 800,
      };
    } catch (err) {
      console.error("[ProductService.uploadImage]", err);
      throw err;
    }
  },
};

// ─── MediaService: Fetch images from ProductImages library folders ────────────

export const MediaService = {

  /**
   * Fetch all banner images from ProductImages library.
   * Expects images in ProductImages/banner/ folder
   * Used by HeroCarousel component.
   */
  getBannerImages: async (): Promise<ProductImage[]> => {
    try {
      const siteUrl = await getSiteUrl();
      const web = await getSP().web.select("ServerRelativeUrl")();
      const libraryRelativePath = `${web.ServerRelativeUrl}/ProductImages/banner`;

      // Try to get folder contents
      const files = await getSP()
        .web.getFolderByServerRelativePath(libraryRelativePath)
        .files.select("ServerRelativeUrl", "Name", "UniqueId")();

      if (!files || files.length === 0) {
        console.warn("[MediaService] No banner files found in ProductImages/banner/");
        return [];
      }

      return files.map((file: any, index: number) => ({
        ID: index + 1,
        ProductId: 0,
        Url: `${siteUrl.split("/sites")[0]}${file.ServerRelativeUrl}`,
        AltText: file.Name?.replace(/\.[^.]+$/, "") || `Banner ${index + 1}`,
        IsPrimary: false,
        SortOrder: index,
        Width: 1200,
        Height: 600,
        ThumbnailUrl: `${siteUrl.split("/sites")[0]}${file.ServerRelativeUrl}?width=400`,
      }));
    } catch (err) {
      console.error("[MediaService.getBannerImages]", err);
      return [];
    }
  },

  /**
   * Fetch category image from ProductImages library.
   * Expects images in ProductImages/{categoryId}/ folder
   * Used by ProfessionalCategories component as fallback.
   */
  getCategoryImage: async (categoryId: number): Promise<ProductImage | null> => {
    try {
      const siteUrl = await getSiteUrl();
      const web = await getSP().web.select("ServerRelativeUrl")();
      const folderPath = `${web.ServerRelativeUrl}/ProductImages/${categoryId}`;

      const files = await getSP()
        .web.getFolderByServerRelativePath(folderPath)
        .files.select("ServerRelativeUrl", "Name")
        .top(1)();

      if (!files || files.length === 0) {
        return null;
      }

      const file = files[0];
      return {
        ID: categoryId,
        ProductId: categoryId,
        Url: `${siteUrl.split("/sites")[0]}${file.ServerRelativeUrl}`,
        AltText: file.Name?.replace(/\.[^.]+$/, "") || `Category ${categoryId}`,
        IsPrimary: true,
        SortOrder: 0,
        Width: 800,
        Height: 800,
        ThumbnailUrl: `${siteUrl.split("/sites")[0]}${file.ServerRelativeUrl}?width=400`,
      };
    } catch (err) {
      console.error(`[MediaService.getCategoryImage] categoryId=${categoryId}`, err);
      return null;
    }
  },

  /**
   * Upload banner image to ProductImages/banner/ folder
   */
  uploadBannerImage: async (file: File): Promise<ProductImage> => {
    try {
      const siteUrl = await getSiteUrl();
      const web = await getSP().web.select("ServerRelativeUrl")();
      const folderPath = `${web.ServerRelativeUrl}/ProductImages/banner`;

      // Ensure banner folder exists
      try {
        await getSP()
          .web.getFolderByServerRelativePath(`${web.ServerRelativeUrl}/ProductImages`)
          .folders.addUsingPath("banner");
      } catch {
        // Folder might already exist
      }

      const arrayBuffer = await file.arrayBuffer();
      const uploadResult = await getSP()
        .web.getFolderByServerRelativePath(folderPath)
        .files.addUsingPath(file.name, arrayBuffer, { Overwrite: true });

      const fileInfo = await uploadResult.file.select(
        "ServerRelativeUrl",
        "UniqueId"
      )();

      return {
        ID: 0,
        ProductId: 0,
        Url: `${siteUrl.split("/sites")[0]}${fileInfo.ServerRelativeUrl}`,
        AltText: file.name.replace(/\.[^.]+$/, ""),
        IsPrimary: false,
        SortOrder: 0,
        Width: 1200,
        Height: 600,
        ThumbnailUrl: `${siteUrl.split("/sites")[0]}${fileInfo.ServerRelativeUrl}?width=400`,
      };
    } catch (err) {
      console.error("[MediaService.uploadBannerImage]", err);
      throw err;
    }
  },
};

// ─── ReviewService ────────────────────────────────────────────────────────────

export const ReviewService = {

  /**
   * Get all reviews for a specific product, newest first.
   */
  getByProductId: async (productId: number): Promise<Review[]> => {
    try {
      const items: IReviewListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.select(
          "ID", "ProductId", "Rating", "Title", "Body",
          "Author/Title", "Author/EMail", "IsVerified",
          "HelpfulCount", "Created"
        ) 
        .expand("Author")
        .filter(`ProductId eq ${productId}`)
        .orderBy("Created", false)
        .top(200)();

      return items.map(toReview);
    } catch (err) {
      console.error("[ReviewService.getByProductId]", err);
      throw err;
    }
  },

  /**
   * Add a new review and update the product's AverageRating + ReviewCount.
   */
  addReview: async (
    review: Omit<Review, "ID" | "CreatedAt" | "HelpfulCount">
  ): Promise<Review> => {
    try {
      // Ensure the user exists in the site and get their SharePoint ID
      const User = await getSP().web.ensureUser(review.Author.email);
      const result = await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.add({
          ProductId: review.ProductId,
          Rating: review.Rating,
          Title: review.Title,
          Body: review.Body,
          AuthorId: User.data.Id,
          // AuthorEmail: review.Author.email,
          IsVerified: review.IsVerified ?? false,
          HelpfulCount: 0,
        });

      // Recalculate and update AverageRating + ReviewCount on the product
      await ReviewService._recalculateProductRating(review.ProductId);

      const newItem: IReviewListItem = await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.getById(result.data.ID)
        .select(
          "ID", "ProductId", "Rating", "Title", "Body",
          "Author/Title", "Author/EMail", "IsVerified",
          "HelpfulCount", "Created"
        )
        .expand("Author")();

      return toReview(newItem);
    } catch (err) {
      console.error("[ReviewService.addReview]", err);
      throw err;
    }
  },

  /**
   * Mark a review as helpful (+1 to HelpfulCount).
   */
  markHelpful: async (reviewId: number): Promise<void> => {
    try {
      const current = await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.getById(reviewId)
        .select("HelpfulCount")();

      await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.getById(reviewId)
        .update({ HelpfulCount: (current.HelpfulCount ?? 0) + 1 });
    } catch (err) {
      console.error("[ReviewService.markHelpful]", err);
      throw err;
    }
  },

  /**
   * Update an existing review (edit own review). Recalculates the
   * product's AverageRating if the rating value changed.
   */
  update: async (
    reviewId: number,
    productId: number,
    updates: Partial<Pick<Review, "Rating" | "Title" | "Body">>
  ): Promise<void> => {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.Rating !== undefined) payload.Rating = updates.Rating;
      if (updates.Title !== undefined) payload.Title = updates.Title;
      if (updates.Body !== undefined) payload.Body = updates.Body;

      await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.getById(reviewId)
        .update(payload);

      if (updates.Rating !== undefined) {
        await ReviewService._recalculateProductRating(productId);
      }
    } catch (err) {
      console.error("[ReviewService.update]", err);
      throw err;
    }
  },

  /**
   * Delete a review (delete own review) and recalculate the product's
   * AverageRating/ReviewCount afterwards.
   */
  delete: async (reviewId: number, productId: number): Promise<void> => {
    try {
      await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.getById(reviewId)
        .delete();

      await ReviewService._recalculateProductRating(productId);
    } catch (err) {
      console.error("[ReviewService.delete]", err);
      throw err;
    }
  },

  /**
   * Recalculates AverageRating and ReviewCount on the Product item.
   * Called internally after a new review is submitted.
   */
  _recalculateProductRating: async (productId: number): Promise<void> => {
    try {
      const reviews: { Rating: number }[] = await getSP()
        .web.lists.getByTitle(LISTS.REVIEWS)
        .items.select("Rating")
        .filter(`ProductId eq ${productId}`)
        .top(5000)();

      const count = reviews.length;
      const avg =
        count > 0
          ? Math.round(
              (reviews.reduce((sum, r) => sum + r.Rating, 0) / count) * 10
            ) / 10
          : 0;

      await getSP()
        .web.lists.getByTitle(LISTS.PRODUCTS)
        .items.getById(productId)
        .update({ AverageRating: avg, ReviewCount: count });
    } catch (err) {
      console.error("[ReviewService._recalculateProductRating]", err);
    }
  },
};

// ─── FeedbackService ──────────────────────────────────────────────────────────
// Backs the site-wide feedback widget (Section: "Feedback — must have").
// Requires a "SiteFeedback" list with columns:
//   Category (Choice: Bug/Suggestion/Compliment/Other), Message (Multiline text),
//   Rating (Number, optional), AuthorName (Text), AuthorEmail (Text), PageUrl (Text)
// Author identity should come from the logged-in user's context
// (CurrentUserContext), not a free-text form field.

export const FeedbackService = {
  /**
   * Submit a new piece of feedback.
   */
  submit: async (
    feedback: Omit<Feedback, "ID" | "CreatedAt">
  ): Promise<number> => {
    try {
      const User = await getSP().web.ensureUser(feedback.Author.email);
      const result = await getSP()
        .web.lists.getByTitle(LISTS.FEEDBACK)
        .items.add({
          Category: feedback.Category,
          Message: feedback.Message,
          Rating: feedback.Rating ?? null,
          AuthorId: User.data.Id,
          PageUrl: feedback.PageUrl,
        });

      return result.data.ID;
    } catch (err) {
      console.error("[FeedbackService.submit]", err);
      throw err;
    }
  },

  /**
   * Get the most recent feedback entries. Intended for an admin view;
   * not currently surfaced anywhere in the customer-facing UI.
   */
  getRecent: async (top = 100): Promise<Feedback[]> => {
    try {
      const items: IFeedbackListItem[] = await getSP()
        .web.lists.getByTitle(LISTS.FEEDBACK)
        .items.select(
          "ID", "Category", "Message", "Rating",
          "Author/Title", "Author/EMail", "PageUrl", "Created"
        )
        .expand("Author")
        .orderBy("Created", false)
        .top(top)();

      return items.map(toFeedback);
    } catch (err) {
      console.error("[FeedbackService.getRecent]", err);
      throw err;
    }
  },
};
