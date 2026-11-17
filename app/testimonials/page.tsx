'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Testimonials from '@/components/Testimonials';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TestimonialsPage() {
  return (
    <main className="bg-white">
      {/* Header Section */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-gradient-to-b from-sandy-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-dark font-semibold mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-lg px-3 py-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-charcoal-900 mb-6">
              What Our <span className="text-gradient">Customers Say</span>
            </h1>

            <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed mb-8">
              Real voices from builders, contractors, and families across Gohana, Sonipat, Rohtak, Jind, and nearby Haryana areas who trust Hanuman Bhatta Company for their brick supply needs. Every testimonial reflects authentic customer experiences.
            </p>

            <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded p-6 text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-[#736F67]">
                Supplying residential, commercial, and agricultural construction masonry throughout Gohana &amp; neighboring Haryana districts since 2010
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Testimonials */}
      <Testimonials
        title="All Customer Testimonials"
        subtitle="Browse through hundreds of verified customer reviews"
        limit={undefined} // Show all testimonials
      />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-sandy-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mb-6">
              Ready to Join Our Loyal Customers?
            </h2>

            <p className="text-lg text-charcoal-700 mb-10">
              Whether you&apos;re building your dream home, expanding your business, or managing a large construction project,
              we have the quality bricks and support you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919876543210"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+919876543210"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
              >
                Call US Now
              </a>
            </div>

            <p className="text-sm text-charcoal-500 mt-8">
              Our team is available Monday to Saturday, 9 AM to 6 PM
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
