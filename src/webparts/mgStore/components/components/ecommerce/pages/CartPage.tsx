import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { useCartStore } from '../../../store/cartStore';
import { CartItem } from '../../../components/ecommerce/cart/CartItem';
import { CartSummary } from '../../../components/ecommerce/cart/CartSummary';
import { Breadcrumbs } from '../../../components/ecommerce/ui/Breadcrumbs';
import { stagger, fadeUp } from '../../../utils/animations';


export function CartPage() {
  const { items, clearCart } = useCartStore();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        // Empty Cart
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {"Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        // Cart Content
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.ID} variants={fadeUp} layout>
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
