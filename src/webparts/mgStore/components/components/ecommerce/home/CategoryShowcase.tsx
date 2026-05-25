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
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Browse by Category
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Explore our wide range of categories to find exactly what you need
          </p>
        </motion.div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories?.map((category, index) => (
              <motion.div key={category.ID} variants={fadeUp}>
                <Link
                  to={`/products?category=${category.ID}`}
                  className="group block"
                >
                  <div className={`relative aspect-square rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} overflow-hidden border border-border hover:border-primary/50 transition-all duration-300`}>
                    {/* Background Image */}
                    {category.ImageUrl && (
                      <img
                        src={category.ImageUrl}
                        alt={category.Title}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
                      />
                    )}
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                        {iconMap[category.IconName] || <Sparkles className="w-8 h-8" />}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm lg:text-base">
                        {category.Title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.ProductCount} Products
                      </p>
                      <ArrowRight className="w-4 h-4 text-primary mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
