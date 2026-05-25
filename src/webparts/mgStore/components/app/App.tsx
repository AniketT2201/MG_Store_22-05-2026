import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";

import styles from "../MgStore.module.scss";
import type { IMgStoreProps } from "../IMgStoreProps";
import { Providers } from "../components/providers/Providers";

import { EcommerceLayout } from "../components/ecommerce/layout/EcommerceLayout";

import { HomePage } from "../components/ecommerce/pages/HomePage";
import { ProductListPage } from "../components/ecommerce/pages/ProductListPage";
import { ProductDetailPage } from "../components/ecommerce/pages/ProductDetailPage";
import { CartPage } from "../components/ecommerce/pages/CartPage";
import { WishlistPage } from "../components/ecommerce/pages/WishlistPage";
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
            <Route exact path="/" component={HomePage} />
            <Route exact path="/products" component={ProductsRoute} />
            <Route
              exact
              path="/product/:productId"
              render={({ match }) => (
                <ProductDetailRoute productId={match.params.productId} />
              )}
            />
            <Route exact path="/cart" component={CartPage} />
            <Route exact path="/wishlist" component={WishlistPage} />
            <Route exact path="/search" component={SearchRoute} />
            <Route component={HomePage} />
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
      <Providers>
        <Router>
          <EcommerceRoutes />
        </Router>
      </Providers>
    </section>
  );
}
