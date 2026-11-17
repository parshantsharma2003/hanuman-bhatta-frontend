'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProcessCardProps {
  step: {
    id: number;
    icon: LucideIcon;
    title: string;
    titleHindi: string;
    description: string;
    details: string[];
  };
  index: number;
}

export default function ProcessCard({
  step,
  index,
}: ProcessCardProps) {
  const Icon = step.icon;

  return (
    <div
      className="bg-white border border-[#E2DDD5] rounded p-7 sm:p-8 flex flex-col justify-between h-full transition-colors duration-200 hover:border-[#B8402C]"
      aria-label={`Process Step ${step.id}: ${step.title}`}
    >
      <div>
        {/* Step Header: Typographic Number & Icon */}
        <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-5 mb-6">
          <span className="font-mono text-2xl font-bold text-[#B8402C]">
            0{step.id}
          </span>
          <div className="w-10 h-10 rounded border border-[#E2DDD5] flex items-center justify-center text-[#242321]">
            <Icon className="w-5 h-5 text-[#B8402C]" />
          </div>
        </div>

        {/* Titles */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321] tracking-tight">
            {step.title}
          </h3>
          <p className="text-xs font-medium text-[#736F67] mt-1 tracking-wide">
            {step.titleHindi}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#57544E] leading-relaxed mb-6 font-normal">
          {step.description}
        </p>
      </div>

      {/* Technical Checkpoints */}
      <div className="border-t border-[#EDE8DF] pt-5 space-y-2.5">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#969188] block mb-2">
          Quality Milestones
        </span>
        {step.details.map((detail, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-[#42403B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8402C] flex-shrink-0"></span>
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
