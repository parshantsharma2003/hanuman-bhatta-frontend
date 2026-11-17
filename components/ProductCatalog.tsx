'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, queryKeys } from '@/lib/api/queries';

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
  const { openModal } = useOrderModal();

  const { data: serverProducts = [] } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    refetchInterval: 30000,
  });

  const products = serverProducts.length > 0 ? serverProducts : defaultProducts;

  const handleOrder = (productName: string) => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <section
      id="products"
      className="py-20 md:py-28 bg-white border-b border-[#E2DDD5] scroll-mt-20"
      aria-label="Product Catalog and Pricing"
    >
      <div className="container-custom">
        {/* Section Header with Pricing Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
              Specifications &amp; Wholesale Pricing
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
              Kiln Brick Grades &amp; Pricing
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
              Direct-from-kiln wholesale pricing for Gohana, Sonipat, Rohtak, and Jind. Transparent rates with standard tractor-trolley delivery options.
            </p>
          </div>

          {/* Pricing Toggle Control */}
          <div className="flex items-center gap-2 p-1 bg-[#F5F0E8] border border-[#E2DDD5] rounded text-xs font-mono">
            <button
              onClick={() => setPricingMode('thousand')}
              className={`px-4 py-2 rounded transition-colors ${
                pricingMode === 'thousand'
                  ? 'bg-[#242321] text-white font-medium'
                  : 'text-[#57544E] hover:text-[#242321]'
              }`}
            >
              Rate per 1,000 Bricks
            </button>
            <button
              onClick={() => setPricingMode('trolley')}
              className={`px-4 py-2 rounded transition-colors ${
                pricingMode === 'trolley'
                  ? 'bg-[#242321] text-white font-medium'
                  : 'text-[#57544E] hover:text-[#242321]'
              }`}
            >
              Rate per Trolley (3,000 Bricks)
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const price = pricingMode === 'thousand' ? product.pricePer1000 : product.pricePerTrolley;
            const priceUnit = pricingMode === 'thousand' ? 'per 1,000 units' : 'per trolley (3,000)';

            return (
              <div
                key={product._id}
                className="border border-[#E2DDD5] rounded bg-white p-7 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-[#B8402C]"
              >
                <div>
                  {/* Category & Grade */}
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-5">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta">
                      {product.type}
                    </span>
                    <span className="text-xs font-mono text-[#736F67]">
                      {product.qualityGrade === 'First' ? 'A-GRADE' : product.qualityGrade === 'Second' ? 'B-GRADE' : 'AGGREGATE'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321] tracking-tight mb-3">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#57544E] leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Technical Checkpoints */}
                  <div className="space-y-2.5 mb-8 border-t border-[#EDE8DF] pt-5">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#969188] block mb-2">
                      Key Applications
                    </span>
                    {product.usageTags.map((tag, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#42403B]">
                        <Check className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Order CTA */}
                <div className="pt-6 border-t border-[#E2DDD5] mt-auto">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold font-display text-[#242321]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#736F67] block mt-0.5">
                        {priceUnit} (Ex-Kiln Yard)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrder(product.name)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F0E8] hover:bg-[#B8402C] text-[#242321] hover:text-white border border-[#E2DDD5] hover:border-[#B8402C] font-medium py-3 px-4 rounded transition-colors text-sm"
                  >
                    <span>Request Quote for this Grade</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Packaging Notice */}
        <div className="mt-12 p-5 bg-[#F5F0E8] border border-[#E2DDD5] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#57544E]">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-[#B8402C] flex-shrink-0" />
            <span>
              Standard regional packaging is 3,000 bricks per tractor-trolley. Transit unloading and freight to site depend on exact distance from Kahlpa kiln.
            </span>
          </div>
          <a
            href="tel:+919996669463"
            className="font-mono text-[#B8402C] font-semibold hover:underline whitespace-nowrap"
          >
            Direct Dispatch: +91 99966 69463
          </a>
        </div>
      </div>
    </section>
  );
}
