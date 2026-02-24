'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, TrendingUp, Clock } from 'lucide-react';

export default function InventoryTicker() {
  const BRICKS_PER_TROLLEY = 3000;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const [availableBricks, setAvailableBricks] = useState<number | null>(null);
  const [availableTrolleys, setAvailableTrolleys] = useState<number | null>(null);
  const [displayBricks, setDisplayBricks] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let isFirstLoad = true;

    const fetchInventory = async () => {
      try {
        if (isFirstLoad) {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch(`${apiBaseUrl}/inventory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || 'Unable to load inventory');
        }

        const inventory = result.data || {};
        const totalBricks = Number(inventory.totalBricks || 0);
        const trolleys = Number(inventory.availableTrolleys || 0);
        const updatedAt = inventory.updatedAt || inventory.createdAt || new Date().toISOString();

        if (isMounted) {
          setAvailableBricks(totalBricks);
          setAvailableTrolleys(trolleys || Math.floor(totalBricks / BRICKS_PER_TROLLEY));
          setLastUpdated(new Date(updatedAt));
          setHasError(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unable to load inventory';
          setError(errorMessage);
          setHasError(true);
        }
      } finally {
        if (isMounted && isFirstLoad) {
          setIsLoading(false);
          isFirstLoad = false;
        }
      }
    };

    // Fetch inventory on page load
    fetchInventory();

    // Poll inventory every 30 seconds, but only if no error has occurred
    const interval = setInterval(() => {
      if (!hasError) {
        fetchInventory();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiBaseUrl, BRICKS_PER_TROLLEY, hasError]);

  useEffect(() => {
    if (availableBricks === null) {
      return;
    }

    setIsAnimating(true);
    let current = displayBricks;
    const target = availableBricks;
    const diff = target - current;
    const steps = 60;
    const stepSize = diff / steps;

    let step = 0;
    const animTimer = setInterval(() => {
      step += 1;
      if (step >= steps) {
        setDisplayBricks(target);
        setIsAnimating(false);
        clearInterval(animTimer);
      } else {
        current += stepSize;
        setDisplayBricks(Math.floor(current));
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

  const resolvedTrolleys = availableTrolleys ?? (
    availableBricks ? Math.floor(availableBricks / BRICKS_PER_TROLLEY) : 0
  );

  const bricksDisplay = isLoading
    ? 'Loading...'
    : error
      ? '--'
      : formatNumber(displayBricks);

  const trolleysDisplay = isLoading
    ? 'Loading...'
    : error
      ? '--'
      : formatNumber(resolvedTrolleys);

  const statusLabel = error
    ? 'Inventory unavailable'
    : isLoading
      ? 'Loading stock...'
      : 'Live Stock Available';

  const statusColor = error ? 'bg-red-400' : 'bg-green-400';

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-charcoal via-charcoal-800 to-charcoal relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 brick-pattern opacity-5"></div>
      
      {/* Animated Background Glow */}
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
                  {error ? 'Status: Offline' : `Updated: ${formatTime(lastUpdated)}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Inventory Stats */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 w-full lg:w-auto">
            {/* Available Bricks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex-1 lg:flex-none min-w-[280px] bg-gradient-to-br from-sandy-100 to-white rounded-2xl p-5 md:p-6 lg:p-7 shadow-brick border-2 border-sandy-300 relative overflow-hidden"
            >
              {/* Animated Pulse */}
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
                  <p className="text-charcoal-600 font-semibold text-sm uppercase tracking-wide">
                    Available Bricks
                  </p>
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
              </div>
            </motion.div>

            {/* Available Trolleys */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex-1 lg:flex-none min-w-[280px] bg-gradient-to-br from-sandy-100 to-white rounded-2xl p-5 md:p-6 lg:p-7 shadow-brick border-2 border-sandy-300 relative overflow-hidden"
            >
              {/* Animated Pulse */}
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
                  <p className="text-charcoal-600 font-semibold text-sm uppercase tracking-wide">
                    Available Trolleys
                  </p>
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

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
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
