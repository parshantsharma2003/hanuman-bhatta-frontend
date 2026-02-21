import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About the Bhatta | Hanuman Bhatta Legacy & Quality Commitment',
  description:
    'Read the story of Hanuman Bhatta, our founder-led values, and the practical quality process that local families and builders trust.',
  keywords: [
    'brick manufacturer',
    'clay bricks',
    'Eent Bhatta',
    'quality bricks',
    'brick supplier',
    'local brick manufacturer',
    'red clay bricks',
  ],
  openGraph: {
    title: 'About the Bhatta | Legacy, Founder Story, and Quality Promise',
    description: 'Explore our local journey, founder values, and the honest quality standards we follow at Hanuman Bhatta.',
    type: 'website',
    siteName: 'Hanuman Bhatta',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About the Bhatta | Hanuman Bhatta',
    description: 'Family-led brick legacy focused on trust, consistency, and uncompromising quality.',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
