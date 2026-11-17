'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, MapPin, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  projectType: 'House' | 'Boundary Wall' | 'Commercial' | 'Infrastructure';
  text: string;
  isVerified: boolean;
  isActive: boolean;
}

// Testimonial data - structured for easy backend migration
const testimonials: Testimonial[] = [
  {
    id: 'testimonial-001',
    name: 'Ramesh Kumar',
    location: 'Gohana',
    projectType: 'House',
    text: 'Avval quality eent ghar banane ke liye li thi. Majboot aur ek jaisi size ki thi. Bhatta wale ne delivery bhi time par di.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-002',
    name: 'Sunita Devi',
    location: 'Baroda',
    projectType: 'Boundary Wall',
    text: 'Humne apne ghar ke paas boundary wall banaya. Eent bilkul mazbut thi. Ek saal ho gaya, abhi tak koyi dikkat nahi aaya.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-003',
    name: 'Vikram Singh',
    location: 'Sonipat',
    projectType: 'Commercial',
    text: 'Badi commercial building bana raha tha. Quality consistent rahi aur bulk trolley order mein achcha rate mila. Bilkul reliable supplier.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-004',
    name: 'Priya Joshi',
    location: 'Mundlana',
    projectType: 'House',
    text: 'Bhatta se second quality eent li thi. Sasti bhi thi aur quality bhi achhi. Contractor ko bhi pasand aaya.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-005',
    name: 'Ajay Yadav',
    location: 'Rohtak Road',
    projectType: 'Infrastructure',
    text: 'Construction project mein hazaron eent lagti hain. Shape consistency, solid strength aur time par trolley delivery - sabse better bhatta yahi hai.',
    isVerified: true,
    isActive: true,
  },
  {
    id: 'testimonial-006',
    name: 'Mohini Kumari',
    location: 'Jind Road',
    projectType: 'House',
    text: 'Pehli baar direct bhatta se order kiya tha. Eent ki pakaayi aur finish bilkul sahi nikli, mistri ne bhi tareef ki.',
    isVerified: true,
    isActive: true,
  },
];

const projectTypeStyles = {
  House: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'House Construction' },
  'Boundary Wall': { bg: 'bg-green-100', text: 'text-green-700', label: 'Boundary Wall' },
  Commercial: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Commercial' },
  Infrastructure: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Infrastructure' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function Testimonials({
  title = 'What Our Customers Say',
  subtitle = 'Real voices from builders and homeowners in our region.',
  limit = undefined,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
} = {}) {
  // Filter active testimonials and apply limit if specified
  const activeTestimonials = testimonials.filter((t) => t.isActive).slice(0, limit);

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-b from-white via-sandy-50 to-white ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="section-heading mb-4">
            {title.split(/(?=\w+\s*$)/)[0]}
            <span className="text-gradient">{title.match(/\w+\s*$/)?.[0]}</span>
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activeTestimonials.map((testimonial) => {
            const projectStyle = projectTypeStyles[testimonial.projectType];
            return (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                className="group relative bg-white border-2 border-sandy-300 rounded-xl p-8 hover:shadow-brick-lg hover:border-terracotta transition-all duration-300 flex flex-col h-full"
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-terracotta/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>

                {/* Quote Icon */}
                <div className="relative z-10 mb-4">
                  <Quote className="w-8 h-8 text-terracotta/40" />
                </div>

                {/* Testimonial Text */}
                <p className="text-charcoal-700 text-base leading-relaxed mb-6 flex-grow relative z-10">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px bg-sandy-300 mb-6 relative z-10"></div>

                {/* Customer Info + Badges */}
                <div className="space-y-4 relative z-10">
                  {/* Name and Verification */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="font-bold text-charcoal-900">{testimonial.name}</p>
                      <div className="flex items-center gap-1 text-sm text-charcoal-600 mt-1">
                        <MapPin className="w-4 h-4 text-terracotta" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                    {testimonial.isVerified && (
                      <div
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-200"
                        title="Verified Customer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Project Type Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${projectStyle.bg} ${projectStyle.text}`}
                    >
                      {projectStyle.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-charcoal-700 mb-6">
            Join hundreds of satisfied customers across the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919996669463?text=Hello%20Hanuman%20Bhatta,%20I%20would%20like%20to%20enquire%20about%20brick%20orders."
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Now on WhatsApp
            </a>
            <a
              href="tel:+919996669463"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
            >
              Call for More Details
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
