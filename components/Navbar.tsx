'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

const navLinks = [
  { name: 'Specifications', href: '/#products' },
  { name: 'Manufacturing', href: '/#process' },
  { name: 'Brick Calculator', href: '/#calculator' },
  { name: 'Kiln Facility', href: '/#gallery' },
  { name: 'Buyer FAQ', href: '/#faq' },
  { name: 'Contact & Map', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2DDD5] shadow-[0_1px_3px_rgba(36,35,33,0.04)]'
          : 'bg-white border-b border-[#E2DDD5]'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Brand Identity / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] rounded py-1"
            aria-label="Hanuman Bhatta Company - Return to Homepage"
          >
            {/* Proportionally accurate Brick Emblem (9" x 4.25" ratio ~ 2.1:1) */}
            <div
              className="w-11 h-6 bg-[#B8402C] rounded-[2px] flex items-center justify-center text-white text-[11px] font-mono font-bold tracking-widest shadow-xs group-hover:bg-[#8E2E1D] transition-colors flex-shrink-0"
              aria-hidden="true"
            >
              HB
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-bold font-display tracking-tight text-[#242321] group-hover:text-[#B8402C] transition-colors leading-tight">
                Hanuman Bhatta Company
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#A9A39A] tracking-wider uppercase leading-none mt-0.5">
                Kahlpa, Gohana • Estd. 2010
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Desktop Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-semibold tracking-wider uppercase text-[#42403B] hover:text-[#B8402C] transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] rounded"
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={handleOrderClick}
              className="inline-flex items-center gap-2 bg-[#B8402C] hover:bg-[#8E2E1D] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-[4px] transition-colors duration-150 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] focus-visible:ring-offset-2"
              aria-label="Request a quote for brick orders"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Toggle Button (Minimum 44px touch target) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2.5 rounded-[4px] text-[#242321] hover:bg-[#F5F0E8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C] min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMenu}
              className="lg:hidden fixed inset-0 top-[72px] bg-black/40 backdrop-blur-xs z-40"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="lg:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-[#E2DDD5] shadow-xl z-50 px-6 py-6"
            >
              <nav className="flex flex-col space-y-1 mb-6" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3 text-sm font-medium text-[#242321] hover:text-[#B8402C] border-b border-[#FAF8F5] transition-colors min-h-[44px]"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#A9A39A]" />
                  </Link>
                ))}
              </nav>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleOrderClick}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B8402C] hover:bg-[#8E2E1D] text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-4 rounded-[4px] transition-colors min-h-[44px]"
                >
                  <span>Request Kiln Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] font-mono text-[#A9A39A] text-center">
                  Direct Dispatch: +91 99966 69463
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
