import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useProductDetail } from "../../../hooks/useProductDetail";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useUIStore } from "../../../store/uiStore";
import { formatCurrency, calculateDiscount } from "../../../utils/currency";
import { LazyImage } from "../ui/LazyImage";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import toast from "react-hot-toast";

interface ProductQuickViewProps {
  goToProduct: (productId: number) => void;
}

export function ProductQuickView({ goToProduct }: ProductQuickViewProps) {
  const { isQuickViewOpen, quickViewProductId, closeQuickView } = useUIStore();
  const { data: product, isLoading } = useProductDetail(
    quickViewProductId || 0
  );
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${quantity} x ${product.Title} added to cart!`);
      closeQuickView();
      openCart();
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleItem(product);
      toast.success(
        isInWishlist(product.ID) ? "Removed from wishlist" : "Added to wishlist!"
      );
    }
  };

  const handleViewDetails = () => {
    if (product) {
      closeQuickView();
      goToProduct(product.ID);
    }
  };

  const discount = product
    ? calculateDiscount(product.Price, product.CompareAtPrice || 0)
    : 0;

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-background rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {isLoading ? (
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            ) : product ? (
              <div className="grid md:grid-cols-2">
                {/* Image Section */}
                <div className="relative bg-secondary">
                  <div className="aspect-square">
                    <LazyImage
                      src={
                        product.Images[selectedImageIndex]?.Url ||
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                      }
                      alt={product.Title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && (
                      <Badge variant="destructive" size="md">
                        -{discount}% OFF
                      </Badge>
                    )}
                    {product.IsFeatured && (
                      <Badge variant="success" size="md">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {product.Images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      {product.Images.slice(0, 4).map((image: any, index: any) => (
                        <button
                          key={image.ID}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex
                              ? "border-primary"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <LazyImage
                            src={image.ThumbnailUrl || image.Url}
                            alt={`${product.Title} thumbnail`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col">
                  {/* Title & SKU */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      SKU: {product.SKU}
                    </p>
                    <h2 className="text-2xl font-bold text-foreground">
                      {product.Title}
                    </h2>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.AverageRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      {product.AverageRating.toFixed(1)} ({product.ReviewCount}{" "}
                      reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold text-foreground">
                      {formatCurrency(product.Price)}
                    </span>
                    {product.CompareAtPrice &&
                      product.CompareAtPrice > product.Price && (
                        <span className="text-xl text-muted-foreground line-through">
                          {formatCurrency(product.CompareAtPrice)}
                        </span>
                      )}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {product.Description}
                  </p>

                  {/* Stock Status */}
                  <div className="mb-6">
                    {product.Stock > 10 ? (
                      <p className="text-emerald-600 font-medium">In Stock</p>
                    ) : product.Stock > 0 ? (
                      <p className="text-amber-600 font-medium">
                        Only {product.Stock} left!
                      </p>
                    ) : (
                      <p className="text-red-600 font-medium">Out of Stock</p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm font-medium text-foreground">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-secondary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.Stock, quantity + 1))
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.Stock === 0}
                      className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`p-3 rounded-lg border transition-colors ${
                        isInWishlist(product.ID)
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "border-border hover:bg-secondary text-foreground"
                      }`}
                      aria-label={
                        isInWishlist(product.ID)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${isInWishlist(product.ID) ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* View Details Link */}
                  <button
                    onClick={handleViewDetails}
                    className="mt-4 text-center text-primary font-medium hover:underline"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Product not found</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
