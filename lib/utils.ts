// Utility functions for the brick manufacturing website

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate brick requirements
 */
export function calculateBricks(
  lengthFt: number,
  heightFt: number,
  brickLengthInches: number,
  brickHeightInches: number,
  includeWastage: boolean = true,
  wastagePercent: number = 5
): { totalBricks: number; trolleys: number } {
  // Convert feet to inches
  const lengthInches = lengthFt * 12;
  const heightInches = heightFt * 12;

  // Calculate areas
  const wallArea = lengthInches * heightInches;
  const effectiveBrickArea = (brickLengthInches + 0.5) * (brickHeightInches + 0.5);

  // Calculate bricks needed
  let bricksNeeded = Math.ceil(wallArea / effectiveBrickArea);

  // Add wastage if enabled
  if (includeWastage) {
    bricksNeeded = Math.ceil(bricksNeeded * (1 + wastagePercent / 100));
  }

  // Calculate trolleys (3000 bricks per trolley)
  const trolleys = Math.ceil(bricksNeeded / 3000);

  return { totalBricks: bricksNeeded, trolleys };
}

/**
 * Validate phone number (Indian format)
 */
export function validateIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Format price in Indian currency
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
