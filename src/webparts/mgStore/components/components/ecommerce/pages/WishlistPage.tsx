import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Share2 } from 'lucide-react';
import { Link, useHistory } from "react-router-dom";
import { useWishlistStore } from '../../../store/wishlistStore';
import { useCartStore } from '../../../store/cartStore';
import { Breadcrumbs } from '../../../components/ecommerce/ui/Breadcrumbs';
import { LazyImage } from '../../../components/ecommerce/ui/LazyImage';
import { EmptyState } from '../../../components/ecommerce/ui/EmptyState';
import { formatCurrency } from '../../../utils/currency';
import { stagger, fadeUp } from '../../../utils/animations';
import { toast } from '../ui/Toast';


export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const history = useHistory();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem(item.Product);
    removeItem(item.ProductId);
    toast.success(`${item.Product.Title} moved to cart!`);
    openCart();
  };

  const handleShareWishlist = async () => {
    if (items.length === 0) return;

    const ids = items.map((item) => item.ProductId).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}#/wishlist/shared?items=${ids}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Wishlist', url: shareUrl });
        return;
      }
    } catch {
      // User cancelled the native share sheet or it's unsupported — fall
      // through to clipboard copy below.
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Wishlist link copied to clipboard!');
    } catch {
      toast.error("Couldn't copy the link — copy it from your browser's address bar instead.");
    }
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
            <div className="flex items-center gap-4">
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Wishlist
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          // Empty Wishlist
          <EmptyState
            icon="wishlist"
            title="Your wishlist is empty"
            description="Save items you love by clicking the heart icon on any product. They'll appear here for easy access later."
            action={{ label: 'Explore Products', onClick: () => history.push('/products') }}
          />
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
