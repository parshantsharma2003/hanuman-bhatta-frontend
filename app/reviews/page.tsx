'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { fetchApprovedReviews, PublicReview, subscribeReviewUpdates } from '@/lib/reviewApi';
import Footer from '@/components/Footer';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchApprovedReviews();
      setReviews(data);
      setIsLoading(false);
    };

    loadReviews();

    const unsubscribe = subscribeReviewUpdates(loadReviews);
    const pollId = window.setInterval(loadReviews, 30000);

    return () => {
      if (unsubscribe) unsubscribe();
      window.clearInterval(pollId);
    };
  }, []);

  return (
    <main className="bg-white min-h-screen pt-20 md:pt-24">
      <section className="container-custom max-w-4xl pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg text-charcoal-700 hover:text-terracotta hover:bg-sandy-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900">Customer Reviews</h1>
          <p className="text-charcoal-600 mt-3">Honest feedback from approved local customers.</p>
        </div>

        {isLoading ? (
          <p className="text-charcoal-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-sandy-300 bg-sandy-50 p-6 text-charcoal-700">
            No approved reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review._id} className="rounded-xl border border-sandy-300 bg-white p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <StarRating rating={review.rating} size="sm" />
                  <time className="text-xs text-charcoal-500">{new Date(review.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="text-charcoal-800 leading-relaxed">{review.comment}</p>
                {(review.name || review.location) && (
                  <p className="text-sm text-charcoal-600 mt-3">
                    {review.name || 'Anonymous'}{review.location ? ` • ${review.location}` : ''}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
