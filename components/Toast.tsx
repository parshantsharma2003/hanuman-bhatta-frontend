'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ type, message, duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 right-4 z-50 max-w-md ${bgColor} border-2 rounded-lg p-4 flex items-start gap-3 shadow-lg`}
        role="alert"
      >
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
