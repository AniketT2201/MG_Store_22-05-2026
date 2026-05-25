import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/currency";
import { LazyImage } from "../ui/LazyImage";
import { drawerSlide } from "../../../utils/animations";

interface CartDrawerProps {
  goToCart: () => void;
  goToProduct: (productId: number) => void;
}

export function CartDrawer({ goToCart, goToProduct }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCartStore();
  const total = subtotal();

  const handleViewCart = () => {
    closeCart();
    goToCart();
  };

  const handleProductClick = (productId: number) => {
    closeCart();
    goToProduct(productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerSlide}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Shopping Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 px-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.ID}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-3 bg-card rounded-xl border border-border"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <LazyImage
                            src={
                              item.Product.Images[0]?.Url ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop"
                            }
                            alt={item.Product.Title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleProductClick(item.Product.ID)}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 text-left"
                          >
                            {item.Product.Title}
                          </button>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatCurrency(item.SnapshotPrice)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.ProductId,
                                    item.Quantity - 1
                                  )
                                }
                                className="p-1.5 hover:bg-secondary transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.Quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.ProductId,
                                    item.Quantity + 1
                                  )
                                }
                                className="p-1.5 hover:bg-secondary transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.ProductId)}
                              className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart */}
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="w-full py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(total)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleViewCart}
                    className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-center block hover:bg-secondary/80 transition-colors"
                  >
                    View Cart
                  </button>
                  <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
