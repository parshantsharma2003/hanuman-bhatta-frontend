'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Flame, Eye, Hammer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

const timelineEvents = [
  {
    year: '1998',
    title: 'Bhatta Started',
    description: 'We started with one kiln and a simple promise to make reliable bricks for nearby families.',
  },
  {
    year: '2005',
    title: 'Expanded Capacity',
    description: 'As local demand grew, we expanded carefully while keeping quality checks in our own hands.',
  },
  {
    year: '2015',
    title: 'Milestone Reached',
    description: 'Our bricks reached homes, walls, and small projects across villages and nearby towns.',
  },
  {
    year: 'Today',
    title: 'Trusted Partner',
    description: 'We continue with the same values: honest rates, clear communication, and dependable supply.',
  },
];

const qualityPoints = [
  {
    icon: Hammer,
    title: 'Proper Mitti Selection',
    description: 'We choose clay based on consistency, not on the cheapest option.',
    detail: 'This gives better shape and fewer breakages during use.',
  },
  {
    icon: Flame,
    title: 'Controlled Firing',
    description: 'Each batch is fired in a controlled cycle for steady strength.',
    detail: 'Even firing helps avoid weak or under-baked bricks.',
  },
  {
    icon: Eye,
    title: 'Manual Checking',
    description: 'We still inspect bricks by hand before dispatch.',
    detail: 'This helps us remove damaged pieces before they reach your site.',
  },
  {
    icon: CheckCircle2,
    title: 'No Shortcuts',
    description: 'We do not rush batches just to increase volume.',
    detail: 'Practical, consistent work matters more than marketing claims.',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-10 md:pb-14 bg-gradient-to-b from-sandy-50 to-white scroll-mt-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg text-charcoal-700 hover:text-terracotta hover:bg-sandy-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-charcoal-900 mb-6">
              The Story of Our <span className="text-gradient">Bhatta</span>
            </h1>
            <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed mb-5 max-w-2xl mx-auto">
              We are a family-run bhatta built to support real construction needs in our area with honest quality.
            </p>
            <p className="text-base md:text-lg text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
              Our work began with one kiln, local trust, and the belief that every family deserves bricks that last.
              That same belief still guides us every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-10 md:mb-14"
          >
            <h2 className="section-heading text-center mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-center text-charcoal-600 text-base md:text-lg max-w-2xl mx-auto">
              From a small dream to a trusted name in the region.
            </p>
          </motion.div>

          {/* Timeline Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
            {/* Timeline connector line (desktop only) */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-orange-600 to-transparent"></div>

            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative"
              >
                {/* Timeline dot (desktop only) */}
                <div className="hidden lg:block absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-terracotta rounded-full border-4 border-white z-10"></div>

                {/* Card */}
                <div className="bg-gradient-to-br from-sandy-50 to-white border-2 border-sandy-300 rounded-xl p-5 md:p-6 lg:pt-20 h-full">
                  <div className="mb-3 pb-3 border-b border-sandy-300/80">
                    <span className="inline-block text-4xl md:text-5xl font-extrabold font-display text-terracotta leading-none">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-charcoal-900 mb-2">{event.title}</h3>
                  <p className="text-charcoal-700 text-sm md:text-base leading-relaxed max-w-prose">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Family Section */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white via-sandy-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="order-1 lg:order-1"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-brick border-8 border-terracotta">
                <Image
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=600&fit=crop&q=80"
                  alt="Founder and family members standing together at Hanuman Bhatta"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 via-transparent to-transparent"></div>
              </div>
            </motion.div>

            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="order-2 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mb-6">
                From Our Family to Yours
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-charcoal-700 leading-relaxed">
                  Our founder started this bhatta with a simple belief: that quality bricks shouldn&apos;t be a luxury.
                  What began as a single kiln has grown into a respected source for families building their homes
                  and contractors building their dreams.
                </p>

                <p className="text-lg text-charcoal-700 leading-relaxed">
                  Today, our family still oversees every step of production. We know the names of the men who
                  work here. We understand their families depend on our success. And we take that responsibility
                  seriously — in every brick we make.
                </p>

                {/* Hindi Quote */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-br from-terracotta/15 to-orange-500/10 border-l-4 border-terracotta rounded-lg p-5 md:p-6 mt-8"
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-charcoal-600 mb-3">
                    Founder&rsquo;s Words
                  </p>
                  <p className="text-2xl md:text-3xl font-display italic text-terracotta mb-2 leading-relaxed">
                    &ldquo;हम हमेशा मजबूत और ईमानदार ईंट बनाने में विश्वास रखते हैं।&rdquo;
                  </p>
                  <p className="text-charcoal-600 text-sm md:text-base">
                    &ldquo;We always believe in making strong and honest bricks.&rdquo;
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Commitment Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-10 md:mb-14"
          >
            <h2 className="section-heading text-center mb-4">
              Why We Don&apos;t Compromise on <span className="text-gradient">Quality</span>
            </h2>
            <p className="text-center text-charcoal-600 text-base md:text-lg max-w-2xl mx-auto">
              Every decision we make comes down to one simple question: Is this the right thing to do for our customers?
            </p>
          </motion.div>

          {/* Quality Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
            {qualityPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-gradient-to-br from-sandy-50 to-white border-2 border-sandy-300 rounded-xl p-5 md:p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-terracotta/10">
                        <Icon className="h-6 w-6 text-terracotta" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-charcoal-900 mb-2">{point.title}</h3>
                      <p className="text-charcoal-700 leading-relaxed text-sm md:text-base mb-1">
                        {point.description}
                      </p>
                      <p className="text-charcoal-600 text-sm leading-relaxed">{point.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-terracotta/5 via-orange-500/5 to-terracotta/5 border border-terracotta/20 rounded-xl p-8 md:p-12 text-center"
          >
            <p className="text-xl md:text-2xl text-charcoal-800 font-display leading-relaxed">
              When you buy from us, you&apos;re not just buying bricks. <br />
              <span className="text-gradient font-bold">You&apos;re buying our reputation and our family&apos;s pride.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-sandy-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mb-6">
              Ready to Work with Us?
            </h2>
            <p className="text-lg text-charcoal-700 mb-10 max-w-2xl mx-auto">
              Whether you need bricks for your home or a large construction project, we&apos;re here to help.
              Give us a call or place your order today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919876543210"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
              <a
                href="tel:+919876543210"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
