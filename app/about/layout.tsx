import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About Us | Hanuman Bhatta Company - Brick Kiln in Gohana, Haryana',
  description:
    'Learn about Hanuman Bhatta Company in Kahlpa, Gohana. Our kiln manufacturing heritage, traditional clay firing, stringent quality checks, and dependable supply for Haryana builders.',
  alternates: {
    canonical: 'https://hanuman-bhatta-gohana.vercel.app/about',
  },
  keywords: [
    'About Hanuman Bhatta Company',
    'brick manufacturer in Gohana',
    'clay bricks Haryana',
    'Eent Bhatta Gohana',
    'quality red clay bricks',
    'brick supplier Sonipat',
    'brick supplier Rohtak',
    'local brick kiln Haryana',
  ],
  openGraph: {
    title: 'About Hanuman Bhatta Company | Brick Kiln in Gohana, Haryana',
    description: 'Explore our local brick manufacturing journey, founder values, and the honest quality standards we uphold at Hanuman Bhatta Company.',
    type: 'website',
    url: 'https://hanuman-bhatta-gohana.vercel.app/about',
    siteName: 'Hanuman Bhatta Company',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Hanuman Bhatta Company | Gohana, Haryana',
    description: 'Trusted brick manufacturer in Gohana focused on strength, consistency, and kiln-direct supply.',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
