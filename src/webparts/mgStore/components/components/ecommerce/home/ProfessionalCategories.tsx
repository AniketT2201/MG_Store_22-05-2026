import * as React from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Grid2X2,
  ShoppingBag,
  Watch,
} from "lucide-react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";
import { useProducts } from "../../../hooks/useProducts";

const FallbackIcon = Icons.Grid2x2;
const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-8 h-8" />,
  Shirt: <Shirt className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
  Dumbbell: <Dumbbell className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Sparkles: <Grid2X2 className="w-7 h-7" />,
  ShoppingBag: <ShoppingBag className="w-8 h-8" />,
  Watch: <Watch className="w-8 h-8" />,
};

interface CategoryItem {
  ID: number;
  Title: string;
  ProductCount: number;
  IconName?: string;
  ImageUrl?: {
    Url: string;
  };
}

export const ProfessionalCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const { data: products } = useProducts();

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const categoryCounts = React.useMemo(
    () =>
      (products ?? []).reduce((acc: Record<number, number>, product: any) => {
        const categoryId = product.CategoryId;

        if (categoryId) {
          acc[categoryId] = (acc[categoryId] || 0) + 1;
        }

        return acc;
      }, {}),
    [products]
  );

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
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Shop By Category
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Find what you need faster with clear product groups.
            </p>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 rounded-lg bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
              style={{
                gridTemplateColumns: "repeat(9, 1fr)",
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-4"
            >
              {categories.slice(0, 8).map((category: CategoryItem) => (
                <motion.div
                  key={category.ID}
                  variants={itemVariants}
                  //whileHover={{ scale: 1.08 }}
                >
                  <Link
                    to={`/products?category=${category.ID}`}
                    className="group flex min-h-36 flex-col items-center text-center p-2"
                  >
                    {/* Category Image/Icon Container */}
                    <div className="relative mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                      {/* Background Image */}
                      {category.ImageUrl?.Url && (
                        <img
                          src={category.ImageUrl?.Url}
                          alt={category.Title}
                          className="w-full h-full object-cover opacity-95 transition-opacity duration-300 group-hover:opacity-95"
                        />
                      )}

                      {/* Icon Overlay */}
                      {/* <div className="absolute inset-0 flex items-center justify-center bg-card/45">
                        <div className="text-foreground/75 transition-colors duration-300 group-hover:text-primary">
                          {(category.IconName && iconMap[category.IconName]) ||
                            iconMap["Sparkles"] ||
                            <Grid2X2 className="w-7 h-7" />}
                        </div>
                      </div> */}
                    </div>

                    {/* Category Title */}
                    <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {category.Title}
                    </h3>

                    {/* Product Count */}
                    <p className="text-xs text-muted-foreground">
                      {categoryCounts[category.ID] || 0} items
                    </p>
                  </Link>
                </motion.div>
              ))}
              {/* View All Category */}
              <motion.div
                variants={itemVariants}
                //whileHover={{ scale: 1.08 }}
              >
                <Link
                  to="/products"
                  className="group flex min-h-36 flex-col items-center text-center p-2"
                >
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
                    <ShoppingBag
                      size={26}
                      className="text-foreground/75 transition-colors duration-300 group-hover:text-primary"
                    />
                  </div>

                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    View All
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Categories
                  </p>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500">
              Categories will load shortly
            </div>
          )}

        </div>
      </section>
    </>
  );
}
