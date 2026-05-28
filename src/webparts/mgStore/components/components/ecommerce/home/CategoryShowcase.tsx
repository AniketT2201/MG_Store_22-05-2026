import * as React from "react";
import { motion } from 'framer-motion';
import { ArrowRight, Laptop, Shirt, Home, Dumbbell, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import { Skeleton } from '../ui/Skeleton';
import { stagger, fadeUp } from '../../../utils/animations';

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-8 h-8" />,
  Shirt: <Shirt className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
  Dumbbell: <Dumbbell className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
};

const gradients = [
  'from-blue-500/20 to-cyan-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-indigo-500/20 to-purple-500/20',
  'from-red-500/20 to-pink-500/20',
];

export function CategoryShowcase() {
  const { data: categories, isLoading, error, isError, } = useCategories();
  console.log("categories", categories);
  console.log("error", error);
  console.log("isError", isError);

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
      <section className="py-10 lg:py-14 bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Browse by Category
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-1 max-w-lg mx-auto text-sm">
              Explore our wide range of categories to find exactly what you need
            </p>
          </motion.div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {categories?.map((category, index) => (
                <motion.div key={category.ID} variants={fadeUp}>
                  <Link
                    to={`/products?category=${category.ID}`}
                    className="group block"
                  >
                    <div className={`relative aspect-square rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} overflow-hidden border border-border hover:border-primary/50 transition-all duration-300`}>
                      {/* Background Image */}
                      {category.ImageUrl && (
                        <img
                          src={category.ImageUrl?.Url}
                          alt={category.Title}
                          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
                        />
                      )}
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center mb-2 text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                          {iconMap[category.IconName] || <Sparkles className="w-6 h-6" />}
                        </div>
                        <h3 className="font-semibold text-foreground text-xs lg:text-sm line-clamp-2">
                          {category.Title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {category.ProductCount} Products
                        </p>
                        <ArrowRight className="w-3 h-3 text-primary mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
