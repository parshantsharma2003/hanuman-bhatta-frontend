'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { FAQ_DATA, type FaqItem } from '@/lib/faqData';

export type { FaqItem };
export { FAQ_DATA };

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-white via-sandy-50 to-white scroll-mt-20">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 text-terracotta font-semibold text-xs md:text-sm uppercase tracking-wider mb-3">
            <HelpCircle size={16} />
            Frequently Asked Questions &amp; Brick Buying Guide
          </div>
          <h2 className="section-heading">
            Everything You Need to Know About <span className="text-gradient">Brick Supply in Gohana</span>
          </h2>
          <p className="section-subheading mx-auto">
            Clear, factual answers on red clay brick grades, kiln pricing, trolley delivery, and quality checks in Gohana, Haryana.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border-2 border-sandy-300 rounded-2xl overflow-hidden shadow-brick transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-charcoal hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="flex-1">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'bg-terracotta text-white rotate-180' : 'bg-sandy-100 text-charcoal-600'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-7 pb-5 sm:pb-6 text-charcoal-700 text-sm sm:text-base leading-relaxed border-t border-sandy-200 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-white rounded-2xl shadow-brick-lg flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-terracotta/40">
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              Have Specific Construction Questions?
            </h3>
            <p className="text-sandy-200 text-sm">
              Our kiln managers provide free brick estimation and direct site quotes for Gohana &amp; Haryana builders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+919996669463"
              className="inline-flex items-center gap-2 bg-white text-charcoal-900 hover:bg-sandy-100 font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              <Phone size={16} className="text-terracotta" />
              <span>Call 99966 69463</span>
            </a>
            <a
              href="https://wa.me/919996669463?text=Hello%20Hanuman%20Bhatta,%20I%20have%20a%20question%20regarding%20brick%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
