import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Customer Reviews | Verified Brick Buyer Feedback',
  description:
    'Read approved customer reviews for Hanuman Bhatta, including local feedback on brick quality, delivery, and service.',
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
