'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/#products' },
  { name: 'Process', href: '/#process' },
  { name: 'Calculator', href: '/#calculator' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
    setIsOpen(false); // Close mobile menu if open
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-brick-lg border-b-2 border-terracotta'
          : 'bg-white/95 backdrop-blur-sm shadow-brick'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Text-Based Brick Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-lg" aria-label="Hanuman Bhatta - Home">
            <div className="relative">
              {/* Brick Logo Icon */}
              <div className="relative bg-gradient-to-br from-terracotta to-terracotta-dark px-3 py-2 rounded border-2 border-terracotta-dark shadow-brick group-hover:shadow-brick-lg transition-all">
                <div className="text-sandy font-bold text-sm tracking-tighter leading-none font-display">
                  BRICK
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent rounded"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold font-display text-charcoal group-hover:text-terracotta transition-colors">
                Hanuman Bhatta
              </span>
              <span className="text-xs text-charcoal-600 font-medium tracking-wide">
                Eent Bhatta - Clay Bricks
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-charcoal hover:text-terracotta font-medium transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded px-2 py-1"
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* CTA Button */}
            <button
              onClick={handleOrderClick}
              className="bg-terracotta hover:bg-terracotta-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-brick hover:shadow-brick-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              aria-label="Get a quote for brick orders"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-sandy-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-20 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-charcoal hover:bg-sandy-100 hover:text-terracotta font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset"
                      aria-label={`Navigate to ${link.name}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Language Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 flex justify-center"
                >
                  <LanguageToggle />
                </motion.div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleOrderClick}
                    className="w-full text-center bg-terracotta hover:bg-terracotta-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-brick"
                  >
                    Get Quote
                  </button>
                </motion.div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sandy-100 to-transparent">
                <div className="text-center">
                  <p className="text-sm text-charcoal-600 mb-2">
                    Building dreams, one brick at a time
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-1 bg-terracotta rounded"></div>
                    <div className="px-2 py-0.5 bg-terracotta rounded text-sandy text-xs font-bold font-display">
                      BRICK
                    </div>
                    <div className="w-8 h-1 bg-terracotta rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
