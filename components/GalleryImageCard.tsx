'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, ZoomIn, Video as VideoIcon, Play } from 'lucide-react';

interface GalleryImageCardProps {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  type: 'image' | 'video';
  isActive: boolean;
  isDesktop: boolean;
  imageError: boolean;
  onImageError: () => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  thumbnailUrl?: string; // For videos
}

const cardVariants = {
  active: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  inactive: {
    scale: 0.85,
    opacity: 0.6,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  desktop: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const captionVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 }
  }
};

export default function GalleryImageCard({
  id,
  src,
  alt,
  caption,
  category,
  type,
  isActive,
  isDesktop,
  imageError,
  onImageError,
  onClick,
  onKeyDown,
  thumbnailUrl
}: GalleryImageCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="inactive"
      animate={isDesktop ? 'desktop' : isActive ? 'active' : 'inactive'}
      whileHover={isDesktop ? { scale: 1.05 } : undefined}
      className={`
        relative flex-shrink-0 group overflow-hidden rounded-2xl
        ${isDesktop ? 'w-full h-full' : 'w-[85%] sm:w-[90%] h-60'}
        aspect-square
        bg-charcoal-100 shadow-brick
        transition-shadow duration-300 cursor-pointer
        ${isDesktop && 'hover:shadow-brick-lg'}
        ${isActive && !isDesktop && 'shadow-brick-lg ring-2 ring-terracotta/30'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2
      `}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${caption}`}
      aria-pressed={isActive && !isDesktop}
    >
      {/* Media Content with Loading State */}
      {!imageError ? (
        <>
          {type === 'image' ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={isDesktop ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : '90vw'}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={onImageError}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              priority={false}
            />
          ) : (
            // Video: Show thumbnail
            <Image
              src={thumbnailUrl || src}
              alt={alt}
              fill
              sizes={isDesktop ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : '90vw'}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={onImageError}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              priority={false}
            />
          )}

          {/* Play Button Overlay - Video Only */}
          {type === 'video' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center z-15"
              aria-hidden="true"
            >
              <div className="w-16 h-16 bg-terracotta/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-brick group-hover:bg-terracotta transition-colors duration-300">
                <Play className="w-7 h-7 text-white fill-white" />
              </div>
            </motion.div>
          )}

          {/* Video Badge */}
          {type === 'video' && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1 z-20">
              <VideoIcon className="w-3 h-3" />
              Video
            </div>
          )}

          {/* Gradient Overlay - Always visible on desktop, hover only on mobile */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent
              ${isDesktop ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              transition-opacity duration-300 flex flex-col justify-end p-4 z-10
            `}
          >
            {/* Zoom Icon - Only show on desktop for images */}
            {isDesktop && type === 'image' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </motion.div>
            )}

            {/* Play Icon - Only show on desktop for videos before hover */}
            {isDesktop && type === 'video' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 w-10 h-10 bg-terracotta/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play className="w-5 h-5 text-white fill-white" />
              </motion.div>
            )}

            {/* Caption - Animated entrance */}
            <motion.div
              variants={captionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <p className="text-white font-bold text-sm md:text-base mb-1 font-display line-clamp-2">
                {caption}
              </p>
              <span className="text-xs text-sandy-200 uppercase tracking-wide font-semibold">
                {category}
              </span>
            </motion.div>
          </div>

          {/* Active Indicator Ring - Mobile only */}
          {!isDesktop && isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 border-4 border-terracotta rounded-2xl pointer-events-none"
              aria-hidden="true"
            />
          )}
        </>
      ) : (
        /* Fallback UI */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sandy-200 to-sandy-300 p-4">
          <ImageIcon className="w-12 h-12 text-charcoal-400 mb-2" />
          <p className="text-xs text-charcoal-600 text-center font-medium">
            Media soon
          </p>
        </div>
      )}
    </motion.div>
  );
}
