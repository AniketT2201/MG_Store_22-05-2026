import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";

import styles from "../MgStore.module.scss";
import type { IMgStoreProps } from "../IMgStoreProps";
import { Providers } from "../components/providers/Providers";
import { CurrentUserProvider } from "../components/providers/CurrentUserContext";
import { ErrorBoundary } from "../components/ecommerce/ui/ErrorBoundary";

import { EcommerceLayout } from "../components/ecommerce/layout/EcommerceLayout";

import { HomePage } from "../components/ecommerce/pages/HomePage";
import { ProductListPage } from "../components/ecommerce/pages/ProductListPage";
import { ProductDetailPage } from "../components/ecommerce/pages/ProductDetailPage";
import { CartPage } from "../components/ecommerce/pages/CartPage";
import { WishlistPage } from "../components/ecommerce/pages/WishlistPage";
import { WishlistSharedPage } from "../components/ecommerce/pages/WishlistSharedPage";
import { SearchResultsPage } from "../components/ecommerce/pages/SearchResultsPage";

import { pageTransition } from "../utils/animations";
import {
  HashRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

const ProductDetailRoute: React.FC<{ productId: string }> = ({
  productId,
}) => {
  const parsedProductId = Number(productId);

  return (
    <ProductDetailPage
      productId={Number.isFinite(parsedProductId) ? parsedProductId : 0}
    />
  );
};

const ProductsRoute: React.FC = () => {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const categoryId = category ? Number(category) : undefined;

  return (
    <ProductListPage
      categoryId={Number.isFinite(categoryId) ? categoryId : undefined}
    />
  );
};

const SearchRoute: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  return <SearchResultsPage initialQuery={query} />;
};

const NotFoundRoute: React.FC = () => (
  <div className="container mx-auto px-4 py-24 text-center">
    <h1 className="text-3xl font-bold text-foreground mb-3">Page not found</h1>
    <p className="text-muted-foreground mb-8">
      The page you&apos;re looking for doesn&apos;t exist or may have moved.
    </p>
    <a
      href="#/"
      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
    >
      Back to home
    </a>
  </div>
);

const EcommerceRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <EcommerceLayout>
      <AnimatePresence exitBeforeEnter>
        <motion.main
          key={`${location.pathname}${location.search}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="flex-1"
        >
          <Switch location={location}>
            <Route exact path="/" render={() => (
              <ErrorBoundary section="the homepage"><HomePage /></ErrorBoundary>
            )} />
            <Route exact path="/products" render={() => (
              <ErrorBoundary section="the product list"><ProductsRoute /></ErrorBoundary>
            )} />
            <Route
              exact
              path="/product/:productId"
              render={({ match }) => (
                <ErrorBoundary section="this product">
                  <ProductDetailRoute productId={match.params.productId} />
                </ErrorBoundary>
              )}
            />
            <Route exact path="/cart" render={() => (
              <ErrorBoundary section="your cart"><CartPage /></ErrorBoundary>
            )} />
            <Route exact path="/wishlist" render={() => (
              <ErrorBoundary section="your wishlist"><WishlistPage /></ErrorBoundary>
            )} />
            <Route exact path="/wishlist/shared" render={() => (
              <ErrorBoundary section="this shared wishlist"><WishlistSharedPage /></ErrorBoundary>
            )} />
            <Route exact path="/search" render={() => (
              <ErrorBoundary section="search results"><SearchRoute /></ErrorBoundary>
            )} />
            <Route component={NotFoundRoute} />
          </Switch>
        </motion.main>
      </AnimatePresence>
    </EcommerceLayout>
  );
};

export default function App(
  props: IMgStoreProps
): React.ReactElement<IMgStoreProps> {

  return (
    <section
      className={`${styles.mgStore} ${
        props.hasTeamsContext ? styles.teams : ""
      }`}
    >
      <ErrorBoundary section="MGStore">
        <CurrentUserProvider
          user={{
            displayName: props.userDisplayName,
            email: props.userEmail,
            loginName: props.userLoginName,
          }}
        >
          <Providers>
            <Router>
              <EcommerceRoutes />
            </Router>
          </Providers>
        </CurrentUserProvider>
      </ErrorBoundary>
    </section>
  );
}
