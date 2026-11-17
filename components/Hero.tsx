'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Truck } from 'lucide-react';
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
              <div className="group relative bg-[#191817] border border-[#31302C] rounded-[2px] overflow-hidden shadow-2xl">
                
                {/* Large Editorial Photo Container - Emphasizing Chimney, Kiln Yard & Brick Stacks */}
                <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/4] w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[560px] overflow-hidden bg-[#171615]">
                  <Image
                    src="/images/hero-kiln.jpg"
                    alt="Active brick kiln chimney with Hindi inscription, delivery tractor and red clay brick stacks at Hanuman Bhatta Company in Kahlpa, Gohana"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 540px"
                    priority
                    className="object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Architectural Corner Crop Marks */}
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />

                  {/* High-Contrast Tonal Gradient & Legible Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-14 pb-4 px-4 sm:px-5 pointer-events-none">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#B8402C] font-semibold block">
                          KAHLPA KILN YARD · ESTD. 2010
                        </span>
                        <p className="text-sm sm:text-base font-semibold text-white mt-0.5 tracking-tight">
                          Active Bull’s Trench Kiln &amp; Dispatch Facility
                        </p>
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 bg-[#191817]/95 text-[#F5F0E8] border border-[#42403B] rounded-[2px] whitespace-nowrap">
                        Gohana, Haryana
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-photo Caption Strip */}
                <div className="px-4 py-3 bg-[#191817] border-t border-[#31302C] flex items-center justify-between text-xs text-[#A9A39A]">
                  <span className="font-mono">Direct Yard Tractor Dispatch</span>
                  <span className="text-[#EAE7E1] font-medium">Kahlpa-Bhanderi Belt</span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Premium Local Trust Section (Replacing the 3 statistics) */}
      <section
        aria-label="Local Heritage and Supply Network"
        className="bg-[#191817] text-[#F5F0E8] border-b border-[#31302C] py-8 sm:py-10"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#31302C]">
            
            {/* Trust Point 1: Established in 2010 */}
            <div className="py-5 md:py-0 md:px-8 first:md:pl-0 flex items-start gap-4">
              <div className="w-9 h-9 rounded-[2px] bg-[#242321] border border-[#31302C] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  Established in 2010
                </h2>
                <p className="text-xs sm:text-sm text-[#A9A39A] mt-1 leading-relaxed">
                  A local brick manufacturing business.
                </p>
              </div>
            </div>

            {/* Trust Point 2: Made in Kahlpa, Gohana */}
            <div className="py-5 md:py-0 md:px-8 flex items-start gap-4">
              <div className="w-9 h-9 rounded-[2px] bg-[#242321] border border-[#31302C] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  Made in Kahlpa, Gohana
                </h2>
                <p className="text-xs sm:text-sm text-[#A9A39A] mt-1 leading-relaxed">
                  Manufactured locally for nearby construction needs.
                </p>
              </div>
            </div>

            {/* Trust Point 3: Local Delivery Network */}
            <div className="py-5 md:py-0 md:px-8 last:md:pr-0 flex items-start gap-4">
              <div className="w-9 h-9 rounded-[2px] bg-[#242321] border border-[#31302C] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                <Truck className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  Local Delivery Network
                </h2>
                <p className="text-xs sm:text-sm text-[#A9A39A] mt-1 leading-relaxed">
                  Serving Gohana and surrounding areas.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
