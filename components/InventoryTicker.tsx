'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInventory, queryKeys } from '@/lib/api/queries';

export default function InventoryTicker() {
  const BRICKS_PER_TROLLEY = 3000;
  const [displayBricks, setDisplayBricks] = useState(0);
  const currentDisplayRef = useRef(0);

  const {
    data: inventory,
    isLoading,
    isError,
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

    let current = currentDisplayRef.current;
    const target = availableBricks;
    const diff = target - current;
    const steps = 30;
    const stepSize = diff / steps;

    let step = 0;
    const animTimer = setInterval(() => {
      step += 1;
      if (step >= steps) {
        setDisplayBricks(target);
        currentDisplayRef.current = target;
        clearInterval(animTimer);
      } else {
        current += stepSize;
        const nextValue = Math.floor(current);
        currentDisplayRef.current = nextValue;
        setDisplayBricks(nextValue);
      }
    }, 20);

    return () => clearInterval(animTimer);
  }, [availableBricks]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Live';
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resolvedTrolleys = availableTrolleys ?? (availableBricks ? Math.floor(availableBricks / BRICKS_PER_TROLLEY) : 0);

  const bricksDisplay = isLoading
    ? 'Checking yard...'
    : isError
      ? 'Direct Inquiry'
      : `${formatNumber(displayBricks)} Bricks`;

  const trolleysDisplay = isLoading
    ? '...'
    : isError
      ? 'Available'
      : `${formatNumber(resolvedTrolleys)} Trolleys`;

  return (
    <section className="bg-[#171615] text-[#F5F0E8] border-b border-[#31302C] py-5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
          
          {/* Operational Status */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-[#BCB7AD] uppercase tracking-wider font-sans font-medium">
              Kiln Yard 1 • Kahlpa Dispatch Active
            </span>
            <span className="text-[#57544E]">|</span>
            <span className="text-[#736F67]">Updated {formatTime(lastUpdated)}</span>
          </div>

          {/* Metrics Counter */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <span className="text-[#736F67] block uppercase text-[10px] tracking-wider font-sans">
                Ready Stock
              </span>
              <span className="text-white text-sm font-semibold tracking-wide">
                {bricksDisplay}
              </span>
            </div>

            <div className="h-6 w-px bg-[#31302C] hidden sm:block"></div>

            <div>
              <span className="text-[#736F67] block uppercase text-[10px] tracking-wider font-sans">
                Transit Fleet
              </span>
              <span className="text-white text-sm font-semibold tracking-wide">
                {trolleysDisplay}
              </span>
            </div>

            <div className="h-6 w-px bg-[#31302C] hidden sm:block"></div>

            <div>
              <span className="text-[#736F67] block uppercase text-[10px] tracking-wider font-sans">
                Packaging
              </span>
              <span className="text-[#BCB7AD] text-sm">
                3,000 / Trolley
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
