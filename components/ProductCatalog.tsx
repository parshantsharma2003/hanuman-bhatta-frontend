'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Volume2, 
  Palette, 
  Layers, 
  Hammer, 
  Info,
  Camera
} from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, queryKeys } from '@/lib/api/queries';

export interface BrickGrade {
  id: string;
  number: string;
  name: string;
  hindiName: string;
  gradeBadge: string;
  badge?: string;
  pricePerBrick: number;
  pricePer1000: number;
  description: string;
  colour: string;
  strengthLevel: string;
  soundWhenStruck: string;
  characteristics: string[];
  applications: string[];
  positionNote: string;
  image?: string;
  featured?: boolean;
}

export const BRICK_COLLECTION: BrickGrade[] = [
  {
    id: 'grade-1-awwal',
    number: '01',
    name: 'Premium Bricks',
    hindiName: 'Premium / अव्वल (Awwal)',
    gradeBadge: 'Grade 1',
    badge: 'BEST SELLER',
    pricePerBrick: 9.0,
    pricePer1000: 9000,
    description:
      'Our best-quality red clay bricks, manufactured for customers who prioritize strength, uniformity and premium finishing. Meticulously slow-fired at peak kiln temperature for maximum compressive resistance.',
    colour: 'White and red colour variation',
    strengthLevel: 'Very High (Load-Bearing Structural)',
    soundWhenStruck: 'Clear metallic ringing sound',
    characteristics: [
      'Very hard and strong body',
      'Uniform size and weight across batches',
      'High-finish sharp edges and square corners',
      'Natural white and red kiln colour variation',
      'Very high structural load-bearing capacity',
      'Produces a clear, distinct metallic ringing sound when struck',
    ],
    applications: [
      'Major commercial and institutional construction',
      'Multi-story residential house construction',
      'Main structural load-bearing masonry walls',
      'Deep foundation and basement footings',
      'Exposed architectural brickwork and exterior facades',
    ],
    positionNote: 'Flagship structural grade for heavy construction and long-term durability.',
    image: '/images/premium-brick.jpg',
    featured: true,
  },
  {
    id: 'grade-1-5-standard',
    number: '02',
    name: 'Standard Bricks',
    hindiName: 'लाल पेटी ईंट (Laal Peti / Lal Petty)',
    gradeBadge: 'Grade 1.5',
    badge: 'POPULAR CHOICE',
    pricePerBrick: 8.5,
    pricePer1000: 8500,
    description:
      'A more affordable alternative to premium Awwal bricks, offering good finishing and rich visual colour for suitable general construction applications.',
    colour: 'Pure deep red colour',
    strengthLevel: 'Medium-High (General Masonry)',
    soundWhenStruck: 'Metallic sound (slightly duller than Awwal)',
    characteristics: [
      'High-finished edges and clean surface texture',
      'Rich, aesthetic pure red colour',
      'Good load tolerance (less strength than First Class bricks)',
      'Produces a solid metallic sound when struck, slightly duller than Awwal',
    ],
    applications: [
      'Non-load-bearing structural masonry',
      'Internal room partition walls',
      'Perimeter boundary walls and compound enclosures',
      'Plaster-coated residential brickwork',
    ],
    positionNote: 'Standard economical choice for non-critical walls requiring fine finish.',
  },
  {
    id: 'grade-2-duyam',
    number: '03',
    name: 'Second Class Bricks',
    hindiName: 'Duyam / 2 Number Eent / दुयम',
    gradeBadge: 'Grade 2',
    badge: 'ECONOMICAL',
    pricePerBrick: 8.0,
    pricePer1000: 8000,
    description:
      'A budget-friendly brick option with lower strength and less uniform appearance compared with the higher grades. Ideal for cost-sensitive structural masonry.',
    colour: 'Light red and yellowish variation',
    strengthLevel: 'Moderate (Secondary Masonry)',
    soundWhenStruck: 'Very dull sound',
    characteristics: [
      'Light red and yellowish natural colour variation',
      'Produces a very dull sound when struck together',
      'Considerably lower strength than Grade 1 and Grade 1.5',
      'Lower price point than First Class and Standard bricks',
    ],
    applications: [
      'Suitable non-critical masonry construction',
      'Temporary labor quarters and site store rooms',
      'Lower-budget boundary partitions and agricultural sheds',
    ],
    positionNote: 'Economical alternative — clearly communicated as not equivalent to First Class.',
  },
  {
    id: 'grade-3-peela',
    number: '04',
    name: 'Third Class Bricks',
    hindiName: 'पीला ईंट (Peela Eent)',
    gradeBadge: 'Grade 3 / Third Class',
    badge: 'UTILITY FILLING',
    pricePerBrick: 7.5,
    pricePer1000: 7500,
    description:
      'A low-cost, lower-quality brick option intended for limited applications where high structural compressive strength is not required.',
    colour: 'Distinct yellowish tone',
    strengthLevel: 'Low (Sub-Grade & Non-Structural)',
    soundWhenStruck: 'Very dull thud',
    characteristics: [
      'Distinct yellowish under-fired kiln colour tone',
      'Very low compressive load resistance',
      'Produces a very dull sound when struck',
      'Lowest-cost option among standard shaped bricks',
    ],
    applications: [
      'Foundation filling below ground soil level',
      'Temporary boundary barriers and site sheds',
      'Low-stress earth retaining packings',
    ],
    positionNote: 'Non-structural utility brick exclusively for below-ground filling and temporary builds.',
  },
  {
    id: 'grade-4-chatka',
    number: '05',
    name: 'Fourth Class Bricks',
    hindiName: 'छटका ईंट (Chatka Eent)',
    gradeBadge: 'Grade 4 / Fourth Class',
    badge: 'HARD VITRIFIED',
    pricePerBrick: 6.0,
    pricePer1000: 6000,
    description:
      'Hard, irregularly shaped kiln-vitrified bricks available at the lowest price. Produced in the hottest zone of the kiln where bricks sinter together.',
    colour: 'Irregular dark reddish-purple vitrified body',
    strengthLevel: 'High Hardness (Irregular Geometry)',
    soundWhenStruck: 'Sharp vitrified clink',
    characteristics: [
      'Extremely hard and moisture-impervious kiln body',
      'Irregular shapes, fused surfaces and variable dimensions',
      'High inherent material hardness and compressive toughness',
      'Irregular dark vitrified colouration',
      'Lowest price among all five products',
    ],
    applications: [
      'Sub-base leveling and heavy ground compaction',
      'Roadway bed foundation preparation',
      'Foundation trench filling and water drainage beds',
      'Temporary paving and rough packing',
    ],
    positionNote: 'Irregular shape limits suitability for regular mortar joint masonry; superb for sub-base filling.',
  },
];

export default function ProductCatalog() {
  const [pricingMode, setPricingMode] = useState<'brick' | 'thousand'>('thousand');
  const [selectedMobileGrade, setSelectedMobileGrade] = useState<string>('grade-1-awwal');
  const { openModal } = useOrderModal();

  const handleOpenQuote = (brickName: string) => {
    trackMetric('order_click');
    openModal();
  };

  const getWhatsAppLink = (brick: BrickGrade) => {
    const formattedPrice =
      pricingMode === 'brick'
        ? `₹${brick.pricePerBrick.toFixed(2)} per brick`
        : `₹${brick.pricePer1000.toLocaleString('en-IN')} per 1,000 bricks`;

    const message = `Hello Hanuman Bhatta Company, I am interested in ordering ${brick.name} (${brick.hindiName}) at ${formattedPrice}. Please share current availability and delivery charges to my construction location.`;
    return `https://wa.me/919996669463?text=${encodeURIComponent(message)}`;
  };

  const { data: serverProducts = [] } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    refetchInterval: 30000,
  });

  const liveBricks = useMemo(() => {
    if (!serverProducts || serverProducts.length === 0) {
      return BRICK_COLLECTION;
    }
    return BRICK_COLLECTION.map((local) => {
      const match = serverProducts.find(
        (sp: Product) =>
          sp.grade?.toLowerCase() === local.gradeBadge.toLowerCase() ||
          sp.name.toLowerCase() === local.name.toLowerCase() ||
          (sp.qualityGrade && sp.qualityGrade.toLowerCase() === local.gradeBadge.toLowerCase())
      );
      if (match) {
        const pricePerBrick =
          match.pricePerBrick || (match.pricePer1000 ? match.pricePer1000 / 1000 : local.pricePerBrick);
        const pricePer1000 = match.pricePer1000 || pricePerBrick * 1000;
        return {
          ...local,
          name: match.name || local.name,
          hindiName: match.localName || local.hindiName,
          pricePerBrick,
          pricePer1000,
          description: match.description || local.description,
          characteristics: match.characteristics && match.characteristics.length > 0 ? match.characteristics : local.characteristics,
          applications: match.recommendedApplications && match.recommendedApplications.length > 0 ? match.recommendedApplications : local.applications,
          colour: match.colourDescription || local.colour,
          soundWhenStruck: match.soundDescription || local.soundWhenStruck,
          strengthLevel: match.strengthLevel || local.strengthLevel,
          badge: match.badge || local.badge,
          image: (match.images && match.images[0]) || match.imageUrl || local.image,
        };
      }
      return local;
    });
  }, [serverProducts]);

  const flagshipBrick = liveBricks[0];
  const secondaryBricks = liveBricks.slice(1);

  return (
    <section
      id="products"
      className="pt-12 sm:pt-16 md:pt-20 pb-20 md:pb-28 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-18"
      aria-label="Our Brick Collection - Hanuman Bhatta Company"
    >
      <div className="container-custom">
        
        {/* PHASE 2: Section Header & Architectural Typography */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D1C7B6] rounded-sm text-[11px] font-mono uppercase tracking-widest text-[#B8402C] font-semibold mb-3">
              <span>OUR BRICK COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold font-display text-[#242321] tracking-tight leading-[1.14]">
              The Right Brick for Every Build.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#57544E] leading-relaxed font-sans max-w-2xl">
              From premium first-class bricks to economical construction options, explore the brick grades manufactured at Hanuman Bhatta Company, Kahlpa, Gohana.
            </p>
          </div>

          {/* PHASE 6: Interactive Pricing Selector */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] font-medium">
              Select Pricing Display
            </span>
            <div 
              role="group" 
              aria-label="Pricing display mode"
              className="inline-flex items-center p-1 bg-white border border-[#D1C7B6] rounded-sm text-xs font-mono shadow-xs"
            >
              <button
                type="button"
                onClick={() => setPricingMode('brick')}
                className={`px-3.5 sm:px-4 py-2 rounded-sm transition-all duration-150 font-medium ${
                  pricingMode === 'brick'
                    ? 'bg-[#242321] text-white shadow-xs'
                    : 'text-[#57544E] hover:text-[#242321] hover:bg-[#F5F0E8]'
                }`}
              >
                Price per Brick
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('thousand')}
                className={`px-3.5 sm:px-4 py-2 rounded-sm transition-all duration-150 font-medium ${
                  pricingMode === 'thousand'
                    ? 'bg-[#242321] text-white shadow-xs'
                    : 'text-[#57544E] hover:text-[#242321] hover:bg-[#F5F0E8]'
                }`}
              >
                Price per 1,000 Bricks
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHASE 4: FLAGSHIP SHOWCASE — PRODUCT 01 (Awwal / First Class) */}
        {/* ============================================================== */}
        <div className="bg-white border-2 border-[#242321] rounded-sm overflow-hidden shadow-sm mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left 7 Cols: Detailed Flagship Editorial Specs */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2DDD5]">
              <div>
                {/* Header Strip with Grade, Number & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DDD5] pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#242321] text-white rounded-xs">
                      {flagshipBrick.number}
                    </span>
                    <span className="text-xs font-mono tracking-wider uppercase text-[#B8402C] font-semibold">
                      {flagshipBrick.gradeBadge}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#B8402C] text-white font-bold tracking-wider rounded-xs">
                      {flagshipBrick.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#736F67] font-medium">
                    Ex-Kiln Yard • Kahlpa
                  </span>
                </div>

                {/* Title & Hindi Script */}
                <div className="mb-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold font-display text-[#242321] tracking-tight">
                    {flagshipBrick.name}
                  </h3>
                  <p className="text-sm sm:text-base font-serif text-[#B8402C] font-semibold mt-1">
                    {flagshipBrick.hindiName}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#57544E] leading-relaxed mb-6 font-sans">
                  {flagshipBrick.description}
                </p>

                {/* Key Physical Attributes Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FAF8F5] border border-[#E2DDD5] rounded-sm mb-6 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block">Colour</span>
                    <span className="font-semibold text-[#242321] leading-tight block">
                      {flagshipBrick.colour}
                    </span>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#E2DDD5] pt-2 sm:pt-0 sm:pl-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block">Strength</span>
                    <span className="font-semibold text-[#242321] leading-tight block">
                      {flagshipBrick.strengthLevel}
                    </span>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#E2DDD5] pt-2 sm:pt-0 sm:pl-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block">Strike Sound</span>
                    <span className="font-semibold text-[#242321] leading-tight block">
                      {flagshipBrick.soundWhenStruck}
                    </span>
                  </div>
                </div>

                {/* Characteristics Checklist */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#736F67] block mb-2.5 font-semibold">
                    Key Quality Characteristics
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#383632]">
                    {flagshipBrick.characteristics.map((char, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Applications */}
                <div className="mb-8">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#736F67] block mb-2 font-semibold">
                    Recommended Construction Applications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {flagshipBrick.applications.map((app, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-[#F5F0E8] border border-[#D1C7B6] text-[#42403B] rounded-xs font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA Actions Bar */}
              <div className="pt-6 border-t border-[#E2DDD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold font-display text-[#242321]">
                      {pricingMode === 'brick'
                        ? `₹${flagshipBrick.pricePerBrick.toFixed(2)}`
                        : `₹${flagshipBrick.pricePer1000.toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-xs text-[#736F67] font-mono">
                      {pricingMode === 'brick' ? 'per brick' : 'per 1,000 bricks'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#969188] block mt-0.5">
                    Indicative yard rate • Bulk discounts apply
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={getWhatsAppLink(flagshipBrick)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium px-4 py-3 rounded-sm text-xs sm:text-sm transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenQuote(flagshipBrick.name)}
                    className="inline-flex items-center justify-center gap-2 bg-[#242321] hover:bg-[#B8402C] text-white font-medium px-5 py-3 rounded-sm text-xs sm:text-sm transition-colors shadow-xs"
                  >
                    <span>Request Kiln Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Authentic High-Resolution Photography */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-xs overflow-hidden border border-[#D1C7B6] bg-white group shadow-xs">
                  <Image
                    src={flagshipBrick.image || "/images/premium-brick.jpg"}
                    alt="Authentic Premium Red Clay Bricks (हनुमान ईंट) at Hanuman Bhatta Company, Kahlpa, Gohana"
                    fill
                    sizes="(max-width: 768px) 100vw, 42vw"
                    className="object-contain p-2 sm:p-3 transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Discreet Kiln Tags */}
                  <div className="absolute top-2.5 left-2.5 bg-[#242321]/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-xs tracking-wider uppercase">
                    Kahlpa Yard
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#B8402C] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
                    {flagshipBrick.gradeBadge}
                  </div>
                </div>

                {/* Sub-label identifying the genuine brick */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono px-0.5">
                  <span className="text-[#736F67]">Genuine Product Specimen</span>
                  <span className="text-[#B8402C] font-semibold">{flagshipBrick.name} ({flagshipBrick.hindiName})</span>
                </div>

                {/* Quality Notes */}
                <div className="mt-6 space-y-3 text-xs text-[#57544E]">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Rigorous Slow Firing:</strong> Heated uniformly for weeks in our continuous bull trench kiln to ensure structural toughness.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#B8402C] flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Metallic Ring Guarantee:</strong> Striking two bricks together yields a sharp ringing sound confirming zero internal voids.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Yard Note */}
              <div className="mt-6 pt-5 border-t border-[#E2DDD5] text-xs text-[#736F67]">
                <p>
                  <strong>Standard Tractor-Trolley Transit:</strong> Supplied in standard 3,000-brick trolley loads throughout Gohana, Sonipat, Rohtak, Panipat, and Jind.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* PHASE 5: PRODUCTS 02 TO 05 — ARCHITECTURAL EDITORIAL GRID */}
        {/* ============================================================== */}
        <div className="mb-14 sm:mb-18">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D1C7B6]">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#B8402C] font-semibold block">
                COMPREHENSIVE KILN GRADES
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
                General Masonry, Economical &amp; Utility Grades
              </h3>
            </div>
            <span className="text-xs font-mono text-[#736F67] hidden sm:block">
              Grades 1.5, 2, 3 &amp; 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryBricks.map((brick) => {
              const displayPrice =
                pricingMode === 'brick'
                  ? `₹${brick.pricePerBrick.toFixed(2)}`
                  : `₹${brick.pricePer1000.toLocaleString('en-IN')}`;
              const unitLabel = pricingMode === 'brick' ? 'per brick' : 'per 1,000';

              return (
                <div
                  key={brick.id}
                  className="bg-white border border-[#D1C7B6] hover:border-[#242321] rounded-sm p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-xs"
                >
                  <div>
                    {/* Header Strip */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5] mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FAF8F5] text-[#242321] border border-[#D1C7B6] rounded-xs">
                          {brick.number}
                        </span>
                        <span className="text-xs font-mono font-semibold uppercase text-[#B8402C]">
                          {brick.gradeBadge}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg sm:text-xl font-bold font-display text-[#242321]">
                          {displayPrice}
                        </span>
                        <span className="text-[10px] font-mono text-[#736F67] ml-1">
                          {unitLabel}
                        </span>
                      </div>
                    </div>

                    {/* Brick Name & Hindi */}
                    <div className="mb-3">
                      <h4 className="text-xl font-bold font-display text-[#242321] tracking-tight">
                        {brick.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-serif text-[#B8402C] font-semibold mt-0.5">
                        {brick.hindiName}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#57544E] leading-relaxed mb-4">
                      {brick.description}
                    </p>

                    {/* Architectural Placeholder / Visual Inspection Note */}
                    <div className="p-3 bg-[#FAF8F5] border border-dashed border-[#D1C7B6] rounded-xs mb-4 flex items-center gap-3">
                      <Camera className="w-4 h-4 text-[#736F67] flex-shrink-0" />
                      <span className="text-[11px] text-[#736F67] font-mono">
                        Actual kiln batch photo coming soon • Inspected on-site at Kahlpa
                      </span>
                    </div>

                    {/* Quick Specs Matrix */}
                    <div className="space-y-1.5 text-xs bg-[#FAF8F5] p-3 rounded-xs border border-[#EDE8DF] mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#736F67] flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-[#B8402C]" />
                          <span>Colour:</span>
                        </span>
                        <span className="font-medium text-[#242321] text-right">{brick.colour}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E2DDD5] pt-1.5">
                        <span className="text-[#736F67] flex items-center gap-1.5">
                          <Hammer className="w-3.5 h-3.5 text-[#B8402C]" />
                          <span>Strength:</span>
                        </span>
                        <span className="font-medium text-[#242321] text-right">{brick.strengthLevel}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E2DDD5] pt-1.5">
                        <span className="text-[#736F67] flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#B8402C]" />
                          <span>Strike Sound:</span>
                        </span>
                        <span className="font-medium text-[#242321] text-right">{brick.soundWhenStruck}</span>
                      </div>
                    </div>

                    {/* Key Characteristics */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block mb-2 font-semibold">
                        Characteristics &amp; Properties
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#383632]">
                        {brick.characteristics.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8402C] mt-1.5 flex-shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Applications */}
                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block mb-2 font-semibold">
                        Recommended Uses
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {brick.applications.map((app, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 bg-[#F5F0E8] border border-[#D1C7B6] text-[#42403B] rounded-xs"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & WhatsApp CTA */}
                  <div className="pt-4 border-t border-[#E2DDD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[11px] text-[#736F67] italic sm:max-w-[50%]">
                      {brick.positionNote}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppLink(brick)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xs text-xs font-medium transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Enquire</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenQuote(brick.name)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#242321] hover:bg-[#B8402C] text-white rounded-xs text-xs font-medium transition-colors"
                      >
                        <span>Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHASE 7: PRICE & ORDER DISCLAIMER */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-white border border-[#D1C7B6] rounded-sm mb-14 shadow-xs">
          <div className="flex items-start gap-3.5">
            <Info className="w-5 h-5 text-[#B8402C] flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs sm:text-sm text-[#57544E] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-[#242321] font-bold block">
                Pricing &amp; Delivery Terms Notice
              </span>
              <p>
                All prices are indicative and negotiable. Special rates may be available for bulk orders. Final pricing depends on order quantity and delivery distance from our Kahlpa kiln.
              </p>
              <p className="text-xs text-[#736F67]">
                Transportation charges may increase for distant delivery locations across Gohana, Sonipat, Rohtak, Panipat, and Jind. Contact our dispatch desk directly to negotiate bulk commercial rates.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHASE 8: COMPREHENSIVE PRODUCT COMPARISON TABLE */}
        {/* ============================================================== */}
        <div className="bg-white border border-[#D1C7B6] rounded-sm overflow-hidden mb-12 shadow-xs">
          <div className="p-5 sm:p-6 border-b border-[#E2DDD5] bg-[#FAF8F5]">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#B8402C] font-semibold block mb-1">
              SIDE-BY-SIDE EVALUATION
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Brick Grade Comparison Matrix
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Compare hardness, visual finish, sound test and ideal applications across all five manufactured grades.
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2DDD5] bg-[#F5F0E8] text-[#242321] font-mono">
                  <th className="p-4 font-semibold w-[16%]">Grade &amp; Name</th>
                  <th className="p-4 font-semibold w-[14%]">Hindi Title</th>
                  <th className="p-4 font-semibold w-[14%]">
                    Price ({pricingMode === 'brick' ? 'Per Brick' : 'Per 1,000'})
                  </th>
                  <th className="p-4 font-semibold w-[16%]">Colour &amp; Body</th>
                  <th className="p-4 font-semibold w-[14%]">Strength Level</th>
                  <th className="p-4 font-semibold w-[14%]">Strike Sound</th>
                  <th className="p-4 font-semibold w-[12%] text-right">Inquiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD5]">
                {liveBricks.map((brick) => {
                  const price =
                    pricingMode === 'brick'
                      ? `₹${brick.pricePerBrick.toFixed(2)}`
                      : `₹${brick.pricePer1000.toLocaleString('en-IN')}`;

                  return (
                    <tr
                      key={brick.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${
                        brick.featured ? 'bg-[#FFFDF9]' : ''
                      }`}
                    >
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#B8402C]">{brick.number}</span>
                          <div>
                            <span className="font-bold text-[#242321] block">{brick.name}</span>
                            <span className="font-mono text-[10px] text-[#736F67]">{brick.gradeBadge}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top font-serif font-medium text-[#42403B]">
                        {brick.hindiName}
                      </td>
                      <td className="p-4 align-top font-mono font-bold text-[#242321]">
                        {price}
                      </td>
                      <td className="p-4 align-top text-[#57544E]">
                        {brick.colour}
                      </td>
                      <td className="p-4 align-top text-[#242321] font-medium">
                        {brick.strengthLevel}
                      </td>
                      <td className="p-4 align-top text-[#57544E]">
                        {brick.soundWhenStruck}
                      </td>
                      <td className="p-4 align-top text-right">
                        <a
                          href={getWhatsAppLink(brick)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#1EBE5D] font-mono text-[11px] font-semibold hover:underline"
                        >
                          <span>Enquire</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison View (Accordion / Tab Switcher to prevent horizontal overflow) */}
          <div className="block lg:hidden p-4 sm:p-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#736F67] block mb-2 font-medium">
              Select Grade to Inspect:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4">
              {liveBricks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedMobileGrade(b.id)}
                  className={`px-2.5 py-2 text-xs font-mono rounded-xs transition-colors text-center ${
                    selectedMobileGrade === b.id
                      ? 'bg-[#242321] text-white font-bold'
                      : 'bg-[#F5F0E8] text-[#57544E] hover:bg-[#EAE4D9]'
                  }`}
                >
                  {b.number} {b.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Selected Grade Mobile Card */}
            {(() => {
              const activeGrade =
                liveBricks.find((b) => b.id === selectedMobileGrade) || liveBricks[0];
              const mobilePrice =
                pricingMode === 'brick'
                  ? `₹${activeGrade.pricePerBrick.toFixed(2)} per brick`
                  : `₹${activeGrade.pricePer1000.toLocaleString('en-IN')} per 1,000 bricks`;

              return (
                <div className="bg-[#FAF8F5] border border-[#D1C7B6] rounded-xs p-4 text-xs space-y-3">
                  <div className="flex items-start justify-between border-b border-[#E2DDD5] pb-2">
                    <div>
                      <span className="font-bold text-sm text-[#242321] block">
                        {activeGrade.name}
                      </span>
                      <span className="font-serif text-xs text-[#B8402C] font-semibold">
                        {activeGrade.hindiName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#242321]">
                      {mobilePrice}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#736F67] block">Colour:</span>
                      <span className="font-medium text-[#242321]">{activeGrade.colour}</span>
                    </div>
                    <div>
                      <span className="text-[#736F67] block">Strength:</span>
                      <span className="font-medium text-[#242321]">{activeGrade.strengthLevel}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#736F67] block">Strike Sound:</span>
                      <span className="font-medium text-[#242321]">{activeGrade.soundWhenStruck}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2DDD5] flex items-center justify-between">
                    <span className="text-[11px] text-[#736F67]">{activeGrade.gradeBadge}</span>
                    <a
                      href={getWhatsAppLink(activeGrade)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-xs font-mono text-xs font-medium"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* PHASE 9: Logistics & Direct Kiln Dispatch Contact Strip */}
        <div className="p-5 sm:p-6 bg-[#242321] text-white rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8402C] font-semibold block">
              DIRECT DISPATCH DESK • KAHLPA KILN
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Need Bulk Supply or Site-Delivered Tractor-Trolley Rates?
            </h4>
            <p className="text-xs sm:text-sm text-[#D1C7B6] max-w-2xl font-sans">
              Speak directly with our dispatch manager for immediate load scheduling, distance-based freight estimation, and bulk commercial orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919996694663"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#242321] hover:bg-[#F5F0E8] font-mono text-xs sm:text-sm font-bold rounded-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-[#B8402C]" />
              <span>+91 99966 94663</span>
            </a>
            <a
              href="https://wa.me/919996669463?text=Hello%20Hanuman%20Bhatta%20Company,%20I%20would%20like%20to%20enquire%20about%20brick%20pricing%20and%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-mono text-xs sm:text-sm font-semibold rounded-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
