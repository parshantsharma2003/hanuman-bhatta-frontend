'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

export default function Hero() {
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center bg-[#242321] text-[#F5F0E8] overflow-hidden py-10 md:py-16 lg:py-20 border-b border-[#31302C] scroll-mt-20"
      aria-label="Hanuman Bhatta Company Introduction"
    >
      {/* Subtle architectural drafting grid pattern */}
      <div className="absolute inset-0 brick-pattern opacity-15 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Statement & Technical Specifications (7 cols) */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Meta Registration Line */}
            <div className="inline-flex items-center gap-3 text-xs tracking-widest uppercase text-[#B8402C] font-semibold">
              <span className="w-6 h-px bg-[#B8402C]" />
              <span>Estd. 2010 • Kiln Facility in Kahlpa, Gohana</span>
            </div>

            {/* Architectural Heading Hierarchy */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white leading-[1.08]">
                Hanuman Bhatta <br />
                <span className="text-[#B8402C]">Company.</span>
              </h1>
              <p className="text-lg sm:text-2xl text-[#EAE7E1] font-display font-normal max-w-2xl leading-snug">
                Kiln-Fired Red Clay Bricks &amp; Direct Tractor-Trolley Supply
              </p>
            </div>

            {/* Grounded Editorial Copy */}
            <p className="text-sm sm:text-base md:text-lg text-[#BCB7AD] leading-relaxed max-w-2xl font-sans font-normal">
              Manufactured directly from dense alluvial clay along the Kahlpa-Bhanderi belt, slow-fired at high kiln temperatures for load-bearing strength, low water absorption, and clean architectural masonry. Serving contractors, builders, and homeowners across Gohana, Sonipat, Rohtak, and Jind.
            </p>

            {/* Specification Strip (Horizontal hairline matrix) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#31302C]">
              <div className="py-2">
                <span className="block text-xl font-bold font-display text-white">3,000 Bricks</span>
                <span className="text-[11px] text-[#A9A39A] uppercase tracking-wider block mt-0.5">Standard Trolley Load</span>
              </div>
              <div className="py-2 border-t sm:border-t-0 sm:border-l border-[#31302C] sm:pl-4">
                <span className="block text-xl font-bold font-display text-white">10.5+ N/mm²</span>
                <span className="text-[11px] text-[#A9A39A] uppercase tracking-wider block mt-0.5">Grade-1 Compressive Strength</span>
              </div>
              <div className="py-2 border-t sm:border-t-0 sm:border-l border-[#31302C] sm:pl-4">
                <span className="block text-xl font-bold font-display text-white">Direct Kiln</span>
                <span className="text-[11px] text-[#A9A39A] uppercase tracking-wider block mt-0.5">Wholesale Yard Pricing</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={handleOrderClick}
                className="inline-flex items-center justify-center gap-3 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-6 py-3.5 rounded transition-colors duration-150 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#242321] min-h-[48px]"
                aria-label="Request a direct kiln quote or delivery schedule"
              >
                <span>Request Kiln Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 border border-[#42403B] hover:border-[#B8402C] hover:text-white text-[#D8D4CC] font-medium px-6 py-3.5 rounded transition-colors duration-150 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] min-h-[48px]"
                aria-label="Estimate required bricks for your wall"
              >
                Estimate Brick Quantity
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Photography & Spec Plate (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#191817] border border-[#31302C] rounded overflow-hidden relative shadow-2xl">
              
              {/* Genuine Red Clay Brickwork Photography */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#242321]">
                <Image
                  src="/images/brick-texture.jpg"
                  alt="Kiln-fired genuine red clay masonry bricks at Hanuman Bhatta Company, Kahlpa"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Architectural corner crop marks */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/60 pointer-events-none" />

                {/* Subtle gradient caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta block">
                      Facility Batch • Kahlpa Yard
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Class 105 Red Clay Masonry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#242321]/80 text-[#F5F0E8] border border-[#42403B] rounded">
                    IS:1077
                  </span>
                </div>
              </div>

              {/* Technical Specifications Summary Strip */}
              <div className="p-5 sm:p-6 space-y-3.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#242321]">
                  <span className="text-[#A9A39A]">Nominal Size</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">{'9" × 4.25" × 2.75" (230×110×70mm)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#242321]">
                  <span className="text-[#A9A39A]">Compressive Strength</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">≥ 10.5 N/mm² (Grade 1 / अव्वल)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#242321]">
                  <span className="text-[#A9A39A]">Water Absorption</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">&lt; 15% (24-hr Cold Immersion)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A9A39A]">Standard Dispatch</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">3,000 Bricks / Tractor-Trolley</span>
                </div>

                {/* Direct Dispatch Indicator */}
                <div className="pt-2 border-t border-[#31302C] flex items-center gap-2 text-[11px] text-[#A9A39A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8402C] flex-shrink-0" />
                  <span>Prompt delivery across Gohana, Sonipat, Rohtak &amp; Jind</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
