import * as React from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useProducts } from "../../../hooks/useProducts";
import { useCartStore } from "../../../store/cartStore";
import { LazyImage } from "../../../components/ecommerce/ui/LazyImage";
import { EmptyState } from "../../../components/ecommerce/ui/EmptyState";
import { ProductGridSkeleton } from "../../../components/ecommerce/ui/Skeleton";
import { formatCurrency } from "../../../utils/currency";
import { stagger, fadeUp } from "../../../utils/animations";
import { toast } from '../ui/Toast';

/**
 * Read-only view of someone else's wishlist, opened from a link generated
 * by WishlistPage's "Share Wishlist" button (?items=1,2,3 in the query
 * string). Anyone with the link can view it and add items to their own
 * cart — this intentionally does not require the viewer to be the owner.
 */
export function WishlistSharedPage() {
  const location = useLocation();
  const { data: products, isLoading } = useProducts();
  const { addItem, openCart } = useCartStore();

  const sharedProductIds = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("items") || "")
      .split(",")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  }, [location.search]);

  const sharedProducts = useMemo(
    () => products?.filter((p) => sharedProductIds.includes(p.ID)) || [],
    [products, sharedProductIds]
  );

  const handleAddToCart = (product: (typeof sharedProducts)[number]) => {
    addItem(product);
    toast.success(`${product.Title} added to your cart!`);
    openCart();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Shared Wishlist</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Someone shared these items with you. Add anything you like to your own cart.
      </p>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : sharedProducts.length === 0 ? (
        <EmptyState
          icon="wishlist"
          title="This wishlist link looks empty or expired"
          description="The items in this link may no longer be available."
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sharedProducts.map((product) => (
            <motion.div
              key={product.ID}
              variants={fadeUp}
              className="bg-card rounded-xl border border-border overflow-hidden group"
            >
              <Link to={`/product/${product.ID}`}>
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <LazyImage
                    src={product.Images[0]?.Url || "https://via.placeholder.com/400"}
                    alt={product.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.ID}`}>
                  <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.Title}
                  </h3>
                </Link>
                <span className="text-lg font-bold text-foreground block mb-4">
                  {formatCurrency(product.Price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.Stock === 0}
                  className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.Stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
