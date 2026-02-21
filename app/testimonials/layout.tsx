import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Customer Testimonials | Verified Trust Reviews by Hanuman Bhatta Clients',
  description:
    'Read verified customer testimonials from builders and homeowners who trust Hanuman Bhatta for consistent quality, reliable delivery, and long-term service.',
  keywords: [
    'brick supplier reviews',
    'customer testimonials',
    'verified reviews',
    'Eent Bhatta feedback',
    'quality bricks reviews',
  ],
  openGraph: {
    title: 'Customer Testimonials | Verified Client Trust at Hanuman Bhatta',
    description: 'Explore verified customer feedback that reflects our legacy of dependable quality and service.',
    type: 'website',
    siteName: 'Hanuman Bhatta',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Testimonials | Hanuman Bhatta',
    description: 'Verified reviews highlighting trust, quality consistency, and reliable support.',
  },
};

export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  return children;
}
