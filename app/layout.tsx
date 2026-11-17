import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

// Inter for clean, readable body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Roboto Slab for rugged, industrial headings (variable font supporting 100-900)
const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hanuman-bhatta-gohana.vercel.app'),
  
  title: {
    default: 'Hanuman Bhatta Company | Premium Red Clay Bricks & Eent Bhatta in Gohana, Haryana',
    template: '%s | Hanuman Bhatta Company Gohana',
  },
  
  description: 'Hanuman Bhatta Company is a premier red clay brick manufacturer (ईंट भट्टा) located in Kahlpa, Gohana, Haryana. We manufacture and supply high-strength Grade-1 and Grade-2 construction bricks directly from the kiln to builders, contractors, and homeowners across Gohana, Sonipat, Rohtak, and Jind.',
  
  keywords: [
    // Core Brand & Location
    'Hanuman Bhatta Company', 'Hanuman Bhatta Gohana', 'Hanuman Eent Bhatta',
    'Brick manufacturer in Gohana', 'Eent Bhatta in Gohana', 'Bricks supplier in Gohana',
    'Bricks supplier near Gohana', 'Red clay bricks in Haryana', 'Construction bricks in Haryana',
    'Brick kiln in Gohana', 'Brick manufacturer in Rohtak', 'Bricks supplier in Sonipat',
    'Quality bricks in Jind', 'Brick manufacturer near me', 'Brick kiln near me',
    
    // Hindi & Regional Terms
    'ईंट भट्टा', 'ईंट भट्टा गोहाना', 'हनुमान भट्टा कंपनी', 'लाल ईंट', 'अव्वल ईंट',
    'दोयम ईंट', 'मिट्टी की ईंट', 'भट्टा', 'eent bhatta', 'laal eent', 'avval eent',
    'doyam eent', 'rora', 'brick bats',
    
    // Product & Intent Terms
    'red clay bricks', 'clay bricks for house construction', 'first class bricks',
    'second class bricks', 'brick trolley price Gohana', 'bulk brick orders Haryana',
    'brick calculator', 'building material supplier Gohana', 'brick supplier Haryana'
  ],
  
  authors: [{ name: 'Hanuman Bhatta Company', url: 'https://hanuman-bhatta-gohana.vercel.app' }],
  creator: 'Hanuman Bhatta Company',
  publisher: 'Hanuman Bhatta Company',
  
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
    url: 'https://hanuman-bhatta-gohana.vercel.app',
    siteName: 'Hanuman Bhatta Company',
    title: 'Hanuman Bhatta Company | Red Clay Brick Manufacturer in Gohana, Haryana',
    description: 'Direct kiln-fired red clay bricks (अव्वल व दोयम ईंट). High compressive strength and dependable trolley delivery for house builders and contractors in Gohana, Sonipat, Rohtak, and Jind.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hanuman Bhatta Company - Red Clay Brick Manufacturer in Gohana, Haryana',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Hanuman Bhatta Company | Red Clay Bricks Gohana, Haryana',
    description: 'Trusted brick manufacturer in Kahlpa, Gohana. High compressive strength red clay bricks for durable construction.',
    images: ['/twitter-image.jpg'],
  },
  
  verification: {
    google: 'GPXdLVfz7VrN1GQvtheZckmthkPYJKhFporw7MmlKDk',
  },
  
  category: 'construction',
  
  alternates: {
    canonical: 'https://hanuman-bhatta-gohana.vercel.app',
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
