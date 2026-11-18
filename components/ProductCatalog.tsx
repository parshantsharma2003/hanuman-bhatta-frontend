'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, queryKeys } from '@/lib/api/queries';

interface GradeSpecs {
  standard: string;
  dimensions: string;
  strength: string;
  waterAbsorption: string;
  colorSound: string;
  dispatchUnit: string;
  bestFor: string;
}

const GRADE_SPECS: Record<string, GradeSpecs> = {
  First: {
    standard: 'IS:1077 (Class 105)',
    dimensions: '9" × 4.25" × 2.75" (230 × 110 × 70 mm)',
    strength: '≥ 10.5 N/mm² (105 kg/cm²)',
    waterAbsorption: '< 15% (24-hr Cold Immersion)',
    colorSound: 'Uniform Deep Kiln Red • Clear Metallic Ring',
    dispatchUnit: '3,000 Bricks / Tractor-Trolley',
    bestFor: 'Multi-story load-bearing walls, exposed facades & commercial masonry',
  },
  Second: {
    standard: 'IS:1077 (Class 75)',
    dimensions: '9" × 4.25" × 2.75" (230 × 110 × 70 mm)',
    strength: '≥ 7.5 N/mm² (75 kg/cm²)',
    waterAbsorption: '< 20% (24-hr Cold Immersion)',
    colorSound: 'Warm Terra Red • Solid Strike Sound',
    dispatchUnit: '3,000 Bricks / Tractor-Trolley',
    bestFor: 'Partition walls, plastered residential brickwork & boundary walls',
  },
  Rora: {
    standard: 'IRC / PWD Sub-base Standard',
    dimensions: '20mm – 50mm Hard Kiln-Vitrified Aggregate',
    strength: 'Heavy Compaction Grade',
    waterAbsorption: 'Impervious Vitrified Bats',
    colorSound: 'Deep Dark Red / Vitrified Clinker',
    dispatchUnit: 'Per Trolley Load (Loose / Crushed)',
    bestFor: 'Foundation beds, road sub-bases, roof water-proofing screeds',
  },
};

const defaultProducts: Product[] = [
  {
    _id: 'prod-avval-gohana',
    name: 'Grade-1 Red Clay Bricks (अव्वल ईंट)',
    slug: 'first-class-red-clay-bricks-gohana',
    type: 'Class 105 Structural Masonry',
    qualityGrade: 'First',
    pricePer1000: 6500,
    pricePerTrolley: 19500,
    usageTags: [
      'Load-bearing multi-story construction',
      'Exposed brickwork & architectural facades',
      'Compressive strength: ≥ 10.5 N/mm²',
      'Water absorption: < 15% (24-hr cold immersion)',
    ],
    description:
      'Our highest-density red clay brick, slow-fired at peak kiln temperatures for exceptional structural load capacity, uniform dimensions, sharp corners, and a clear metallic ringing sound.',
    isActive: true,
  },
  {
    _id: 'prod-doyam-gohana',
    name: 'Grade-2 Red Clay Bricks (दोयम ईंट)',
    slug: 'second-class-red-clay-bricks-gohana',
    type: 'Class 75 Standard Masonry',
    qualityGrade: 'Second',
    pricePer1000: 5500,
    pricePerTrolley: 16500,
    usageTags: [
      'Internal partition & non-load-bearing walls',
      'Plastered residential brickwork',
      'Boundary walls & perimeter structures',
      'Compressive strength: ≥ 7.5 N/mm²',
    ],
    description:
      'Well-fired red clay bricks with slight surface texture variation, ideal for plaster-coated masonry, boundary walls, and cost-effective residential partitioning.',
    isActive: true,
  },
  {
    _id: 'prod-rora-gohana',
    name: 'Crushed Brick Bats / Rora (रोड़ा ईंट)',
    slug: 'brick-bats-crushed-rora-gohana',
    type: 'Vitrified Sub-Base Aggregate',
    qualityGrade: 'Rora',
    pricePer1000: 3500,
    pricePerTrolley: 10500,
    usageTags: [
      'Foundation sub-base & ground consolidation',
      'Roadway bed leveling & paving foundation',
      'Roof lime-concrete terrace weatherproofing',
      'Drainage fill & soak pit aggregate',
    ],
    description:
      'Kiln-hardened crushed brick aggregates and broken bats used for foundation bedding, ground compaction, road sub-bases, and damp-proofing concrete screeds.',
    isActive: true,
  },
];

export default function ProductCatalog() {
  const [pricingMode, setPricingMode] = useState<'thousand' | 'trolley'>('thousand');
  const [selectedGrade, setSelectedGrade] = useState<'First' | 'Second' | 'Rora'>('First');
  const { openModal } = useOrderModal();

  const { data: serverProducts = [] } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    refetchInterval: 30000,
  });

  const products = serverProducts.length > 0 ? serverProducts : defaultProducts;
  const currentProduct = products.find((p) => p.qualityGrade === selectedGrade) || products[0];
  const specs = GRADE_SPECS[selectedGrade] || GRADE_SPECS.First;

  const handleOrder = (_productName: string) => {
    trackMetric('order_click');
    openModal();
  };

  const selectedPrice = pricingMode === 'thousand' ? currentProduct.pricePer1000 : currentProduct.pricePerTrolley;
  const selectedUnitLabel = pricingMode === 'thousand' ? 'per 1,000 bricks' : 'per trolley (3,000 bricks)';

  return (
    <section
      id="products"
      className="pt-10 sm:pt-12 md:pt-14 pb-20 md:pb-28 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-18"
      aria-label="Product Catalog and Technical Datasheets"
    >
      <div className="container-custom">
        
        {/* Section Header: Refined Editorial Typography & Tight Transition */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-[#B8402C] mb-2 block">
              KILN SPECIFICATIONS &amp; GRADES
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-bold font-display text-[#242321] tracking-tight leading-[1.12]">
              Kiln Brick Grades &amp; Technical Datasheet
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#57544E] leading-relaxed max-w-2xl font-sans">
              Explore our red clay brick grades, dimensions and technical specifications. Contact us directly for current wholesale pricing and bulk orders.
            </p>
          </div>

          {/* Pricing Toggle Switch */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#D1C7B6] rounded text-xs font-mono self-start lg:self-end shadow-xs">
            <button
              onClick={() => setPricingMode('thousand')}
              className={`px-4 py-2.5 rounded transition-colors font-medium ${
                pricingMode === 'thousand'
                  ? 'bg-[#242321] text-white'
                  : 'text-[#57544E] hover:text-[#242321]'
              }`}
            >
              Rate per 1,000 Bricks
            </button>
            <button
              onClick={() => setPricingMode('trolley')}
              className={`px-4 py-2.5 rounded transition-colors font-medium ${
                pricingMode === 'trolley'
                  ? 'bg-[#242321] text-white'
                  : 'text-[#57544E] hover:text-[#242321]'
              }`}
            >
              Rate per Trolley (3,000)
            </button>
          </div>
        </div>

        {/* Grade Selector Tabs (Segmented architectural bar) */}
        <div className="flex items-center gap-2 border-b border-[#D1C7B6] pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setSelectedGrade('First')}
            className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedGrade === 'First'
                ? 'bg-[#242321] text-white'
                : 'bg-white text-[#57544E] hover:bg-[#EAE4D9] border border-[#D1C7B6]'
            }`}
          >
            <span className="font-mono text-xs text-[#B8402C]">01</span>
            <span>Grade-1 Red Clay (अव्वल)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#B8402C] text-white rounded">FLAGSHIP</span>
          </button>

          <button
            onClick={() => setSelectedGrade('Second')}
            className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedGrade === 'Second'
                ? 'bg-[#242321] text-white'
                : 'bg-white text-[#57544E] hover:bg-[#EAE4D9] border border-[#D1C7B6]'
            }`}
          >
            <span className="font-mono text-xs text-[#B8402C]">02</span>
            <span>Grade-2 Red Clay (दोयम)</span>
          </button>

          <button
            onClick={() => setSelectedGrade('Rora')}
            className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedGrade === 'Rora'
                ? 'bg-[#242321] text-white'
                : 'bg-white text-[#57544E] hover:bg-[#EAE4D9] border border-[#D1C7B6]'
            }`}
          >
            <span className="font-mono text-xs text-[#B8402C]">03</span>
            <span>Crushed Brick Bats (रोड़ा)</span>
          </button>
        </div>

        {/* Flagship Technical Datasheet & Visual Split Layout */}
        <div className="bg-white border border-[#D1C7B6] rounded overflow-hidden shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Full Technical Datasheet (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2DDD5]">
              <div>
                {/* Identification Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DDD5] pb-4 mb-6">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#B8402C] font-semibold block">
                      {currentProduct.type}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#242321] tracking-tight mt-1">
                      {currentProduct.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#736F67] block">STANDARD</span>
                    <span className="text-xs font-mono font-bold text-[#242321] bg-[#F5F0E8] border border-[#D1C7B6] px-2 py-0.5 rounded">
                      {specs.standard}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#57544E] leading-relaxed mb-6 font-normal">
                  {currentProduct.description}
                </p>

                {/* Detailed Technical Matrix */}
                <div className="space-y-3 text-xs sm:text-sm mb-6 bg-[#FAF8F5] border border-[#EDE8DF] p-4 sm:p-5 rounded">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#736F67] block mb-2 font-semibold">
                    Engineering Test Parameters (IS:1077 / Kahlpa Lab)
                  </span>

                  <div className="flex justify-between py-1.5 border-b border-[#E2DDD5]">
                    <span className="text-[#736F67]">Nominal Dimensions</span>
                    <span className="font-mono text-[#242321] font-semibold text-right">{specs.dimensions}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#E2DDD5]">
                    <span className="text-[#736F67]">Compressive Strength</span>
                    <span className="font-mono text-[#242321] font-semibold text-right">{specs.strength}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#E2DDD5]">
                    <span className="text-[#736F67]">Water Absorption (24-hr)</span>
                    <span className="font-mono text-[#242321] font-semibold text-right">{specs.waterAbsorption}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#E2DDD5]">
                    <span className="text-[#736F67]">Visual &amp; Metallic Ring</span>
                    <span className="font-mono text-[#242321] font-semibold text-right">{specs.colorSound}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-[#736F67]">Standard Packaging</span>
                    <span className="font-mono text-[#242321] font-semibold text-right">{specs.dispatchUnit}</span>
                  </div>
                </div>

                {/* Key Applications List */}
                <div className="space-y-2 mb-8">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#736F67] block mb-1 font-semibold">
                    Approved Construction Applications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#42403B]">
                    {currentProduct.usageTags.map((tag, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Call to Action Bar */}
              <div className="pt-6 border-t border-[#E2DDD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold font-display text-[#242321]">
                      ₹{selectedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#736F67] font-mono">
                      {selectedUnitLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#969188] block mt-0.5">
                    Ex-Kiln Yard, Kahlpa • Freight based on site location
                  </span>
                </div>

                <button
                  onClick={() => handleOrder(currentProduct.name)}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-6 py-3.5 rounded transition-colors text-sm shadow-xs min-h-[48px]"
                >
                  <span>Request Kiln Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Photography & Quality Assurance (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded overflow-hidden border border-[#D1C7B6] bg-[#242321] group shadow-inner">
                  <Image
                    src="/images/brick-texture.jpg"
                    alt={`${currentProduct.name} authentic masonry batch at Hanuman Bhatta Company`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-white/80">
                      Genuine Kiln Inspection
                    </span>
                    <span className="text-xs font-semibold">
                      {currentProduct.name}
                    </span>
                  </div>
                </div>

                {/* Quality Checklist */}
                <div className="mt-6 space-y-3.5">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#736F67] block font-semibold">
                    Kahlpa Yard Quality Assurance
                  </span>

                  <div className="flex items-start gap-3 text-xs text-[#57544E]">
                    <ShieldCheck className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                    <span><strong>Uniform Firing:</strong> Slow kiln cycle guarantees deep red body without brittle unburnt cores.</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-[#57544E]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                    <span><strong>Pre-Dispatch Yard Count:</strong> Every tractor-trolley count is verified before gate dispatch.</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-[#57544E]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                    <span><strong>Direct Manufacturer Rate:</strong> No commission agents or middlemen markups.</span>
                  </div>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="mt-6 pt-5 border-t border-[#E2DDD5] text-xs text-[#736F67]">
                <p>
                  <strong>Site Deliveries:</strong> Dedicated tractor-trolley transit to Sonipat, Rohtak, Panipat, Jind, and adjoining rural districts.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Comparison of All 3 Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const price = pricingMode === 'thousand' ? product.pricePer1000 : product.pricePerTrolley;
            const unit = pricingMode === 'thousand' ? 'per 1,000' : 'per trolley';
            const isSelected = product.qualityGrade === selectedGrade;

            return (
              <div
                key={product._id}
                onClick={() => setSelectedGrade(product.qualityGrade)}
                className={`cursor-pointer rounded p-5 sm:p-6 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-white border-[#B8402C] shadow-md ring-1 ring-[#B8402C]'
                    : 'bg-white/80 border-[#D1C7B6] hover:border-[#B8402C] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5] mb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8402C] font-semibold">
                    {product.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#242321]">
                    ₹{price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-[#736F67]">{unit}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold font-display text-[#242321] mb-1">
                  {product.name}
                </h4>

                <p className="text-xs text-[#57544E] line-clamp-2 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between text-xs font-medium text-[#B8402C]">
                  <span>{isSelected ? 'Currently Viewing' : 'View Full Datasheet'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Logistics Information Strip */}
        <div className="mt-8 p-4 sm:p-5 bg-white border border-[#D1C7B6] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#57544E]">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-[#B8402C] flex-shrink-0" />
            <span>
              Standard regional dispatch is 3,000 bricks per tractor-trolley. Transit freight depends on exact distance from Kahlpa kiln yard.
            </span>
          </div>
          <a
            href="tel:+919996669463"
            className="font-mono text-[#B8402C] font-semibold hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            Direct Dispatch Line: +91 99966 69463
          </a>
        </div>

      </div>
    </section>
  );
}
