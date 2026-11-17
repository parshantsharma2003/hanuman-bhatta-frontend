import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Client Testimonials | Hanuman Bhatta Company - Gohana, Haryana',
  description:
    'Read verified testimonials from homeowners, contractors, and builders across Gohana, Sonipat, Rohtak, and Jind who rely on Hanuman Bhatta Company for quality red clay bricks.',
  alternates: {
    canonical: 'https://hanuman-bhatta-gohana.vercel.app/testimonials',
  },
  keywords: [
    'Hanuman Bhatta reviews',
    'brick supplier testimonials Gohana',
    'customer feedback brick kiln Haryana',
    'Eent Bhatta Gohana reviews',
    'red clay bricks feedback',
  ],
  openGraph: {
    title: 'Customer Testimonials | Hanuman Bhatta Company Gohana',
    description: 'Explore verified client feedback reflecting our legacy of dependable quality and on-time trolley brick delivery across Haryana.',
    type: 'website',
    url: 'https://hanuman-bhatta-gohana.vercel.app/testimonials',
    siteName: 'Hanuman Bhatta Company',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Testimonials | Hanuman Bhatta Company Gohana',
    description: 'Verified reviews highlighting trust, brick strength, and reliable support from Hanuman Bhatta Company.',
  },
};

export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  return children;
}
