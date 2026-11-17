'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { FAQ_DATA, type FaqItem } from '@/lib/faqData';

export type { FaqItem };
export { FAQ_DATA };

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-28 bg-[#F5F0E8] border-b border-[#E2DDD5] scroll-mt-20"
      aria-label="Frequently Asked Questions & Purchasing Guidelines"
    >
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
            Technical Guidelines &amp; Direct Supply FAQs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-[#242321] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#57544E] leading-relaxed">
            Essential facts on brick grading, kiln pricing, trolley capacity, and structural verification for construction projects in Gohana and Haryana.
          </p>
        </div>

        {/* Clean Architectural Accordion */}
        <div className="border-t border-[#E2DDD5] divide-y divide-[#E2DDD5] bg-white rounded border">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-6 font-display font-bold text-base sm:text-lg text-[#242321] hover:text-[#B8402C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="flex-1">{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded border border-[#E2DDD5] flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#242321] text-white border-[#242321]' : 'text-[#736F67]'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="px-6 sm:px-8 pb-6 text-[#57544E] text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Direct Inquiries Callout */}
        <div className="mt-12 p-7 sm:p-8 bg-[#242321] text-white rounded border border-[#31302C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              Have Specific Site or Delivery Questions?
            </h3>
            <p className="text-sm text-[#BCB7AD]">
              Speak directly with our kiln dispatch team for custom delivery timelines and bulk order pricing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919996669463"
              className="inline-flex items-center gap-2 bg-[#B8402C] hover:bg-[#8E2E1D] text-white font-medium px-5 py-2.5 rounded transition-colors text-sm"
            >
              <Phone size={14} />
              <span>Call 99966 69463</span>
            </a>
            <a
              href="https://wa.me/918295669463?text=Hello%20Hanuman%20Bhatta,%20I%20have%20a%20question%20regarding%20brick%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#42403B] hover:border-white text-white font-medium px-5 py-2.5 rounded transition-colors text-sm"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
