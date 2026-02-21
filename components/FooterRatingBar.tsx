'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Star } from 'lucide-react';
import { fetchRatingSummary, subscribeReviewUpdates } from '@/lib/reviewApi';

export default function FooterRatingBar() {
  const pathname = usePathname();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      return;
    }

    const loadSummary = async () => {
      try {
        const summary = await fetchRatingSummary();
        setAverageRating(summary?.averageRating || 0);
        setTotalReviews(summary?.totalApprovedReviews || 0);
      } catch (error) {
        console.error('Failed to load rating summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();

    const unsubscribe = subscribeReviewUpdates(() => {
      loadSummary();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(averageRating);
      const isHalf = i === Math.ceil(averageRating) && averageRating % 1 !== 0;

      stars.push(
        <div key={i} className="relative inline-block">
          {/* Background star (unfilled) */}
          <Star className="w-4 h-4 text-sandy-400" strokeWidth={1.5} />

          {/* Filled star overlay */}
          <div
            className="absolute top-0 left-0 overflow-hidden transition-all duration-300"
            style={{
              width: isHalf ? '50%' : isFilled ? '100%' : '0%',
            }}
          >
            <Star className="w-4 h-4 text-terracotta fill-terracotta" strokeWidth={1.5} />
          </div>
        </div>
      );
    }
    return stars;
  };

  const ratingText = averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'No ratings yet';
  const ariaLabel = totalReviews > 0 
    ? `${averageRating.toFixed(1)} out of 5 stars based on ${totalReviews} verified customer review${totalReviews !== 1 ? 's' : ''}`
    : 'Rating system';

  return (
    <div className="border-b border-sandy-300 bg-charcoal-900/60 px-4 py-4">
      <div className="mx-auto max-w-5xl flex items-center gap-4">
        {/* Star Display */}
        <div 
          className="flex items-center gap-2"
          role="img"
          aria-label={ariaLabel}
        >
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
          <span className="text-xs font-semibold text-sandy-300 min-w-fit">
            {isLoading ? '...' : ratingText}
          </span>
        </div>

        {/* Badge Text */}
        <p className="text-xs text-sandy-400 italic font-light">
          {isLoading ? 'Loading...' : totalReviews > 0 ? 'Based on verified customer reviews' : 'Be the first to review'}
        </p>
      </div>
    </div>
  );
}
