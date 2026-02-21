'use client';

import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-sandy-100 hover:bg-sandy-200 border-2 border-sandy-300 transition-all duration-300 shadow-sm hover:shadow-brick focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
      aria-label={`Current language: ${language === 'en' ? 'English' : 'Hindi'}. Click to switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      aria-pressed={language === 'hi'}
    >
      <Languages className="w-5 h-5 text-terracotta" />
      
      <div className="flex items-center gap-1">
        <span
          className={`text-sm font-bold transition-all duration-300 ${
            language === 'en' ? 'text-terracotta' : 'text-charcoal-400'
          }`}
        >
          EN
        </span>
        <span className="text-charcoal-400">|</span>
        <span
          className={`text-sm font-bold transition-all duration-300 ${
            language === 'hi' ? 'text-terracotta' : 'text-charcoal-400'
          }`}
        >
          हिं
        </span>
      </div>

      {/* Active Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-terracotta"
        initial={false}
        animate={{
          width: '50%',
          x: language === 'en' ? '0%' : '100%',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.button>
  );
}
