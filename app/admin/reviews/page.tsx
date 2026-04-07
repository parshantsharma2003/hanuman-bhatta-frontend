'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, MessageSquare, Trash2, XCircle, Clock3, LayoutDashboard, Package, Warehouse, Image as ImageIcon, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminSidebar, { AdminNavItem } from '@/components/AdminSidebar';
import AdminTopBar from '@/components/AdminTopBar';
import {
  approveAdminReview,
  deleteAdminReview,
  disapproveAdminReview,
  fetchAllAdminReviews,
  PublicReview,
  subscribeReviewUpdates,
} from '@/lib/reviewApi';

type ToastState = { type: 'success' | 'error'; message: string } | null;

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      const list = await fetchAllAdminReviews();
      setReviews(list);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load reviews' });
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    const unsubscribe = subscribeReviewUpdates(loadReviews);
    const pollId = window.setInterval(loadReviews, 30000);

    return () => {
      if (unsubscribe) unsubscribe();
      window.clearInterval(pollId);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const pendingCount = useMemo(() => reviews.filter((r) => r.status === 'pending').length, [reviews]);

  const handleApprove = async (reviewId: string) => {
    setBusyId(reviewId);
    try {
      await approveAdminReview(reviewId);
      setToast({ type: 'success', message: 'Review approved' });
      await loadReviews();
    } catch {
      setToast({ type: 'error', message: 'Failed to approve review' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDisapprove = async (reviewId: string) => {
    setBusyId(reviewId);
    try {
      await disapproveAdminReview(reviewId);
      setToast({ type: 'success', message: 'Review moved to pending' });
      await loadReviews();
    } catch {
      setToast({ type: 'error', message: 'Failed to update review' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Delete this review permanently?')) return;

    setBusyId(reviewId);
    try {
      await deleteAdminReview(reviewId);
      setToast({ type: 'success', message: 'Review deleted' });
      await loadReviews();
    } catch {
      setToast({ type: 'error', message: 'Failed to delete review' });
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://hanuman-bhatta-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');
    await fetch(`${apiBaseUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
    router.push('/admin');
  };

  const navItems: AdminNavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin?tab=dashboard' },
    { key: 'products', label: 'Products', icon: <Package size={20} />, href: '/admin/products' },
    { key: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} />, href: '/admin/gallery' },
    { key: 'activity', label: 'Activity Log', icon: <Clock3 size={20} />, href: '/admin/activity' },
    { key: 'inventory', label: 'Inventory', icon: <Warehouse size={20} />, href: '/admin?tab=inventory' },
    { key: 'enquiries', label: 'Enquiries', icon: <MessageSquare size={20} />, href: '/admin?tab=enquiries' },
    { key: 'orders', label: 'Orders', icon: <MessageSquare size={20} />, href: '/admin/orders' },
    { key: 'reviews', label: 'Reviews', icon: <Star size={20} />, href: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <AdminSidebar
        roleLabel="Admin"
        navItems={navItems}
        activeKey="reviews"
        onLogout={handleLogout}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 lg:ml-64">
        <AdminTopBar
          title="Review Moderation"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">All Reviews</h1>
            <span className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
              Pending: {pendingCount}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-600">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">No reviews found.</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className={`rounded-xl border p-4 bg-white ${
                    review.status === 'pending' ? 'border-orange-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <p className="text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {review.name || 'Anonymous'}{review.location ? ` • ${review.location}` : ''} • {new Date(review.createdAt).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleApprove(review._id)}
                      disabled={busyId === review._id || review.status === 'approved'}
                      className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium disabled:opacity-50"
                    >
                      {busyId === review._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Approve
                    </button>
                    <button
                      onClick={() => handleDisapprove(review._id)}
                      disabled={busyId === review._id || review.status === 'pending'}
                      className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium disabled:opacity-50"
                    >
                      <XCircle size={16} /> Disapprove
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={busyId === review._id}
                      className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
