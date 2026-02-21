'use client';

import Navbar from '@/components/Navbar';
import FloatingActions from '@/components/FloatingActions';
import SmartOrderModal from '@/components/SmartOrderModal';
import { ModalProvider } from '@/lib/orderModalContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <>
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="skip-to-content"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="pt-20">
          {children}
        </main>
        <FloatingActions />
        <SmartOrderModal />
      </>
    </ModalProvider>
  );
}
