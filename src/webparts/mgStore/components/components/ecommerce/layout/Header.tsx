import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useUIStore } from "../../../store/uiStore";
import { useCategories } from "../../../hooks/useCategories";
import { bounceScale } from "../../../utils/animations";

interface HeaderProps {
  goToHome: () => void;
  goToProducts: (categoryId?: number) => void;
  goToCart: () => void;
  goToWishlist: () => void;
  goToSearch: (query?: string) => void;
}

export function Header({
  goToHome,
  goToProducts,
  goToCart,
  goToWishlist,
  goToSearch,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch, toggleMobileMenu, isMobileMenuOpen, closeMobileMenu } =
    useUIStore();
  const { data: categories } = useCategories();
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = totalItems();

  const handleCartClick = () => {
    openCart();
  };

  const handleSearchClick = () => {
    openSearch();
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background"
      }`}
    >
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        Free shipping on orders over $99 | Use code SAVE20 for 20% off
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={goToHome} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              SPFx Store
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={goToHome}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showCategories ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border py-2"
                  >
                    {categories?.map((category) => (
                      <button
                        key={category.ID}
                        onClick={() => {
                          goToProducts(category.ID);
                          setShowCategories(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-foreground hover:bg-secondary transition-colors"
                      >
                        {category.Title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => goToProducts()}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              All Products
            </button>

            <button
              onClick={goToWishlist}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Wishlist
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              onClick={handleSearchClick}
              className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={goToWishlist}
              className="relative p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <motion.button
              onClick={handleCartClick}
              className="relative p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Shopping cart"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    variants={bounceScale}
                    initial="initial"
                    animate="animate"
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User */}
            <button
              className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <button
                onClick={() => {
                  goToHome();
                  closeMobileMenu();
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
                  goToProducts();
                  closeMobileMenu();
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
              >
                All Products
              </button>
              {categories?.map((category) => (
                <button
                  key={category.ID}
                  onClick={() => {
                    goToProducts(category.ID);
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-3 px-4 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {category.Title}
                </button>
              ))}
              <button
                onClick={() => {
                  goToWishlist();
                  closeMobileMenu();
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Wishlist
              </button>
              <button
                onClick={() => {
                  goToCart();
                  closeMobileMenu();
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Cart ({cartCount})
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
