'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  AlertCircle, 
  Check, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Truck, 
  MapPin, 
  Info, 
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import OrderStepIndicator from './OrderStepIndicator';
import { submitSmartOrder, SmartOrderPayload, smartOrderSchema } from '@/lib/orderApi';
import { trackMetric } from '@/lib/analytics';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, queryKeys } from '@/lib/api/queries';

export interface BrickSelectionOption {
  id: string;
  name: string;
  localName: string;
  grade: string;
  badge?: string;
  pricePerBrick: number;
  pricePer1000: number;
  description: string;
  colour: string;
  sound: string;
  strength: string;
}

const DEFAULT_BRICK_OPTIONS: BrickSelectionOption[] = [
  {
    id: 'awwal',
    name: 'First Class Bricks',
    localName: 'Awwal / अव्वल',
    grade: 'Grade 1',
    badge: 'BEST SELLER',
    pricePerBrick: 9.0,
    pricePer1000: 9000,
    description: 'Premium-quality red clay bricks manufactured for structural strength, uniformity and high-finish edges.',
    colour: 'White and red variation',
    sound: 'Clear metallic ring',
    strength: 'Very High (Structural)',
  },
  {
    id: 'laal-peti',
    name: 'Standard Bricks',
    localName: 'Laal Peti / लाल पेटी',
    grade: 'Grade 1.5',
    badge: 'POPULAR CHOICE',
    pricePerBrick: 8.5,
    pricePer1000: 8500,
    description: 'High-finished edges, pure red colour. Excellent affordable alternative for partition and boundary walls.',
    colour: 'Pure red',
    sound: 'Solid metallic sound',
    strength: 'Medium-High',
  },
  {
    id: 'duyam',
    name: 'Second Class Bricks',
    localName: 'Duyam / दुयम',
    grade: 'Grade 2',
    badge: 'ECONOMICAL',
    pricePerBrick: 8.0,
    pricePer1000: 8000,
    description: 'Budget-friendly brick option with lower strength and light red/yellowish tone for non-critical construction.',
    colour: 'Light red / yellowish',
    sound: 'Very dull sound',
    strength: 'Moderate',
  },
  {
    id: 'peela',
    name: 'Third Class Bricks',
    localName: 'Peela Eent / पीला',
    grade: 'Grade 3',
    badge: 'UTILITY FILLING',
    pricePerBrick: 7.5,
    pricePer1000: 7500,
    description: 'Low-cost, lower-strength underfired brick option intended for below-ground foundation filling.',
    colour: 'Yellowish tone',
    sound: 'Very dull thud',
    strength: 'Low (Sub-Grade)',
  },
  {
    id: 'chatka',
    name: 'Fourth Class Bricks',
    localName: 'Chatka Eent / छटका',
    grade: 'Grade 4',
    badge: 'HARD VITRIFIED',
    pricePerBrick: 6.0,
    pricePer1000: 6000,
    description: 'Hard, irregularly shaped kiln-vitrified bricks available at the lowest price. Best for sub-base packing.',
    colour: 'Irregular dark clinker',
    sound: 'Sharp vitrified clink',
    strength: 'Hard / Irregular Shape',
  },
];

const ORDER_STEPS = [
  'Brick Grade',
  'Quantity',
  'Customer Details',
  'Delivery Details',
  'Review & Enquiry',
];

export default function SmartOrderForm({ onSubmitSuccess }: { onSubmitSuccess?: (data?: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Products Query from Database
  const { data: serverProducts = [] } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    refetchInterval: 30000,
  });

  const brickOptions: BrickSelectionOption[] = useMemo(() => {
    if (!serverProducts || serverProducts.length === 0) {
      return DEFAULT_BRICK_OPTIONS;
    }
    return DEFAULT_BRICK_OPTIONS.map((opt) => {
      const match = serverProducts.find(
        (sp: Product) =>
          sp.grade?.toLowerCase() === opt.grade.toLowerCase() ||
          sp.name.toLowerCase() === opt.name.toLowerCase()
      );
      if (match) {
        const pricePerBrick =
          match.pricePerBrick || (match.pricePer1000 ? match.pricePer1000 / 1000 : opt.pricePerBrick);
        return {
          ...opt,
          name: match.name || opt.name,
          localName: match.localName || opt.localName,
          pricePerBrick,
          pricePer1000: match.pricePer1000 || pricePerBrick * 1000,
          description: match.description || opt.description,
          badge: match.badge || opt.badge,
        };
      }
      return opt;
    });
  }, [serverProducts]);

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SmartOrderPayload>({
    defaultValues: {
      brickType: 'First Class Bricks',
      usagePurpose: 'House',
      quantityUnit: 'bricks',
      quantityValue: 3000,
      deliveryType: 'delivery',
      deliveryArea: '',
      village: '',
      district: 'Sonipat / Gohana',
      pincode: '',
      landmark: '',
      distanceRange: '0-10km',
      requiredDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      urgency: 'flexible',
      name: '',
      phoneNumber: '',
      email: '',
      whatsappNumber: '',
      isWhatsappSame: true,
      customerInstructions: '',
    },
    mode: 'onChange',
  });

  const formValues = watch();

  const selectedProduct = useMemo(() => {
    return (
      brickOptions.find(
        (b) =>
          b.name.toLowerCase() === formValues.brickType.toLowerCase() ||
          b.localName.toLowerCase().includes(formValues.brickType.toLowerCase()) ||
          b.grade.toLowerCase() === formValues.brickType.toLowerCase()
      ) || brickOptions[0]
    );
  }, [brickOptions, formValues.brickType]);

  const totalBricksCount = useMemo(() => {
    const qty = Number(formValues.quantityValue) || 0;
    return formValues.quantityUnit === 'bricks' ? qty : qty * 3000;
  }, [formValues.quantityValue, formValues.quantityUnit]);

  const estimatedSubtotal = useMemo(() => {
    return Math.round(totalBricksCount * selectedProduct.pricePerBrick);
  }, [totalBricksCount, selectedProduct.pricePerBrick]);

  const estimatedTrolleys = useMemo(() => {
    return Math.round((totalBricksCount / 3000) * 100) / 100;
  }, [totalBricksCount]);

  // Step Validation Handlers
  const handleNext = () => {
    clearErrors();

    if (currentStep === 1) {
      if (!formValues.brickType) {
        setError('brickType', { message: 'Please select a brick grade' });
        return;
      }
    } else if (currentStep === 2) {
      const qty = Number(formValues.quantityValue);
      if (!qty || isNaN(qty) || qty <= 0) {
        setError('quantityValue', { message: 'Please enter a valid brick quantity' });
        return;
      }
    } else if (currentStep === 3) {
      if (!formValues.name || formValues.name.trim().length < 2) {
        setError('name', { message: 'Please enter your full name (at least 2 characters)' });
        return;
      }
      if (!formValues.phoneNumber || formValues.phoneNumber.trim().length < 10) {
        setError('phoneNumber', { message: 'Please enter a valid 10-digit mobile number' });
        return;
      }
      if (!formValues.email || !/^\S+@\S+\.\S+$/.test(formValues.email)) {
        setError('email', { message: 'Please enter a valid email address' });
        return;
      }
    } else if (currentStep === 4) {
      if (!formValues.deliveryArea || formValues.deliveryArea.trim().length < 2) {
        setError('deliveryArea', { message: 'Please enter your delivery location or site address' });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitEnquiry = async () => {
    setIsSubmitting(true);
    setToast(null);

    try {
      trackMetric('order_click');

      const response = await submitSmartOrder({
        ...formValues,
        brickType: selectedProduct.name,
      });

      setToast({
        type: 'success',
        message: 'Order enquiry submitted successfully! Our dispatch manager will contact you.',
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err: any) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to submit order enquiry. Please call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildDirectWhatsAppUrl = () => {
    const text =
      `Hello Hanuman Bhatta Company,\n\n` +
      `I want to enquire about the following brick order:\n\n` +
      `• Product: ${selectedProduct.name} (${selectedProduct.localName})\n` +
      `• Grade: ${selectedProduct.grade}\n` +
      `• Quantity: ${totalBricksCount.toLocaleString('en-IN')} bricks (~${estimatedTrolleys} trolleys)\n` +
      `• Indicative Rate: ₹${selectedProduct.pricePerBrick.toFixed(2)}/brick\n` +
      `• Estimated Subtotal: ₹${estimatedSubtotal.toLocaleString('en-IN')}\n\n` +
      `• Customer: ${formValues.name || 'Site Owner'}\n` +
      `• Mobile: ${formValues.phoneNumber || 'Provided on enquiry'}\n` +
      `• Location: ${formValues.deliveryArea || 'Gohana / Kahlpa Area'}\n` +
      `• Transit: ${formValues.deliveryType === 'self_pickup' ? 'Self-Pickup' : 'Tractor-Trolley Delivery'}\n\n` +
      `Please confirm best available quotation and freight charges.`;

    return `https://wa.me/919996669463?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-sm mb-6 flex items-start gap-3 border text-xs sm:text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p>{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Indicator */}
      <OrderStepIndicator currentStep={currentStep} steps={ORDER_STEPS} />

      {/* STEP 1: BRICK SELECTION */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Step 1: Select Brick Quality Grade
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Choose the brick grade suited for your building requirement. All rates are ex-kiln Kahlpa.
            </p>
          </div>

          <div className="space-y-3">
            {brickOptions.map((brick) => {
              const isSelected = selectedProduct.id === brick.id;
              return (
                <div
                  key={brick.id}
                  onClick={() => setValue('brickType', brick.name)}
                  className={`p-4 sm:p-5 rounded-sm border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#242321] bg-white ring-2 ring-[#242321] shadow-sm'
                      : 'border-[#D1C7B6] bg-[#FAF8F5] hover:bg-white hover:border-[#242321]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#242321] text-white rounded-xs">
                          {brick.grade}
                        </span>
                        {brick.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#B8402C] text-white font-bold rounded-xs">
                            {brick.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-[#242321]">
                        {brick.name}
                      </h4>
                      <p className="text-xs font-serif text-[#B8402C] font-semibold">
                        {brick.localName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg sm:text-xl font-bold font-display text-[#242321] block">
                        ₹{brick.pricePerBrick.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-[#736F67]">
                        per brick (₹{brick.pricePer1000.toLocaleString('en-IN')}/1k)
                      </span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-[#57544E] leading-relaxed">
                    {brick.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E2DDD5] grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#42403B]">
                    <div>
                      <span className="text-[#736F67] block">Colour:</span>
                      <span className="font-medium">{brick.colour}</span>
                    </div>
                    <div>
                      <span className="text-[#736F67] block">Sound:</span>
                      <span className="font-medium">{brick.sound}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[#736F67] block">Strength:</span>
                      <span className="font-medium">{brick.strength}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.brickType && (
            <p className="text-xs text-rose-600 font-medium">{errors.brickType.message}</p>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded-sm text-sm font-medium transition-colors"
            >
              <span>Continue to Quantity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: QUANTITY INPUT */}
      {currentStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Step 2: Enter Required Brick Quantity
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Enter the exact count or tractor-trolley loads for your build site.
            </p>
          </div>

          {/* Active Product Confirmation Badge */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D1C7B6] rounded-sm flex items-center justify-between text-xs">
            <div>
              <span className="text-[#736F67] font-mono text-[10px] uppercase block">Selected Grade</span>
              <span className="font-bold text-[#242321] text-sm">
                {selectedProduct.name} ({selectedProduct.grade})
              </span>
            </div>
            <span className="font-mono font-bold text-[#B8402C]">
              ₹{selectedProduct.pricePerBrick.toFixed(2)} / brick
            </span>
          </div>

          {/* Unit Toggle: Bricks vs Trolleys */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-2 font-medium">
              Specify Quantity In:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('quantityUnit', 'bricks')}
                className={`py-2.5 px-4 rounded-sm border text-xs sm:text-sm font-medium font-mono transition-all ${
                  formValues.quantityUnit === 'bricks'
                    ? 'bg-[#242321] text-white border-[#242321]'
                    : 'bg-white border-[#D1C7B6] text-[#57544E] hover:border-[#242321]'
                }`}
              >
                Number of Bricks
              </button>
              <button
                type="button"
                onClick={() => setValue('quantityUnit', 'trolleys')}
                className={`py-2.5 px-4 rounded-sm border text-xs sm:text-sm font-medium font-mono transition-all ${
                  formValues.quantityUnit === 'trolleys'
                    ? 'bg-[#242321] text-white border-[#242321]'
                    : 'bg-white border-[#D1C7B6] text-[#57544E] hover:border-[#242321]'
                }`}
              >
                Tractor-Trolley (3,000/load)
              </button>
            </div>
          </div>

          {/* Direct Numeric Input */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-2 font-medium">
              {formValues.quantityUnit === 'bricks'
                ? 'Total Brick Count (pieces)'
                : 'Number of Trolleys'}
            </label>
            <input
              type="number"
              min="1"
              step={formValues.quantityUnit === 'bricks' ? '500' : '1'}
              {...register('quantityValue', { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white border border-[#D1C7B6] rounded-sm text-lg font-mono font-bold text-[#242321] focus:outline-none focus:border-[#242321]"
              placeholder={formValues.quantityUnit === 'bricks' ? 'e.g. 5000' : 'e.g. 2'}
            />
            {errors.quantityValue && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.quantityValue.message}</p>
            )}
          </div>

          {/* Quick Increment Pills */}
          <div>
            <span className="text-[11px] font-mono text-[#736F67] block mb-2">Quick Standard Loads:</span>
            <div className="flex flex-wrap gap-2">
              {[3000, 6000, 9000, 15000, 25000].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    setValue('quantityUnit', 'bricks');
                    setValue('quantityValue', count);
                  }}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D1C7B6] hover:border-[#242321] text-xs font-mono text-[#242321] rounded-xs"
                >
                  {count.toLocaleString('en-IN')} Bricks ({Math.round(count / 3000)} Trolley)
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Subtotal Box */}
          <div className="p-4 bg-[#FAF8F5] border border-[#D1C7B6] rounded-sm space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#736F67]">Total Calculated Bricks:</span>
              <span className="font-mono font-bold text-[#242321]">
                {totalBricksCount.toLocaleString('en-IN')} bricks (~{estimatedTrolleys} trolleys)
              </span>
            </div>
            <div className="flex items-center justify-between text-base sm:text-lg border-t border-[#E2DDD5] pt-2">
              <span className="font-bold font-display text-[#242321]">Estimated Product Subtotal:</span>
              <span className="font-mono font-bold text-xl sm:text-2xl text-[#B8402C]">
                ₹{estimatedSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-[#736F67] italic">
              * Indicative rate based on ₹{selectedProduct.pricePerBrick.toFixed(2)}/brick ex-kiln. Bulk order discounts negotiable.
            </p>
          </div>

          {/* Navigation */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D1C7B6] text-[#242321] rounded-sm text-sm font-medium hover:bg-[#FAF8F5]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded-sm text-sm font-medium transition-colors"
            >
              <span>Continue to Contact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: CUSTOMER CONTACT DETAILS */}
      {currentStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Step 3: Customer Information
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Enter contact details for our dispatch manager to discuss rates and delivery scheduling.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  Mobile Number (Calling) *
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="e.g. 9996669463"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
              </div>
            </div>

            {/* WhatsApp same checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#42403B]">
                <input
                  type="checkbox"
                  {...register('isWhatsappSame')}
                  className="rounded text-[#B8402C] focus:ring-[#B8402C]"
                />
                <span>WhatsApp number is the same as calling number</span>
              </label>
            </div>

            {!formValues.isWhatsappSame && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  {...register('whatsappNumber')}
                  placeholder="e.g. 9812345678"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D1C7B6] text-[#242321] rounded-sm text-sm font-medium hover:bg-[#FAF8F5]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded-sm text-sm font-medium transition-colors"
            >
              <span>Continue to Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: DELIVERY DETAILS */}
      {currentStep === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Step 4: Delivery Location &amp; Logistics
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Choose your preferred delivery mode and describe your construction site location.
            </p>
          </div>

          {/* Delivery Mode Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('deliveryType', 'delivery')}
              className={`p-3.5 rounded-sm border text-left transition-all ${
                formValues.deliveryType === 'delivery'
                  ? 'border-[#242321] bg-white ring-1 ring-[#242321]'
                  : 'border-[#D1C7B6] bg-[#FAF8F5]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#B8402C] mb-1" />
              <span className="font-bold text-xs sm:text-sm text-[#242321] block">
                Tractor-Trolley Delivery
              </span>
              <span className="text-[11px] text-[#736F67] block">
                Direct unloading at your construction site
              </span>
            </button>

            <button
              type="button"
              onClick={() => setValue('deliveryType', 'self_pickup')}
              className={`p-3.5 rounded-sm border text-left transition-all ${
                formValues.deliveryType === 'self_pickup'
                  ? 'border-[#242321] bg-white ring-1 ring-[#242321]'
                  : 'border-[#D1C7B6] bg-[#FAF8F5]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#B8402C] mb-1" />
              <span className="font-bold text-xs sm:text-sm text-[#242321] block">
                Self-Pickup (Kiln Gate)
              </span>
              <span className="text-[11px] text-[#736F67] block">
                Pick up with own trolley from Kahlpa kiln
              </span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                Delivery Site Address or Landmark *
              </label>
              <input
                type="text"
                {...register('deliveryArea')}
                placeholder="e.g. Near Old Bus Stand, Village Kahlpa / Gohana Road"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
              />
              {errors.deliveryArea && (
                <p className="mt-1 text-xs text-rose-600">{errors.deliveryArea.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  Village / Town
                </label>
                <input
                  type="text"
                  {...register('village')}
                  placeholder="e.g. Kahlpa"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  District
                </label>
                <input
                  type="text"
                  {...register('district')}
                  placeholder="Sonipat / Rohtak / Jind"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1 font-medium">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  {...register('requiredDeliveryDate')}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1C7B6] rounded-sm text-sm text-[#242321] focus:outline-none focus:border-[#242321]"
                />
              </div>
            </div>

            {/* Transport Charges Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p>
                Transportation charges will be confirmed according to delivery location and distance from our Kahlpa kiln. Standard trolley loads accommodate 3,000 bricks per trip.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D1C7B6] text-[#242321] rounded-sm text-sm font-medium hover:bg-[#FAF8F5]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded-sm text-sm font-medium transition-colors"
            >
              <span>Review Order Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: REVIEW & SUBMIT ENQUIRY */}
      {currentStep === 5 && (
        <motion.div
          key="step-5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-5"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#242321]">
              Step 5: Review &amp; Submit Order Enquiry
            </h3>
            <p className="text-xs sm:text-sm text-[#57544E] mt-1 font-sans">
              Verify your enquiry details below. All quotations are negotiable and confirmed directly by telephone.
            </p>
          </div>

          {/* Detailed Summary Card */}
          <div className="bg-[#FAF8F5] border border-[#D1C7B6] rounded-sm p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start justify-between border-b border-[#E2DDD5] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#736F67] block">
                  Brick Grade &amp; Product
                </span>
                <span className="font-bold text-base text-[#242321] block">
                  {selectedProduct.name}
                </span>
                <span className="font-serif text-xs text-[#B8402C] font-semibold">
                  {selectedProduct.localName} ({selectedProduct.grade})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#736F67] block">Indicative Rate</span>
                <span className="font-mono font-bold text-sm text-[#242321]">
                  ₹{selectedProduct.pricePerBrick.toFixed(2)} / brick
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-b border-[#E2DDD5] text-xs">
              <div>
                <span className="text-[#736F67] block">Total Bricks:</span>
                <span className="font-mono font-bold text-[#242321]">
                  {totalBricksCount.toLocaleString('en-IN')} pieces (~{estimatedTrolleys} trolleys)
                </span>
              </div>
              <div>
                <span className="text-[#736F67] block">Transit Mode:</span>
                <span className="font-medium text-[#242321]">
                  {formValues.deliveryType === 'self_pickup' ? 'Self-Pickup' : 'Tractor-Trolley Delivery'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#736F67] block">Site Location:</span>
                <span className="font-medium text-[#242321]">
                  {formValues.deliveryArea} {formValues.village ? `, Village: ${formValues.village}` : ''}
                </span>
              </div>
              <div>
                <span className="text-[#736F67] block">Customer:</span>
                <span className="font-medium text-[#242321]">{formValues.name}</span>
              </div>
              <div>
                <span className="text-[#736F67] block">Phone:</span>
                <span className="font-mono font-medium text-[#242321]">{formValues.phoneNumber}</span>
              </div>
            </div>

            {/* Estimated Subtotal Row */}
            <div className="flex items-center justify-between pt-1 text-base">
              <span className="font-bold font-display text-[#242321]">
                Estimated Product Subtotal:
              </span>
              <span className="font-mono font-bold text-xl sm:text-2xl text-[#B8402C]">
                ₹{estimatedSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Pricing Disclaimer */}
          <div className="p-3.5 bg-white border border-[#D1C7B6] rounded-sm text-xs text-[#57544E] space-y-1">
            <span className="font-mono uppercase text-[10px] text-[#242321] font-bold block">
              Negotiation &amp; Pricing Terms:
            </span>
            <p>
              Prices are indicative and negotiable. Bulk-order discounts may be available. Final pricing and transportation charges will be confirmed by Hanuman Bhatta Company.
            </p>
          </div>

          {/* Actions & Submission */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#D1C7B6] text-[#242321] rounded-sm text-sm font-medium hover:bg-[#FAF8F5]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={buildDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-sm text-xs sm:text-sm font-medium transition-colors shadow-xs flex-1 sm:flex-initial"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleSubmitEnquiry}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#242321] hover:bg-[#B8402C] text-white rounded-sm text-xs sm:text-sm font-medium transition-colors shadow-xs flex-1 sm:flex-initial disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT ORDER ENQUIRY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
