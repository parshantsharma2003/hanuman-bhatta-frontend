'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Check, ShieldCheck, Truck, Layers, Flame, Sun, Droplets, Mountain, PhoneCall } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

interface ManufacturingStage {
  number: string;
  id: string;
  shortLabel: string;
  title: string;
  titleHindi: string;
  description: string;
  keyDetails: string[];
  visualType: 'photo' | 'dual_method' | 'pending_photo';
  imageSrc?: string;
  imageAlt?: string;
  photoCaption?: string;
  pendingPhotoLabel?: string;
  pendingPhotoSpecs?: string;
}

const STAGES: ManufacturingStage[] = [
  {
    number: '01',
    id: 'stage-01',
    shortLabel: 'Soil Selection',
    title: 'Best Quality Soil Selection',
    titleHindi: 'अच्छी मिट्टी का चुनाव',
    description: 'We begin by selecting suitable, high-quality soil that forms the foundation of our red clay bricks.',
    keyDetails: [
      'Dense alluvial clay selected from the Kahlpa basin',
      'Screened to remove stones, roots, and organic matter',
      'Natural balance of silica and alumina for long-term brick density',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-soil.jpg',
    imageAlt: 'Best quality red clay and alluvial soil selection mounds at Hanuman Bhatta Company, Kahlpa',
    photoCaption: 'Actual Kahlpa Kiln Yard · High-Quality Alluvial Clay Selection Mounds',
  },
  {
    number: '02',
    id: 'stage-02',
    shortLabel: 'Sweet Water Mixing',
    title: 'Soil & Sweet Water Mixing',
    titleHindi: 'मिट्टी और मीठे पानी से गारा तैयार करना',
    description: 'Selected soil is mixed with good-quality sweet water (मीठा पानी) to prepare smooth, workable mud (गारा) for brick manufacturing.',
    keyDetails: [
      'Pure sweet groundwater (मीठा पानी) prevents salt efflorescence',
      'Thorough pug-mill churning for homogeneous plasticity',
      'Lump-free workable mud (गारा) ready for precise molding',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-mixing.jpg',
    imageAlt: 'Preparation of smooth workable clay mud (गारा) using sweet water at Hanuman Bhatta Company, Kahlpa',
    photoCaption: 'Actual Kahlpa Yard · Soil & Sweet Water Mixing to Prepare Workable Mud (गारा)',
  },
  {
    number: '03',
    id: 'stage-03',
    shortLabel: 'Raw Brick Molding',
    title: 'Raw Brick Manufacturing',
    titleHindi: 'मशीन और हाथों से कच्ची ईंट बनाना',
    description: 'Our raw bricks (कच्ची ईंट) are manufactured using both machine-based production and skilled manual hand-molding methods.',
    keyDetails: [
      'Dual-method production: Automated extrusion and artisan hand-casting',
      'Clean 90-degree edges and deep frog indent for mortar bonding',
      'Standardized dimensions checked during wet molding',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-molding.jpg',
    imageAlt: 'Skilled artisans hand-molding raw red clay bricks with steel and wooden molds at Hanuman Bhatta Company, Kahlpa',
    photoCaption: 'Actual Kahlpa Yard · Skilled Hand-Molding & Stacking of Raw Bricks (कच्ची ईंट)',
  },
  {
    number: '04',
    id: 'stage-04',
    shortLabel: 'Air & Sun Drying',
    title: 'Natural Air & Sun Drying',
    titleHindi: 'धूप और हवा में सुखाना',
    description: 'Freshly molded wet bricks are arranged in open drying areas and allowed to dry completely under natural sunlight and airflow.',
    keyDetails: [
      'Staggered open-air hack formations for even cross-ventilation',
      'Gradual moisture evaporation down to below 2%',
      'Elimination of thermal shock cracks prior to kiln loading',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-drying.jpg',
    imageAlt: 'Open-air sun drying yard with thousands of freshly molded raw bricks arranged in rows at Hanuman Bhatta Company, Kahlpa',
    photoCaption: 'Actual Kahlpa Yard · Open-Air Sun Drying Lines of Freshly Molded Raw Bricks',
  },
  {
    number: '05',
    id: 'stage-05',
    shortLabel: 'Kiln Loading',
    title: 'Kiln Loading',
    titleHindi: 'सूखी कच्ची ईंट भट्ठे में भरना',
    description: 'After complete drying, the raw bricks are carefully packed inside the kiln for firing.',
    keyDetails: [
      'Engineered interlocking stacking inside Bull’s Trench chambers',
      'Calibrated draft flue channels left between brick columns',
      'Manual chamber loading by experienced kiln stacking crews',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-loading.jpg',
    imageAlt: 'Experienced kiln stacking crew packing and loading raw dried bricks into the Bull’s trench chamber at Hanuman Bhatta Company, Kahlpa',
    photoCaption: 'Actual Kahlpa Kiln Trench · Chamber Stacking & Loading of Dried Raw Bricks (कच्ची ईंट भराई)',
  },
  {
    number: '06',
    id: 'stage-06',
    shortLabel: 'Coal Firing',
    title: 'High-Quality Coal Firing',
    titleHindi: 'अच्छी क्वालिटी के कोयले से पकाई',
    description: 'We use high-GCV, good-quality coal for firing and baking the raw bricks inside the kiln at high temperatures.',
    keyDetails: [
      'High Gross Calorific Value (GCV) coal for intense, steady baking',
      '1000°C peak vitrification temperature for structural hardness',
      '24/7 kiln masters supervising continuous fire progression',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-firing.jpg',
    imageAlt: 'Active firing chimney with Hanuman Bhatta lettering and smoke during coal baking at Kahlpa kiln',
    photoCaption: 'Actual Hanuman Bhatta Chimney & Active High-Heat Coal Firing Chamber (1000°C)',
  },
  {
    number: '07',
    id: 'stage-07',
    shortLabel: 'Stock Yard',
    title: 'Finished Bricks & Stock Yard',
    titleHindi: 'पकी हुई ईंटों का स्टॉक यार्ड',
    description: 'After firing, finished bricks are taken out of the kiln and arranged in our open stock yard, ready for customer orders.',
    keyDetails: [
      'Gradual natural cooling to ensure structural density and ring',
      'Manual grading into Grade-1 (अव्वल) and Grade-2 (दोयम)',
      'Organized open yard inventory ready for immediate transport',
    ],
    visualType: 'photo',
    imageSrc: '/images/brick-texture.jpg',
    imageAlt: 'Finished Grade-1 kiln-fired red clay bricks stacked in open yard at Hanuman Bhatta Company',
    photoCaption: 'Actual Fired Red Clay Masonry Batch with Metallic Ring & Uniform Dimensions',
  },
  {
    number: '08',
    id: 'stage-08',
    shortLabel: 'Tractor Delivery',
    title: 'Tractor-Trolley Delivery',
    titleHindi: 'ट्रैक्टर-ट्रॉली से सप्लाई',
    description: 'Finished bricks are supplied to customers using tractors and trolleys.',
    keyDetails: [
      'Standard 3,000 bricks per tractor-trolley dispatch',
      'Careful manual counting and loading prior to yard exit',
      'Direct on-site unloading across Gohana, Sonipat, Rohtak & Jind',
    ],
    visualType: 'photo',
    imageSrc: '/images/process-tractor.jpg',
    imageAlt: 'Blue tractor-trolley dispatch unit at Hanuman Bhatta Company kiln yard in Kahlpa',
    photoCaption: 'Actual Delivery Fleet: Dedicated Tractor-Trolley Transit to Construction Sites',
  },
];

export default function OurProcess() {
  const [activeStageId, setActiveStageId] = useState<string>('stage-01');
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  const scrollToStage = (id: string) => {
    setActiveStageId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="process"
      className="pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-20"
      aria-label="Manufacturing Process and Journey"
    >
      <div className="container-custom">
        
        {/* Section Introduction */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#B8402C] mb-3 block">
            FROM SOIL TO STRONG BRICKS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
            The Journey of Every Brick
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
            Every brick begins with carefully selected soil and passes through a series of traditional and modern manufacturing stages before reaching your construction site.
          </p>
        </div>

        {/* Quick Clickable Stage Navigation Bar */}
        <div className="mb-14 pb-3 border-b border-[#D1C7B6] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STAGES.map((stage) => {
              const isActive = activeStageId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className={`px-3.5 py-2 rounded-sm text-xs font-mono transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#242321] text-white font-semibold shadow-xs'
                      : 'bg-white/80 hover:bg-white text-[#57544E] border border-[#D1C7B6]'
                  }`}
                  aria-label={`Jump to stage ${stage.number}: ${stage.title}`}
                >
                  <span className="text-[#B8402C] font-bold">{stage.number}</span>
                  <span>{stage.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Eight Manufacturing Stages: Visual Documentary Timeline */}
        <div className="relative">
          
          {/* Subtle Central Connecting Timeline Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-12 w-px bg-[#D1C7B6] -translate-x-1/2 pointer-events-none" />

          {/* Continuous Left Timeline Line (Mobile) */}
          <div className="lg:hidden absolute left-4 sm:left-6 top-4 bottom-12 w-px bg-[#D1C7B6] pointer-events-none" />

          <div className="space-y-16 md:space-y-24">
            {STAGES.map((stage, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={stage.id}
                  id={stage.id}
                  className="relative scroll-mt-28"
                  onMouseEnter={() => setActiveStageId(stage.id)}
                >
                  {/* Timeline Node Marker */}
                  <div className="lg:hidden absolute left-4 sm:left-6 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#B8402C] border-4 border-[#F5F0E8] z-10 shadow-xs" />
                  <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-[#B8402C] z-10 items-center justify-center shadow-xs">
                    <span className="text-[10px] font-mono font-bold text-[#B8402C]">{stage.number}</span>
                  </div>

                  {/* Editorial Layout: Desktop Alternates (Zig-Zag), Mobile Vertical */}
                  <div className="pl-10 sm:pl-14 lg:pl-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                      
                      {/* Text Column */}
                      <div
                        className={`space-y-4 ${
                          isEven
                            ? 'lg:col-span-6 lg:text-left lg:pr-6'
                            : 'lg:col-span-6 lg:order-2 lg:text-left lg:pl-6'
                        }`}
                      >
                        {/* Stage Number & Headings */}
                        <div>
                          <span className="text-3xl sm:text-4xl font-bold font-mono text-[#B8402C] block mb-1">
                            {stage.number}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#242321] tracking-tight">
                            {stage.title}
                          </h3>
                          <p className="text-sm font-medium text-[#736F67] mt-1 font-sans tracking-wide">
                            {stage.titleHindi}
                          </p>
                        </div>

                        {/* Concise Narrative */}
                        <p className="text-sm sm:text-base text-[#57544E] leading-relaxed font-sans">
                          {stage.description}
                        </p>

                        {/* Key Technical Highlights */}
                        <div className="space-y-2 pt-2 border-t border-[#D1C7B6]">
                          {stage.keyDetails.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[#42403B]">
                              <Check className="w-3.5 h-3.5 text-[#B8402C] flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Visual Column */}
                      <div
                        className={`w-full ${
                          isEven
                            ? 'lg:col-span-6'
                            : 'lg:col-span-6 lg:order-1'
                        }`}
                      >
                        {/* Variant 1: Actual Facility Photograph */}
                        {stage.visualType === 'photo' && stage.imageSrc && (
                          <div className="group relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-[2px] border border-[#31302C] bg-[#191817] shadow-xl overflow-hidden">
                            <Image
                              src={stage.imageSrc}
                              alt={stage.imageAlt || stage.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 45vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Architectural Corner Crop Marks */}
                            <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
                            <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
                            <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
                            <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />

                            {/* High-Contrast Legible Caption Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-12 pb-3.5 px-4 pointer-events-none">
                              <span className="text-[10px] font-mono tracking-wider uppercase text-[#B8402C] font-semibold block">
                                Kahlpa Facility · Stage {stage.number}
                              </span>
                              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 line-clamp-1">
                                {stage.photoCaption}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Variant 2: Dual Manufacturing Methods (Stage 03 Requirement: Show Both Methods Visually) */}
                        {stage.visualType === 'dual_method' && (
                          <div className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {/* Method A: Machine Extrusion */}
                              <div className="bg-white border border-[#D1C7B6] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
                                <div>
                                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EDE8DF]">
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8402C] font-bold">
                                      METHOD A
                                    </span>
                                    <span className="text-[10px] font-mono bg-[#F5F0E8] px-2 py-0.5 border border-[#D1C7B6] rounded-xs text-[#242321]">
                                      Machine Press
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold font-display text-[#242321]">
                                    Machine-Based Production
                                  </h4>
                                  <p className="text-xs text-[#57544E] mt-1 leading-relaxed">
                                    Mechanical mold extrusion delivering high compaction density, crisp dimensional uniformity, and steady volume output.
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-[#EDE8DF] text-[10px] font-mono text-[#736F67]">
                                  Photo Needed: Machine extrusion line at Kahlpa
                                </div>
                              </div>

                              {/* Method B: Skilled Hand-Molding */}
                              <div className="bg-white border border-[#D1C7B6] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
                                <div>
                                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EDE8DF]">
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8402C] font-bold">
                                      METHOD B
                                    </span>
                                    <span className="text-[10px] font-mono bg-[#F5F0E8] px-2 py-0.5 border border-[#D1C7B6] rounded-xs text-[#242321]">
                                      Hand-Casting
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold font-display text-[#242321]">
                                    Skilled Hand-Molding (सांचा ढलाई)
                                  </h4>
                                  <p className="text-xs text-[#57544E] mt-1 leading-relaxed">
                                    Traditional steel and wooden mold hand-casting by master molders, pressing the HB imprint with sharp 90-degree corners.
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-[#EDE8DF] text-[10px] font-mono text-[#736F67]">
                                  Photo Needed: Artisan hand-molding close-up
                                </div>
                              </div>
                            </div>

                            {/* Dual Method Status Strip */}
                            <div className="px-3.5 py-2 bg-white/70 border border-[#D1C7B6] rounded-[2px] flex items-center justify-between text-xs text-[#57544E]">
                              <span className="font-mono text-[11px] text-[#B8402C] font-semibold">Dual Production Capacity</span>
                              <span className="text-[11px]">Combining modern scale with traditional craftsmanship</span>
                            </div>
                          </div>
                        )}

                        {/* Variant 3: Architectural Documentation Frame (Identifies Exact Photo Needed per Strict Rules) */}
                        {stage.visualType === 'pending_photo' && (
                          <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-[2px] border border-[#D1C7B6] bg-white p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                            {/* Subtle Architectural Grid */}
                            <div className="absolute inset-0 brick-pattern opacity-10 pointer-events-none" />

                            {/* Header with Camera Icon */}
                            <div className="relative z-10 flex items-center justify-between border-b border-[#EDE8DF] pb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-[2px] bg-[#F5F0E8] border border-[#D1C7B6] flex items-center justify-center text-[#B8402C]">
                                  <Camera className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8402C] font-semibold">
                                  Facility Documentation
                                </span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F5F0E8] border border-[#D1C7B6] rounded text-[#736F67]">
                                Stage {stage.number}
                              </span>
                            </div>

                            {/* Identification of Exact Needed Photograph */}
                            <div className="relative z-10 my-auto py-3">
                              <h4 className="text-sm sm:text-base font-bold font-display text-[#242321]">
                                {stage.pendingPhotoLabel}
                              </h4>
                              <p className="text-xs text-[#57544E] mt-1.5 leading-relaxed max-w-md font-sans">
                                {stage.pendingPhotoSpecs}
                              </p>
                            </div>

                            {/* Footer Location Strip */}
                            <div className="relative z-10 pt-3 border-t border-[#EDE8DF] flex items-center justify-between text-[11px] text-[#736F67]">
                              <span className="font-mono">Kahlpa Yard • Hanuman Bhatta</span>
                              <span className="text-[#B8402C] font-medium">Authentic Step</span>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                </article>
              );
            })}
          </div>

        </div>

        {/* Natural Transition Divider between Stage 08 Delivery Photo & Dispatch Section */}
        <div className="w-full h-px bg-[#D1C7B6] mt-12 mb-8 sm:mt-14 sm:mb-10" />

        {/* Editorial Delivery Dispatch Section */}
        <div className="bg-[#191817] text-white border border-[#31302C] rounded-[2px] p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10">
            
            {/* Left Column: Dispatch Narrative & Location */}
            <div className="lg:col-span-8 space-y-2.5">
              <span className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#B8402C] font-semibold block">
                DIRECT FROM OUR KAHLPA KILN YARD
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold font-display text-white tracking-tight leading-snug">
                From Our Kiln to Your Construction Site.
              </h3>

              <p className="text-sm sm:text-base text-[#BCB7AD] leading-relaxed max-w-2xl font-sans">
                Quality red clay bricks, manufactured locally and supplied directly to your construction site through tractor-trolley delivery.
              </p>

              <p className="text-xs font-mono text-[#8E8980] pt-1">
                Kahlpa, Gohana, Haryana • Established 2010
              </p>
            </div>

            {/* Right Column: Refined Actions */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-3 pt-2 lg:pt-0">
              <button
                onClick={handleOrderClick}
                className="inline-flex items-center justify-center gap-2 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-6 py-3 rounded-[2px] transition-colors text-sm sm:text-base shadow-xs min-h-[44px] sm:min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] w-full sm:w-auto lg:w-full"
                aria-label="Request a brick order from Hanuman Bhatta Company"
              >
                <span>Request a Brick Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919996694663"
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[#D8D4CC] hover:text-white transition-colors py-1.5 px-2 text-center"
                aria-label="Call dispatch directly at +91 99966 94663"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#B8402C]" />
                <span>Call: +91 99966 94663</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
