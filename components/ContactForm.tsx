'use client';

import { useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { Phone, User, Send, MapPin, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';
import { API, getApiErrorMessage } from '@/lib/api/client';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(13, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactResolver: Resolver<ContactFormData> = async (values) => {
  const result = contactSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: Record<string, { type: string; message: string }> = {};

  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string' && !errors[fieldName]) {
      errors[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }
  });

  return {
    values: {},
    errors,
  };
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: contactResolver,
    mode: 'onChange',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await API.post('/enquiries', {
        name: data.name,
        phone: data.phone,
        message: data.message,
      });

      const result = response.data;

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to submit enquiry');
      }

      setSubmitSuccess('Thank you. Your inquiry has been sent to our dispatch team.');
      reset();
    } catch (err: any) {
      setSubmitError(getApiErrorMessage(err, 'Failed to submit enquiry. Please call us directly.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-white border-b border-[#E2DDD5] scroll-mt-20"
      aria-label="Contact Information and Location"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Kiln Contact & Dispatch Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
                Kiln Yard &amp; Office Details
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#242321] tracking-tight">
                Direct Dispatch &amp; Kiln Location
              </h2>
              <p className="mt-4 text-base text-[#57544E] leading-relaxed">
                Connect directly with our kiln manager for pricing, dispatch scheduling, or to arrange an on-site sample inspection in Kahlpa.
              </p>
            </div>

            {/* Structured Specifications */}
            <div className="space-y-6 border-t border-[#E2DDD5] pt-6">
              
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded border border-[#E2DDD5] bg-[#F5F0E8] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[#242321]">Kiln Premises</h3>
                  <p className="text-sm text-[#57544E] mt-0.5 leading-relaxed">
                    Hanuman Bhatta Company<br />
                    Kahlpa-Bhanderi Road, V.P.O. Kahlpa<br />
                    Gohana, Sonipat District, Haryana 131301
                  </p>
                </div>
              </div>

              {/* Direct Telephone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded border border-[#E2DDD5] bg-[#F5F0E8] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[#242321]">Direct Phone &amp; WhatsApp</h3>
                  <a
                    href="tel:+919996669463"
                    className="text-base font-mono font-semibold text-[#B8402C] hover:underline block mt-0.5"
                  >
                    +91 99966 69463
                  </a>
                  <span className="text-xs text-[#736F67]">Direct line to kiln dispatch desk</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded border border-[#E2DDD5] bg-[#F5F0E8] flex items-center justify-center text-[#B8402C] flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[#242321]">Operating &amp; Dispatch Hours</h3>
                  <p className="text-sm text-[#57544E] mt-0.5">
                    Monday &ndash; Sunday: 06:00 AM &ndash; 07:00 PM
                  </p>
                  <span className="text-xs text-[#736F67]">Continuous dispatch during construction season</span>
                </div>
              </div>

            </div>

            {/* Delivery Zones */}
            <div className="p-5 bg-[#F5F0E8] border border-[#E2DDD5] rounded">
              <span className="text-xs font-mono uppercase tracking-wider text-[#736F67] block mb-1.5">
                Primary Transit Delivery Coverage
              </span>
              <p className="text-xs text-[#42403B] leading-relaxed">
                Gohana • Sonipat • Rohtak • Jind • Safidon • Panipat • Baroda • Mundlana • Kahlpa &amp; surrounding villages.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="border border-[#E2DDD5] rounded bg-[#FAF8F5] p-7 sm:p-10">
              <div className="border-b border-[#E2DDD5] pb-5 mb-6">
                <h3 className="text-xl font-bold font-display text-[#242321]">
                  Request Site Delivery Quote
                </h3>
                <p className="text-xs text-[#736F67] mt-1">
                  Fill in your details below and our dispatch manager will call you with exact trolley pricing.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-3 border border-[#D1C7B6] rounded text-[#242321] text-sm bg-white focus:outline-none focus:border-[#B8402C]"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      placeholder="e.g. 99966 69463"
                      className="w-full px-3.5 py-3 border border-[#D1C7B6] rounded text-[#242321] text-sm bg-white focus:outline-none focus:border-[#B8402C]"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase text-[#42403B] mb-1.5">
                    Project Requirements / Site Location *
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    placeholder="e.g. Need 4 trolleys Grade-1 bricks for house construction near Rohtak Road, Gohana."
                    className="w-full px-3.5 py-3 border border-[#D1C7B6] rounded text-[#242321] text-sm bg-white focus:outline-none focus:border-[#B8402C]"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B8402C] hover:bg-[#8E2E1D] text-white py-3.5 px-6 rounded transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry to Dispatch Desk'}</span>
                </button>

                {submitSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* Google Maps Location */}
        <div className="mt-16 pt-12 border-t border-[#E2DDD5]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold font-display text-[#242321]">
                Kiln Location &amp; Satellite Coordinates
              </h3>
              <p className="text-xs text-[#736F67] mt-0.5">
                Kahlpa-Bhanderi Road, Gohana (Coordinates: 29.1052° N, 76.5954° E)
              </p>
            </div>
            <a
              href="https://www.google.com/maps/place/Hanuman+Bhatta+company/@29.1052208,76.5948049,19z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-semibold text-[#B8402C] hover:underline"
            >
              Open in Google Maps &rarr;
            </a>
          </div>

          <div className="w-full h-[360px] md:h-[440px] rounded border border-[#E2DDD5] overflow-hidden bg-[#EDE8DF]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1585.1293907390345!2d76.59480487785433!3d29.105220820180755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d8d78522f1c3d%3A0x3c4e4e4aaec68a13!2sHanuman%20Bhatta%20company!5e1!3m2!1sen!2sin!4v1771436018793!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hanuman Bhatta Company Kiln Map"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
