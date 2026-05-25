import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { useUIStore } from "../../../store/uiStore";
import { useProductSearch } from "../../../hooks/useProducts";
import { useDebounce } from "use-debounce";
import { formatCurrency } from "../../../utils/currency";
import { LazyImage } from "../ui/LazyImage";
import { Skeleton } from "../ui/Skeleton";

interface SearchModalProps {
  goToSearch: (query?: string) => void;
  goToProduct: (productId: number) => void;
}

export function SearchModal({ goToSearch, goToProduct }: SearchModalProps) {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading } = useProductSearch(debouncedQuery);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeSearch]);

  const popularSearches = [
    "Headphones",
    "Smartwatch",
    "Leather Jacket",
    "Running Shoes",
  ];

  const handleProductClick = (productId: number) => {
    closeSearch();
    goToProduct(productId);
  };

  const handleViewAll = () => {
    closeSearch();
    goToSearch(query);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 bg-background shadow-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4">
              {/* Search Input */}
              <div className="flex items-center gap-4 py-6 border-b border-border">
                <Search className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-xl bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Search Results */}
              <div className="py-6 max-h-[60vh] overflow-y-auto">
                {query.length < 3 ? (
                  // Show popular searches when no query
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-secondary rounded-full text-sm text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isLoading ? (
                  // Loading state
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results && results.length > 0 ? (
                  // Results
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {results.length} results for &quot;{query}&quot;
                    </p>
                    <div className="space-y-3">
                      {results.slice(0, 6).map((product) => (
                        <button
                          key={product.ID}
                          onClick={() => handleProductClick(product.ID)}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            <LazyImage
                              src={
                                product.Images[0]?.Url ||
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop"
                              }
                              alt={product.Title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {product.Title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(product.Price)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                    {results.length > 6 && (
                      <button
                        onClick={handleViewAll}
                        className="block mt-4 text-center py-3 text-primary font-medium hover:underline w-full"
                      >
                        View all {results.length} results
                      </button>
                    )}
                  </div>
                ) : (
                  // No results
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try different keywords or browse our categories
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
