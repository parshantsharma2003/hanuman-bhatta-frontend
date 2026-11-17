'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

export default function Hero() {
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <>
      {/* Main Hero Section: Two-Column Editorial Composition */}
      <section
        id="home"
        className="relative bg-[#242321] text-[#F5F0E8] overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24 border-b border-[#31302C] scroll-mt-20"
        aria-label="Hanuman Bhatta Company Introduction"
      >
        {/* Subtle architectural drafting grid texture */}
        <div className="absolute inset-0 brick-pattern opacity-10 pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Brand Statement & Primary CTAs (7 cols desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-5 sm:space-y-6"
            >
              {/* Eyebrow Registration */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-wider sm:tracking-widest uppercase text-[#B8402C] font-semibold flex-wrap">
                <span className="w-4 sm:w-5 h-px bg-[#B8402C] flex-shrink-0" aria-hidden="true" />
                <span>ESTD. 2010 · KILN FACILITY IN KAHLPA, GOHANA</span>
              </div>

              {/* Main Headline Hierarchy */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08] break-words">
                  Hanuman Bhatta <br />
                  <span className="text-[#B8402C]">Company.</span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-[#F5F0E8] font-display font-normal max-w-xl leading-snug">
                  Kiln-Fired Red Clay Bricks &amp; Direct Tractor-Trolley Supply.
                </p>
              </div>

              {/* Grounded, Concise Description */}
              <div className="space-y-2 text-sm sm:text-base text-[#BCB7AD] leading-relaxed max-w-xl font-sans font-normal">
                <p>
                  Manufactured from dense alluvial clay along the Kahlpa-Bhanderi belt and carefully kiln-fired for dependable strength and durable masonry.
                </p>
                <p>
                  Serving builders, contractors and homeowners across Gohana and surrounding areas.
                </p>
              </div>

              {/* Action Buttons Pair */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={handleOrderClick}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-6 py-3.5 rounded transition-colors duration-150 text-sm sm:text-base shadow-xs min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#242321]"
                  aria-label="Request a direct kiln quote or delivery schedule"
                >
                  <span>Request Kiln Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 border border-[#42403B] hover:border-[#B8402C] hover:text-white text-[#D8D4CC] font-medium px-6 py-3.5 rounded transition-colors duration-150 text-sm sm:text-base min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
                  aria-label="Estimate required bricks for your wall"
                >
                  Estimate Brick Quantity
                </a>
              </div>
            </motion.div>

            {/* Right Column: Authentic Kiln Facility Photography (5 cols desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="group relative bg-[#191817] border border-[#31302C] rounded-[3px] overflow-hidden shadow-2xl">
                
                {/* Large Editorial Photo Container */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[3/4] w-full overflow-hidden bg-[#171615]">
                  <Image
                    src="/images/hero-kiln.jpg"
                    alt="Active brick kiln chimney and tractor dispatch yard at Hanuman Bhatta Company in Kahlpa, Gohana"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px"
                    priority
                    className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Architectural Corner Crop Marks */}
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />

                  {/* Subtle Tonal Gradient & Authentic Facility Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-5 flex items-end justify-between pointer-events-none">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8402C] block font-semibold">
                        Kahlpa Facility • Firing Chamber
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                        Active Bull’s Trench Kiln Yard
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#242321]/90 text-[#F5F0E8] border border-[#42403B] rounded-[2px] whitespace-nowrap">
                      ESTD. 2010
                    </span>
                  </div>
                </div>

                {/* Sub-photo Caption Strip */}
                <div className="p-3 sm:p-3.5 bg-[#191817] border-t border-[#31302C] flex items-center justify-between text-[11px] text-[#A9A39A]">
                  <span className="font-mono">Tractor-Trolley Direct Dispatch</span>
                  <span className="text-[#BCB7AD]">Gohana &amp; Surrounding Belt</span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Separate Business Proof Strip Section Immediately Below Hero */}
      <section
        aria-label="Verified Manufacturing Standards and Capacity"
        className="bg-[#191817] text-[#F5F0E8] border-b border-[#31302C] py-6 sm:py-8"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#31302C]">
            
            {/* Specification 1: Trolley Load */}
            <div className="py-3 sm:py-0 sm:px-6 first:sm:pl-0 flex flex-col justify-center">
              <span className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                3,000 Bricks
              </span>
              <span className="text-xs font-mono text-[#A9A39A] uppercase tracking-wider mt-1">
                Standard Trolley Load
              </span>
            </div>

            {/* Specification 2: Compressive Strength */}
            <div className="py-3 sm:py-0 sm:px-6 flex flex-col justify-center">
              <span className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                10.5+ N/mm²
              </span>
              <span className="text-xs font-mono text-[#A9A39A] uppercase tracking-wider mt-1">
                Grade-1 Compressive Strength
              </span>
            </div>

            {/* Specification 3: Wholesale Pricing */}
            <div className="py-3 sm:py-0 sm:px-6 last:sm:pr-0 flex flex-col justify-center">
              <span className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                Direct Kiln
              </span>
              <span className="text-xs font-mono text-[#A9A39A] uppercase tracking-wider mt-1">
                Wholesale Yard Pricing
              </span>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
