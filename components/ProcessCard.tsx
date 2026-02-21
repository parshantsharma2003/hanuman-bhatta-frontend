'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ProcessCardProps {
  step: {
    id: number;
    icon: LucideIcon;
    title: string;
    titleHindi: string;
    description: string;
    details: string[];
    color: string;
    iconBg: string;
  };
  index: number;
  isActive?: boolean;
  variants?: any;
  totalSteps?: number;
}

export default function ProcessCard({
  step,
  index,
  isActive = false,
  variants,
  totalSteps = 3,
}: ProcessCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      variants={variants || {}}
      className={`group relative bg-white rounded-2xl shadow-brick transition-all duration-300 overflow-hidden border-2 h-full flex flex-col ${
        isActive
          ? 'border-terracotta shadow-lg scale-100 ring-2 ring-terracotta/20'
          : 'border-sandy-300 hover:border-terracotta hover:shadow-brick-lg'
      }`}
      aria-label={`Step ${step.id}: ${step.title}`}
      role="article"
    >
      {/* Step Number Badge */}
      <div
        className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
          isActive
            ? 'bg-terracotta border-terracotta text-white'
            : 'bg-sandy-200 border-sandy-400 text-charcoal'
        }`}
      >
        <span className="text-xl font-bold font-display">
          {String(step.id).padStart(2, '0')}
        </span>
      </div>

      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${step.color} transition-opacity duration-300 ${
          isActive ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'
        }`}
      ></div>

      <div className="relative p-6 md:p-8 space-y-5 flex-1 flex flex-col">
        {/* Icon */}
        <div className="relative inline-block">
          <motion.div
            className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${step.iconBg}`}
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            whileHover={!isActive ? { scale: 1.05 } : {}}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          {/* Icon glow effect */}
          <div
            className={`absolute inset-0 ${step.iconBg} rounded-xl blur-xl opacity-20 transition-opacity duration-300 ${
              isActive ? 'opacity-40' : 'group-hover:opacity-30'
            }`}
          ></div>
        </div>

        {/* Title Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-charcoal font-display mb-1">
            {step.title}
          </h3>
          <p className="text-terracotta font-medium italic text-sm md:text-base">
            {step.titleHindi}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-charcoal-700 leading-relaxed text-sm md:text-base flex-1"
          role="contentinfo"
        >
          {step.description}
        </p>

        {/* Details List */}
        <div className="space-y-2 pt-4 border-t-2 border-sandy-300">
          {step.details.map((detail, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-2"
              animate={isActive ? { x: 4 } : { x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0"></div>
              <span className="text-xs md:text-sm text-charcoal-600 font-medium">
                {detail}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Arrow Indicator (desktop only, except last card) */}
        {index < totalSteps - 1 && (
          <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center shadow-brick-lg"
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom accent stripe */}
      <motion.div
        className={`h-2 bg-gradient-to-r ${step.color}`}
        animate={isActive ? { scaleX: 1, opacity: 1 } : { scaleX: 0.9, opacity: 0.7 }}
        transition={{ duration: 0.3 }}
      ></motion.div>
    </motion.div>
  );
}
