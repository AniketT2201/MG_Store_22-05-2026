import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaService } from "../../../services/SharePointService";
import { ProductImage } from "../../../types";

interface HeroSlide {
  id: number;
  image: ProductImage;
}

export const HeroCarousel: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Fetch banner images from SharePoint
  const fetchBannerImages = async () => {
    try {
      setIsLoading(true);
      const images = await MediaService.getBannerImages();

      if (!images || images.length === 0) {
        console.warn("No banner images found in SharePoint");
        setSlides([]);
        return;
      }

      const heroSlides: HeroSlide[] = images.map((img, index) => ({
        id: index + 1,
        image: img,
      }));

      setSlides(heroSlides);
    } catch (error) {
      console.error("Failed to fetch banner images:", error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    void fetchBannerImages();
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 120 : -120,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    if (slides.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  // Auto-play carousel
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (isLoading) {
    return (
      <section className="w-full h-80 bg-gray-200 animate-pulse rounded-2xl" />
    );
  }

  if (slides.length === 0) {
    return (
      <section className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-500">
        No banner images available
      </section>
    );
  }

  const slide = slides[currentIndex];

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
      <section
        className="relative w-full h-72 md:h-96 lg:h-[430px] overflow-hidden bg-secondary group border-b border-border"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Carousel Container */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 180, damping: 28 },
              opacity: { duration: 0.35 },
            }}
            className="absolute inset-0"
          >
            {/* Image with overlay */}
            <img
              src={slide.image.Url}
              alt={slide.image.AltText || "Banner"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Left Navigation Icon - Hover Reveal */}
        <motion.button
          onClick={() => paginate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: showControls ? 1 : 0, x: showControls ? 0 : -20 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm border border-white/70"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </motion.button>

        {/* Right Navigation Icon - Hover Reveal */}
        <motion.button
          onClick={() => paginate(1)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showControls ? 1 : 0, x: showControls ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm border border-white/70"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </motion.button>

        {/* Dot Indicators - Bottom */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-sm">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all ${
                index === currentIndex ? "bg-white w-6" : "bg-white/55 w-2"
              } h-2 rounded-full hover:bg-white`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};
