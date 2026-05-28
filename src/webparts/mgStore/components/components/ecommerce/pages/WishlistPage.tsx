import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from "react-router-dom";
import { useWishlistStore } from '../../../store/wishlistStore';
import { useCartStore } from '../../../store/cartStore';
import { Breadcrumbs } from '../../../components/ecommerce/ui/Breadcrumbs';
import { LazyImage } from '../../../components/ecommerce/ui/LazyImage';
import { formatCurrency } from '../../../utils/currency';
import { stagger, fadeUp } from '../../../utils/animations';
import toast from 'react-hot-toast';


export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem(item.Product);
    removeItem(item.ProductId);
    toast.success(`${item.Product.Title} moved to cart!`);
    openCart();
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
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />

        {/* Page Header */}
        <div className="flex items-center justify-between mt-6 mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </button>
          )}
        </div>

        {items.length === 0 ? (
          // Empty Wishlist
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product. {"They'll"} appear here for easy access later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          // Wishlist Items
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.ID}
                  variants={fadeUp}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-xl border border-border overflow-hidden group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.Product.ID}`}>
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <LazyImage
                        src={item.Product.Images[0]?.Url || 'https://via.placeholder.com/400'}
                        alt={item.Product.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeItem(item.ProductId);
                          toast.success('Removed from wishlist');
                        }}
                        className="absolute top-3 right-3 p-2 bg-card rounded-full text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/product/${item.Product.ID}`}>
                      <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {item.Product.Title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(item.Product.Price)}
                      </span>
                      {item.Product.CompareAtPrice && item.Product.CompareAtPrice > item.Product.Price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(item.Product.CompareAtPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.Product.Stock === 0}
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.Product.Stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}
