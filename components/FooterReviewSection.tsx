'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import ReviewModal from './ReviewModal';
import { fetchRatingSummary, RatingSummary } from '@/lib/reviewApi';

export default function FooterReviewSection() {
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadRatings = async () => {
      setIsLoading(true);
      const data = await fetchRatingSummary();
      setRatingSummary(data);
      setIsLoading(false);
    };

    loadRatings();
  }, []);

  if (isLoading) {
    return (
      <div className="py-6 border-t-2 border-sandy-300">
        <div className="h-4 w-32 bg-sandy-300 rounded animate-pulse" />
      </div>
    );
  }

  if (!ratingSummary) {
    return null; // Don't show section if no data
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-6 border-t-2 border-sandy-300"
      >
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wide mb-2">
            Customer Reviews & Ratings
          </h3>
        </div>

        {/* Rating Display */}
        <div className="space-y-4">
          {/* Stars and Average Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <StarRating rating={ratingSummary.averageRating} size="sm" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-charcoal-900">
                {ratingSummary.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-charcoal-600">/5</span>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="text-xs text-charcoal-600">
            Based on <span className="font-semibold text-charcoal-900">{ratingSummary.totalApprovedReviews}+</span> local customer{' '}
            {ratingSummary.totalApprovedReviews === 1 ? 'review' : 'reviews'}
          </div>

          {/* Trust Statement */}
          <p className="text-xs text-charcoal-500 italic">
            Ratings from verified local contractors and builders
          </p>

          {/* Leave a Rating Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block text-xs font-semibold text-terracotta hover:text-terracotta-dark transition-colors mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded px-2 py-1"
          >
            Leave a Rating →
          </button>
        </div>
      </motion.div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh ratings after successful submission
          fetchRatingSummary().then(data => {
            if (data) setRatingSummary(data);
          });
        }}
      />
    </>
  );
}
