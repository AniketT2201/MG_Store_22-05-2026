import * as React from "react";
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Link } from "react-router-dom";
import { Product } from '../../../types';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { useUIStore } from '../../../store/uiStore';
import { formatCurrency, calculateDiscount } from '../../../utils/currency';
import { LazyImage } from '../ui/LazyImage';
import { Badge } from '../ui/Badge';
import { toast } from '../ui/Toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { openQuickView } = useUIStore();
  
  const discount = calculateDiscount(product.Price, product.CompareAtPrice || 0);
  const inWishlist = isInWishlist(product.ID);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.Title} added to cart!`, {
      style: {
        borderRadius: '10px',
        background: 'var(--card)',
        color: 'var(--card-foreground)',
      },
    });
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast.success(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
      {
        style: {
          borderRadius: '10px',
          background: 'var(--card)',
          color: 'var(--card-foreground)',
        },
      }
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.ID);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link to={`/product/${product.ID}`}>
        <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <LazyImage
              src={product.Images[0]?.Url || 'https://via.placeholder.com/400'}
              alt={product.Title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="destructive" size="sm">
                  -{discount}%
                </Badge>
              )}
              {product.IsFeatured && (
                <Badge variant="success" size="sm">
                  Featured
                </Badge>
              )}
              {product.Stock < 10 && product.Stock > 0 && (
                <Badge variant="warning" size="sm">
                  Low Stock
                </Badge>
              )}
              {product.Stock === 0 && (
                <Badge variant="secondary" size="sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full shadow-md transition-colors ${
                  inWishlist 
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-card text-foreground hover:bg-secondary border border-border'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="p-2.5 rounded-full bg-card text-foreground hover:bg-secondary shadow-md transition-colors border border-border"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <motion.div
              initial={false}
              whileHover={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300"
            >
              <button
                onClick={handleAddToCart}
                disabled={product.Stock === 0}
                className="w-full py-3 bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.Stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.Tags[0] || 'General'}
            </p>
            
            {/* Title */}
            <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-10">
              {product.Title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(product.Price)}
              </span>
              {product.CompareAtPrice && product.CompareAtPrice > product.Price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.CompareAtPrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.AverageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.ReviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
