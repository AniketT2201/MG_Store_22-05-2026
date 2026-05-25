import * as React from "react";
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = !filled && index < rating;
        
        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : halfFilled
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
