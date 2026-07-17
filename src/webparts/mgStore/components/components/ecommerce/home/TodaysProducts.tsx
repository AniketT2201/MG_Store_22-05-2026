import * as React from "react";
import { motion } from "framer-motion";
import { useFeaturedProducts } from "../../../hooks/useProducts";
import { ProductCard } from "../product/ProductCard";
import { stagger, fadeUp } from "../../../utils/animations";
import { useHistory } from "react-router-dom";

const PRODUCT_TABS = [
  { id: "trending", label: "Trending Now", badge: "Trend" },
  { id: "bestseller", label: "Best Seller", badge: "Best" },
  { id: "newarrival", label: "New Arrival", badge: "New" },
  { id: "sale", label: "Special Price", badge: "Deal" },
];

export function TodaysProducts() {
  const { data: products, isLoading } = useFeaturedProducts();
  const [activeTab, setActiveTab] = React.useState("trending");
  const history = useHistory();

  const getProductsForTab = () => {
    if (!products) return [];
    return products.slice(0, 4);
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
            Today's Picks
          </h2>
          <p className="text-muted-foreground text-sm">
            Personalized picks based on your interests
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 border ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground hover:bg-secondary border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            key={activeTab}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {getProductsForTab()?.map((product, index) => (
              <motion.div key={product.ID} variants={fadeUp}>
                <div className="relative group">
                  <div className="absolute top-3 left-3 z-10 bg-card/95 text-foreground px-2 py-1 rounded-full text-xs font-medium border border-border">
                    {PRODUCT_TABS.find((t) => t.id === activeTab)?.badge}
                  </div>
                  <ProductCard product={product} index={index} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <button 
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            onClick={() => history.push("/products")}
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
