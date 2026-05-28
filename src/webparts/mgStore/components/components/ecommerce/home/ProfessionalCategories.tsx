import * as React from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Watch,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";
import { Skeleton } from "../ui/Skeleton";

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-12 h-12" />,
  Shirt: <Shirt className="w-12 h-12" />,
  Home: <Home className="w-12 h-12" />,
  Dumbbell: <Dumbbell className="w-12 h-12" />,
  BookOpen: <BookOpen className="w-12 h-12" />,
  Sparkles: <Sparkles className="w-12 h-12" />,
  ShoppingBag: <ShoppingBag className="w-12 h-12" />,
  Watch: <Watch className="w-12 h-12" />,
};

const categoryGradients = [
  "from-blue-600 to-blue-400",
  "from-purple-600 to-purple-400",
  "from-pink-600 to-pink-400",
  "from-amber-600 to-amber-400",
  "from-emerald-600 to-emerald-400",
  "from-red-600 to-red-400",
  "from-indigo-600 to-indigo-400",
  "from-cyan-600 to-cyan-400",
];

interface CategoryItem {
  ID: number;
  Title: string;
  ProductCount: number;
  IconName?: string;
  ImageUrl?: {
    Url: string;
  };
}

export function ProfessionalCategories() {
  const { data: categories, isLoading } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -12,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Shop By Category
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through our carefully curated categories to find exactly what
            you're looking for
          </p>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories?.slice(0, 8).map((category: CategoryItem, index) => (
              <motion.div
                key={category.ID}
                variants={itemVariants}
                whileHover="hover"
              >
                <Link
                  to={`/products?category=${category.ID}`}
                  className="group block h-full"
                >
                  <div
                    className={`relative h-80 rounded-2xl bg-gradient-to-br ${
                      categoryGradients[index % categoryGradients.length]
                    } overflow-hidden border-2 border-white/10 backdrop-blur-sm`}
                  >
                    {/* Background pattern overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
                    </div>

                    {/* Image background */}
                    {category.ImageUrl?.Url && (
                      <img
                        src={category.ImageUrl.Url}
                        alt={category.Title}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                      />
                    )}

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                      {/* Icon Container */}
                      <motion.div
                        className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 text-white border border-white/20 group-hover:bg-white/25 transition-all"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {(category.IconName && iconMap[category.IconName]) ||
                          iconMap["Sparkles"] ||
                          <Sparkles className="w-12 h-12" />}
                      </motion.div>

                      {/* Category Name */}
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                        {category.Title}
                      </h3>

                      {/* Product Count */}
                      <p className="text-sm text-white/80 mb-4">
                        {category.ProductCount} Products
                      </p>

                      {/* CTA Text */}
                      <motion.div
                        className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-all"
                        initial={{ y: 10, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        <span>Shop Now</span>
                        <span className="text-xl">→</span>
                      </motion.div>
                    </div>

                    {/* Border glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/40 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-16"
      >
        <Link
          to="/products"
          className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <span className="flex items-center gap-2">
            View All Categories
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-50 blur transition-opacity" />
        </Link>
      </motion.div>
    </section>
  );
}
