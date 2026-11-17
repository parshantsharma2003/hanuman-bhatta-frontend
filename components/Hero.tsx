'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
      className="relative min-h-[92vh] flex items-center bg-[#242321] text-[#F5F0E8] overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 border-b border-[#31302C] scroll-mt-20"
      aria-label="Hanuman Bhatta Company Introduction"
    >
      {/* Subtle architectural grid */}
      <div className="absolute inset-0 brick-pattern opacity-15 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Statement & Technical Credentials (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Meta Registration Line */}
            <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-terracotta font-semibold">
              <span className="w-6 h-px bg-terracotta"></span>
              <span>Estd. 2010 • Kiln Facility in Kahlpa, Gohana (Haryana)</span>
            </div>

            {/* Architectural Heading Hierarchy */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white leading-[1.08]">
                Hanuman Bhatta <br />
                <span className="text-[#B8402C]">Company.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-[#EAE7E1] font-display font-normal max-w-2xl leading-snug">
                Kiln-Fired Red Clay Bricks &amp; Direct Tractor-Trolley Supply
              </p>
            </div>

            {/* Authoritative, Grounded Body */}
            <p className="text-base sm:text-lg text-[#BCB7AD] leading-relaxed max-w-2xl font-sans font-normal">
              Manufactured directly from dense alluvial clay along the Kahlpa-Bhanderi belt, slow-fired at high kiln temperatures for load-bearing strength, low water absorption, and clean architectural masonry. Serving contractors, builders, and homeowners across Gohana, Sonipat, Rohtak, and Jind.
            </p>

            {/* Verified Technical Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#31302C]">
              <div className="py-2">
                <span className="block text-xl font-bold font-display text-white">3,000 Bricks</span>
                <span className="text-xs text-[#969188] uppercase tracking-wider">Standard Trolley Load</span>
              </div>
              <div className="py-2 border-t sm:border-t-0 sm:border-l border-[#31302C] sm:pl-4">
                <span className="block text-xl font-bold font-display text-white">10.5+ N/mm²</span>
                <span className="text-xs text-[#969188] uppercase tracking-wider">Grade-1 Compressive Strength</span>
              </div>
              <div className="py-2 border-t sm:border-t-0 sm:border-l border-[#31302C] sm:pl-4">
                <span className="block text-xl font-bold font-display text-white">Direct Kiln</span>
                <span className="text-xs text-[#969188] uppercase tracking-wider">Wholesale Yard Pricing</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={handleOrderClick}
                className="inline-flex items-center justify-center gap-3 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-7 py-4 rounded transition-colors duration-150 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#242321]"
                aria-label="Request a direct kiln quote or delivery schedule"
              >
                <span>Request Kiln Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 border border-[#42403B] hover:border-[#B8402C] hover:text-white text-[#D8D4CC] font-medium px-7 py-4 rounded transition-colors duration-150 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
                aria-label="Estimate required bricks for your wall"
              >
                Estimate Brick Quantity
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Masonry Card / Spec Plate (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#171615] border border-[#31302C] rounded p-6 sm:p-8 space-y-6 relative shadow-2xl">
              
              {/* Card Header: Product Specification Plate */}
              <div className="flex items-start justify-between border-b border-[#31302C] pb-5">
                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta block">
                    Product Specification • Grade-1
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-1">
                    Red Clay Masonry Brick (अव्वल)
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#969188] block">STANDARD</span>
                  <span className="text-sm font-mono text-white font-semibold">IS:1077</span>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#242321]">
                  <span className="text-[#969188]">Nominal Dimensions</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">{'9" × 4.25" × 2.75" (230×110×70mm)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#242321]">
                  <span className="text-[#969188]">Compressive Strength</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">≥ 10.5 N/mm² (Class 105)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#242321]">
                  <span className="text-[#969188]">Water Absorption</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">&lt; 15% (24-hr Cold Water)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#242321]">
                  <span className="text-[#969188]">Color &amp; Sound</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">Uniform Deep Red • Metallic Ring</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#969188]">Dispatched In</span>
                  <span className="font-mono text-[#EAE7E1] font-medium">3,000 Units per Tractor-Trolley</span>
                </div>
              </div>

              {/* Verified Dispatch Notice */}
              <div className="bg-[#242321] border border-[#31302C] p-4 rounded flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0" />
                <p className="text-xs text-[#BCB7AD] leading-relaxed">
                  Every batch is inspected at our Kahlpa kiln yard prior to tractor-trolley dispatch.
                </p>
              </div>

              {/* Direct Dispatch Indicator */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#969188]">
                <span>Dispatch Radius: 50+ km</span>
                <span className="text-terracotta font-medium">Gohana • Sonipat • Rohtak • Jind</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
