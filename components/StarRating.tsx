'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 1-5
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleKeyDown = (e: React.KeyboardEvent, starIndex: number) => {
    if (!interactive || !onRatingChange) return;

    if (e.key === 'ArrowRight' && starIndex < 5) {
      e.preventDefault();
      onRatingChange(Math.min(starIndex + 1, 5));
    } else if (e.key === 'ArrowLeft' && starIndex > 1) {
      e.preventDefault();
      onRatingChange(Math.max(starIndex - 1, 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRatingChange(starIndex);
    }
  };

  const renderStars = () => {
    const displayRating = hoverRating ?? rating;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(displayRating);
      const isHalf = i === Math.ceil(displayRating) && displayRating % 1 !== 0;

      stars.push(
        <button
          key={i}
          onClick={() => {
            if (interactive && onRatingChange) {
              onRatingChange(i);
            }
          }}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(null)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={!interactive}
          className={`transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm' : 'cursor-default'
          }`}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          aria-current={interactive && hoverRating === null && rating === i ? 'true' : 'false'}
          type="button"
          tabIndex={interactive ? 0 : -1}
        >
          <div className="relative">
            {/* Background star (unfilled) */}
            <Star className={`${sizeClasses[size]} text-sandy-300`} strokeWidth={1.5} />

            {/* Filled star overlay */}
            <div
              className="absolute top-0 left-0 overflow-hidden transition-all"
              style={{
                width: isHalf ? '50%' : isFilled ? '100%' : '0%',
              }}
            >
              <Star className={`${sizeClasses[size]} text-terracotta fill-terracotta`} strokeWidth={1.5} />
            </div>
          </div>
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {renderStars()}
    </div>
  );
}
