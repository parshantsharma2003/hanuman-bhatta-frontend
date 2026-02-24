'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, TrendingUp } from 'lucide-react';
import OrderStepIndicator from './OrderStepIndicator';
import { submitSmartOrder, SmartOrderPayload, smartOrderSchema } from '@/lib/orderApi';
import { trackMetric } from '@/lib/analytics';

type FormValues = SmartOrderPayload;

const STEPS = ['Brick Selection', 'Delivery Details', 'Contact Details'];

const BRICK_SUGGESTIONS: Record<FormValues['usagePurpose'], FormValues['brickType']> = {
  House: 'Avval',
  Boundary: 'Second',
  Filling: 'Rora',
};

const ESTIMATE_PER_BRICK: Record<FormValues['brickType'], { min: number; max: number }> = {
  Avval: { min: 8.5, max: 9.5 },
  Second: { min: 6.5, max: 7.5 },
  Rora: { min: 3.5, max: 4.5 },
};

const BRICKS_PER_TROLLEY = 3000;

interface InventoryInfo {
  totalBricks: number;
}

export default function SmartOrderForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventory, setInventory] = useState<InventoryInfo | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(smartOrderSchema),
    defaultValues: {
      brickType: 'Avval',
      usagePurpose: 'House',
      quantityUnit: 'bricks',
      quantityValue: 3000,
      deliveryArea: '',
      landmark: '',
      distanceRange: '0-10km',
      requiredDeliveryDate: '',
      urgency: 'flexible',
      name: '',
      phoneNumber: '',
      email: '',
      whatsappNumber: '',
      isWhatsappSame: true,
    },
    mode: 'onChange',
  });

  const values = watch();
  const quantityBricks = useMemo(() => {
    if (values.quantityUnit === 'trolleys') {
      return Math.round((values.quantityValue || 0) * BRICKS_PER_TROLLEY);
    }
    return Math.round(values.quantityValue || 0);
  }, [values.quantityUnit, values.quantityValue]);

  const suggestedBrickType = BRICK_SUGGESTIONS[values.usagePurpose];
  const isIdealBrick = values.brickType === suggestedBrickType;

  const suggestedTrolleys = useMemo(() => {
    return quantityBricks > 0 ? Math.ceil(quantityBricks / BRICKS_PER_TROLLEY) : 0;
  }, [quantityBricks]);

  const priceEstimate = useMemo(() => {
    const rate = ESTIMATE_PER_BRICK[values.brickType];
    return {
      min: Math.round(quantityBricks * rate.min),
      max: Math.round(quantityBricks * rate.max),
    };
  }, [values.brickType, quantityBricks]);

  const stockWarning = useMemo(() => {
    if (!inventory) return null;
    if (quantityBricks > inventory.totalBricks) {
      return {
        availableBricks: inventory.totalBricks,
        requestedBricks: quantityBricks,
      };
    }
    return null;
  }, [inventory, quantityBricks]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`);
        if (!response.ok) return;
        const result = await response.json();
        if (result?.success) {
          setInventory({ totalBricks: Number(result.data?.totalBricks || 0) });
        }
      } catch {
        // Silently ignore stock awareness failure
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    if (values.isWhatsappSame) {
      setValue('whatsappNumber', values.phoneNumber || '');
    }
  }, [values.phoneNumber, values.isWhatsappSame, setValue]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof FormValues)[]> = {
      1: ['brickType', 'usagePurpose', 'quantityUnit', 'quantityValue'],
      2: ['deliveryArea', 'distanceRange', 'requiredDeliveryDate', 'urgency'],
      3: ['name', 'phoneNumber', 'email', 'whatsappNumber', 'isWhatsappSame'],
    };

    const valid = await trigger(fieldsByStep[step]);
    if (!valid) return;

    setStep((current) => Math.min(current + 1, 3));
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    trackMetric('order_click');

    try {
      const payload: FormValues = {
        ...formData,
        quantityValue: Number(formData.quantityValue),
        whatsappNumber: formData.isWhatsappSame ? formData.phoneNumber : formData.whatsappNumber,
      };

      const result = await submitSmartOrder(payload);

      if (result.data?.adminWhatsAppUrl) {
        try {
          window.open(result.data.adminWhatsAppUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // Ignore popup issues
        }
      }

      showToast('success', 'Order submitted successfully! Our team will contact you soon.');
      reset();
      setStep(1);
      
      // Call the success callback (used by modal to show success screen)
      if (onSubmitSuccess) {
        // Small delay to ensure user sees the toast
        setTimeout(onSubmitSuccess, 500);
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const leadPriorityLabel = useMemo(() => {
    if (values.brickType === 'Avval' || values.urgency === 'immediate' || quantityBricks >= 15000) {
      return { label: 'HOT', className: 'bg-red-100 text-red-700 border-red-300' };
    }
    if (quantityBricks >= 6000 || values.urgency === 'flexible') {
      return { label: 'WARM', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    }
    return { label: 'NORMAL', className: 'bg-gray-100 text-gray-700 border-gray-300' };
  }, [values.brickType, values.urgency, quantityBricks]);

  return (
    <div id="order" className="bg-white border-2 border-sandy-300 rounded-2xl shadow-brick-lg p-4 md:p-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`mb-4 rounded-lg border px-4 py-3 text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-charcoal">Smart Brick Order Form</h3>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${leadPriorityLabel.className}`}>
          Lead: {leadPriorityLabel.label}
        </span>
      </div>

      <OrderStepIndicator currentStep={step} steps={STEPS} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Brick Type</label>
                  <select {...register('brickType')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none">
                    <option value="Avval">Avval</option>
                    <option value="Second">Second</option>
                    <option value="Rora">Rora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Usage Purpose</label>
                  <select {...register('usagePurpose')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none">
                    <option value="House">House</option>
                    <option value="Boundary">Boundary</option>
                    <option value="Filling">Filling</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-sandy-300 bg-sandy-50 p-3 text-sm text-charcoal-700">
                Suggested brick type for {values.usagePurpose}: <strong>{suggestedBrickType}</strong>
                {!isIdealBrick && (
                  <div className="mt-2 flex items-start gap-2 text-amber-700">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>{values.brickType} may be less ideal for {values.usagePurpose}. Consider {suggestedBrickType}.</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Quantity Unit</label>
                  <select {...register('quantityUnit')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none">
                    <option value="bricks">Bricks</option>
                    <option value="trolleys">Trolleys</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-charcoal mb-2">Quantity</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    {...register('quantityValue', { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none"
                    placeholder="Enter quantity"
                  />
                  {errors.quantityValue && <p className="text-red-600 text-xs mt-1">{errors.quantityValue.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-sandy-300 p-3">
                  <p className="text-sm text-charcoal-600">Suggested Trolleys</p>
                  <p className="text-xl font-bold text-terracotta">{suggestedTrolleys}</p>
                </div>
                <div className="rounded-lg border border-sandy-300 p-3">
                  <p className="text-sm text-charcoal-600">Approx Bricks</p>
                  <p className="text-xl font-bold text-terracotta">{quantityBricks.toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-lg border border-sandy-300 bg-sandy-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-terracotta" />
                  <p className="text-sm font-semibold text-charcoal">Live Price Estimate (Not Final)</p>
                </div>
                <p className="text-lg font-bold text-charcoal">
                  ₹{priceEstimate.min.toLocaleString()} - ₹{priceEstimate.max.toLocaleString()}
                </p>
                <p className="text-xs text-charcoal-600 mt-1">Transport and loading charges may vary by distance and urgency.</p>
                {quantityBricks >= 12000 && (
                  <p className="text-xs text-emerald-700 mt-2 font-semibold">Bulk order benefit: You may get better negotiated pricing.</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Delivery Area / Village</label>
                <input {...register('deliveryArea')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="Village / area" />
                {errors.deliveryArea && <p className="text-red-600 text-xs mt-1">{errors.deliveryArea.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Landmark</label>
                <input {...register('landmark')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="Nearest landmark (optional)" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Distance Range</label>
                  <select {...register('distanceRange')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none">
                    <option value="0-10km">0-10km</option>
                    <option value="10-25km">10-25km</option>
                    <option value="25+km">25+km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Required Date</label>
                  <input type="date" {...register('requiredDeliveryDate')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Urgency</label>
                  <select {...register('urgency')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none">
                    <option value="immediate">Immediate</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {stockWarning && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-700 text-sm">
                  <p className="font-semibold">Limited stock available</p>
                  <p>Requested: {stockWarning.requestedBricks.toLocaleString()} bricks, Available: {stockWarning.availableBricks.toLocaleString()} bricks.</p>
                  <p className="mt-1">Suggestion: Request partial delivery now or choose a later date.</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Name</label>
                  <input {...register('name')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="Your name" />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Phone Number</label>
                  <input {...register('phoneNumber')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="Phone number" />
                  {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Email</label>
                <input {...register('email')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="Email" />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" {...register('isWhatsappSame')} className="w-4 h-4" />
                <label className="text-sm text-charcoal-700">WhatsApp number same as phone</label>
              </div>

              {!values.isWhatsappSame && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">WhatsApp Number</label>
                  <input {...register('whatsappNumber')} className="w-full px-4 py-3 rounded-lg border-2 border-sandy-300 focus:border-terracotta focus:outline-none" placeholder="WhatsApp number" />
                </div>
              )}

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to submit. Your order will be prioritized automatically.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 1 || isSubmitting}
            className="px-5 py-3 rounded-lg border-2 border-sandy-300 text-charcoal font-semibold disabled:opacity-50"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-3 rounded-lg bg-terracotta text-white font-semibold"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 rounded-lg bg-terracotta text-white font-semibold inline-flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
