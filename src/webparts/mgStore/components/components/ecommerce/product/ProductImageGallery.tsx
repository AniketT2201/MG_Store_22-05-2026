import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { ProductImage } from '../../../types';
import { LazyImage } from '../ui/LazyImage';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const paginate = useCallback(
    (newDirection: number) => {
      const newIndex = selectedIndex + newDirection;
      if (newIndex >= 0 && newIndex < images.length) {
        setDirection(newDirection);
        setSelectedIndex(newIndex);
      }
    },
    [selectedIndex, images.length]
  );

  const goToImage = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  // Arrow-key navigation while the fullscreen lightbox is open.
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, paginate]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-secondary rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

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
            {/* Click-to-zoom on the main image. On touch devices this also
                supports pinch-zoom via the library's built-in gesture handling. */}
            <LazyImage
              src={currentImage?.Url || ''}
              alt={`${productTitle} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg transition-all z-10"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

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
                fill
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // className="fixed inset-0 z-[9999999999999999999999] bg-foreground/95 flex flex-col"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              background: "rgba(0,0,0,.6)"
            }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-background/80 text-sm">
                {selectedIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full hover:bg-background/10 text-background transition-colors"
                aria-label="Close fullscreen view"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div 
              style={{
                position: "absolute",
                top: 70,        // below the top toolbar
                bottom: 90,     // above thumbnail strip
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              {images.length > 1 && (
                <button
                  onClick={() => paginate(-1)}
                  disabled={selectedIndex === 0}
                  className="absolute left-4 p-3 rounded-full bg-background/10 hover:bg-background/20 text-background disabled:opacity-30 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={currentImage?.Url}
                alt={`${productTitle} - Image ${selectedIndex + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
              />

              {images.length > 1 && (
                <button
                  onClick={() => paginate(1)}
                  disabled={selectedIndex === images.length - 1}
                  className="absolute right-4 p-3 rounded-full bg-background/10 hover:bg-background/20 text-background disabled:opacity-30 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-2 pb-6 pt-2 overflow-x-auto px-6">
                {images.map((image, index) => (
                  <button
                    key={image.ID}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedIndex ? 'border-background' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img
                      src={image.ThumbnailUrl || image.Url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
