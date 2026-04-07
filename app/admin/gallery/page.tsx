'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Edit,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Package,
} from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  publicId: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://hanuman-bhatta-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

  // Fetch gallery items
  const fetchGalleryItems = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.data);
      } else {
        setError('Failed to fetch gallery items');
      }
    } catch (err) {
      setError('Network error while fetching gallery');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
    if (!fileType) {
      setError('Only image and video files are allowed');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch(`${apiBaseUrl}/admin/gallery`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: fileType,
            fileData,
            title: file.name,
          }),
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (response.ok) {
          setSuccess('Media uploaded successfully!');
          await fetchGalleryItems();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to upload media');
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle update metadata
  const handleUpdateItem = async (id: string, title: string, description: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setSuccess('Item updated successfully!');
        await fetchGalleryItems();
        setShowEditModal(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update item');
      }
    } catch (err) {
      setError('Network error while updating');
    }
  };

  // Handle delete
  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSuccess('Item deleted successfully!');
        await fetchGalleryItems();
        setShowDeleteModal(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Network error while deleting');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
      </div>
    );
  }

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
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Upload and manage images/videos for the public gallery</p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-5 h-5 text-red-600" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
            >
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Media</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              id="fileUpload"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Images or videos (max 10MB)
                </p>
              </div>
            </label>

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
            >
              {/* Media Preview */}
              <div className="aspect-square relative bg-gray-100">
                {item.type === 'image' ? (
                  <Image
                    src={item.mediaUrl}
                    alt={item.title || 'Gallery image'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}

                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  {item.type}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {item.title || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No media uploaded yet</h3>
            <p className="text-gray-600">Upload your first image or video to get started</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedItem && (
          <EditModal
            item={selectedItem}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdateItem}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedItem && (
          <DeleteModal
            item={selectedItem}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit Modal Component
function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: GalleryItem;
  onClose: () => void;
  onSave: (id: string, title: string, description: string) => void;
}) {
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Media</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Enter description"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(item._id, title, description)}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Delete Modal Component
function DeleteModal({
  item,
  onClose,
  onConfirm,
}: {
  item: GalleryItem;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Delete Media</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete &quot;{item.title || 'this item'}&quot;? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item._id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
