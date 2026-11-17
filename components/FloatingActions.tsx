'use client';

import { MessageCircle, PhoneCall } from 'lucide-react';
import TrackableButton from './TrackableButton';

const whatsappNumber = '919996669463';
const callNumber = '+919996669463';

export default function FloatingActions() {
  const whatsappMessage = encodeURIComponent(
    "Hello Hanuman Bhatta, I'm interested in your brick products."
  );

  return (
    <aside
      aria-label="Direct Kiln Contact"
      className="fixed bottom-5 right-5 z-50 flex items-center bg-[#242321] text-white border border-[#31302C] rounded-full shadow-xl overflow-hidden p-1"
    >
      <TrackableButton
        as="a"
        metricType="call_click"
        href={`tel:${callNumber}`}
        className="flex items-center gap-2 text-white hover:text-[#B8402C] px-3.5 py-2 text-xs font-mono font-medium transition-colors"
        ariaLabel="Call Hanuman Bhatta Company"
      >
        <PhoneCall className="w-3.5 h-3.5 text-[#B8402C]" />
        <span className="hidden sm:inline">Call Kiln</span>
        <span className="sm:hidden">Call</span>
      </TrackableButton>

      <span className="w-px h-4 bg-[#42403B]"></span>

      <TrackableButton
        as="a"
        metricType="whatsapp_click"
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-white hover:text-emerald-400 px-3.5 py-2 text-xs font-mono font-medium transition-colors"
        ariaLabel="Chat with Hanuman Bhatta on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span>WhatsApp</span>
      </TrackableButton>
    </aside>
  );
}
