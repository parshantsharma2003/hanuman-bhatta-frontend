'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

const navLinks = [
  { name: 'Products', href: '/#products' },
  { name: 'Process', href: '/#process' },
  { name: 'Calculator', href: '/#calculator' },
  { name: 'Gallery', href: '/#gallery' },
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
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 bg-white border-b ${
        isScrolled ? 'border-[#D1C7B6] shadow-sm' : 'border-[#E2DDD5]'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
            aria-label="Hanuman Bhatta Company - Return to Home"
          >
            {/* Architectural Brick Glyph */}
            <div className="w-10 h-7 bg-[#B8402C] rounded-[2px] flex items-center justify-center text-white text-[11px] font-mono font-bold tracking-wider shadow-sm group-hover:bg-[#8E2E1D] transition-colors">
              HB
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-[#242321] group-hover:text-[#B8402C] transition-colors leading-tight">
                Hanuman Bhatta Company
              </span>
              <span className="text-[11px] font-mono text-[#736F67] tracking-wider uppercase">
                Kahlpa, Gohana • Estd. 2010
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#42403B] hover:text-[#B8402C] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={handleOrderClick}
              className="bg-[#B8402C] hover:bg-[#8E2E1D] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
              aria-label="Get a quote for brick orders"
            >
              Request Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded text-[#242321] hover:bg-[#F5F0E8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8402C]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#E2DDD5] px-6 py-6 space-y-4">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 text-base font-medium text-[#242321] hover:text-[#B8402C] border-b border-[#FAF8F5]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleOrderClick}
              className="w-full bg-[#B8402C] hover:bg-[#8E2E1D] text-white text-sm font-semibold py-3 rounded text-center transition-colors"
            >
              Request Kiln Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
