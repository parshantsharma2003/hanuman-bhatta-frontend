'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, PhoneCall } from 'lucide-react';
import TrackableButton from './TrackableButton';

const WHATSAPP_NUMBER = '918295669463';
const CALL_NUMBER = '+919996669463';

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Hanuman Bhatta, I'm interested in red clay brick pricing and delivery to my site."
  );

  return (
    <aside
      aria-label="Direct Kiln Contact & Navigation"
      className="fixed right-3 sm:right-6 z-50 flex items-center gap-2 pointer-events-auto transition-all duration-200"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top of page"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#191817]/95 backdrop-blur-sm text-[#F5F0E8] border border-[#31302C] shadow-xl flex items-center justify-center hover:bg-[#242321] hover:text-[#B8402C] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B8402C] flex-shrink-0"
        >
          <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>
      )}

      {/* Unified Direct Kiln Contact Bar */}
      <div className="flex items-center bg-[#191817]/95 backdrop-blur-sm text-white border border-[#31302C] rounded-full shadow-2xl overflow-hidden p-1">
        {/* Direct Call Button */}
        <TrackableButton
          as="a"
          metricType="call_click"
          href={`tel:${CALL_NUMBER}`}
          className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#B8402C] px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] text-xs font-mono font-medium transition-colors"
          ariaLabel="Call Hanuman Bhatta Company (+91 99966 69463)"
        >
          <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8402C]" />
          <span className="font-sans text-[11px] sm:text-xs">Call Kiln</span>
        </TrackableButton>

        <span className="w-px h-4 sm:h-5 bg-[#31302C]" />

        {/* Direct WhatsApp Button */}
        <TrackableButton
          as="a"
          metricType="whatsapp_click"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-emerald-400 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] text-xs font-mono font-medium transition-colors"
          ariaLabel="Chat with Hanuman Bhatta on WhatsApp (+91 82956 69463)"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
          <span className="font-sans text-[11px] sm:text-xs">WhatsApp</span>
        </TrackableButton>
      </div>
    </aside>
  );
}
