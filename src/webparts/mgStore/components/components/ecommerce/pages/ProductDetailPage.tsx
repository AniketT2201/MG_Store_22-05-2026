import * as React from "react";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Star, Share2 } from 'lucide-react';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { useRecentlyViewedStore } from '../../../store/recentlyViewedStore';
import { ProductImageGallery } from '../../../components/ecommerce/product/ProductImageGallery';
import { RelatedProducts, RecentlyViewed } from '../../../components/ecommerce/product/RelatedProducts';
import { ReviewList } from '../../../components/ecommerce/reviews/ReviewList';
import { ErrorBoundary } from '../../../components/ecommerce/ui/ErrorBoundary';
import { Breadcrumbs } from '../../../components/ecommerce/ui/Breadcrumbs';
import { Badge } from '../../../components/ecommerce/ui/Badge';
import { ProductDetailSkeleton } from '../../../components/ecommerce/ui/Skeleton';
import { formatCurrency, calculateDiscount } from '../../../utils/currency';
import { FeedbackWidget } from "../../../components/ecommerce/feedback/FeedbackWidget";
import { toast } from '../ui/Toast';
import { createPortal } from "react-dom";


interface ProductDetailPageProps {
  productId: number;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { data: product, isLoading } = useProductDetail(productId);
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { productIds: recentlyViewedIds, addProduct: recordRecentlyViewed } = useRecentlyViewedStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specs'>('description');

  useEffect(() => {
    if (product?.ID) {
      recordRecentlyViewed(product.ID);
    }
    // Only re-run when the product itself changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.ID]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const discount = calculateDiscount(product.Price, product.CompareAtPrice || 0);
  const inWishlist = isInWishlist(product.ID);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.Title} added to cart!`);
    openCart();
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <>
      <style>
        {`
          .CanvasComponent.LCS .grid {
            display: grid !important;
          }

          .CanvasComponent.LCS .grid::before,
          .CanvasComponent.LCS .grid::after {
            content: none !important;
            display: none !important;
          }
        `}  
      </style>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: product.Title },
          ]}
        />

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductImageGallery images={product.Images} productTitle={product.Title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {discount > 0 && <Badge variant="destructive">-{discount}% OFF</Badge>}
              {product.IsFeatured && <Badge variant="success">Featured</Badge>}
              {product.Stock < 10 && product.Stock > 0 && <Badge variant="warning">Low Stock</Badge>}
              {product.Stock === 0 && <Badge variant="secondary">Out of Stock</Badge>}
            </div>

            {/* Title & SKU */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">SKU: {product.SKU}</p>
              <h1 className="text-3xl font-bold text-foreground">{product.Title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.AverageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-foreground font-medium">{product.AverageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.ReviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-foreground">
                {formatCurrency(product.Price)}
              </span>
              {product.CompareAtPrice && product.CompareAtPrice > product.Price && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatCurrency(product.CompareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.Description}
            </p>

            {/* Stock Status */}
            <div>
              {product.Stock > 10 ? (
                <p className="text-emerald-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  In Stock ({product.Stock} available)
                </p>
              ) : product.Stock > 0 ? (
                <p className="text-amber-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Only {product.Stock} left in stock!
                </p>
              ) : (
                <p className="text-red-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.Stock, quantity + 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.Stock === 0}
                className="flex-1 py-4 px-8 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleWishlist}
                className={`p-4 rounded-lg border transition-colors ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-border hover:bg-secondary text-foreground'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Share */}
              <button
                className="p-4 rounded-lg border border-border hover:bg-secondary text-foreground transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center p-3">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <Shield className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <RotateCcw className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">30 Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div className="flex border-b border-border">
            {[
              { id: 'description', label: 'Description' },
              { id: 'reviews', label: `Reviews (${product.ReviewCount})` },
              { id: 'specs', label: 'Specifications' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.Description}
                </p>
                {product.Tags && product.Tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-foreground mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.Tags.map((tag: any) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-secondary rounded-full text-sm text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ErrorBoundary section="reviews">
                <div className="mt-6">
                  <FeedbackWidget variant="inline" />
                </div>
                <ReviewList
                  productId={product.ID}
                  averageRating={product.AverageRating}
                  totalReviews={product.ReviewCount}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'specs' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-4">Product Details</h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">SKU</dt>
                      <dd className="font-medium text-foreground">{product.SKU}</dd>
                    </div>
                    {product.Weight && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Weight</dt>
                        <dd className="font-medium text-foreground">{product.Weight}g</dd>
                      </div>
                    )}
                    {product.Dimensions && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Dimensions</dt>
                        <dd className="font-medium text-foreground">
                          {product.Dimensions.width} x {product.Dimensions.height} x {product.Dimensions.depth} cm
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                {product.Attributes && Object.keys(product.Attributes).length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h4 className="font-semibold text-foreground mb-4">Attributes</h4>
                    <dl className="space-y-3">
                      {Object.entries(product.Attributes).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-muted-foreground capitalize">{key}</dt>
                          <dd className="font-medium text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <ErrorBoundary section="related products">
        <RelatedProducts
          currentProductId={product.ID}
          categoryId={product.CategoryId}
          tags={product.Tags}
        />
      </ErrorBoundary>

      {/* Recently Viewed (excluding the product currently being viewed) */}
      <ErrorBoundary section="recently viewed products">
        <RecentlyViewed
          productIds={recentlyViewedIds.filter((id) => id !== product.ID)}
        />
      </ErrorBoundary>
    </>
  );
}
