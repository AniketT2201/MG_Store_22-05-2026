import * as React from "react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Star, Check } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useFilterStore } from '../../../store/filterStore';
import { accordionContent } from '../../../utils/animations';

export function FilterPanel() {
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
    resetFilters,
    hasActiveFilters,
  } = useFilterStore();

  const [openSections, setOpenSections] = useState<string[]>(['categories', 'price', 'rating']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: undefined },
  ];

  const FilterSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-border">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-4 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            openSections.includes(id) ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {openSections.includes(id) && (
          <motion.div
            variants={accordionContent}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters() && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories" id="categories">
        <div className="space-y-2">
          <button
            onClick={() => setCategoryId(undefined)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !categoryId
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary text-foreground'
            }`}
          >
            All Categories
          </button>
          {categories?.map((category) => (
            <button
              key={category.ID}
              onClick={() => setCategoryId(category.ID)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                categoryId === category.ID
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              }`}
            >
              <span>{category.Title}</span>
              <span className="text-xs opacity-60">{category.ProductCount}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" id="price">
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  isSelected
                    ? setPriceRange(undefined, undefined)
                    : setPriceRange(range.min, range.max)
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {range.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" id="rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setRating(rating === stars ? undefined : stars)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                rating === stars
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              }`}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < stars
                        ? rating === stars
                          ? 'text-primary-foreground fill-primary-foreground'
                          : 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability" id="availability">
        <label className="flex items-center gap-3 px-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock === true}
            onChange={(e) => setInStock(e.target.checked ? true : undefined)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  );
}
