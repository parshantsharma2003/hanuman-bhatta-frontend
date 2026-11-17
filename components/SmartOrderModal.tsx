'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOrderModal } from '@/lib/orderModalContext';

const SmartOrderForm = dynamic(() => import('./SmartOrderForm'), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8402C]"></div>
    </div>
  ),
});

interface SuccessScreenProps {
  onClose: () => void;
}

function SuccessScreen({ onClose }: SuccessScreenProps) {
  const whatsappNumber = '918295669463';
  const callNumber = '+919996669463';
  const whatsappMessage = encodeURIComponent(
    'Hello Hanuman Bhatta, I have submitted an order request online and would like to confirm pricing and delivery.'
  );

  return (
    <div className="text-center py-8 px-4 sm:px-6">
      {/* Success Icon */}
      <div className="mb-5 flex justify-center">
        <div className="w-12 h-12 bg-[#F5F0E8] border border-[#B8402C] rounded-full flex items-center justify-center text-[#B8402C]">
          <Check className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>

      {/* Success Message */}
      <h3 className="text-2xl font-bold font-display text-[#242321] mb-2">
        Inquiry Submitted
      </h3>
      <p className="text-[#57544E] mb-6 text-sm max-w-md mx-auto leading-relaxed">
        Your order inquiry has been received by our Kahlpa dispatch desk. Our manager will contact you with exact tractor-trolley delivery scheduling.
      </p>

      {/* What's Next Summary */}
      <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded p-5 mb-6 text-left max-w-md mx-auto space-y-2 text-xs text-[#42403B]">
        <span className="font-mono uppercase tracking-wider text-[#736F67] block mb-1">
          Next Steps
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8402C]"></span>
          <span>Kiln team reviews quantity and site transit route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8402C]"></span>
          <span>Telephone confirmation of trolley dispatch schedule</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8402C]"></span>
          <span>Unloading at destination in Gohana or surrounding areas</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 max-w-md mx-auto mb-4">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded font-medium transition-colors text-sm"
        >
          <MessageCircle size={16} />
          <span>Confirm Details on WhatsApp</span>
        </a>
        <a
          href={`tel:${callNumber}`}
          className="flex items-center justify-center gap-2 w-full px-5 py-3 border border-[#E2DDD5] hover:border-[#242321] text-[#242321] rounded font-medium transition-colors text-sm"
        >
          <Phone size={16} />
          <span>Call Dispatch Desk Directly</span>
        </a>
      </div>

      <button
        onClick={onClose}
        className="text-xs text-[#736F67] hover:text-[#242321] transition-colors"
      >
        Close Window
      </button>
    </div>
  );
}

export default function SmartOrderModal() {
  const { isOpen, closeModal, showSuccessScreen, setShowSuccessScreen } = useOrderModal();
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={closeModal}
          aria-label="Order modal overlay"
        >
          <div
            ref={modalRef}
            className="bg-white rounded border border-[#E2DDD5] shadow-2xl w-full max-h-[90vh] overflow-y-auto max-w-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#F5F0E8] border-b border-[#E2DDD5] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta block">
                  Hanuman Bhatta Company • Direct Supply
                </span>
                <h2 id="modal-title" className="text-xl font-bold font-display text-[#242321]">
                  Kiln Brick Order Request
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-white text-[#736F67] hover:text-[#242321] transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} />
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
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
