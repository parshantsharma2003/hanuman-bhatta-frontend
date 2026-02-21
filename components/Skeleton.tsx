/**
 * Skeleton Loading Component
 * Provides skeleton loaders for various UI elements with smooth animations
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  animate = true,
}: SkeletonProps) {
  const baseClass = 'bg-gradient-to-r from-sandy-200 via-sandy-300 to-sandy-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const animationClass = animate ? 'animate-shimmer' : '';

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${animationClass} ${className}`}
      style={{ width: widthStyle, height: heightStyle }}
      role="status"
      aria-label="Loading..."
    />
  );
}

// Skeleton for card components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border-2 border-sandy-300 rounded-2xl shadow-brick p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="1.5rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
        </div>
        <Skeleton width="100%" height="4rem" variant="rounded" />
        <div className="flex gap-2">
          <Skeleton width="30%" height="2.5rem" variant="rounded" />
          <Skeleton width="30%" height="2.5rem" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for list items
export function SkeletonListItem({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-sandy-200 rounded-xl p-4 bg-white ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height="1.25rem" />
          <Skeleton width="50%" height="1rem" />
        </div>
        <Skeleton width="80px" height="2rem" variant="rounded" />
      </div>
    </div>
  );
}

// Skeleton for product catalog
export function SkeletonProduct({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-brick border-2 border-sandy-300 p-6 ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="circular" width={56} height={56} />
          <Skeleton width="80px" height="1.5rem" variant="rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton width="70%" height="1.5rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
        <Skeleton width="100%" height="3rem" />
        <div className="space-y-2">
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="90%" height="1rem" />
          <Skeleton width="80%" height="1rem" />
        </div>
        <div className="flex items-center justify-between pt-4">
          <Skeleton width="40%" height="2rem" />
          <Skeleton width="100px" height="2.5rem" variant="rounded" />
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton for dashboard stat cards
export function SkeletonStatCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border-2 border-sandy-300 rounded-2xl shadow-brick p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="0.875rem" />
          <Skeleton width="40%" height="2rem" />
          <Skeleton width="50%" height="0.75rem" />
        </div>
        <Skeleton variant="rounded" width={48} height={48} />
      </div>
    </div>
  );
}

// Add shimmer animation to global CSS
export const skeletonStyles = `
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
`;
