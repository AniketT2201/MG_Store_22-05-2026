import { Product, Category, Review, ProductImage } from '../types';

// Mock product images
const generateProductImages = (productId: number, count = 4): ProductImage[] => {
  const baseImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1491553895911-0055uj6bef?w=800',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    ID: productId * 100 + i,
    ProductId: productId,
    Url: baseImages[(productId + i) % baseImages.length],
    AltText: `Product image ${i + 1}`,
    IsPrimary: i === 0,
    SortOrder: i,
    Width: 800,
    Height: 800,
    ThumbnailUrl: baseImages[(productId + i) % baseImages.length].replace('w=800', 'w=200'),
  }));
};

// Mock Categories based on SharePoint schema
export const mockCategories: Category[] = [
  {
    ID: 1,
    Title: 'Electronics',
    Slug: 'electronics',
    Description: 'Latest gadgets and electronics',
    ImageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
    IconName: 'Laptop',
    SortOrder: 1,
    IsActive: true,
    ProductCount: 24,
  },
  {
    ID: 2,
    Title: 'Clothing',
    Slug: 'clothing',
    Description: 'Fashion and apparel for everyone',
    ImageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600',
    IconName: 'Shirt',
    SortOrder: 2,
    IsActive: true,
    ProductCount: 36,
  },
  {
    ID: 3,
    Title: 'Home & Garden',
    Slug: 'home-garden',
    Description: 'Everything for your home',
    ImageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
    IconName: 'Home',
    SortOrder: 3,
    IsActive: true,
    ProductCount: 18,
  },
  {
    ID: 4,
    Title: 'Sports',
    Slug: 'sports',
    Description: 'Sports equipment and gear',
    ImageUrl: 'https://images.unsplash.com/photo-1461896836934- voices?w=600',
    IconName: 'Dumbbell',
    SortOrder: 4,
    IsActive: true,
    ProductCount: 15,
  },
  {
    ID: 5,
    Title: 'Books',
    Slug: 'books',
    Description: 'Books, magazines and more',
    ImageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
    IconName: 'BookOpen',
    SortOrder: 5,
    IsActive: true,
    ProductCount: 42,
  },
  {
    ID: 6,
    Title: 'Beauty',
    Slug: 'beauty',
    Description: 'Beauty and personal care',
    ImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
    IconName: 'Sparkles',
    SortOrder: 6,
    IsActive: true,
    ProductCount: 28,
  },
];

// Mock Products based on SharePoint schema
export const mockProducts: Product[] = [
  {
    ID: 1,
    Title: 'Premium Wireless Headphones',
    Description: 'Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
    Price: 299.99,
    CompareAtPrice: 399.99,
    SKU: 'WH-1000XM5',
    Stock: 45,
    CategoryId: 1,
    Tags: ['wireless', 'audio', 'noise-cancelling'],
    IsFeatured: true,
    IsActive: true,
    Weight: 250,
    Dimensions: { width: 18, height: 20, depth: 8 },
    Attributes: { color: 'Black', connectivity: 'Bluetooth 5.2' },
    AverageRating: 4.8,
    ReviewCount: 234,
    SortOrder: 1,
    Images: generateProductImages(1),
  },
  {
    ID: 2,
    Title: 'Minimalist Smart Watch',
    Description: 'Track your fitness and stay connected with our sleek smart watch. Water resistant, GPS enabled, and week-long battery.',
    Price: 249.99,
    CompareAtPrice: 299.99,
    SKU: 'SW-PRO-2',
    Stock: 78,
    CategoryId: 1,
    Tags: ['smartwatch', 'fitness', 'wearable'],
    IsFeatured: true,
    IsActive: true,
    Weight: 45,
    Dimensions: { width: 4, height: 4, depth: 1 },
    Attributes: { color: 'Silver', size: '44mm' },
    AverageRating: 4.6,
    ReviewCount: 189,
    SortOrder: 2,
    Images: generateProductImages(2),
  },
  {
    ID: 3,
    Title: 'Classic Leather Jacket',
    Description: 'Timeless style meets modern comfort. Genuine leather with premium lining for all-season wear.',
    Price: 189.99,
    CompareAtPrice: 249.99,
    SKU: 'LJ-CLASSIC-01',
    Stock: 23,
    CategoryId: 2,
    Tags: ['leather', 'jacket', 'fashion'],
    IsFeatured: true,
    IsActive: true,
    Weight: 1200,
    Dimensions: { width: 50, height: 70, depth: 5 },
    Attributes: { color: 'Brown', material: 'Genuine Leather' },
    AverageRating: 4.7,
    ReviewCount: 156,
    SortOrder: 3,
    Images: generateProductImages(3),
  },
  {
    ID: 4,
    Title: 'Ergonomic Office Chair',
    Description: 'Work in comfort with our fully adjustable ergonomic chair. Lumbar support, breathable mesh, and 360-degree swivel.',
    Price: 449.99,
    CompareAtPrice: 599.99,
    SKU: 'EC-ERGO-PRO',
    Stock: 12,
    CategoryId: 3,
    Tags: ['office', 'ergonomic', 'furniture'],
    IsFeatured: true,
    IsActive: true,
    Weight: 15000,
    Dimensions: { width: 65, height: 120, depth: 65 },
    Attributes: { color: 'Black', material: 'Mesh & Aluminum' },
    AverageRating: 4.9,
    ReviewCount: 312,
    SortOrder: 4,
    Images: generateProductImages(4),
  },
  {
    ID: 5,
    Title: 'Running Shoes Pro',
    Description: 'Engineered for speed and comfort. Lightweight design with responsive cushioning for your best run.',
    Price: 159.99,
    CompareAtPrice: 199.99,
    SKU: 'RS-PRO-X',
    Stock: 89,
    CategoryId: 4,
    Tags: ['running', 'shoes', 'sports'],
    IsFeatured: true,
    IsActive: true,
    Weight: 280,
    Dimensions: { width: 30, height: 12, depth: 10 },
    Attributes: { color: 'Blue/White', size: 'Multiple' },
    AverageRating: 4.5,
    ReviewCount: 278,
    SortOrder: 5,
    Images: generateProductImages(5),
  },
  {
    ID: 6,
    Title: 'Portable Bluetooth Speaker',
    Description: 'Big sound in a compact package. IPX7 waterproof, 20-hour playtime, and 360-degree audio.',
    Price: 79.99,
    CompareAtPrice: 99.99,
    SKU: 'BS-MINI-360',
    Stock: 156,
    CategoryId: 1,
    Tags: ['bluetooth', 'speaker', 'portable'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.4,
    ReviewCount: 445,
    SortOrder: 6,
    Images: generateProductImages(6),
  },
  {
    ID: 7,
    Title: 'Cashmere Sweater',
    Description: 'Luxuriously soft 100% cashmere sweater. Perfect for layering or wearing alone.',
    Price: 129.99,
    CompareAtPrice: 179.99,
    SKU: 'CS-LUX-01',
    Stock: 34,
    CategoryId: 2,
    Tags: ['cashmere', 'sweater', 'luxury'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.8,
    ReviewCount: 89,
    SortOrder: 7,
    Images: generateProductImages(7),
  },
  {
    ID: 8,
    Title: 'Modern Desk Lamp',
    Description: 'Sleek LED desk lamp with adjustable brightness and color temperature. USB charging port included.',
    Price: 59.99,
    CompareAtPrice: 79.99,
    SKU: 'DL-LED-01',
    Stock: 67,
    CategoryId: 3,
    Tags: ['lamp', 'led', 'desk'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.3,
    ReviewCount: 167,
    SortOrder: 8,
    Images: generateProductImages(8),
  },
  {
    ID: 9,
    Title: 'Yoga Mat Premium',
    Description: 'Extra thick, non-slip yoga mat with alignment lines. Eco-friendly materials and carrying strap included.',
    Price: 49.99,
    CompareAtPrice: 69.99,
    SKU: 'YM-PRO-01',
    Stock: 123,
    CategoryId: 4,
    Tags: ['yoga', 'fitness', 'mat'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.6,
    ReviewCount: 234,
    SortOrder: 9,
    Images: generateProductImages(9),
  },
  {
    ID: 10,
    Title: 'Bestseller Book Collection',
    Description: 'Curated collection of top 5 bestselling novels of the year. Perfect gift for book lovers.',
    Price: 89.99,
    CompareAtPrice: 120.00,
    SKU: 'BC-BEST-5',
    Stock: 45,
    CategoryId: 5,
    Tags: ['books', 'collection', 'bestseller'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.9,
    ReviewCount: 78,
    SortOrder: 10,
    Images: generateProductImages(10),
  },
  {
    ID: 11,
    Title: 'Luxury Skincare Set',
    Description: 'Complete skincare routine in a box. Includes cleanser, toner, serum, and moisturizer.',
    Price: 149.99,
    CompareAtPrice: 199.99,
    SKU: 'SK-LUX-SET',
    Stock: 56,
    CategoryId: 6,
    Tags: ['skincare', 'beauty', 'luxury'],
    IsFeatured: true,
    IsActive: true,
    AverageRating: 4.7,
    ReviewCount: 312,
    SortOrder: 11,
    Images: generateProductImages(11),
  },
  {
    ID: 12,
    Title: 'Wireless Earbuds Pro',
    Description: 'True wireless earbuds with ANC, transparency mode, and spatial audio. 8-hour battery with case.',
    Price: 199.99,
    CompareAtPrice: 249.99,
    SKU: 'EB-PRO-TWS',
    Stock: 234,
    CategoryId: 1,
    Tags: ['earbuds', 'wireless', 'audio'],
    IsFeatured: false,
    IsActive: true,
    AverageRating: 4.5,
    ReviewCount: 567,
    SortOrder: 12,
    Images: generateProductImages(12),
  },
];

// Mock Reviews based on SharePoint schema
export const mockReviews: Review[] = [
  {
    ID: 1,
    ProductId: 1,
    Rating: 5,
    Title: 'Best headphones I have ever owned!',
    Body: 'The sound quality is incredible and the noise cancellation is top-notch. Battery life exceeds expectations.',
    Author: { name: 'John D.', email: 'john@example.com' },
    IsVerified: true,
    HelpfulCount: 45,
    CreatedAt: '2024-01-15T10:30:00Z',
  },
  {
    ID: 2,
    ProductId: 1,
    Rating: 4,
    Title: 'Great sound, slightly tight fit',
    Body: 'Audio quality is amazing but they feel a bit tight after extended wear. Still highly recommend.',
    Author: { name: 'Sarah M.', email: 'sarah@example.com' },
    IsVerified: true,
    HelpfulCount: 23,
    CreatedAt: '2024-01-10T14:20:00Z',
  },
  {
    ID: 3,
    ProductId: 2,
    Rating: 5,
    Title: 'Perfect fitness companion',
    Body: 'Tracks everything accurately and the battery lasts all week. Best smartwatch purchase.',
    Author: { name: 'Mike R.', email: 'mike@example.com' },
    IsVerified: true,
    HelpfulCount: 67,
    CreatedAt: '2024-01-12T09:15:00Z',
  },
  {
    ID: 4,
    ProductId: 3,
    Rating: 5,
    Title: 'Quality leather, perfect fit',
    Body: 'This jacket is exactly what I was looking for. The leather is soft and high quality.',
    Author: { name: 'Emily L.', email: 'emily@example.com' },
    IsVerified: true,
    HelpfulCount: 34,
    CreatedAt: '2024-01-08T16:45:00Z',
  },
  {
    ID: 5,
    ProductId: 4,
    Rating: 5,
    Title: 'Game changer for my home office',
    Body: 'My back pain is gone after switching to this chair. Worth every penny for the comfort.',
    Author: { name: 'David K.', email: 'david@example.com' },
    IsVerified: true,
    HelpfulCount: 89,
    CreatedAt: '2024-01-05T11:30:00Z',
  },
];

// Simulate PnP.js style API calls
export const ProductService = {
  getAll: async (categoryId?: number): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let products = mockProducts.filter(p => p.IsActive);
    if (categoryId) {
      products = products.filter(p => p.CategoryId === categoryId);
    }
    return products.sort((a, b) => a.SortOrder - b.SortOrder);
  },
  
  getById: async (id: number): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(p => p.ID === id && p.IsActive) || null;
  },
  
  getFeatured: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts.filter(p => p.IsFeatured && p.IsActive);
  },
  
  search: async (term: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const lowercaseTerm = term.toLowerCase();
    return mockProducts.filter(p => 
      p.IsActive && (
        p.Title.toLowerCase().includes(lowercaseTerm) ||
        p.Description.toLowerCase().includes(lowercaseTerm) ||
        p.Tags.some(tag => tag.toLowerCase().includes(lowercaseTerm))
      )
    );
  },
};

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories.filter(c => c.IsActive).sort((a, b) => a.SortOrder - b.SortOrder);
  },
  
  getBySlug: async (slug: string): Promise<Category | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories.find(c => c.Slug === slug && c.IsActive) || null;
  },
};

export const ReviewService = {
  getByProductId: async (productId: number): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockReviews.filter(r => r.ProductId === productId);
  },
  
  addReview: async (review: Omit<Review, 'ID' | 'CreatedAt' | 'HelpfulCount'>): Promise<Review> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newReview: Review = {
      ...review,
      ID: mockReviews.length + 1,
      HelpfulCount: 0,
      CreatedAt: new Date().toISOString(),
    };
    mockReviews.push(newReview);
    return newReview;
  },
};
