import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Customer Reviews | Hanuman Bhatta Company - Gohana, Haryana',
  description:
    'Read approved customer reviews for Hanuman Bhatta Company, including local feedback on red clay brick quality, kiln pricing, and trolley delivery across Gohana and nearby Haryana regions.',
  alternates: {
    canonical: 'https://hanuman-bhatta-gohana.vercel.app/reviews',
  },
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
