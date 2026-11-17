'use client';

import React from 'react';
import { MapPin, Check } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  projectType: string;
  text: string;
  isVerified: boolean;
  isActive: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 'testimonial-001',
    name: 'Ramesh Kumar',
    location: 'Gohana',
    projectType: 'House Construction',
    text: 'Grade-1 (Avval) bricks for our 2-story residential house in Gohana were uniform in dimension and had sharp edges. The tractor-trolley delivery arrived exactly on schedule with zero transit breakage.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-002',
    name: 'Vikram Singh',
    location: 'Sonipat Road',
    projectType: 'Commercial Boundary',
    text: 'Procured 12 trolleys for our boundary and partition masonry. Consistency across batches was remarkable, and direct kiln pricing saved significant margin compared to retail dealers.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-003',
    name: 'Ajay Yadav',
    location: 'Rohtak Belt',
    projectType: 'Structural Framing',
    text: 'Solid compressive strength and a distinctive metallic ring when struck. Our head mason specifically commended the mortar bonding quality of these red clay bricks.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-004',
    name: 'Sunita Devi',
    location: 'Baroda',
    projectType: 'Residential Wall',
    text: 'Ordered Grade-2 bricks for our perimeter wall. Excellent strength, minimal efflorescence, and very fair trolley delivery rates from their Kahlpa yard.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-005',
    name: 'Priya Joshi',
    location: 'Mundlana',
    projectType: 'Partition Masonry',
    text: 'Straightforward ordering through the dispatch desk. The bricks were clean, dense, and well-seasoned. Would recommend to any builder looking for direct kiln supply.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-006',
    name: 'Mohini Kumari',
    location: 'Jind Road',
    projectType: 'Residential Construction',
    text: 'First time ordering directly from Hanuman Bhatta Company. The kiln firing quality and uniform red color throughout the batch was impressive.',
    isVerified: true,
    isActive: true,
  },
];

export default function Testimonials({
  title = 'Customer Verification & Feedback',
  subtitle = 'Documented site delivery experiences from builders, contractors, and property owners in Haryana.',
  limit = undefined,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
} = {}) {
  const activeTestimonials = testimonials.filter((t) => t.isActive).slice(0, limit);

  return (
    <section className={`py-20 md:py-28 bg-[#F5F0E8] border-b border-[#E2DDD5] ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 md:mb-18">
          <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
            Direct Delivery Records
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
            {title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border border-[#E2DDD5] rounded p-7 sm:p-8 flex flex-col justify-between hover:border-[#B8402C] transition-colors"
            >
              <div>
                {/* Project Tag */}
                <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-5">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#736F67]">
                    {testimonial.projectType}
                  </span>
                  {testimonial.isVerified && (
                    <span className="text-[10px] font-mono text-[#B8402C] flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      <span>Verified Order</span>
                    </span>
                  )}
                </div>

                {/* Quote Body */}
                <p className="text-sm text-[#42403B] leading-relaxed mb-6 font-normal">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              {/* Author & Location */}
              <div className="pt-4 border-t border-[#EDE8DF] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display text-[#242321]">
                    {testimonial.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#736F67] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B8402C]" />
                    <span>{testimonial.location}, Haryana</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact Prompt */}
        <div className="mt-14 pt-8 border-t border-[#E2DDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#736F67]">
            Looking for references for commercial or residential supply in your sector?
          </p>
          <a
            href="tel:+919996669463"
            className="text-xs font-mono font-semibold text-[#B8402C] hover:underline"
          >
            Speak with Kiln Dispatch: +91 99966 69463 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
