import * as React from "react";
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Truck, Shield } from 'lucide-react';
import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/currency";

export function CartSummary() {
  const { subtotal } = useCartStore();
  const total = subtotal();
  
  const shipping = total >= 99 ? 0 : 9.99;
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + shipping + tax;

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? (
              <span className="text-emerald-600">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {total < 99 && (
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Add <span className="font-semibold text-foreground">{formatCurrency(99 - total)}</span> more for free shipping!
          </p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((total / 99) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button className="w-full mt-6 py-4 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <CreditCard className="w-5 h-5" />
        Proceed to Checkout
      </button>

      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="w-4 h-4" />
          <span>Free shipping on orders over $99</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Secure 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
