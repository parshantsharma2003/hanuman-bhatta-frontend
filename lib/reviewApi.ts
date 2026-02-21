import { z } from 'zod';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

// Validation Schema
export const reviewSubmissionSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(1, 'Review text is required').max(300, 'Comment cannot exceed 300 characters'),
  name: z.string().max(80, 'Name cannot exceed 80 characters').optional().nullable(),
  location: z.string().optional().nullable(),
});

export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

export interface RatingSummary {
  totalApprovedReviews: number;
  averageRating: number;
}

export interface PublicReview {
  _id: string;
  rating: number;
  comment: string;
  name?: string;
  location?: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

/**
 * Fetch rating summary (public endpoint)
 * Shows average rating and total number of reviews
 */
export async function fetchRatingSummary(): Promise<RatingSummary | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/reviews/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rating summary: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('[ReviewAPI] Error fetching rating summary:', error);
    return null;
  }
}

/**
 * Submit a review (public endpoint)
 * No authentication required
 */
export async function submitReview(data: ReviewSubmission): Promise<{ success: boolean; message: string }> {
  try {
    // Validate data
    const validatedData = reviewSubmissionSchema.parse(data);

    const response = await fetch(`${apiBaseUrl}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit review');
    }

    return {
      success: true,
      message: result.message || 'Review submitted successfully!',
    };
  } catch (error) {
    console.error('[ReviewAPI] Error submitting review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
    };
  }
}

export async function fetchApprovedReviews(): Promise<PublicReview[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/reviews`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error('[ReviewAPI] Error fetching approved reviews:', error);
    return [];
  }
}

export function subscribeReviewUpdates(onMessage: () => void): (() => void) | null {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return null;
  }

  const eventSource = new EventSource(`${apiBaseUrl}/reviews/stream`);

  const handleUpdate = () => onMessage();

  eventSource.addEventListener('connected', handleUpdate);
  eventSource.addEventListener('review_updated', handleUpdate);
  eventSource.addEventListener('review_deleted', handleUpdate);

  eventSource.onerror = () => {
    eventSource.close();
  };

  return () => {
    eventSource.removeEventListener('connected', handleUpdate);
    eventSource.removeEventListener('review_updated', handleUpdate);
    eventSource.removeEventListener('review_deleted', handleUpdate);
    eventSource.close();
  };
}

export async function fetchAllAdminReviews(): Promise<PublicReview[]> {
  const response = await fetch(`${apiBaseUrl}/admin/reviews`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin reviews');
  }

  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

export async function approveAdminReview(reviewId: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/admin/reviews/${reviewId}/approve`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to approve review');
  }
}

export async function disapproveAdminReview(reviewId: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/admin/reviews/${reviewId}/disapprove`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to move review to pending');
  }
}

export async function deleteAdminReview(reviewId: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete review');
  }
}
