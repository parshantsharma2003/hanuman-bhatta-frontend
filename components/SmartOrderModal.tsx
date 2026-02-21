'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOrderModal } from '@/lib/orderModalContext';

const SmartOrderForm = dynamic(() => import('./SmartOrderForm'), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  ),
});

interface SuccessScreenProps {
  onClose: () => void;
}

function SuccessScreen({ onClose }: SuccessScreenProps) {
  const whatsappNumber = '8295669463';
  const callNumber = '+918295669463';
  const whatsappMessage = encodeURIComponent(
    'Hi! I just submitted my brick order and wanted to confirm the details with you. 🧱'
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-12 px-6"
    >
      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">✓</span>
        </div>
      </div>

      {/* Success Message */}
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Submitted!</h3>
      <p className="text-gray-600 mb-6 text-lg">
        Thank you for placing your order. Our team will reach out to you shortly to confirm the delivery details.
      </p>

      {/* Order Details Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
        <p className="text-sm font-semibold text-blue-900 mb-2">📋 What&apos;s Next?</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ We received your order</li>
          <li>✓ Our team will call to confirm</li>
          <li>✓ Delivery will be arranged</li>
          <li>✓ You&apos;ll be updated via WhatsApp</li>
        </ul>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3 mb-6">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          <MessageCircle size={20} /> Message on WhatsApp
        </a>
        <a
          href={`tel:${callNumber}`}
          className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          <Phone size={20} /> Call Us Now
        </a>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
      >
        Close
      </button>
    </motion.div>
  );
}

export default function SmartOrderModal() {
  const { isOpen, closeModal, showSuccessScreen, setShowSuccessScreen } = useOrderModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Save scroll position when opening
  useEffect(() => {
    if (isOpen) {
      setScrollPosition(window.scrollY);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeModal]);

  // Handle focus trap (basic implementation)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          aria-label="Order modal overlay"
        >
          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-h-screen overflow-y-auto max-w-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                  Place Your Order
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Easy, step-by-step ordering process
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label="Close dialog"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {showSuccessScreen ? (
                <SuccessScreen onClose={closeModal} />
              ) : (
                <SmartOrderForm onSubmitSuccess={() => setShowSuccessScreen(true)} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
