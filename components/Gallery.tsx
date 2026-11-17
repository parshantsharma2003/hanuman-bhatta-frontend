'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, AlertCircle } from 'lucide-react';
import GalleryModal from './GalleryModal';
import GalleryVideoModal from './GalleryVideoModal';
import { useQuery } from '@tanstack/react-query';
import { fetchGallery, queryKeys } from '@/lib/api/queries';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  type: 'image' | 'video';
}

const defaultGalleryItems: GalleryImage[] = [
  {
    id: 'gal-1',
    src: '/images/brick-texture.jpg',
    alt: 'Stacked kiln-fired red clay bricks ready for dispatch in Kahlpa',
    caption: 'Grade-1 Fired Brick Stacks Ready for Dispatch',
    category: 'Yard Inventory',
    type: 'image',
  },
  {
    id: 'gal-2',
    src: '/og-image.jpg',
    alt: 'Traditional brick kiln firing facility in Gohana',
    caption: 'Continuous Bull’s Trench Kiln Firing Chamber',
    category: 'Production',
    type: 'image',
  },
  {
    id: 'gal-3',
    src: '/og-image.png',
    alt: 'Tractor trolley brick loading for Haryana construction sites',
    caption: '3,000 Brick Tractor-Trolley Loading for Site Delivery',
    category: 'Transit Logistics',
    type: 'image',
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryImage | null>(null);

  const {
    data: galleryItems = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.gallery,
    queryFn: fetchGallery,
    refetchInterval: 30000,
  });

  const serverGallery: GalleryImage[] = galleryItems.map((item) => ({
    id: item._id,
    src: item.mediaUrl,
    alt: item.title || 'Hanuman Bhatta Company facility',
    caption: item.title || 'Kiln Brick Manufacturing',
    category: item.type === 'image' ? 'Production' : 'Video',
    type: item.type,
  }));

  const displayImages = serverGallery.length > 0 ? serverGallery : defaultGalleryItems;

  const openModal = (item: GalleryImage) => {
    if (item.type === 'video') {
      setSelectedVideo(item);
    } else {
      setSelectedImage(item);
    }
  };

  return (
    <>
      <section
        id="gallery"
        className="py-20 md:py-28 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-20"
        aria-label="Kiln Yard and Manufacturing Gallery"
      >
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
                Visual Documentation &amp; Yard Operations
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
                Kiln Operations &amp; Facility
              </h2>
              <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
                Direct views of raw clay preparation, drying lines, kiln firing, and tractor-trolley dispatch at our Kahlpa manufacturing premises.
              </p>
            </div>
            <div className="text-xs font-mono text-[#736F67] border-l-2 border-[#B8402C] pl-3 py-1">
              Location: Kahlpa-Bhanderi Road, Gohana
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-[4/3] bg-[#E2DDD5] animate-pulse rounded" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center bg-white border border-[#E2DDD5] rounded">
              <AlertCircle className="w-8 h-8 text-[#B8402C] mx-auto mb-2" />
              <p className="text-sm text-[#57544E] mb-4">Unable to retrieve latest photos.</p>
              <button
                onClick={() => refetch()}
                className="text-xs font-semibold uppercase tracking-wider text-[#B8402C] hover:underline"
              >
                Reload Gallery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => openModal(image)}
                  className="group relative aspect-[4/3] bg-[#242321] rounded overflow-hidden cursor-pointer border border-[#E2DDD5] transition-colors duration-200 hover:border-[#B8402C]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Subtle architectural hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta mb-1 block">
                      {image.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-display text-white leading-snug">
                      {image.caption}
                    </h3>
                  </div>

                  <div className="absolute top-4 right-4 w-8 h-8 rounded border border-white/20 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yard Visit Note */}
          <div className="mt-12 pt-6 border-t border-[#E2DDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57544E]">
            <span>
              Contractors and builders are welcome to inspect raw clay and brick stock in person at our Kahlpa yard.
            </span>
            <a
              href="#contact"
              className="font-mono text-[#B8402C] font-semibold hover:underline"
            >
              Get Kiln Directions &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedImage && (
        <GalleryModal
          image={selectedImage}
          allImages={displayImages}
          onClose={() => setSelectedImage(null)}
          onNavigate={(img) => setSelectedImage(img)}
        />
      )}

      {selectedVideo && (
        <GalleryVideoModal
          videoUrl={selectedVideo.src}
          title={selectedVideo.caption}
          caption={selectedVideo.caption}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
