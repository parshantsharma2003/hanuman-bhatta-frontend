'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { trackMetric } from '@/lib/analytics';
import { useState } from 'react';
import FooterRatingBar from './FooterRatingBar';
import ReviewModal from './ReviewModal';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/#products' },
  { name: 'Calculator', href: '/#calculator' },
  { name: 'Contact', href: '/#contact' },
  { name: 'About the Bhatta', href: '/about' },
  { name: 'Customer Testimonials', href: '/testimonials' },
  { name: 'View All Reviews', href: '/reviews' },
];

const contactInfo = {
  phone: '+91 8295669463', // Replace with actual phone
  email: 'info@hanumanbhatta.com',
  address: 'Kahlpa-Bhanderi road, v.p.o Kahlpa, Gohana, Sonipat, Haryana 131301',
  whatsapp: '+91 8295669463', // Replace with actual WhatsApp number (no + or spaces)
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
    <footer className="relative bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 brick-pattern opacity-5"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sandy opacity-5 rounded-full blur-3xl"></div>

      <FooterRatingBar />

      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 py-8 md:py-12 border-b border-charcoal-700">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative bg-gradient-to-br from-terracotta to-terracotta-dark px-3 py-2 rounded border-2 border-terracotta-dark shadow-brick">
                <div className="text-sandy font-bold text-sm tracking-tighter leading-none font-display">
                  BRICK
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent rounded"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-terracotta font-display">Hanuman Bhatta </h3>
                <p className="text-xs text-sandy-300">Eent Bhatta - Clay Bricks</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sandy-200 text-sm leading-relaxed">
              Premium quality red clay brick manufacturing for all your construction needs. 
              Building dreams with tradition and excellence since 2010.
            </p>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/20 border border-terracotta/30 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-terracotta rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-sandy-100">
                15+ Years of Excellence
              </span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-terracotta rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sandy-200 hover:text-terracotta transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1 inline-block"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-sandy-200 hover:text-terracotta transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1 inline-block min-h-[44px]"
                  aria-label="Write a quick review"
                >
                  Write a Quick Review
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-terracotta rounded-full"></div>
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  onClick={() => trackMetric('call_click')}
                  className="group flex items-start gap-3 text-sandy-200 hover:text-terracotta transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1"
                  aria-label={`Call us at ${contactInfo.phone}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0 group-hover:bg-terracotta/20 transition-colors">
                    <Phone className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-sandy-400 mb-0.5">Call Us</p>
                    <p className="text-sm font-semibold">{contactInfo.phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-start gap-3 text-sandy-200 hover:text-terracotta transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1"
                  aria-label={`Email us at ${contactInfo.email}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0 group-hover:bg-terracotta/20 transition-colors">
                    <Mail className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-sandy-400 mb-0.5">Email</p>
                    <p className="text-sm font-semibold break-all">{contactInfo.email}</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sandy-200">
                <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-terracotta" />
                </div>
                <div>
                  <p className="text-xs text-sandy-400 mb-0.5">Location</p>
                  <p className="text-sm">{contactInfo.address}</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-terracotta rounded-full"></div>
              Get in Touch
            </h4>
            
            <div className="bg-gradient-to-br from-terracotta/20 to-terracotta-dark/20 border-2 border-terracotta/30 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-terracotta" />
                <span className="text-sm font-semibold text-white">Quick Response on WhatsApp</span>
              </div>
              
              <p className="text-xs text-sandy-200 leading-relaxed">
                Get instant quotes, product details, and expert advice directly on WhatsApp
              </p>

              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Hanuman%20Bhatta,%20I'm%20interested%20in%20your%20brick%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMetric('whatsapp_click')}
                className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-bold py-3 px-6 rounded-lg shadow-brick hover:shadow-brick-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sandy focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
                aria-label="Chat with us on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <p className="text-xs text-sandy-300 text-center">
                Available Mon-Sat, 8 AM - 6 PM
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <p className="text-sandy-300 text-sm text-center md:text-left">
            &copy; {currentYear} <span className="font-semibold text-white">Hanuman Bhatta Company</span>. All rights reserved.
          </p>

          {/* Additional Links or Credits */}
          <div className="flex items-center gap-6 text-xs text-sandy-300">
            <button className="hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1" aria-label="View privacy policy">Privacy Policy</button>
            <span className="text-charcoal-600">|</span>
            <button className="hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 rounded px-2 py-1" aria-label="View terms of service">Terms of Service</button>
          </div>
        </motion.div>
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terracotta to-transparent"></div>
    </footer>
    <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </>
  );
}
