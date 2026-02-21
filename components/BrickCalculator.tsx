'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, PackageOpen, Truck, Info, AlertCircle, Ruler, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackMetric } from '@/lib/analytics';

interface BrickSize {
  name: string;
  length: number; // in inches
  height: number; // in inches
}

const BRICK_SIZES: BrickSize[] = [
  { name: 'Standard (9" × 4.5")', length: 9, height: 4.5 },
  { name: 'Modular (7.5" × 3.5")', length: 7.5, height: 3.5 },
  { name: 'Engineer (9" × 3.5")', length: 9, height: 3.5 },
  { name: 'Jumbo (9" × 5.5")', length: 9, height: 5.5 },
];

const BRICKS_PER_TROLLEY = 3000;
const WASTAGE_PERCENTAGE = 5; // 5% wastage factor

export default function BrickCalculator() {
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [selectedBrickIndex, setSelectedBrickIndex] = useState<number>(0);
  const [totalBricks, setTotalBricks] = useState<number>(0);
  const [totalTrolleys, setTotalTrolleys] = useState<number>(0);
  const [wallArea, setWallArea] = useState<number>(0);
  const [includeWastage, setIncludeWastage] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ length?: string; height?: string }>({});

  useEffect(() => {
    calculateBricks();
  }, [wallLength, wallHeight, selectedBrickIndex, includeWastage]);

  const validateInputs = (): boolean => {
    const newErrors: { length?: string; height?: string } = {};
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);

    if (wallLength && (isNaN(length) || length <= 0)) {
      newErrors.length = 'Please enter a valid length greater than 0';
    }
    if (wallLength && length > 1000) {
      newErrors.length = 'Length seems too large. Please check your input';
    }

    if (wallHeight && (isNaN(height) || height <= 0)) {
      newErrors.height = 'Please enter a valid height greater than 0';
    }
    if (wallHeight && height > 1000) {
      newErrors.height = 'Height seems too large. Please check your input';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBricks = () => {
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
    
    // Convert wall dimensions from feet to inches
    const wallLengthInches = length * 12;
    const wallHeightInches = height * 12;
    
    // Calculate wall area in square feet
    const wallAreaSqFt = length * height;
    setWallArea(wallAreaSqFt);
    
    // Calculate wall area in square inches
    const wallAreaSqInches = wallLengthInches * wallHeightInches;
    
    // Calculate number of bricks needed (with mortar joints - approx 0.5" joint)
    const effectiveBrickLength = selectedBrick.length + 0.5;
    const effectiveBrickHeight = selectedBrick.height + 0.5;
    const effectiveBrickArea = effectiveBrickLength * effectiveBrickHeight;
    
    // Calculate total bricks using: Area / (BrickLength × BrickHeight)
    let bricksNeeded = Math.ceil(wallAreaSqInches / effectiveBrickArea);
    
    // Add wastage if enabled
    if (includeWastage) {
      bricksNeeded = Math.ceil(bricksNeeded * (1 + WASTAGE_PERCENTAGE / 100));
    }
    
    setTotalBricks(bricksNeeded);
    setTotalTrolleys(Math.ceil(bricksNeeded / BRICKS_PER_TROLLEY));
  };

  const resetCalculator = () => {
    setWallLength('');
    setWallHeight('');
    setSelectedBrickIndex(0);
    setTotalBricks(0);
    setTotalTrolleys(0);
    setWallArea(0);
    setErrors({});
  };

  const handleLengthChange = (value: string) => {
    setWallLength(value);
    if (errors.length) {
      setErrors((prev) => ({ ...prev, length: undefined }));
    }
  };

  const handleHeightChange = (value: string) => {
    setWallHeight(value);
    if (errors.height) {
      setErrors((prev) => ({ ...prev, height: undefined }));
    }
  };

  const sendToWhatsApp = () => {
    if (totalBricks === 0) {
      alert('Please calculate brick requirements first');
      return;
    }

    const selectedBrick = BRICK_SIZES[selectedBrickIndex];
    const message = `🧱 *Hanuman Bhatta - Brick Quote Request*

📐 *Wall Dimensions:*
• Length: ${wallLength} ft
• Height: ${wallHeight} ft
• Area: ${wallArea.toFixed(1)} sq ft

🧱 *Brick Specifications:*
• Size: ${selectedBrick.name}

📊 *Requirements:*
• Total Bricks: ${totalBricks.toLocaleString()} pieces
• Trolleys Needed: ${totalTrolleys} (@ ${BRICKS_PER_TROLLEY.toLocaleString()} bricks/trolley)
• Wastage: ${includeWastage ? `${WASTAGE_PERCENTAGE}% included` : 'Not included'}

💬 I would like to get a quote for these bricks. Please share pricing and availability.

Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918295669463?text=${encodedMessage}`;
    trackMetric('whatsapp_click');
    
    // Create a temporary link element to trigger the WhatsApp opening
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-brick-lg overflow-hidden border-2 border-sandy-300"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-terracotta to-terracotta-dark p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 brick-pattern opacity-10"></div>
        <div className="relative flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Calculator className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display">Brick Calculator</h2>
            <p className="text-sandy-100 text-sm md:text-base mt-1">
              Calculate the exact number of bricks needed for your project
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Wall Length */}
          <div className="space-y-2">
            <label htmlFor="wallLength" className="block text-sm font-bold text-charcoal uppercase tracking-wide">
              Wall Length
              <span className="ml-2 text-xs font-normal text-charcoal-600 normal-case">(in feet)</span>
            </label>
            <div className="relative">
              <input
                id="wallLength"
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={wallLength}
                onChange={(e) => handleLengthChange(e.target.value)}
                placeholder="e.g., 20"
                className={`w-full px-3 md:px-4 py-2.5 md:py-3 pr-10 md:pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta transition-all text-charcoal text-base md:text-lg font-semibold ${
                  errors.length
                    ? 'border-red-500 bg-red-50'
                    : 'border-sandy-600 focus:border-transparent'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600 font-medium">
                ft
              </span>
            </div>
            {errors.length && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.length}
              </motion.div>
            )}
          </div>

          {/* Wall Height */}
          <div className="space-y-2">
            <label htmlFor="wallHeight" className="block text-sm font-bold text-charcoal uppercase tracking-wide">
              Wall Height
              <span className="ml-2 text-xs font-normal text-charcoal-600 normal-case">(in feet)</span>
            </label>
            <div className="relative">
              <input
                id="wallHeight"
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={wallHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder="e.g., 10"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta transition-all text-charcoal text-lg font-semibold ${
                  errors.height
                    ? 'border-red-500 bg-red-50'
                    : 'border-sandy-600 focus:border-transparent'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600 font-medium">
                ft
              </span>
            </div>
            {errors.height && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.height}
              </motion.div>
            )}
          </div>
        </div>

        {/* Wall Area Display */}
        {wallArea > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-sandy-100 rounded-lg border-2 border-sandy-400"
          >
            <Ruler className="w-5 h-5 text-terracotta" />
            <div>
              <span className="text-sm font-semibold text-charcoal-700">Wall Area:</span>
              <span className="ml-2 text-lg font-bold text-terracotta font-display">
                {wallArea.toFixed(1)} sq ft
              </span>
            </div>
          </motion.div>
        )}

        {/* Brick Size Selection */}
        <div className="space-y-2">
          <label htmlFor="brickSize" className="block text-sm font-bold text-charcoal uppercase tracking-wide">
            Brick Size
            <span className="ml-2 text-xs font-normal text-charcoal-600 normal-case">(Standard Indian sizes)</span>
          </label>
          <select
            id="brickSize"
            value={selectedBrickIndex}
            onChange={(e) => setSelectedBrickIndex(parseInt(e.target.value))}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-sandy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all text-charcoal bg-white cursor-pointer text-base md:text-lg font-semibold hover:border-terracotta"
          >
            {BRICK_SIZES.map((brick, index) => (
              <option key={index} value={index}>
                {brick.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wastage Toggle */}
        <div className="flex items-center justify-between p-4 bg-sandy-50 rounded-lg border border-sandy-600">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-terracotta" />
            <span className="text-sm font-medium text-charcoal">
              Include {WASTAGE_PERCENTAGE}% wastage allowance
            </span>
          </div>
          <button
            onClick={() => setIncludeWastage(!includeWastage)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
              includeWastage ? 'bg-terracotta' : 'bg-charcoal-300'
            }`}
            role="switch"
            aria-checked={includeWastage}
            aria-label={`Toggle wastage allowance. Currently ${includeWastage ? 'enabled' : 'disabled'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                includeWastage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {totalBricks > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 pt-6 border-t-4 border-terracotta"
            >
              {/* Results Header */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-charcoal font-display mb-1">
                  Your Brick Requirements
                </h3>
                <p className="text-xs md:text-sm text-charcoal-600">
                  Based on your wall dimensions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {/* Total Bricks - Enhanced Highlight */}
                <div className="relative bg-gradient-to-br from-terracotta to-terracotta-dark p-4 md:p-6 rounded-xl shadow-brick-lg overflow-hidden group hover:scale-105 transition-transform">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="brick-pattern w-full h-full"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <PackageOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                        Total Bricks
                      </h3>
                    </div>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display mb-2">
                      {totalBricks.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 text-sandy-100 text-xs">
                      <Info className="w-3 h-3" />
                      <span>
                        {includeWastage ? `Including ${WASTAGE_PERCENTAGE}% wastage` : 'Exact count (no wastage)'}
                      </span>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Total Trolleys - Enhanced Highlight */}
                <div className="relative bg-gradient-to-br from-charcoal-800 to-charcoal-900 p-4 md:p-6 rounded-xl shadow-brick-lg overflow-hidden group hover:scale-105 transition-transform">
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sandy/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-sandy/20 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-sandy" />
                      </div>
                      <h3 className="text-sm font-bold text-sandy uppercase tracking-wide">
                        Trolleys Needed
                      </h3>
                    </div>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-sandy font-display mb-2">
                      {totalTrolleys}
                    </p>
                    <div className="text-sandy-200 text-xs">
                      @ {BRICKS_PER_TROLLEY.toLocaleString()} bricks per trolley
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-sandy-50 p-4 rounded-lg border-2 border-sandy-400">
                <p className="text-sm text-charcoal-700 font-medium">
                  <strong>💡 Formula Used:</strong> Total Bricks = Wall Area ÷ (Brick Length × Brick Height)
                </p>
              </div>

              {/* WhatsApp Share Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={sendToWhatsApp}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 md:gap-3 group text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                aria-label="Send brick calculation to WhatsApp for quote"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Send to WhatsApp for Quote</span>
                <span className="text-xs opacity-90">(Share these details)</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => {
              trackMetric('calculator_use');
              calculateBricks();
            }}
            className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-200 shadow-brick hover:shadow-brick-lg flex items-center justify-center gap-2 text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            aria-label="Calculate brick requirements"
          >
            <Calculator className="w-4 h-4 md:w-5 md:h-5" />
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-charcoal-300 text-charcoal hover:bg-charcoal-50 font-semibold rounded-lg transition-colors duration-200 text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
            aria-label="Reset calculator to default values"
          >
            Reset
          </button>
        </div>

        {/* Info Footer */}
        <div className="bg-gradient-to-r from-sandy-100 to-sandy-200 p-5 rounded-lg border-l-4 border-terracotta shadow-sm">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-charcoal-800 leading-relaxed">
                <strong className="text-terracotta">Important Note:</strong> This calculation includes mortar joint spacing (approx. 0.5 inches). 
                Actual requirements may vary based on wall thickness, mortar type, and construction method. 
                Always consult with your contractor for precise estimates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
