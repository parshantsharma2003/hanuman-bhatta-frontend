'use client';

import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { trackMetric } from '@/lib/analytics';
import { useState } from 'react';
import FooterRatingBar from './FooterRatingBar';
import ReviewModal from './ReviewModal';

const quickLinks = [
  { name: 'Products & Grades', href: '/#products' },
  { name: 'Kiln Process', href: '/#process' },
  { name: 'Brick Calculator', href: '/#calculator' },
  { name: 'Buyer FAQs', href: '/#faq' },
  { name: 'About the Bhatta', href: '/about' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Customer Reviews', href: '/reviews' },
  { name: 'Kiln Yard & Directions', href: '/#contact' },
];

const contactInfo = {
  phone: '+91 99966 69463',
  email: 'info@hanumanbhatta.com',
  address: 'Kahlpa-Bhanderi Road, V.P.O. Kahlpa, Gohana, Sonipat, Haryana 131301',
  whatsapp: '919996669463',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#171615] text-[#F5F0E8] border-t border-[#31302C]">
        <FooterRatingBar />

        <div className="container-custom py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#31302C]">
            
            {/* Col 1: Brand & Mission (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 bg-[#B8402C] rounded-[2px] flex items-center justify-center text-white text-[10px] font-mono font-bold tracking-wider">
                  HB
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  Hanuman Bhatta Company
                </h3>
              </div>
              <p className="text-xs text-[#969188] leading-relaxed max-w-sm">
                Red clay brick manufacturing &amp; direct kiln dispatch in Kahlpa, Gohana. Supplying high-compressive-strength Grade-1 and Grade-2 bricks across Haryana since 2010.
              </p>
              <div className="pt-2 text-xs font-mono text-[#736F67]">
                Registration: V.P.O. Kahlpa, Gohana (Haryana) 131301
              </div>
            </div>

            {/* Col 2: Navigation (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#BCB7AD]">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#969188] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-terracotta hover:underline transition-colors"
                  >
                    Write a Review &rarr;
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Specifications & Regions (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#BCB7AD]">
                Dispatch Radius
              </h4>
              <ul className="space-y-1.5 text-xs text-[#969188]">
                <li>Gohana Region</li>
                <li>Sonipat Belt</li>
                <li>Rohtak Road</li>
                <li>Jind &amp; Safidon</li>
                <li>Baroda &amp; Mundlana</li>
                <li>Panipat Rural</li>
              </ul>
            </div>

            {/* Col 4: Kiln Contact (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#BCB7AD]">
                Direct Kiln Desk
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  onClick={() => trackMetric('call_click')}
                  className="flex items-center gap-2 text-white hover:text-terracotta font-mono font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-terracotta" />
                  <span>{contactInfo.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=Hello%20Hanuman%20Bhatta,%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackMetric('whatsapp_click')}
                  className="flex items-center gap-2 text-[#969188] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp Chat</span>
                </a>
                <div className="flex items-start gap-2 text-[#969188] pt-2">
                  <MapPin className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Kahlpa-Bhanderi Road, Gohana - 131301</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Legal Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736F67]">
            <p>
              &copy; 2010 &ndash; {currentYear} Hanuman Bhatta Company. All rights reserved.
            </p>
            <p className="text-[11px] font-mono">
              Grade-1 &amp; Grade-2 Red Clay Bricks • IS:1077 Standard
            </p>
          </div>
        </div>
      </footer>

      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </>
  );
}
