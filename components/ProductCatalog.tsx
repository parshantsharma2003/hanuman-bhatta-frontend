'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Package, ArrowRight, IndianRupee, AlertCircle } from 'lucide-react';
import { SkeletonProduct } from './Skeleton';
import { trackMetric } from '@/lib/analytics';
import { useOrderModal } from '@/lib/orderModalContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, queryKeys } from '@/lib/api/queries';

// Quality grade to visual styling mapping
const GRADE_STYLES = {
  First: {
    color: 'from-terracotta to-terracotta-dark',
    iconBg: 'bg-terracotta',
    label: 'Premium Quality',
    quality: 'A-Grade',
    featured: true,
  },
  Second: {
    color: 'from-orange-600 to-red-600',
    iconBg: 'bg-orange-600',
    label: 'Standard Quality',
    quality: 'B-Grade',
    featured: false,
  },
  Rora: {
    color: 'from-amber-700 to-orange-800',
    iconBg: 'bg-amber-700',
    label: 'Utility Grade',
    quality: 'Utility',
    featured: false,
  },
};

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

const defaultProducts: Product[] = [
  {
    _id: 'prod-avval-gohana',
    name: 'First-Class Red Clay Bricks (अव्वल ईंट)',
    slug: 'first-class-red-clay-bricks-gohana',
    type: 'Red Clay Brick',
    qualityGrade: 'First',
    pricePer1000: 6500,
    pricePerTrolley: 19500,
    usageTags: [
      'Load-Bearing Walls',
      'Multi-Story Construction',
      'Exposed Brickwork',
      'High Compressive Strength (10.5+ N/mm²)',
    ],
    description:
      'Our Grade-1 kiln-fired red clay bricks (अव्वल ईंट) represent the highest quality standard for residential and commercial construction in Gohana and Haryana. Hand-sorted and laboratory-tested for superior load-bearing capacity and low water absorption.',
    isActive: true,
  },
  {
    _id: 'prod-doyam-gohana',
    name: 'Second-Class Red Clay Bricks (दोयम ईंट)',
    slug: 'second-class-red-clay-bricks-gohana',
    type: 'Red Clay Brick',
    qualityGrade: 'Second',
    pricePer1000: 5500,
    pricePerTrolley: 16500,
    usageTags: [
      'Internal Partition Walls',
      'Plastered Masonry',
      'Boundary Walls',
      'Solid Strength (7.5+ N/mm²)',
    ],
    description:
      'Durable, well-fired Grade-2 construction bricks (दोयम ईंट) suited for internal walls, boundary fences, foundation filling, and standard plastering masonry where high performance meets practical cost efficiency.',
    isActive: true,
  },
  {
    _id: 'prod-rora-gohana',
    name: 'Brick Bats / Crushed Brick Rora (रोड़ा ईंट)',
    slug: 'brick-bats-crushed-rora-gohana',
    type: 'Brick Aggregate',
    qualityGrade: 'Rora',
    pricePer1000: 3500,
    pricePerTrolley: 10500,
    usageTags: [
      'Sub-base Flooring',
      'Road Foundation Beds',
      'Soak Pits & Drainage',
      'Roof Lime Concrete Terraces',
    ],
    description:
      'Clean, kiln-hardened crushed brick bats and broken aggregates (रोड़ा) indispensable for heavy-duty floor sub-bases, road foundational layers, soak pits, and damp-proofing concrete mixtures.',
    isActive: true,
  },
];

export default function ProductCatalog() {
  const [pricingMode, setPricingMode] = useState<'thousand' | 'trolley'>('thousand');
  const { openModal } = useOrderModal();

  const {
    data: products = defaultProducts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    initialData: defaultProducts,
    refetchInterval: 30000,
  });

  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  const handleOrderClick = () => {
    trackMetric('order_click');
    openModal();
  };

  return (
    <section
      id="products"
      className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-sandy-50 via-white to-sandy-50 scroll-mt-20"
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="section-heading">
            Our Premium <span className="text-gradient">Product Range</span>
          </h2>
          <p className="section-subheading mx-auto">
            Quality bricks for every construction need - from premium projects to economical
            solutions
          </p>
        </motion.div>

        {/* Pricing Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex justify-center mb-10 md:mb-12 lg:mb-14"
        >
          <div
            className="inline-flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-xl shadow-brick border-2 border-sandy-300"
            role="group"
            aria-label="Pricing display options"
          >
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
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonProduct key={`loading-${index}`} />
            ))}

          {/* Error State */}
          {!isLoading && isError && (
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
                <p className="text-red-700 mb-4">
                  {error instanceof Error ? error.message : 'Unable to load products'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && products.length === 0 && (
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
                <p className="text-charcoal-600">
                  Please check back later or contact us directly.
                </p>
              </div>
            </motion.div>
          )}

          {/* Products Display */}
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                variants={cardVariants}
                pricingMode={pricingMode}
                onOrderClick={handleOrderClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        {!isLoading && !isError && products.length > 0 && (
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
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  variants: any;
  pricingMode: 'thousand' | 'trolley';
  onOrderClick: () => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard(
  { product, variants, pricingMode, onOrderClick },
  ref
) {
  const gradeStyle = GRADE_STYLES[product.qualityGrade];

  // Calculate price based on pricing mode
  const displayPrice =
    pricingMode === 'thousand' ? product.pricePer1000 : product.pricePerTrolley;

  const priceLabel =
    pricingMode === 'thousand'
      ? 'Price per 1000 bricks'
      : 'Price per trolley (3000 bricks)';

  // Determine if product should be featured (First Class)
  const isFeatured = product.qualityGrade === 'First';

  return (
    <motion.div
      ref={ref}
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative bg-white rounded-2xl shadow-brick hover:shadow-brick-lg transition-all duration-300 overflow-hidden border-2 ${
        isFeatured ? 'border-terracotta' : 'border-sandy-400'
      } h-full flex flex-col`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-terracotta text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header with Gradient or Image */}
      {product.imageUrl ? (
        <div className="relative h-48 bg-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${gradeStyle.color} opacity-30`}></div>
          {/* Quality Badge on Image */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${gradeStyle.iconBg}`}>
              {product.qualityGrade} Class
            </span>
          </div>
        </div>
      ) : (
        <div className={`relative bg-gradient-to-r ${gradeStyle.color} p-6 text-white`}>
          <div className="absolute inset-0 brick-pattern opacity-10"></div>
          <div className="relative">
            {/* Icon */}
            <div
              className={`inline-flex w-14 h-14 ${gradeStyle.iconBg} rounded-xl items-center justify-center mb-4 shadow-lg`}
            >
              <Package className="w-7 h-7 text-white" />
            </div>

            {/* Grade Badge */}
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              {gradeStyle.label}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 space-y-4">
        {/* Product Name */}
        <div>
          <h3 className="text-2xl font-bold font-display text-charcoal">
            {product.name}
          </h3>
          <p className="text-sandy-600 text-sm mt-1">{product.type}</p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-charcoal-700 leading-relaxed text-sm line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Quality Indicator */}
        <div className="flex items-center gap-2 p-3 bg-sandy-50 rounded-lg border border-sandy-300">
          <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0" />
          <div>
            <span className="text-xs text-charcoal-600 font-medium">Quality Grade:</span>
            <span className="ml-2 text-sm font-bold text-charcoal">{gradeStyle.quality}</span>
          </div>
        </div>

        {/* Usage Tags */}
        {product.usageTags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wide mb-2">
              Best For:
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.usageTags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-sandy-100 text-charcoal-700 text-xs rounded-full border border-sandy-300"
                >
                  {tag}
                </span>
              ))}
              {product.usageTags.length > 4 && (
                <span className="px-2 py-1 bg-sandy-100 text-charcoal-700 text-xs rounded-full border border-sandy-300">
                  +{product.usageTags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
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
        <button
          onClick={onOrderClick}
          className={`group/btn w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${gradeStyle.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-brick hover:shadow-brick-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2`}
          aria-label={`Get quote for ${product.name}`}
        >
          Get Quote
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hover Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradeStyle.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
      ></div>
    </motion.div>
  );
});
