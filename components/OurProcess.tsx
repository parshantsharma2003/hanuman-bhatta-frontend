'use client';

import React from 'react';
import { Shapes, Sun, Flame, ArrowRight } from 'lucide-react';
import ProcessCard from './ProcessCard';

const processSteps = [
  {
    id: 1,
    icon: Shapes,
    title: 'Clay Sourcing & Precision Molding',
    titleHindi: 'मिट्टी की तैयारी और सांचा ढलाई',
    description:
      'High-grade alluvial clay extracted from the Kahlpa basin is stone-screened, tempered with water in our pug mills, and hand-cast into uniform dimensions with sharp 90-degree edges.',
    details: ['Alluvial Clay Selection', 'Pug-Mill Blending', 'Dimensional Hand-Casting'],
  },
  {
    id: 2,
    icon: Sun,
    title: 'Controlled Natural Seasoning',
    titleHindi: 'धूप में सुखाना व नमी नियंत्रण',
    description:
      'Green raw bricks are stacked in open-air hack formations across our drying yards. Controlled wind and sun exposure removes moisture down to below 2%, eliminating kiln cracks and warping.',
    details: ['Staggered Hack Stacking', 'Moisture Evaporation < 2%', 'Edge & Surface Inspection'],
  },
  {
    id: 3,
    icon: Flame,
    title: 'High-Heat Firing & Manual Grading',
    titleHindi: 'भट्ठी में पकाई और ग्रेडिंग',
    description:
      'Fired in continuous Bull’s Trench kilns at 1000°C for complete vitrification. Once cooled, every brick is individually sorted into Grade-1 (अव्वल), Grade-2 (दोयम), and Rora bats.',
    details: ['1000°C Coal Vitrification', 'Acoustic Metallic Ring Check', 'Class-1 & Class-2 Sorting'],
  },
];

export default function OurProcess() {
  return (
    <section
      id="process"
      className="py-20 md:py-28 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-20"
      aria-label="Manufacturing process section"
    >
      <div className="container-custom">
        {/* Section Header: Editorial & Technical */}
        <div className="max-w-3xl mb-14 md:mb-18">
          <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
            Kiln Operations &amp; Quality Control
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
            How Our Bricks Are Manufactured
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
            From raw alluvial clay to vitrified red bricks, our three-phase production cycle ensures structural density, crisp edges, and consistent load-bearing capability.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <ProcessCard
              key={step.id}
              step={step}
              index={index}
            />
          ))}
        </div>

        {/* Technical Process Note */}
        <div className="mt-12 pt-8 border-t border-[#E2DDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#736F67] max-w-xl">
            All bricks manufactured at our Kahlpa kiln comply with regional IS:1077 building standards for red clay bricks.
          </p>
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8402C] hover:text-[#8E2E1D] transition-colors"
          >
            <span>Estimate required brick count for your project</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
