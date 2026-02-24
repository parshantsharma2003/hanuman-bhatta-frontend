'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Clock3 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  pricePer1000: number;
  pricePerTrolley: number;
  imageUrl?: string;
  imagePublicId?: string;
  usageTags: string[];
  qualityGrade: 'First' | 'Second' | 'Rora';
  isActive: boolean;
  availability: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityLogItem {
  _id: string;
  actionType: 'price_change' | 'inventory_update' | 'product_archived' | 'product_restored';
  message: string;
  actorName: string;
  actorRole: 'super_admin' | 'admin' | 'system';
  metadata?: {
    productName?: string;
  };
  createdAt: string;
}

interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  type: string;
  pricePer1000: string;
  pricePerTrolley: string;
  usageTags: string[];
  qualityGrade: 'First' | 'Second' | 'Rora';
  isActive: boolean;
  image?: string;
}

type ProductFilter = 'all' | 'active' | 'inactive' | 'archived';

const USAGE_TAG_OPTIONS = [
  'House Construction',
  'Boundary Wall',
  'Filling',
  'Foundation',
  'Flooring',
  'Partition Walls',
  'Retaining Walls',
  'Garden Walls',
];

const QUALITY_GRADES = ['First', 'Second', 'Rora'] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    type: '',
    pricePer1000: '',
    pricePerTrolley: '',
    usageTags: [],
    qualityGrade: 'First',
    isActive: true,
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products?includeArchived=true`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (productFilter === 'archived') return Boolean(product.isArchived);
    if (productFilter === 'active') return !product.isArchived && product.isActive;
    if (productFilter === 'inactive') return !product.isArchived && !product.isActive;
    return true;
  });

  const filterCounts = {
    all: products.length,
    active: products.filter((product) => !product.isArchived && product.isActive).length,
    inactive: products.filter((product) => !product.isArchived && !product.isActive).length,
    archived: products.filter((product) => Boolean(product.isArchived)).length,
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity-logs?limit=25`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      const data = await response.json();
      setActivityLogs(data.data || []);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug?.trim() || undefined,
        description: formData.description.trim() || undefined,
        type: formData.type.trim(),
        pricePer1000: parseFloat(formData.pricePer1000),
        pricePerTrolley: parseFloat(formData.pricePerTrolley),
        usageTags: formData.usageTags,
        qualityGrade: formData.qualityGrade,
        isActive: formData.isActive,
        image: formData.image,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      await fetchProducts();
      await fetchActivityLogs();
      closeModal();
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleArchive = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
      await fetchActivityLogs();
      setDeleteConfirmId(null);
      alert('Product archived successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to archive product');
      console.error('Error archiving product:', err);
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}/restore`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore product');
      }

      await fetchProducts();
      await fetchActivityLogs();
      alert('Product restored successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restore product');
      console.error('Error restoring product:', err);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle product status');
      }

      await fetchProducts();
      await fetchActivityLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle product status');
      console.error('Error toggling product status:', err);
    }
  };

  const formatActivityMessage = (log: ActivityLogItem) => {
    const actionPrefix =
      log.actionType === 'price_change'
        ? 'Price updated'
        : log.actionType === 'inventory_update'
        ? 'Inventory updated'
        : log.actionType === 'product_archived'
        ? 'Product archived'
        : 'Product restored';

    const actorLabel = log.actorRole === 'system' ? 'System' : 'Admin';
    const time = new Date(log.createdAt).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `${actionPrefix} by ${actorLabel} at ${time}`;
  };

  // Open modal for new product
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: '',
      pricePer1000: '',
      pricePerTrolley: '',
      usageTags: [],
      qualityGrade: 'First',
      isActive: true,
      image: undefined,
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      type: product.type,
      pricePer1000: product.pricePer1000.toString(),
      pricePerTrolley: product.pricePerTrolley.toString(),
      usageTags: product.usageTags,
      qualityGrade: product.qualityGrade,
      isActive: product.isActive,
      image: undefined,
    });
    setImagePreview(product.imageUrl || null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: '',
      pricePer1000: '',
      pricePerTrolley: '',
      usageTags: [],
      qualityGrade: 'First',
      isActive: true,
      image: undefined,
    });
    setImagePreview(null);
  };

  // Toggle usage tag
  const toggleUsageTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      usageTags: prev.usageTags.includes(tag)
        ? prev.usageTags.filter((t) => t !== tag)
        : [...prev.usageTags, tag],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ImageIcon size={20} />
            <span>Gallery</span>
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/admin/activity"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Clock3 size={20} />
            <span>Activity Log</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage brick products and inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/activity"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              View Activity
            </Link>
            <button
              onClick={openCreateModal}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
            >
              + Add New Product
            </button>
          </div>
        </div>

        {/* Quick Activity */}
        {activityLogs.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activityLogs.slice(0, 4).map((log) => (
                <p key={log._id} className="text-sm text-gray-700">
                  {formatActivityMessage(log)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 mb-6 inline-flex flex-wrap gap-2">
          {([
            ['all', 'All'],
            ['active', 'Active'],
            ['inactive', 'Inactive'],
            ['archived', 'Archived'],
          ] as [ProductFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setProductFilter(value)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                productFilter === value
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} ({filterCounts[value]})
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-200">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isArchived
                            ? 'bg-red-500 text-white'
                            : product.isActive
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {product.isArchived ? 'Archived' : product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {/* Quality Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                        {product.qualityGrade}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.type}</p>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Per 1000</p>
                        <p className="text-lg font-bold text-orange-600">
                          ₹{product.pricePer1000.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Per Trolley</p>
                        <p className="text-lg font-bold text-orange-600">
                          ₹{product.pricePerTrolley.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Usage Tags */}
                    {product.usageTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.usageTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.usageTags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{product.usageTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          product.isArchived
                            ? handleRestore(product._id)
                            : handleToggleActive(product._id)
                        }
                        className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${
                          product.isArchived
                            ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                            : product.isActive
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {product.isArchived
                          ? 'Restore'
                          : product.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        disabled={Boolean(product.isArchived)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product._id)}
                        disabled={Boolean(product.isArchived)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products in this Filter</h3>
            <p className="text-gray-500 mb-6">
              {productFilter === 'all'
                ? 'Get started by adding your first product'
                : 'Try switching filters or restoring archived products.'}
            </p>
            {productFilter === 'all' && (
              <button
                onClick={openCreateModal}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex items-start gap-4">
                      {imagePreview && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Max 5MB. Recommended: 800x800px
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name and Type in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Red Clay Brick"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Red Brick, Fly Ash Brick"
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Slug (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Auto-generated if left empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for SEO-friendly URLs
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="Product description (max 1000 characters)"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Pricing and Quality Grade in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Per 1000 *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.pricePer1000}
                          onChange={(e) =>
                            setFormData({ ...formData, pricePer1000: e.target.value })
                          }
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Per Trolley *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.pricePerTrolley}
                          onChange={(e) =>
                            setFormData({ ...formData, pricePerTrolley: e.target.value })
                          }
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quality Grade *
                      </label>
                      <div className="flex gap-2">
                        {QUALITY_GRADES.map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => setFormData({ ...formData, qualityGrade: grade })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              formData.qualityGrade === grade
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Usage Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Usage Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {USAGE_TAG_OPTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleUsageTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            formData.usageTags.includes(tag)
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                      Active (visible to customers)
                    </label>
                  </div>
                </form>
              </div>

              {/* Fixed Footer with Buttons */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="productForm"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {submitting
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Product?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to archive this product? You can restore it later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleArchive(deleteConfirmId)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
