import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import QueryProvider from '@/components/providers/QueryProvider';

// Inter for clean, readable body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Roboto Slab for rugged, industrial headings
const robotoSlab = Roboto_Slab({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hanumanbhatta.com'), // Replace with actual domain
  
  title: {
    default: 'Hanuman Bhatta - Premium Red Clay Brick Manufacturing | Eent Bhatta',
    template: '%s | Hanuman Bhatta',
  },
  
  description: 'Premium quality red clay bricks (ईंट) for construction. First-class and second-class bricks manufactured with 25+ years of traditional expertise and modern techniques. Trusted brick supplier for builders, contractors, and architects.',
  
  keywords: [
    // Hindi/Local terms
    'eent bhatta', 'ईंट भट्टा', 'eent', 'ईंट', 'laal eent', 'लाल ईंट',
    'mitti ki eent', 'मिट्टी की ईंट', 'bhatta', 'भट्टा',
    'eent bhatta near me', 'ईंट भट्टा near me',
    
    // English terms - Product types
    'red clay bricks', 'clay bricks', 'building bricks', 'construction bricks',
    'first class bricks', 'second class bricks', 'premium bricks', 'quality bricks',
    'brick bats', 'rora', 'broken bricks',
    'red clay bricks supplier', 'red clay brick supplier',
    
    // Manufacturing & Business
    'brick manufacturing', 'brick kiln', 'brick factory', 'brick supplier',
    'brick manufacturer', 'brick production', 'traditional bricks',
    
    // Location-based (customize as needed)
    'brick supplier near me', 'brick kiln near me', 'local brick supplier',
    'brick factory', 'local brick manufacturer',
    'City Name brick supplier', 'City Name eent bhatta',
    'District Name brick kiln', 'State brick manufacturer',
    
    // Construction-related
    'wall construction', 'building materials', 'construction materials',
    'masonry bricks', 'structural bricks', 'load bearing bricks',
    
    // Business terms
    'bulk brick orders', 'brick dealer', 'brick wholesale', 'brick trolley',
    'brick calculator', 'brick estimation', 'brick requirements',
  ],
  
  authors: [{ name: 'Hanuman Bhatta' }],
  
  creator: 'Hanuman Bhatta',
  
  publisher: 'Hanuman Bhatta',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN'],
    url: 'https://hanumanbhatta.com', // Replace with actual URL
    siteName: 'Hanuman Bhatta',
    title: 'Hanuman Bhatta - Premium Red Clay Brick Manufacturing',
    description: 'Premium quality red clay bricks (ईंट) for construction. 25+ years of expertise. First-class and second-class bricks. Trusted by 500+ builders and contractors.',
    images: [
      {
        url: '/og-image.jpg', // Add actual OG image
        width: 1200,
        height: 630,
        alt: 'Hanuman Bhatta - Premium Red Clay Brick Manufacturing',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Hanuman Bhatta - Premium Red Clay Brick Manufacturing',
    description: 'Premium quality red clay bricks for construction. 25+ years of expertise. Trusted by 500+ builders.',
    images: ['/twitter-image.jpg'], // Add actual Twitter card image
    creator: '@hanumanbhatta', // Replace with actual Twitter handle if available
  },
  
  verification: {
    google: 'your-google-verification-code', // Add Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  category: 'construction',
  
  alternates: {
    canonical: 'https://hanumanbhatta.com', // Replace with actual URL
  },
  
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable}`}>
      <body className="min-h-screen bg-sandy text-charcoal">
        <LanguageProvider>
          <QueryProvider>{children}</QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
