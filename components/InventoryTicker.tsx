'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, TrendingUp, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInventory, queryKeys } from '@/lib/api/queries';

export default function InventoryTicker() {
  const BRICKS_PER_TROLLEY = 3000;
  const [displayBricks, setDisplayBricks] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentDisplayRef = useRef(0);

  const {
    data: inventory,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: fetchInventory,
    refetchInterval: (query) => (query.state.error ? false : 30000),
  });

  const availableBricks = inventory ? Number(inventory.totalBricks || 0) : null;
  const availableTrolleys = inventory
    ? Number(inventory.availableTrolleys || 0) || Math.floor(Number(inventory.totalBricks || 0) / BRICKS_PER_TROLLEY)
    : null;
  const lastUpdated = inventory
    ? new Date(inventory.updatedAt || inventory.createdAt || new Date().toISOString())
    : null;

  useEffect(() => {
    if (availableBricks === null) {
      return;
    }

    setIsAnimating(true);
    let current = currentDisplayRef.current;
    const target = availableBricks;
    const diff = target - current;
    const steps = 60;
    const stepSize = diff / steps;

    let step = 0;
    const animTimer = setInterval(() => {
      step += 1;
      if (step >= steps) {
        setDisplayBricks(target);
        currentDisplayRef.current = target;
        setIsAnimating(false);
        clearInterval(animTimer);
      } else {
        current += stepSize;
        const nextValue = Math.floor(current);
        currentDisplayRef.current = nextValue;
        setDisplayBricks(nextValue);
      }
    }, 16);

    return () => clearInterval(animTimer);
  }, [availableBricks]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  const formatTime = (date: Date | null) => {
    if (!date) {
      return 'Loading...';
    }

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const resolvedTrolleys = availableTrolleys ?? (availableBricks ? Math.floor(availableBricks / BRICKS_PER_TROLLEY) : 0);

  const bricksDisplay = isLoading
    ? 'Loading...'
    : isError
      ? '--'
      : formatNumber(displayBricks);

  const trolleysDisplay = isLoading
    ? 'Loading...'
    : isError
      ? '--'
      : formatNumber(resolvedTrolleys);

  const statusLabel = isError
    ? 'Inventory unavailable'
    : isLoading
      ? 'Loading stock...'
      : 'Live Stock Available';

  const statusColor = isError ? 'bg-red-400' : 'bg-green-400';

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-charcoal via-charcoal-800 to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 brick-pattern opacity-5"></div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-terracotta/10 via-transparent to-terracotta/10"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-3 md:gap-4"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h3 className="text-white font-display text-2xl md:text-3xl font-bold">Live Inventory</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-sandy-300" />
                <p className="text-sandy-300 text-xs md:text-sm font-medium">
                  {isError ? 'Status: Offline' : `Updated: ${formatTime(lastUpdated)}`}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 w-full lg:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="flex-1 lg:flex-none min-w-[280px] bg-gradient-to-br from-sandy-100 to-white rounded-2xl p-5 md:p-6 lg:p-7 shadow-brick border-2 border-sandy-300 relative overflow-hidden"
            >
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 bg-terracotta/10"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-terracotta" />
                  </div>
                  <p className="text-charcoal-600 font-semibold text-sm uppercase tracking-wide">Available Bricks</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${bricksDisplay}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-terracotta font-display"
                  >
                    {bricksDisplay}
                  </motion.div>
                </AnimatePresence>
                <p className="text-charcoal-500 text-xs mt-1">units in stock</p>
                {isError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    {error instanceof Error ? error.message : 'Unable to load inventory'}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="flex-1 lg:flex-none min-w-[280px] bg-gradient-to-br from-sandy-100 to-white rounded-2xl p-5 md:p-6 lg:p-7 shadow-brick border-2 border-sandy-300 relative overflow-hidden"
            >
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 bg-terracotta/10"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
              )}

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-terracotta" />
                  </div>
                  <p className="text-charcoal-600 font-semibold text-sm uppercase tracking-wide">Available Trolleys</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${trolleysDisplay}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-terracotta font-display"
                  >
                    {trolleysDisplay}
                  </motion.div>
                </AnimatePresence>
                <p className="text-charcoal-500 text-xs mt-1">ready for delivery</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 md:px-6 py-3 md:py-3.5 rounded-full border border-white/20"
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${statusColor}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-white font-semibold text-sm">{statusLabel}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
