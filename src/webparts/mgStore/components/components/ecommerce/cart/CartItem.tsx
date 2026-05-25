import * as React from "react";
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { CartItem as CartItemType } from '../../../types';
import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/currency";
import { LazyImage } from '../ui/LazyImage';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const lineTotal = item.SnapshotPrice * item.Quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-6 p-4 bg-card rounded-xl border border-border"
    >
      {/* Product Image */}
      <Link to={`/product/${item.Product.ID}`} className="flex-shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-secondary">
          <LazyImage
            src={item.Product.Images[0]?.Url || 'https://via.placeholder.com/128'}
            alt={item.Product.Title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div>
            <Link
              to={`/product/${item.Product.ID}`}
              className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
            >
              {item.Product.Title}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">SKU: {item.Product.SKU}</p>
          </div>
          <button
            onClick={() => removeItem(item.ProductId)}
            className="p-2 h-fit text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-3">Qty:</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => updateQuantity(item.ProductId, item.Quantity - 1)}
                disabled={item.Quantity <= 1}
                className="p-2 hover:bg-secondary transition-colors disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{item.Quantity}</span>
              <button
                onClick={() => updateQuantity(item.ProductId, item.Quantity + 1)}
                disabled={item.Quantity >= item.Product.Stock}
                className="p-2 hover:bg-secondary transition-colors disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(lineTotal)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(item.SnapshotPrice)} each
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
