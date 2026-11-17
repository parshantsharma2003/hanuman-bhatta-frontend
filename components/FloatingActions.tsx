'use client';

import { MessageCircle, PhoneCall, ShoppingCart } from 'lucide-react';
import TrackableButton from './TrackableButton';
import { useOrderModal } from '@/lib/orderModalContext';
import { trackMetric } from '@/lib/analytics';

const whatsappNumber = '919996669463';
const callNumber = '+919996669463';

export default function FloatingActions() {
  const { openModal } = useOrderModal();
  const whatsappMessage = encodeURIComponent(
    "Hello Hanuman Bhatta, I'm interested in your brick products."
  );

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {/* Order Now Button */}
      <button
        onClick={handleOrderClick}
        className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        aria-label="Open smart order form"
        title="Place a quick order"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-sm font-semibold">Order</span>
      </button>

      <TrackableButton
        as="a"
        metricType="whatsapp_click"
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
        ariaLabel="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">WhatsApp</span>
      </TrackableButton>

      <TrackableButton
        as="a"
        metricType="call_click"
        href={`tel:${callNumber}`}
        className="flex items-center gap-2 rounded-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-3 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
        ariaLabel="Call Hanuman Bhatta"
      >
        <PhoneCall className="w-5 h-5" />
        <span className="text-sm font-semibold">Call Now</span>
      </TrackableButton>
    </div>
  );
}
