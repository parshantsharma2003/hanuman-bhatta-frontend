'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle, Phone, User, Send, MapPin, Mail, CheckCircle, XCircle } from 'lucide-react';
import { trackMetric } from '@/lib/analytics';

// Validation schema
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

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to submit your enquiry');
      }

      setSubmitSuccess('Thank you! Your enquiry has been submitted successfully.');
      reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit your enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-sandy-50 via-white to-sandy-50 scroll-mt-20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
          {/* Left Column - Contact Info & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            {/* Section Header */}
            <div>
              <h2 className="section-heading text-left">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="section-subheading text-left mt-4">
                Have questions about our products? Need a custom quote? We&apos;re here to help build your vision.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 md:space-y-6">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-br from-sandy-100 to-white rounded-xl border-2 border-sandy-300 shadow-brick hover:shadow-brick-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal mb-1">Call Us</h3>
                  <a
                    href="tel:+918295669463"
                    onClick={() => trackMetric('call_click')}
                    className="text-terracotta hover:text-terracotta-600 transition-colors font-semibold"
                  >
                    +91 82956 69463
                  </a>
                  <p className="text-xs text-charcoal-500 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                </div>
              </motion.div>

              {/* WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-br from-sandy-100 to-white rounded-xl border-2 border-sandy-300 shadow-brick hover:shadow-brick-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/918295669463"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackMetric('whatsapp_click')}
                    className="text-terracotta hover:text-terracotta-600 transition-colors font-semibold"
                  >
                    Chat with us
                  </a>
                  <p className="text-xs text-charcoal-500 mt-1">Quick response guaranteed</p>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-br from-sandy-100 to-white rounded-xl border-2 border-sandy-300 shadow-brick hover:shadow-brick-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal mb-1">Visit Our Bhatta</h3>
                  <p className="text-charcoal-700 text-sm">
                    Kahlpa-Bhanderi road<br />
                    Kahlpa, Gohana - 131301
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-r from-terracotta to-terracotta-600 text-white p-5 md:p-6 lg:p-7 rounded-2xl shadow-brick"
            >
              <p className="text-sm font-semibold mb-2">💪 Built on Trust</p>
              <h3 className="text-2xl font-bold font-display mb-1">15+ Years of Excellence</h3>
              <p className="text-sandy-100 text-sm">
                Serving the construction industry with high-quality bricks and reliable service
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="bg-white rounded-2xl shadow-brick-lg border-2 border-sandy-300 p-4 md:p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 brick-pattern opacity-5"></div>

              {/* Form Header */}
              <div className="relative mb-6 md:mb-8">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-terracotta" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-charcoal font-display">Send us a Message</h3>
                </div>
                <p className="text-charcoal-600 text-sm">
                  Fill out the form below and our team will get back to you shortly
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-sandy-300 bg-sandy-50'
                      } focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all duration-200 text-charcoal placeholder:text-charcoal-400`}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      id="name-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 font-medium"
                      role="alert"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border-2 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-sandy-300 bg-sandy-50'
                      } focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all duration-200 text-charcoal placeholder:text-charcoal-400`}
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      id="phone-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 font-medium"
                      role="alert"
                    >
                      {errors.phone.message}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                    Your Message *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-charcoal-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={5}
                      placeholder="Tell us about your requirements..."
                      className={`w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border-2 ${
                        errors.message ? 'border-red-500 bg-red-50' : 'border-sandy-300 bg-sandy-50'
                      } focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all duration-200 text-charcoal placeholder:text-charcoal-400 resize-none`}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                  </div>
                  {errors.message && (
                    <motion.p
                      id="message-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 font-medium"
                      role="alert"
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-terracotta to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-brick hover:shadow-brick-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Submit contact form"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm font-semibold flex items-start gap-2"
                    role="alert"
                  >
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 text-sm font-semibold flex items-start gap-2"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{submitSuccess}</span>
                  </motion.div>
                )}

                {/* Privacy Note */}
                <p className="text-xs text-charcoal-500 text-center">
                  🔒 Your information is secure and will only be used to contact you
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-charcoal font-display mb-2">
              Find Us on the <span className="text-gradient">Map</span>
            </h3>
            <p className="text-charcoal-600">
              Visit our brick kiln for product inspection and bulk orders
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-brick-lg border-2 border-sandy-300 p-4 overflow-hidden">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden bg-sandy-100">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1585.1293907390345!2d76.59480487785433!3d29.105220820180755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d8d78522f1c3d%3A0x3c4e4e4aaec68a13!2sHanuman%20Bhatta%20company!5e1!3m2!1sen!2sin!4v1771436018793!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hanuman Bhatta Location - Brick Kiln Manufacturing Unit"
                aria-label="Google Maps showing the location of Hanuman Bhatta brick manufacturing facility"
                className="rounded-lg"
              />
            </div>

            {/* Map Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4">
              <a
                href="https://www.google.com/maps/place/Hanuman+Bhatta+company/@29.1052208,76.5948049,19z/data=!3m1!4b1!4m6!3m5!1s0x390d8d78522f1c3d:0x3c4e4e4aaec68a13!8m2!3d29.1052208!4d76.5954486!16s%2Fg%2F11t_5ns_6j"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg shadow-brick hover:shadow-brick-lg transition-all duration-300 text-sm md:text-base"
              >
                <MapPin className="w-5 h-5" />
                Open in Google Maps
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=29.105220820180755,76.59480487785433&destination_place_id=ChIJPRwo1Xi9EDkRE4rsquROTjw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-sandy-50 text-terracotta border-2 border-terracotta font-semibold py-3 px-6 rounded-lg shadow-brick hover:shadow-brick-lg transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
