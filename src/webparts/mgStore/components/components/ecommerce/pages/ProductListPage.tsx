import * as React from "react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, LayoutGrid, LayoutList, X } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import { useFilterStore } from '../../../store/filterStore';
import { ProductGrid } from '../../../components/ecommerce/product/ProductGrid';
import { FilterPanel } from '../../../components/ecommerce/filters/FilterPanel';
import { SortDropdown } from '../../../components/ecommerce/filters/SortDropdown';
import { FilterChip } from '../../../components/ecommerce/filters/FilterChip';
import { Breadcrumbs } from '../../../components/ecommerce/ui/Breadcrumbs';
import { Product } from '../../../types';


interface ProductListPageProps {
  categoryId?: number;
  categoryName?: string;
}

export function ProductListPage({ categoryId, categoryName }: ProductListPageProps) {
  const { data: products, isLoading } = useProducts(categoryId);
  const { categoryId: filterCategoryId, minPrice, maxPrice, rating, inStock, sortBy, resetFilters } = useFilterStore();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Apply client-side filters
  const filteredProducts = products
    ?.filter((product: Product) => {
      if (filterCategoryId && product.CategoryId !== filterCategoryId) return false;
      if (minPrice && product.Price < minPrice) return false;
      if (maxPrice && product.Price > maxPrice) return false;
      if (rating && product.AverageRating < rating) return false;
      if (inStock && product.Stock === 0) return false;
      return true;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc':
          return a.Price - b.Price;
        case 'price-desc':
          return b.Price - a.Price;
        case 'rating':
          return b.AverageRating - a.AverageRating;
        case 'name':
          return a.Title.localeCompare(b.Title);
        case 'newest':
        default:
          return b.ID - a.ID;
      }
    }) || [];

  const categoryCounts = React.useMemo(() => {
    return products?.reduce((acc: Record<number, number>, product: any) => {
      const categoryId = product.CategoryId; // adjust if lookup

      if (categoryId) {
        acc[categoryId] = (acc[categoryId] || 0) + 1;
      }

      return acc;
    }, {});
  }, [products]);

  const breadcrumbs = categoryName
    ? [{ label: 'Products', href: '/products' }, { label: categoryName }]
    : [{ label: 'All Products' }];

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
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {categoryName || 'All Products'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLoading ? 'Loading...' : `${filteredProducts.length} products`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel categoryCounts={categoryCounts} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                
                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-secondary' : ''}`}
                    aria-label="List view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <SortDropdown />
            </div>

            {/* Active Filters */}
            <div className="mb-6">
              <FilterChip />
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              emptyMessage="No products match your filters"
              emptyDescription="Try widening your price range, clearing a filter, or checking a different category."
              emptyAction={{ label: 'Clear all filters', onClick: resetFilters }}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                className="absolute top-0 left-0 h-full w-full max-w-sm bg-background shadow-2xl overflow-y-auto"
              >
                <div className="sticky top-0 bg-background z-10 flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-secondary rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <FilterPanel categoryCounts={categoryCounts} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
