'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import { submitReview, ReviewSubmission } from '@/lib/reviewApi';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Simple Toast component
function SimpleToast({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-50 max-w-md ${bgColor} border-2 rounded-lg p-4 flex items-start gap-3 shadow-lg`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
    </motion.div>
  );
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setToast({ type: 'error', message: 'Please select a rating' });
      return;
    }

    if (!comment.trim()) {
      setToast({ type: 'error', message: 'Please write a short review' });
      return;
    }

    setIsLoading(true);

    try {
      const reviewData: ReviewSubmission = {
        rating,
        comment: comment.trim(),
        name: name.trim() || undefined,
        location: location.trim() || undefined,
      };

      const result = await submitReview(reviewData);

      if (result.success) {
        setToast({ 
          type: 'success', 
          message: 'Thank you! Your review will appear after admin verification.' 
        });
        // Reset form
        setRating(0);
        setComment('');
        setName('');
        setLocation('');

        // Close modal after success
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else {
        setToast({ type: 'error', message: result.message });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-sandy-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-terracotta/10 to-orange-500/10 border-b-2 border-sandy-300 px-8 py-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display text-charcoal-900">
                      Write a Quick Review
                    </h3>
                    <p className="text-sm text-charcoal-600 mt-1">
                      Share honest feedback in under a minute
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="p-2 hover:bg-sandy-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-50"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6 text-charcoal" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-900 mb-3">
                      How was your experience?
                    </label>
                    <div className="mb-3">
                      <StarRating
                        rating={rating}
                        size="lg"
                        interactive
                        onRatingChange={setRating}
                      />
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-terracotta font-medium animate-pulse">
                        {rating === 1 && '😔 Needs improvement - Help us do better!'}
                        {rating === 2 && '😕 Okay - There\'s room for improvement'}
                        {rating === 3 && '😊 Average - Good to know! What can we improve?'}
                        {rating === 4 && '😄 Good - We\'re glad you\'re satisfied!'}
                        {rating === 5 && '🎉 Excellent - Thank you for your support!'}
                      </p>
                    )}
                    {rating === 0 && (
                      <p className="text-xs text-charcoal-400 italic">
                        Select a rating to continue
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="comment" className="block text-sm font-semibold text-charcoal-900">
                        Your Review
                      </label>
                      <span className={`text-xs font-medium ${comment.length > 280 ? 'text-orange-600' : 'text-charcoal-500'}`}>
                        {comment.length}/300
                      </span>
                    </div>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={300}
                      rows={3}
                      placeholder="Tell us briefly about your experience..."
                      className="w-full px-4 py-3 border-2 border-sandy-300 rounded-lg focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors resize-none text-charcoal-900 placeholder:text-charcoal-500"
                      required
                      aria-label="Your review"
                    />
                    <p className="text-xs text-charcoal-600 mt-1.5">
                      {comment.length === 0 ? 'Share your honest feedback here' : 'Great feedback!'}
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal-900 mb-2">
                      Name (Optional)
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border-2 border-sandy-300 rounded-lg focus:outline-none focus:border-terracotta transition-colors text-charcoal-900 placeholder:text-charcoal-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-charcoal-900 mb-2">
                      Your Area/Village (Optional)
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Ballia, Motihari"
                      className="w-full px-4 py-3 border-2 border-sandy-300 rounded-lg focus:outline-none focus:border-terracotta transition-colors text-charcoal-900 placeholder:text-charcoal-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || rating === 0 || !comment.trim()}
                    className="w-full bg-gradient-to-r from-terracotta to-terracotta-dark hover:shadow-lg text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>

                  {/* Info text */}
                  <p className="text-xs text-charcoal-500 text-center">
                    Your review will be visible after admin approval (usually within 24 hours)
                  </p>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <SimpleToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
