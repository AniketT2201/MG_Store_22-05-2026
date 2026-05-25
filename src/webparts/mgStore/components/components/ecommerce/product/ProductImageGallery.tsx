import * as React from "react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '../../../types';
import { LazyImage } from '../ui/LazyImage';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = selectedIndex + newDirection;
    if (newIndex >= 0 && newIndex < images.length) {
      setDirection(newDirection);
      setSelectedIndex(newIndex);
    }
  };

  const goToImage = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-secondary rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={selectedIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            <LazyImage
              src={images[selectedIndex]?.Url || ''}
              alt={`${productTitle} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              disabled={selectedIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={selectedIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 rounded-full text-sm font-medium z-10">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.ID}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-border'
              }`}
            >
              <LazyImage
                src={image.ThumbnailUrl || image.Url}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
