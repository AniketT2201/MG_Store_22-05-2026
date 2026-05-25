import * as React from "react";
import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function LazyImage({ src, alt, className, fill, sizes }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={clsx('relative overflow-hidden', fill && 'absolute inset-0', className)}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      )}
      
      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={clsx(
          'w-full h-full object-cover',
          !isLoaded && 'invisible'
        )}
        loading="lazy"
      />
    </div>
  );
}
