import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    title: "Summer Collection 2026",
    subtitle: "Discover Premium Fashion",
    description: "Explore our latest summer collection with exclusive designs",
    cta: "Shop Summer",
    ctaLink: "/products?category=summer",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
    title: "Limited Edition Sale",
    subtitle: "Up to 70% Off",
    description: "Premium products at unbelievable prices. Act fast!",
    cta: "Shop Sale",
    ctaLink: "/products?sale=true",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop",
    title: "Exclusive Brands",
    subtitle: "Premium Quality",
    description: "Featuring the world's most trusted brands",
    cta: "Explore Brands",
    ctaLink: "/products",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1549887534-f81d85ff1bef?w=1200&h=600&fit=crop",
    title: "New Arrivals",
    subtitle: "Fresh Styles Daily",
    description: "Latest trends delivered straight to your wardrobe",
    cta: "View New",
    ctaLink: "/products?sort=new",
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + heroSlides.length) % heroSlides.length
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const slide = heroSlides[currentIndex];

  return (
    <section className="relative w-full h-screen max-h-[800px] overflow-hidden bg-black">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm font-medium backdrop-blur-md">
                  Featured Collection
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-4xl font-light mb-6 text-white/90"
              >
                {slide.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
              >
                {slide.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{slide.cta}</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all border border-white/20 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all border border-white/20 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 translate-y-16">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              setAutoPlay(false);
              setTimeout(() => setAutoPlay(true), 5000);
            }}
            className={`transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/40 w-2 hover:bg-white/60"
            } h-2 rounded-full`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        key={currentIndex}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
      />
    </section>
  );
};
