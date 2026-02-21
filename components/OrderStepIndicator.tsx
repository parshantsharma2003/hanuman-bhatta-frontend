'use client';

import { motion } from 'framer-motion';

interface OrderStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function OrderStepIndicator({ currentStep, steps }: OrderStepIndicatorProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <div key={step} className="flex-1">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                  }}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center border-2 ${
                    isComplete
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isActive
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </motion.div>
                <div className="min-w-0">
                  <p className={`text-xs md:text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    Step {stepNumber}
                  </p>
                  <p className={`text-xs truncate ${isActive ? 'text-orange-700' : 'text-gray-400'}`}>{step}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="mt-2 h-1 bg-gray-200 rounded overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      width: currentStep > stepNumber ? '100%' : '0%',
                    }}
                    className="h-full bg-orange-600"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
