import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFilterStore } from '../../../store/filterStore';
import { useCategories } from '../../../hooks/useCategories';
import { filterChip } from '../../../utils/animations';

export function FilterChip() {
  const { data: categories } = useCategories();
  const {
    categoryId,
    minPrice,
    maxPrice,
    rating,
    inStock,
    setCategoryId,
    setPriceRange,
    setRating,
    setInStock,
  } = useFilterStore();

  const chips: { label: string; onRemove: () => void }[] = [];

  if (categoryId) {
    const category = categories?.find((c) => c.ID === categoryId);
    if (category) {
      chips.push({
        label: category.Title,
        onRemove: () => setCategoryId(undefined),
      });
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const label =
      minPrice && maxPrice
        ? `$${minPrice} - $${maxPrice}`
        : minPrice
        ? `Over $${minPrice}`
        : `Under $${maxPrice}`;
    chips.push({
      label,
      onRemove: () => setPriceRange(undefined, undefined),
    });
  }

  if (rating) {
    chips.push({
      label: `${rating}+ Stars`,
      onRemove: () => setRating(undefined),
    });
  }

  if (inStock) {
    chips.push({
      label: 'In Stock',
      onRemove: () => setInStock(undefined),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {chips.map((chip) => (
          <motion.button
            key={chip.label}
            variants={filterChip}
            initial="hidden"
            animate="show"
            exit="exit"
            layout
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            {chip.label}
            <X className="w-3.5 h-3.5" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
