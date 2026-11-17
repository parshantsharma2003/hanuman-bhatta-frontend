'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shapes, Sun, Flame, ArrowRight, Pause, Play } from 'lucide-react';
import ProcessCard from './ProcessCard';

const processSteps = [
  {
    id: 1,
    icon: Shapes,
    title: 'Molding',
    titleHindi: 'Mittī se Eent Banana',
    description: 'Premium clay is carefully selected and molded into precise brick shapes using traditional techniques combined with modern machinery.',
    details: ['Clay Selection', 'Mixing & Tempering', 'Precision Molding'],
    color: 'from-terracotta-600 to-terracotta-700',
    iconBg: 'bg-terracotta',
  },
  {
    id: 2,
    icon: Sun,
    title: 'Drying',
    titleHindi: 'Suraj mein Sukhaana',
    description: 'Molded bricks are naturally sun-dried for optimal moisture removal, ensuring structural integrity and preventing cracks.',
    details: ['Natural Sun Drying', 'Controlled Environment', 'Quality Monitoring'],
    color: 'from-amber-600 to-orange-600',
    iconBg: 'bg-amber-600',
  },
  {
    id: 3,
    icon: Flame,
    title: 'Firing',
    titleHindi: 'Bhatti mein Pakana',
    description: 'Bricks are fired in our traditional kilns at precise temperatures, transforming raw clay into durable, premium-quality building blocks.',
    details: ['Kiln Preparation', 'High-Temperature Firing', 'Cooling & Grading'],
    color: 'from-orange-700 to-red-700',
    iconBg: 'bg-orange-700',
  },
];

export default function OurProcess() {
  const ref = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const containerInViewRef = useRef(false);

  // State for mobile auto-scroll
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // IntersectionObserver to guard horizontal scroll - only scroll if visible
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        containerInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(scrollContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle auto-scroll on mobile
  useEffect(() => {
    if (!isAutoScrolling || prefersReducedMotion.current) return;

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % processSteps.length);
      }, 4000); // 4 seconds between steps
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, [isAutoScrolling]);

  // Scroll horizontally to active card on mobile (NEVER scroll page vertically)
  useEffect(() => {
    if (!scrollContainerRef.current || !containerInViewRef.current) return;

    // Check if on mobile (less than lg breakpoint)
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('[data-card]');
    if (cards[activeStep]) {
      const card = cards[activeStep] as HTMLElement;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Calculate position to center card in viewport
      const targetScroll = cardLeft - (containerWidth - cardWidth) / 2;

      // Use scrollTo with smooth behavior for HORIZONTAL ONLY scrolling
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [activeStep]);

  // Pause auto-scroll when user manually scrolls
  const handleUserInteraction = () => {
    setIsPaused(true);
    setIsAutoScrolling(false);

    // Resume auto-scroll after 8 seconds of inactivity
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
      setIsPaused(false);
    }, 8000);
  };

  const handleToggleAutoScroll = () => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
      setIsPaused(true);
    } else {
      setIsAutoScrolling(true);
      setIsPaused(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="process"
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-sandy-50 via-white to-sandy-50 relative overflow-hidden scroll-mt-20"
      aria-label="Manufacturing process section"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 brick-pattern opacity-[0.02]"></div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-heading">
            Our Manufacturing <span className="text-gradient">Process</span>
          </h2>
          <p className="section-subheading mx-auto">
            Traditional craftsmanship meets modern precision in every brick we produce
          </p>
        </motion.div>

        {/* Process Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Desktop: Grid View with Timeline */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <ProcessCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={false}
                  variants={cardVariants}
                  totalSteps={processSteps.length}
                />
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Horizontal Auto-Scroll View */}
          <div className="lg:hidden">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-medium text-charcoal-600">
                Step {activeStep + 1} of {processSteps.length}
              </div>
              <button
                onClick={handleToggleAutoScroll}
                className="p-2 rounded-lg bg-sandy-100 hover:bg-sandy-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                aria-label={isAutoScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                aria-pressed={!isAutoScrolling}
              >
                {isAutoScrolling ? (
                  <Pause className="w-4 h-4 text-charcoal" />
                ) : (
                  <Play className="w-4 h-4 text-charcoal" />
                )}
              </button>
            </div>

            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
              onScroll={handleUserInteraction}
              onTouchStart={handleUserInteraction}
              role="region"
              aria-label="Manufacturing process steps carousel"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  data-card
                  className="flex-none w-[90vw] sm:w-[90vw] md:w-[460px] snap-center"
                  animate={
                    activeStep === index && !prefersReducedMotion.current
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0.6, scale: 0.95 }
                  }
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <ProcessCard
                    step={step}
                    index={index}
                    isActive={activeStep === index}
                    variants={cardVariants}
                    totalSteps={processSteps.length}
                  />
                </motion.div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {processSteps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index);
                    handleUserInteraction();
                  }}
                  className={`transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-full ${
                    activeStep === index
                      ? 'bg-terracotta w-3 h-3'
                      : 'bg-charcoal-300 w-2 h-2 hover:bg-charcoal-400'
                  }`}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                  aria-current={activeStep === index ? 'step' : undefined}
                  animate={activeStep === index ? { scale: 1.2 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            {/* Auto-scroll indicator */}
            {isAutoScrolling && !isPaused && (
              <motion.div
                className="flex justify-center mt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-charcoal-500 italic">
                  Auto-scroll enabled
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-dark font-semibold group transition-colors"
          >
            Calculate your brick requirements
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
