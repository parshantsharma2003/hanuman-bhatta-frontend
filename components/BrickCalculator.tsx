'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';

interface BrickSize {
  name: string;
  length: number; // in inches
  height: number; // in inches
}

const BRICK_SIZES: BrickSize[] = [
  { name: 'Standard Indian (9" × 4.25" × 2.75")', length: 9, height: 4.25 },
  { name: 'Modular Brick (7.5" × 3.5")', length: 7.5, height: 3.5 },
  { name: 'Heavy Structural (9" × 4.5")', length: 9, height: 4.5 },
];

const BRICKS_PER_TROLLEY = 3000;
const WASTAGE_PERCENTAGE = 5;

export default function BrickCalculator() {
  const [wallLength, setWallLength] = useState<string>('20');
  const [wallHeight, setWallHeight] = useState<string>('10');
  const [selectedBrickIndex, setSelectedBrickIndex] = useState<number>(0);
  const [totalBricks, setTotalBricks] = useState<number>(0);
  const [totalTrolleys, setTotalTrolleys] = useState<number>(0);
  const [wallArea, setWallArea] = useState<number>(200);
  const [includeWastage, setIncludeWastage] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ length?: string; height?: string }>({});

  const validateInputs = useCallback((): boolean => {
    const newErrors: { length?: string; height?: string } = {};
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);

    if (wallLength && (isNaN(length) || length <= 0)) {
      newErrors.length = 'Enter a valid wall length';
    }
    if (wallLength && length > 1000) {
      newErrors.length = 'Length exceeds standard estimation bounds';
    }

    if (wallHeight && (isNaN(height) || height <= 0)) {
      newErrors.height = 'Enter a valid wall height';
    }
    if (wallHeight && height > 1000) {
      newErrors.height = 'Height exceeds standard estimation bounds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [wallLength, wallHeight]);

  const calculateBricks = useCallback(() => {
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);

    if (!wallLength || !wallHeight || isNaN(length) || isNaN(height) || length <= 0 || height <= 0) {
      setTotalBricks(0);
      setTotalTrolleys(0);
      setWallArea(0);
      return;
    }

    if (!validateInputs()) {
      setTotalBricks(0);
      setTotalTrolleys(0);
      setWallArea(0);
      return;
    }

    const selectedBrick = BRICK_SIZES[selectedBrickIndex];
    const wallLengthInches = length * 12;
    const wallHeightInches = height * 12;
    const wallAreaSqFt = length * height;
    setWallArea(wallAreaSqFt);

    const wallAreaSqInches = wallLengthInches * wallHeightInches;
    const effectiveBrickLength = selectedBrick.length + 0.5;
    const effectiveBrickHeight = selectedBrick.height + 0.5;
    const effectiveBrickArea = effectiveBrickLength * effectiveBrickHeight;

    let bricksNeeded = Math.ceil(wallAreaSqInches / effectiveBrickArea);

    if (includeWastage) {
      bricksNeeded = Math.ceil(bricksNeeded * (1 + WASTAGE_PERCENTAGE / 100));
    }

    setTotalBricks(bricksNeeded);
    setTotalTrolleys(Math.ceil(bricksNeeded / BRICKS_PER_TROLLEY));
  }, [wallLength, wallHeight, selectedBrickIndex, includeWastage, validateInputs]);

  useEffect(() => {
    calculateBricks();
  }, [calculateBricks]);

  const resetCalculator = () => {
    setWallLength('');
    setWallHeight('');
    setSelectedBrickIndex(0);
    setTotalBricks(0);
    setTotalTrolleys(0);
    setWallArea(0);
    setErrors({});
  };

  const sendToWhatsApp = () => {
    if (totalBricks === 0) {
      alert('Please enter valid dimensions first');
      return;
    }

    const selectedBrick = BRICK_SIZES[selectedBrickIndex];
    const message = `Hanuman Bhatta - Brick Quantity Estimate:
• Wall Dimensions: ${wallLength} ft × ${wallHeight} ft (${wallArea.toFixed(1)} sq ft)
• Brick Type: ${selectedBrick.name}
• Estimated Quantity: ${totalBricks.toLocaleString('en-IN')} bricks
• Tractor-Trolley Deliveries: ${totalTrolleys} loads (@ 3,000 bricks/trolley)
• Wastage Allowance: ${includeWastage ? '5% included' : '0%'}

Please provide pricing and delivery timeline to my site in Gohana/Haryana.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919996669463?text=${encodedMessage}`;
    trackMetric('whatsapp_click');

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border border-[#E2DDD5] rounded bg-white overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Form: Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E2DDD5] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-[#242321]">
                Wall Dimensions &amp; Specifications
              </h3>
              <p className="text-xs text-[#736F67] mt-0.5">
                Standard single-brick thickness with 12mm mortar allowance
              </p>
            </div>
            <button
              onClick={resetCalculator}
              type="button"
              className="text-xs text-[#736F67] hover:text-[#B8402C] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Length */}
            <div>
              <label htmlFor="wallLength" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
                Wall Length (Feet)
              </label>
              <div className="relative">
                <input
                  id="wallLength"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  value={wallLength}
                  onChange={(e) => setWallLength(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 border border-[#D1C7B6] rounded text-[#242321] text-base font-mono focus:outline-none focus:border-[#B8402C]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#969188]">
                  ft
                </span>
              </div>
              {errors.length && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.length}
                </p>
              )}
            </div>

            {/* Height */}
            <div>
              <label htmlFor="wallHeight" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
                Wall Height (Feet)
              </label>
              <div className="relative">
                <input
                  id="wallHeight"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3.5 py-2.5 border border-[#D1C7B6] rounded text-[#242321] text-base font-mono focus:outline-none focus:border-[#B8402C]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#969188]">
                  ft
                </span>
              </div>
              {errors.height && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.height}
                </p>
              )}
            </div>
          </div>

          {/* Brick Size Dropdown */}
          <div>
            <label htmlFor="brickSize" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
              Brick Type &amp; Dimensions
            </label>
            <select
              id="brickSize"
              value={selectedBrickIndex}
              onChange={(e) => setSelectedBrickIndex(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-[#D1C7B6] rounded text-[#242321] text-sm font-mono bg-white focus:outline-none focus:border-[#B8402C]"
            >
              {BRICK_SIZES.map((brick, idx) => (
                <option key={idx} value={idx}>
                  {brick.name}
                </option>
              ))}
            </select>
          </div>

          {/* Wastage Checkbox */}
          <label className="flex items-center gap-3 p-3 border border-[#E2DDD5] rounded cursor-pointer hover:bg-[#FAF8F5] transition-colors">
            <input
              type="checkbox"
              checked={includeWastage}
              onChange={(e) => setIncludeWastage(e.target.checked)}
              className="w-4 h-4 text-[#B8402C] rounded border-[#D1C7B6] focus:ring-[#B8402C]"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#242321] block">
                Include 5% transit and cutting allowance
              </span>
              <span className="text-[#736F67]">
                Recommended by construction standards for handling and edge cutting
              </span>
            </div>
          </label>
        </div>

        {/* Right Panel: Quantity Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F0E8] border-t lg:border-t-0 lg:border-l border-[#E2DDD5] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#E2DDD5] pb-4 mb-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta block">
                Bill of Quantities (BOQ)
              </span>
              <h4 className="text-lg font-bold font-display text-[#242321] mt-0.5">
                Estimation Summary
              </h4>
            </div>

            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between items-baseline py-1 border-b border-[#E2DDD5]">
                <span className="text-[#57544E]">Net Wall Area</span>
                <span className="font-mono text-[#242321] font-semibold">
                  {wallArea.toFixed(1)} sq ft
                </span>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#E2DDD5]">
                <span className="text-[#57544E]">Total Required Bricks</span>
                <span className="font-mono text-2xl font-bold text-[#B8402C]">
                  {totalBricks > 0 ? totalBricks.toLocaleString('en-IN') : '—'}
                </span>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#E2DDD5]">
                <span className="text-[#57544E]">Equivalent Trolleys</span>
                <span className="font-mono text-lg font-bold text-[#242321]">
                  {totalTrolleys > 0 ? `${totalTrolleys} Trolley Loads` : '—'}
                </span>
              </div>

              <div className="flex justify-between items-baseline py-1">
                <span className="text-[#736F67] text-xs">Standard Capacity</span>
                <span className="font-mono text-xs text-[#736F67]">3,000 Bricks / Trolley</span>
              </div>
            </div>
          </div>

          <button
            onClick={sendToWhatsApp}
            disabled={totalBricks === 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#242321] hover:bg-[#B8402C] text-white py-3.5 px-4 rounded transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Estimate to WhatsApp (+91 99966 69463)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
