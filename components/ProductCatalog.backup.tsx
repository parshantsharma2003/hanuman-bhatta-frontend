'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Package, ArrowRight, IndianRupee, AlertCircle } from 'lucide-react';
import { SkeletonProduct } from './Skeleton';

interface Product {
  id: number;
  name: string;
  nameHindi: string;
  grade: string;
  description: string;
  quality: string;
  usageTitle: string;
  usage: string[];
  pricePerThousand: number;
  pricePerTrolley: number;
  featured?: boolean;
  color: string;
  iconBg: string;
  availability?: boolean;
}

interface ApiProduct {
  _id?: string;
  name: string;
  type: string;
  pricePer1000: number;
  pricePerTrolley: number;
  availability?: boolean;
}

const productPresets: Product[] = [
  {
    id: 1,
    name: 'First Class Bricks',
    nameHindi: 'Avval Eent',
    grade: 'Premium Quality',
    description: 'Our premium first-class bricks are perfectly shaped, uniformly colored, and thoroughly fired for maximum strength and durability.',
    quality: 'A-Grade',
    usageTitle: 'Best For:',
    usage: [
      'Load-bearing structures',
      'Exterior walls & facades',
      'High-rise buildings',
      'Premium construction projects',
    ],
    pricePerThousand: 0,
    pricePerTrolley: 0,
    featured: true,
    color: 'from-terracotta to-terracotta-dark',
    iconBg: 'bg-terracotta',
  },
  {
    id: 2,
    name: 'Second Class Bricks',
    nameHindi: 'Duyam / 2 Number Eent / दुयम',
    grade: 'Standard Quality',
    description: 'Reliable second-class bricks offering good quality at an economical price point. Suitable for standard construction and partition masonry.',
    quality: 'B-Grade',
    usageTitle: 'Ideal For:',
    usage: [
      'Partition walls',
      'Internal masonry work',
      'Non-load-bearing structures',
      'Budget-friendly projects',
    ],
    pricePerThousand: 8000,
    pricePerTrolley: 24000,
    featured: false,
    color: 'from-orange-600 to-red-600',
    iconBg: 'bg-orange-600',
  },
  {
    id: 3,
    name: 'Premium Bricks',
    nameHindi: 'Premium / अव्वल',
    grade: 'Premium Quality',
    description: 'High-strength premium kiln-fired red clay bricks with 10.5+ N/mm² compressive strength for load-bearing walls and architectural construction.',
    quality: 'A-Grade',
    usageTitle: 'Best For:',
    usage: [
      'Load-bearing structures',
      'Multi-storey buildings',
      'Exterior walls & facades',
      'Heavy-duty foundations',
    ],
    pricePerThousand: 9000,
    pricePerTrolley: 27000,
    featured: false,
    color: 'from-amber-700 to-orange-800',
    iconBg: 'bg-amber-700',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function ProductCatalog() {
  const [pricingMode, setPricingMode] = useState<'thousand' | 'trolley'>('thousand');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hanuman-bhatta-backend-production.up.railway.app/api/v1';

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || 'Unable to load products');
        }

        const apiProducts: ApiProduct[] = result.data || [];

        const mappedProducts = apiProducts.map((apiProduct, index) => {
          const preset = productPresets.find(
            (item) => item.name.toLowerCase() === apiProduct.name.toLowerCase()
          ) || productPresets[index] || productPresets[0];

          return {
            ...preset,
            id: preset?.id || index + 1,
            name: apiProduct.name || preset.name,
            grade: apiProduct.type || preset.grade,
            pricePerThousand: apiProduct.pricePer1000 ?? preset.pricePerThousand,
            pricePerTrolley: apiProduct.pricePerTrolley ?? preset.pricePerTrolley,
            availability: apiProduct.availability ?? true,
          } as Product;
        });

        if (isMounted) {
          setProducts(mappedProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load products');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const displayProducts = useMemo(() => {
    if (products.length > 0) {
      return products;
    }

    if (isLoading) {
      return [];
    }

    return [];
  }, [products, isLoading]);

  return (
    <section id="products" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-sandy-50 via-white to-sandy-50 scroll-mt-20">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="section-heading">
            Our Premium <span className="text-gradient">Product Range</span>
          </h2>
          <p className="section-subheading mx-auto">
            Quality bricks for every construction need - from premium projects to economical solutions
          </p>
        </motion.div>

        {/* Pricing Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex justify-center mb-10 md:mb-12 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-xl shadow-brick border-2 border-sandy-300" role="group" aria-label="Pricing display options">
            <button
              onClick={() => setPricingMode('thousand')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                pricingMode === 'thousand'
                  ? 'bg-gradient-to-r from-terracotta to-terracotta-600 text-white shadow-lg'
                  : 'text-charcoal-600 hover:text-charcoal hover:bg-sandy-50'
              }`}
              role="radio"
              aria-checked={pricingMode === 'thousand'}
              aria-label="Show prices per 1000 bricks"
            >
              Per 1000 Bricks
            </button>
            <button
              onClick={() => setPricingMode('trolley')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                pricingMode === 'trolley'
                  ? 'bg-gradient-to-r from-terracotta to-terracotta-600 text-white shadow-lg'
                  : 'text-charcoal-600 hover:text-charcoal hover:bg-sandy-50'
              }`}
              role="radio"
              aria-checked={pricingMode === 'trolley'}
              aria-label="Show prices per trolley of 3000 bricks"
            >
              Per Trolley <span className="text-xs opacity-75">(3000 bricks)</span>
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Loading State with Skeleton */}
          {isLoading && (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonProduct key={`loading-${index}`} />
            ))
          )}
          
          {/* Error State */}
          {!isLoading && error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <div className="inline-flex w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Products</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && displayProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <div className="bg-sandy-100 border-2 border-sandy-300 rounded-2xl p-8 text-center">
                <div className="inline-flex w-16 h-16 bg-sandy-200 rounded-full items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-charcoal-400" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No Products Available</h3>
                <p className="text-charcoal-600">Please check back later or contact us directly.</p>
              </div>
            </motion.div>
          )}
          
          {/* Products Display */}
          {!isLoading && !error && displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} variants={cardVariants} pricingMode={pricingMode} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#calculator"
              className="btn-primary text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              aria-label="Navigate to brick calculator"
            >
              Calculate Your Requirements
            </a>
            <a
              href="#contact"
              className="btn-outline text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
              aria-label="Navigate to contact form for bulk quote"
            >
              Request Bulk Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  variants: any;
  pricingMode: 'thousand' | 'trolley';
}

function ProductCard({ product, variants, pricingMode }: ProductCardProps) {
  // Calculate price based on pricing mode
  const displayPrice = pricingMode === 'thousand'
    ? product.pricePerThousand
    : product.pricePerTrolley;
  
  const priceLabel = pricingMode === 'thousand' 
    ? 'Price per 1000 bricks' 
    : 'Price per trolley (3000 bricks)';

  return (
    <motion.div
      variants={variants}
      className={`group relative bg-white rounded-2xl shadow-brick hover:shadow-brick-lg transition-all duration-300 overflow-hidden border-2 ${
        product.featured ? 'border-terracotta' : 'border-sandy-400'
      } h-full flex flex-col`}
    >
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-terracotta text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header with Gradient */}
      <div className={`relative bg-gradient-to-r ${product.color} p-6 text-white`}>
        <div className="absolute inset-0 brick-pattern opacity-10"></div>
        <div className="relative">
          {/* Icon */}
          <div className={`inline-flex w-14 h-14 ${product.iconBg} rounded-xl items-center justify-center mb-4 shadow-lg`}>
            <Package className="w-7 h-7 text-white" />
          </div>

          {/* Product Name */}
          <h3 className="text-2xl font-bold font-display mb-1">
            {product.name}
          </h3>
          <p className="text-sandy-100 text-sm italic mb-2">
            {product.nameHindi}
          </p>
          
          {/* Grade Badge */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            {product.grade}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-5">
        {/* Description */}
        <p className="text-charcoal-700 leading-relaxed">
          {product.description}
        </p>

        {/* Quality Indicator */}
        <div className="flex items-center gap-2 p-3 bg-sandy-50 rounded-lg border border-sandy-300">
          <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0" />
          <div>
            <span className="text-xs text-charcoal-600 font-medium">Quality Grade:</span>
            <span className="ml-2 text-sm font-bold text-charcoal">{product.quality}</span>
          </div>
        </div>

        {/* Usage Section */}
        <div>
          <h4 className="text-sm font-bold text-charcoal uppercase tracking-wide mb-3">
            {product.usageTitle}
          </h4>
          <ul className="space-y-2">
            {product.usage.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-700">
                <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price Footer */}
      <div className="border-t-2 border-sandy-300 bg-gradient-to-r from-sandy-50 to-sandy-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-charcoal-600 font-medium mb-1">{priceLabel}</p>
            <AnimatePresence mode="wait">
              <motion.div 
                key={pricingMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1"
              >
                <IndianRupee className="w-5 h-5 text-terracotta" />
                <span className="text-3xl font-bold text-terracotta font-display">
                  {displayPrice.toLocaleString()}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-right">
            <p className="text-xs text-charcoal-600 mb-1">Bulk orders</p>
            <p className="text-sm font-bold text-terracotta">Special rates</p>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#contact"
          className={`group/btn w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${product.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-brick hover:shadow-brick-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2`}
          aria-label={`Get quote for ${product.name}`}
        >
          Get Quote
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
    </motion.div>
  );
}
