import * as React from "react";
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from "../../../store/cartStore";
import { bounceScale } from "../../../utils/animations";

export function CartIcon() {
  const { openCart, totalItems } = useCartStore();
  const count = totalItems();

  return (
    <motion.button
      onClick={openCart}
      className="relative p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Shopping cart with ${count} items`}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <motion.span
          key={count}
          variants={bounceScale}
          initial="initial"
          animate="animate"
          className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </motion.button>
  );
}
