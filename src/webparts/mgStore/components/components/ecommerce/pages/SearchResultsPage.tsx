import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { Search, X, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { useProducts } from "../../../hooks/useProducts";
import { useFilterStore } from "../../../store/filterStore";
import { ProductCard } from "../product/ProductCard";
import { ProductCardSkeleton } from "../ui/Skeleton";
import { FilterPanel } from "../filters/FilterPanel";
import { SortDropdown } from "../filters/SortDropdown";
import { FilterChip } from "../filters/FilterChip";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { stagger, fadeUp } from "../../../utils/animations";


interface SearchResultsPageProps {
  initialQuery?: string;
  onClose?: () => void;
}

export function SearchResultsPage({ initialQuery = "", onClose }: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);

  const { data: products, isLoading } = useProducts();
  const {
    minPrice,
    maxPrice,
    categoryId,
    sortBy,
    resetFilters,
  } = useFilterStore();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      // Search filter
      if (debouncedQuery) {
        const query = debouncedQuery.toLowerCase();
        const matchesTitle = product.Title.toLowerCase().includes(query);
        const matchesDescription = product.Description?.toLowerCase().includes(query);
        const matchesSku = product.SKU?.toLowerCase().includes(query);
        const matchesTags = product.Tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesSku && !matchesTags) {
          return false;
        }
      }
      
      // Price filter
      if (
        (minPrice !== undefined && product.Price < minPrice) ||
        (maxPrice !== undefined && product.Price > maxPrice)
      ) {
        return false;
      }
      
      // Category filter
      if (categoryId && product.CategoryId !== categoryId) {
        return false;
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.Price - b.Price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.Price - a.Price);
        break;
      case "rating":
        filtered.sort((a, b) => b.AverageRating - a.AverageRating);
        break;
      case "newest":
        filtered.sort((a, b) => b.ID - a.ID);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, debouncedQuery, minPrice, maxPrice, categoryId, sortBy]);

  const hasActiveFilters =
    !!categoryId ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    debouncedQuery.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Search Results" },
          ]}
        />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {debouncedQuery ? `Results for "${debouncedQuery}"` : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-border hover:bg-secondary"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <SortDropdown />
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FilterChip />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <FilterPanel />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {debouncedQuery
                    ? `We couldn't find any products matching "${debouncedQuery}". Try different keywords or adjust your filters.`
                    : "No products match your current filters. Try adjusting or clearing your filters."}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.ID} variants={fadeUp}>
                    <ProductCard product={product}  />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
