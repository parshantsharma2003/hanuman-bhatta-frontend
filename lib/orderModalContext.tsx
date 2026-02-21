'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  showSuccessScreen: boolean;
  setShowSuccessScreen: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setShowSuccessScreen(false);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowSuccessScreen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, showSuccessScreen, setShowSuccessScreen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useOrderModal must be used within ModalProvider');
  }
  return context;
}
