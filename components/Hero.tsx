'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Shield, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const features = [
  { icon: Shield, text: { en: 'Built to Last Generations', hi: 'पीढ़ियों तक टिकाऊ' } },
  { icon: Award, text: { en: 'Premium Quality Certified', hi: 'प्रीमियम गुणवत्ता प्रमाणित' } },
  { icon: TrendingUp, text: { en: 'Trusted by 500+ Builders', hi: '500+ बिल्डरों का विश्वास' } },
];

export default function Hero() {
  const { t } = useLanguage();
  const { openModal } = useOrderModal();

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white overflow-hidden scroll-mt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 brick-pattern opacity-5"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-terracotta opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sandy opacity-5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10 py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/20 border border-terracotta/30 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-terracotta rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-sandy-100">
                  {t('Since 2010 - Two Generations of Excellence', '2010 से - दो पीढ़ियों की उत्कृष्टता')}
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-3 md:space-y-4">
              <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase text-sandy-300">
                Hanuman Bhatta Company • Kahlpa, Gohana (Haryana)
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
                {t('Premium Red Clay Bricks &', 'प्रीमियम लाल मिट्टी की ईंटें व')}{' '}
                <span className="text-gradient">{t('Eent Bhatta in Gohana', 'ईंट भट्टा गोहाना')}</span>
              </h1>
              <p className="text-sm sm:text-base text-terracotta-light font-medium italic">
                {t('Building Strength, Forging Tradition', 'निर्माण शक्ति, रचना परंपरा')}
              </p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-terracotta to-terracotta-dark rounded-full"></div>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              variants={fadeInUp}
              className="text-base md:text-lg lg:text-xl text-sandy-200 leading-relaxed max-w-xl"
            >
              {t(
                'Premium red clay bricks crafted with precision for contractors, builders, and architects who demand uncompromising quality and lasting durability in every project.',
                'ठेकेदारों, बिल्डरों और आर्किटेक्ट्स के लिए सटीकता से तैयार की गई प्रीमियम लाल मिट्टी की ईंटें जो हर प्रोजेक्ट में बेजोड़ गुणवत्ता और स्थायित्व की मांग करते हैं।'
              )}
            </motion.p>

            {/* Features */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <feature.icon className="w-4 h-4 text-terracotta" />
                  <span className="text-sm font-medium text-sandy-100">
                    {t(feature.text.en, feature.text.hi)}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4"
            >
              <button
                onClick={handleOrderClick}
                className="group inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-xl transition-all duration-300 shadow-brick-lg hover:shadow-2xl hover:scale-105 text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sandy focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900\"
                aria-label="Request a quote for brick orders"
              >
                {t('Request Quote', 'कोटेशन का अनुरोध करें')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 md:px-8 py-3.5 md:py-4 rounded-xl border-2 border-white/20 hover:border-sandy transition-all duration-300 text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sandy focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900\"
                aria-label="Navigate to brick calculator to estimate requirements"
              >
                {t('Calculate Bricks Needed', 'ईंटों की गणना करें')}
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-6 md:gap-8 pt-6 md:pt-8 border-t border-white/10"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terracotta font-display">15+</div>
                <div className="text-xs md:text-sm text-sandy-300">{t('Years Experience', 'वर्षों का अनुभव')}</div>
              </div>
              <div className="w-px h-10 md:h-12 bg-white/20"></div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terracotta font-display">150M+</div>
                <div className="text-xs md:text-sm text-sandy-300">{t('Bricks Produced', 'ईंटें उत्पादित')}</div>
              </div>
              <div className="w-px h-10 md:h-12 bg-white/20"></div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terracotta font-display">50K+</div>
                <div className="text-xs md:text-sm text-sandy-300">{t('Happy Clients', 'संतुष्ट ग्राहक')}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-4 border-terracotta/30 shadow-2xl">
              {/* Placeholder with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta-900 via-charcoal-700 to-charcoal-900">
                {/* Image placeholder - replace with actual image */}
                <Image
                  src="/placeholder-brick-kiln.svg"
                  alt="Hanuman Bhatta Company red clay brick kiln manufacturing facility in Kahlpa, Gohana, Haryana"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover mix-blend-overlay opacity-60"
                  priority
                />
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent"></div>
                
                {/* Placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-terracotta/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-terracotta/50">
                      <div className="text-4xl">🧱</div>
                    </div>
                    <p className="text-sandy-200 font-medium px-4">
                      Premium Clay Brick<br />Manufacturing Process
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-sandy rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-sandy rounded-br-2xl"></div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border-2 border-terracotta"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-charcoal font-display">Grade-1 Quality</div>
                  <div className="text-sm text-charcoal-600">Kiln Assured Strength</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F5F5DC"
            className="opacity-10"
          />
        </svg>
      </div>
    </section>
  );
}
