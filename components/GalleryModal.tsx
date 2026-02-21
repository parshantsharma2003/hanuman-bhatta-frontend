'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  type: 'image' | 'video';
}

interface GalleryModalProps {
  image: GalleryImage;
  allImages: GalleryImage[];
  onClose: () => void;
  onNavigate: (image: GalleryImage) => void;
}

export default function GalleryModal({ image, allImages, onClose, onNavigate }: GalleryModalProps) {
  const [imageError, setImageError] = React.useState(false);
  const currentIndex = allImages.findIndex((img) => img.id === image.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === allImages.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && !isLast) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Focus trap - keep focus within modal
    const modalElement = document.getElementById('gallery-modal');
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handleTabKey);
      };
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isFirst, isLast, onClose]);

  const handleNext = () => {
    if (!isLast) {
      setImageError(false);
      onNavigate(allImages[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setImageError(false);
      onNavigate(allImages[currentIndex - 1]);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      id="gallery-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-charcoal-900/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
        aria-label="Close gallery modal"
      >
        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Navigation - Previous */}
      <button
        onClick={handlePrevious}
        disabled={isFirst}
        className={`absolute left-4 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 ${
          isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
        }`}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-7 h-7 text-white" />
      </button>

      {/* Navigation - Next */}
      <button
        onClick={handleNext}
        disabled={isLast}
        className={`absolute right-4 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 ${
          isLast ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
        }`}
        aria-label="Next image"
      >
        <ChevronRight className="w-7 h-7 text-white" />
      </button>

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative max-w-7xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-charcoal-800 shadow-2xl">
          {!imageError ? (
            <div className="relative w-full h-full min-h-[300px] md:min-h-[500px]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            /* Fallback for missing images */
            <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-charcoal-700 to-charcoal-800 p-8">
              <ImageIcon className="w-24 h-24 text-charcoal-500 mb-4" />
              <p className="text-xl text-white font-semibold mb-2">Image Not Available</p>
              <p className="text-sm text-charcoal-300 text-center max-w-md">
                This image will be added soon. Please check back later.
              </p>
            </div>
          )}
        </div>

        {/* Caption and Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 
                id="modal-title"
                className="text-xl md:text-2xl font-bold text-white mb-2 font-display"
              >
                {image.caption}
              </h3>
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-terracotta rounded-full text-xs font-bold text-white uppercase tracking-wide">
                  {image.category}
                </span>
                <span className="text-sm text-sandy-200">
                  Image {currentIndex + 1} of {allImages.length}
                </span>
              </div>
            </div>

            {/* Keyboard Hints */}
            <div className="hidden md:flex items-center gap-2 text-xs text-sandy-300">
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">←</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">→</kbd>
              <span>Navigate</span>
              <span className="mx-2">•</span>
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Thumbnail Strip - Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4 hidden lg:block">
        <div className="flex gap-2 justify-center overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => {
                setImageError(false);
                onNavigate(img);
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                img.id === image.id
                  ? 'border-terracotta shadow-lg scale-110'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View ${img.caption}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
