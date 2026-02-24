'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, ZoomIn, Video as VideoIcon, Pause, Play } from 'lucide-react';
import GalleryModal from './GalleryModal';
import GalleryImageCard from './GalleryImageCard';
import GalleryVideoModal from './GalleryVideoModal';

interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  publicId: string;
  createdAt: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  type: 'image' | 'video';
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryImage | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  
  // Mobile-first auto-scroll state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Refs for auto-scroll logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerInViewRef = useRef(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // Fetch gallery items from API
  const fetchGalleryItems = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/gallery`);
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchGalleryItems();

    // Real-time updates using polling every 30 seconds
    const pollInterval = setInterval(fetchGalleryItems, 30000);

    return () => clearInterval(pollInterval);
  }, [fetchGalleryItems]);

  // Convert backend data to gallery format
  const galleryImages: GalleryImage[] = galleryItems.map((item) => ({
    id: item._id,
    src: item.mediaUrl,
    alt: item.title || 'Gallery media',
    caption: item.title || 'Brick Manufacturing',
    category: item.type === 'image' ? 'Production' : 'Video',
    type: item.type,
  }));

  // Detect desktop breakpoint (1024px = lg breakpoint)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // IntersectionObserver to guard horizontal scroll - only scroll if visible
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        containerInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(scrollContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll logic for mobile gallery
  useEffect(() => {
    if (isDesktop || galleryImages.length === 0 || !isAutoScrolling || isPaused || isVideoPlaying) {
      return;
    }

    // Check if prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsAutoScrolling(false);
      return;
    }

    // Set auto-scroll interval (4 seconds for smooth animation)
    autoScrollIntervalRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isDesktop, galleryImages.length, isAutoScrolling, isPaused, isVideoPlaying]);

  // Scroll horizontally to active card on mobile (NEVER scroll page vertically)
  useEffect(() => {
    if (isDesktop || !scrollContainerRef.current || !containerInViewRef.current || galleryImages.length === 0) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const cards = scrollContainer.querySelectorAll('[role="button"]');
    const activeCard = cards[activeImageIndex] as HTMLElement;

    if (activeCard) {
      const cardLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;

      // Calculate position to center card in viewport
      const targetScroll = cardLeft - (containerWidth - cardWidth) / 2;

      // Use scrollTo with smooth behavior for HORIZONTAL ONLY scrolling
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [activeImageIndex, isDesktop, galleryImages.length]);

  // Handle user interaction - pause/resume logic
  const handleUserInteraction = () => {
    if (isDesktop || !isAutoScrolling) return;

    // Pause auto-scroll
    setIsPaused(true);

    // Clear existing timeout if any
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Resume after 8 seconds of inactivity
    scrollTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  // Handle manual pause/resume toggle
  const handleToggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
    setIsPaused(false);

    // Clear any pending resume timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const openVideoModal = (video: GalleryImage) => {
    setSelectedVideo(video);
    setIsVideoPlaying(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsVideoPlaying(false);
    document.body.style.overflow = 'unset';
    // Resume auto-scroll after video ends/closes
    setIsPaused(false);
  };

  const handleVideoEnd = () => {
    closeVideoModal();
    // After 2 seconds, resume auto-scroll if user didn't interact
    setTimeout(() => {
      if (!isPaused) {
        setIsPaused(false);
      }
    }, 2000);
  };

  const handleImageError = (imageId: string) => {
    setImageError((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <>
      <section 
        id="gallery" 
        className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-br from-sandy-50 via-sandy-100 to-sandy-200 overflow-hidden scroll-mt-20"
        aria-label="Brick Manufacturing Gallery"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 brick-pattern opacity-5"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-charcoal opacity-5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12 md:mb-16"
          >
            {/* Icon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-terracotta/10 border-2 border-terracotta/20 rounded-full"
            >
              <ImageIcon className="w-5 h-5 text-terracotta" />
              <span className="text-sm font-bold text-terracotta uppercase tracking-wide">
                Our Operations
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 font-display">
              Brick Manufacturing Gallery
            </h2>
            <p className="text-base md:text-lg text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Witness our traditional craftsmanship meets modern efficiency. Every brick tells a story of quality, 
              dedication, and decades of expertise in red clay brick manufacturing.
            </p>
            
            {/* Trust Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-charcoal-700">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="font-semibold">Real photos from our facility</span>
              <span className="text-charcoal-500">• Not stock images</span>
            </div>
          </motion.div>

          {/* Gallery Container */}
          {isLoading ? (
            /* Loading Skeletons */
            <div className="space-y-8">
              {/* Mobile skeleton */}
              <div className="lg:hidden flex gap-4 overflow-hidden pb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[85%] sm:w-[90%] h-60 bg-sandy-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
              {/* Desktop skeleton */}
              <div className="hidden lg:grid grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-sandy-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : galleryImages.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
                Gallery Coming Soon
              </h3>
              <p className="text-charcoal-600">
                We&apos;re adding photos and videos. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Mobile - Horizontal Auto-Scroll Gallery */}
              <div className="lg:hidden space-y-6">
                {/* Scroll Container */}
                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
                  onScroll={handleUserInteraction}
                  onTouchStart={handleUserInteraction}
                  role="region"
                  aria-label="Gallery images carousel"
                  aria-live="polite"
                  aria-atomic="false"
                >
                  {galleryImages.map((image, idx) => (
                    <GalleryImageCard
                      key={image.id}
                      {...image}
                      isActive={idx === activeImageIndex}
                      isDesktop={false}
                      imageError={imageError[image.id] || false}
                      onImageError={() => handleImageError(image.id)}
                      onClick={() => {
                        if (image.type === 'video') {
                          openVideoModal(image);
                        } else {
                          openImageModal(image);
                        }
                      }}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (image.type === 'video') {
                            openVideoModal(image);
                          } else {
                            openImageModal(image);
                          }
                        } else if (e.key === 'ArrowRight' && idx < galleryImages.length - 1) {
                          e.preventDefault();
                          setActiveImageIndex(idx + 1);
                          handleUserInteraction();
                        } else if (e.key === 'ArrowLeft' && idx > 0) {
                          e.preventDefault();
                          setActiveImageIndex(idx - 1);
                          handleUserInteraction();
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-between px-4">
                  <div className="flex gap-2" role="tablist" aria-label="Gallery image selection">
                    {galleryImages.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          handleUserInteraction();
                        }}
                        className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                          idx === activeImageIndex
                            ? 'w-3 h-3 bg-terracotta shadow-brick'
                            : 'w-2 h-2 bg-charcoal-300'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        role="tab"
                        aria-selected={idx === activeImageIndex}
                        aria-label={`View image ${idx + 1} of ${galleryImages.length}: ${galleryImages[idx].caption}`}
                        aria-current={idx === activeImageIndex ? 'step' : undefined}
                      />
                    ))}
                  </div>

                  {/* Auto-scroll Controls */}
                  <div className="flex items-center gap-3">
                    {/* Auto-scroll Status */}
                    {isAutoScrolling && !isPaused && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-terracotta rounded-full"
                        aria-hidden="true"
                      />
                    )}

                    {/* Pause/Play Button */}
                    <button
                      onClick={handleToggleAutoScroll}
                      className="p-2 rounded-full bg-sandy-200 hover:bg-sandy-300 text-charcoal transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                      aria-label={isAutoScrolling ? 'Pause gallery auto-scroll' : 'Resume gallery auto-scroll'}
                      aria-pressed={isAutoScrolling}
                      title={isAutoScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                    >
                      {isAutoScrolling ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Counter */}
                <div className="text-center text-sm text-charcoal-600 font-medium">
                  Image {activeImageIndex + 1} of {galleryImages.length}
                </div>
              </div>

              {/* Desktop - Grid Gallery */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="hidden lg:grid grid-cols-4 gap-6"
                role="region"
                aria-label="Gallery images grid"
              >
                {galleryImages.map((image) => (
                  <GalleryImageCard
                    key={image.id}
                    {...image}
                    isActive={true}
                    isDesktop={true}
                    imageError={imageError[image.id] || false}
                    onImageError={() => handleImageError(image.id)}
                    onClick={() => {
                      if (image.type === 'video') {
                        openVideoModal(image);
                      } else {
                        openImageModal(image);
                      }
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (image.type === 'video') {
                          openVideoModal(image);
                        } else {
                          openImageModal(image);
                        }
                      }
                    }}
                  />
                ))}
              </motion.div>
            </>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 md:mt-16 text-center"
          >
            <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-xl shadow-brick border-2 border-sandy-400">
              <div className="text-left">
                <h3 className="text-lg font-bold text-charcoal mb-1">Want to Visit Our Facility?</h3>
                <p className="text-sm text-charcoal-600">
                  Schedule a tour and see our brick-making process firsthand
                </p>
              </div>
              <a
                href="#contact"
                className="px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white font-bold rounded-lg transition-colors duration-200 whitespace-nowrap shadow-brick hover:shadow-brick-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {/* Image Lightbox */}
        {selectedImage && selectedImage.type === 'image' && (
          <GalleryModal
            image={selectedImage}
            allImages={galleryImages.filter((img) => img.type === 'image')}
            onClose={closeImageModal}
            onNavigate={setSelectedImage}
          />
        )}

        {/* Video Modal */}
        {selectedVideo && selectedVideo.type === 'video' && (
          <GalleryVideoModal
            videoUrl={selectedVideo.src}
            title={selectedVideo.caption}
            caption={selectedVideo.alt}
            onClose={closeVideoModal}
            onVideoEnd={handleVideoEnd}
          />
        )}
      </AnimatePresence>
    </>
  );
}
