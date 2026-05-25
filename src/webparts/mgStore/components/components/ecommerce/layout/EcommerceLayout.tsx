import * as React from "react";
import { Header } from "../../../components/ecommerce/layout/Header";
import { CategoryBar } from "../../../components/ecommerce/layout/CategoryBar";
import { Footer } from "../../../components/ecommerce/layout/Footer";
import { CartDrawer } from "../../../components/ecommerce/cart/CartDrawer";
import { ProductQuickView } from "../../../components/ecommerce/product/ProductQuickView";
import { SearchModal } from "../../../components/ecommerce/search/SearchModal";
import { useHistory, useLocation } from "react-router-dom";

interface EcommerceLayoutProps {
  children: React.ReactNode;
}

export const EcommerceLayout:
React.FC<EcommerceLayoutProps> = ({
  children,
}) => {
  const history = useHistory();
  const location = useLocation();

  const goToHome = (): void => {
    history.push("/");
  };

  const goToProducts = (categoryId?: number): void => {
    history.push(categoryId ? `/products?category=${categoryId}` : "/products");
  };

  const goToProduct = (productId: number): void => {
    history.push(`/product/${productId}`);
  };

  const goToCart = (): void => {
    history.push("/cart");
  };

  const goToWishlist = (): void => {
    history.push("/wishlist");
  };

  const goToSearch = (query?: string): void => {
    history.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const showCategoryBar =
    location.pathname === "/" ||
    location.pathname === "/products";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        goToHome={goToHome}
        goToProducts={
          goToProducts
        }
        goToCart={goToCart}
        goToWishlist={
          goToWishlist
        }
        goToSearch={
          goToSearch
        }
      />

      {showCategoryBar && (
        <CategoryBar
          goToProducts={
            goToProducts
          }
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      <Footer
        goToHome={goToHome}
        goToProducts={
          goToProducts
        }
      />

      {/* Overlays */}

      <CartDrawer
        goToCart={goToCart}
        goToProduct={
          goToProduct
        }
      />

      <ProductQuickView
        goToProduct={
          goToProduct
        }
      />

      <SearchModal
        goToSearch={
          goToSearch
        }
        goToProduct={
          goToProduct
        }
      />
    </div>
  );
};
