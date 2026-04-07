'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  Eye,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  Package,
  Warehouse,
  MessageSquare,
  Image as ImageIcon,
  Star,
  Clock3,
  MapPin,
  Flame,
  Loader,
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar, { AdminNavItem } from '@/components/AdminSidebar';
import AdminTopBar from '@/components/AdminTopBar';

// Types
interface Order {
  _id: string;
  name?: string;
  customerName?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  brickType?: 'Avval' | 'Second' | 'Rora';
  product?: string;
  deliveryArea?: string;
  address?: string;
  quantity: number;
  quantityBricks?: number;
  quantityTrolleys?: number;
  leadPriority?: 'hot' | 'warm' | 'normal';
  notes?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  usagePurpose?: string;
  urgency?: string;
  distanceRange?: string;
  landmark?: string;
}

interface SummaryStats {
  total: number;
  hot: number;
  today: number;
  pending: number;
}

// Skeleton Loader
function OrderTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

// Toast Notification
function Toast({ message, type, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold text-white shadow-lg ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`}
    >
      {message}
    </motion.div>
  );
}

// Order Detail Panel
function OrderDetailPanel({ order, onClose, onSave, onDelete, apiBaseUrl }: any) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    status: order?.status || 'pending',
    notes: order?.notes || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(order._id, formData);
      setEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(order._id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallClick = () => {
    const phoneNumber = order.phoneNumber || order.phone;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = order.phoneNumber || order.phone;
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(
        `Hi ${order.name || 'there'}! 👋\n\nWe received your order for ${order.quantityBricks || order.quantity} bricks (${order.brickType || order.product}).\n\nWe'll be in touch soon with an update!\n\n🧱 Eent Bhatta`
      );
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-end z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full md:max-w-2xl h-screen md:h-auto md:rounded-xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order._id?.slice(-6).toUpperCase()}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span> Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                <p className="text-gray-900 font-semibold mt-1">{order.name || order.customerName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-gray-900 font-semibold mt-1 break-all">{order.email || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</p>
                <p className="text-gray-900 font-semibold mt-1">{order.phoneNumber || order.phone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Area</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-orange-600" />
                  <p className="text-gray-900 font-semibold">{order.deliveryArea || order.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📦</span> Order Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Brick Type</p>
                <p className="text-lg font-bold text-orange-900 mt-2">{order.brickType || order.product || 'N/A'}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Quantity</p>
                <p className="text-lg font-bold text-blue-900 mt-2">
                  {order.quantityBricks || order.quantity || 0} bricks
                </p>
                {order.quantityTrolleys && (
                  <p className="text-sm text-blue-700 mt-1">(≈ {Number(order.quantityTrolleys).toFixed(1)} trolleys)</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Usage Purpose</p>
                <p className="text-gray-900 font-semibold mt-1 capitalize">{order.usagePurpose || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Distance Range</p>
                <p className="text-gray-900 font-semibold mt-1">{order.distanceRange || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Urgency</p>
                <p className="text-gray-900 font-semibold mt-1 capitalize">{order.urgency || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Required Delivery Date</p>
                <p className="text-gray-900 font-semibold mt-1">TBD</p>
              </div>
            </div>
          </section>

          {/* Lead Priority */}
          <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame size={24} className={order.leadPriority === 'hot' ? 'text-red-600' : order.leadPriority === 'warm' ? 'text-yellow-600' : 'text-gray-600'} />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead Priority</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{order.leadPriority || 'normal'}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-white ${
                order.leadPriority === 'hot' ? 'bg-red-600' : order.leadPriority === 'warm' ? 'bg-yellow-600' : 'bg-gray-600'
              }`}>
                {order.leadPriority === 'hot' ? '🔥 HOT' : order.leadPriority === 'warm' ? '⚠️ WARM' : '○ NORMAL'}
              </div>
            </div>
          </section>

          {/* Status & Notes */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Admin Actions
            </h3>
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✓ Confirmed</option>
                    <option value="in_progress">→ In Progress</option>
                    <option value="delivered">✓✓ Delivered</option>
                    <option value="cancelled">✗ Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Internal Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Add internal notes about this order..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    {order.status === 'pending' && <Clock size={20} className="text-yellow-600" />}
                    {order.status === 'confirmed' && <CheckCircle size={20} className="text-blue-600" />}
                    {order.status === 'in_progress' && <TrendingUp size={20} className="text-indigo-600" />}
                    {order.status === 'delivered' && <CheckCircle size={20} className="text-green-600" />}
                    {order.status === 'cancelled' && <AlertCircle size={20} className="text-red-600" />}
                    <p className="text-lg font-bold text-gray-900 capitalize">{order.status?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>
                  <p className="text-gray-900 mt-2 text-sm">{order.notes || 'No notes added yet'}</p>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} /> Update Status & Notes
                </button>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📞</span> Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleCallClick}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
              >
                <Phone size={18} /> Call Customer
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                <MessageCircle size={18} /> WhatsApp
              </button>
            </div>
          </section>

          {/* Delete Action */}
          <section className="border-t border-gray-200 pt-6">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Delete Order
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                <p className="text-red-900 font-semibold">Delete this order permanently?</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-2 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Orders Page
export default function OrdersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SummaryStats>({ total: 0, hot: 0, today: 0, pending: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'hot' | 'warm' | 'normal'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBrickType, setFilterBrickType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'quantity' | 'priority'>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detail Panel
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<any>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://hanuman-bhatta-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true);
        fetchOrders();
      } else {
        window.location.href = '/admin';
      }
    } catch (error) {
      window.location.href = '/admin';
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const ordersList = (data.data || []).sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(ordersList);
        calculateStats(ordersList);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setToast({ message: 'Failed to load orders', type: 'error' });
    }
  };

  const calculateStats = (ordersList: Order[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = ordersList.length;
    const hot = ordersList.filter((o) => o.leadPriority === 'hot').length;
    const todayCount = ordersList.filter((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
    const pending = ordersList.filter((o) => o.status === 'pending').length;

    setStats({ total, hot, today: todayCount, pending });
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        (order.name || order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.phoneNumber || order.phone || '').includes(searchQuery) ||
        (order.email || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = filterPriority === 'all' || order.leadPriority === filterPriority;
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesBrickType = filterBrickType === 'all' || order.brickType === filterBrickType;

      return matchesSearch && matchesPriority && matchesStatus && matchesBrickType;
    });

    // Sort
    if (sortBy === 'quantity') {
      filtered.sort((a, b) => (b.quantityBricks || 0) - (a.quantityBricks || 0));
    } else if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { hot: 0, warm: 1, normal: 2 };
      filtered.sort((a, b) => {
        const aPriority = (a.leadPriority || 'normal') as string;
        const bPriority = (b.leadPriority || 'normal') as string;
        return (priorityOrder[aPriority] || 2) - (priorityOrder[bPriority] || 2);
      });
    }

    return filtered;
  }, [orders, searchQuery, filterPriority, filterStatus, filterBrickType, sortBy]);

  const handleUpdateOrder = async (orderId: string, updateData: { status: string; notes: string }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders/${orderId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setToast({ message: 'Order updated successfully', type: 'success' });
        fetchOrders();
        setSelectedOrder(null);
      } else {
        const error = await response.json();
        setToast({ message: error.message || 'Failed to update order', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Failed to update order', type: 'error' });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setToast({ message: 'Order deleted successfully', type: 'success' });
        fetchOrders();
      } else {
        const error = await response.json();
        setToast({ message: error.message || 'Failed to delete order', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Failed to delete order', type: 'error' });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      window.location.href = '/admin';
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-orange-600 mx-auto mb-4" size={40} />
          <p className="text-gray-700 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <AdminSidebar
        roleLabel="Admin"
        navItems={navItems}
        activeKey="orders"
        onLogout={handleLogout}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 lg:ml-64">
        <AdminTopBar
          title="Orders & Enquiries"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        {/* Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Orders & Enquiries</h1>
                  <p className="text-gray-600 text-sm mt-1">Manage and track all customer orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setFilterPriority('all')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg hover:border-orange-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setFilterPriority('hot')}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 text-left hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-semibold uppercase tracking-wide">🔥 Hot Leads</p>
                <p className="text-4xl font-bold text-red-900 mt-2">{stats.hot}</p>
              </div>
              <Flame size={40} className="text-red-600" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              setSearchQuery('');
            }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Today</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.today}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setFilterStatus('pending')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg hover:border-yellow-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </motion.button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className="md:hidden min-h-[44px] px-3 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg text-gray-700"
              aria-expanded={showMobileFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">⚠️ Warm</option>
              <option value="normal">○ Normal</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✓ Confirmed</option>
              <option value="in_progress">→ In Progress</option>
              <option value="delivered">✓✓ Delivered</option>
              <option value="cancelled">✗ Cancelled</option>
            </select>

            <select
              value={filterBrickType}
              onChange={(e) => setFilterBrickType(e.target.value)}
              className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">All Brick Types</option>
              <option value="Avval">Avval</option>
              <option value="Second">Second</option>
              <option value="Rora">Rora</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="quantity">Highest Quantity</option>
              <option value="priority">Priority First</option>
            </select>
          </div>

          {showMobileFilters && (
            <div className="md:hidden grid grid-cols-1 gap-3 border-t border-gray-200 pt-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="hot">🔥 Hot</option>
                <option value="warm">⚠️ Warm</option>
                <option value="normal">○ Normal</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="confirmed">✓ Confirmed</option>
                <option value="in_progress">→ In Progress</option>
                <option value="delivered">✓✓ Delivered</option>
                <option value="cancelled">✗ Cancelled</option>
              </select>

              <select
                value={filterBrickType}
                onChange={(e) => setFilterBrickType(e.target.value)}
                className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Brick Types</option>
                <option value="Avval">Avval</option>
                <option value="Second">Second</option>
                <option value="Rora">Rora</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="quantity">Highest Quantity</option>
                <option value="priority">Priority First</option>
              </select>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchQuery || filterPriority !== 'all' || filterStatus !== 'all' || filterBrickType !== 'all') && (
            <div className="flex flex-wrap gap-2 text-sm">
              {searchQuery && (
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Search: {searchQuery}</span>
                  <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </div>
              )}
              {filterPriority !== 'all' && (
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Priority: {filterPriority}</span>
                  <button onClick={() => setFilterPriority('all')} className="hover:bg-red-200 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </div>
              )}
              {filterStatus !== 'all' && (
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Status: {filterStatus}</span>
                  <button onClick={() => setFilterStatus('all')} className="hover:bg-yellow-200 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </div>
              )}
              {filterBrickType !== 'all' && (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Type: {filterBrickType}</span>
                  <button onClick={() => setFilterBrickType('all')} className="hover:bg-orange-200 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <OrderTableSkeleton />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 px-6">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-semibold text-lg mb-2">No orders found</p>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
            <div className="md:hidden p-4 space-y-3">
              {filteredOrders.map((order) => (
                <div key={order._id} className="rounded-lg border border-gray-200 p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900">{order.name || order.customerName || 'N/A'}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.leadPriority === 'hot'
                          ? 'bg-red-100 text-red-700'
                          : order.leadPriority === 'warm'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.leadPriority === 'hot' ? 'Hot' : order.leadPriority === 'warm' ? 'Warm' : 'Normal'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Brick Type</p>
                      <p className="font-medium text-gray-900">{order.brickType || order.product || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900">{order.quantityBricks || order.quantity || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'in_progress'
                            ? 'bg-indigo-100 text-indigo-700'
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold"
                  >
                    <Eye size={16} /> View Details
                  </button>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Brick Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Delivery</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-orange-50 transition-colors ${
                        order.leadPriority === 'hot' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                        #{order._id?.slice(-4).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{order.name || order.customerName || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.phoneNumber || order.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          {order.brickType || order.product || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-semibold">{order.quantityBricks || order.quantity || 0}</div>
                        <div className="text-xs text-gray-500">
                          {order.quantityTrolleys ? `${Number(order.quantityTrolleys).toFixed(1)} trolleys` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.deliveryArea || order.address || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            order.leadPriority === 'hot'
                              ? 'bg-red-100 text-red-700'
                              : order.leadPriority === 'warm'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.leadPriority === 'hot' ? '🔥' : order.leadPriority === 'warm' ? '⚠️' : '○'}{' '}
                          {order.leadPriority?.toUpperCase() || 'NORMAL'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'in_progress'
                              ? 'bg-indigo-100 text-indigo-700'
                              : order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}

          {/* Footer with count */}
          {filteredOrders.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm text-gray-600 font-semibold">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </div>
      </div>
          </div>

      {/* Order Detail Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSave={handleUpdateOrder}
            onDelete={handleDeleteOrder}
            apiBaseUrl={apiBaseUrl}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
