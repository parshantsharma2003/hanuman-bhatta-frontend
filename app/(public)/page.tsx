import Hero from '@/components/Hero';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const SectionLoader = ({ label }: { label: string }) => (
  <div className="py-16" aria-busy="true" aria-live="polite">
    <div className="container-custom">
      <div className="bg-white border-2 border-sandy-300 rounded-2xl p-6 shadow-brick">
        <div className="h-4 w-1/3 bg-sandy-200 rounded mb-3 animate-pulse" />
        <div className="h-3 w-2/3 bg-sandy-200 rounded mb-6 animate-pulse" />
        <p className="text-sm text-charcoal-500 font-medium">{label}</p>
      </div>
    </div>
  </div>
);

const InventoryTicker = dynamic(() => import('@/components/InventoryTicker'), {
  loading: () => <SectionLoader label="Loading live inventory..." />,
  ssr: false,
});

const OurProcess = dynamic(() => import('@/components/OurProcess'), {
  loading: () => <SectionLoader label="Loading manufacturing process..." />,
  ssr: false,
});

const ProductCatalog = dynamic(() => import('@/components/ProductCatalog'), {
  loading: () => <SectionLoader label="Loading product catalog..." />,
});

const BrickCalculator = dynamic(() => import('@/components/BrickCalculator'), {
  loading: () => <SectionLoader label="Loading brick calculator..." />,
  ssr: false,
});

const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <SectionLoader label="Loading gallery..." />,
  ssr: false,
});

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <SectionLoader label="Loading contact form..." />,
  ssr: false,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <SectionLoader label="Loading footer..." />,
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Home - Premium Red Clay Bricks & Eent Bhatta Services',
  description: 'Hanuman Bhatta - Local eent bhatta near you and trusted red clay bricks supplier. 25+ years of experience, first-class and second-class bricks, live inventory, quick quotes, and delivery across nearby areas.',
  openGraph: {
    title: 'Hanuman Bhatta - Premium Red Clay Brick Manufacturing',
    description: 'Local red clay bricks supplier and eent bhatta near you with 25+ years of experience. Quality bricks for every construction need.',
    url: 'https://hanumanbhatta.com',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Hanuman Bhatta Brick Manufacturing',
      },
    ],
  },
  verification: {
    google: 'GPXdLVfz7VrN1GQvtheZckmthkPYJKhFporw7MmlKDk',
  },
};

export default function Home() {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://hanumanbhatta.com',
    name: 'Hanuman Bhatta',
    alternateName: ['Hanuman Eent Bhatta', 'Hanuman Brick Manufacturing'],
    description: 'Local red clay brick manufacturer and eent bhatta near you with 25+ years of expertise in producing first-class and second-class bricks for construction.',
    url: 'https://hanumanbhatta.com',
    telephone: '+91-98765-43210', // Replace with actual phone
    email: 'info@hanumanbhatta.com', // Replace with actual email
    image: 'https://hanumanbhatta.com/og-image.jpg',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Industrial Area, Brick Kiln Zone',
      addressLocality: 'City Name', // Replace with actual city
      addressRegion: 'State', // Replace with actual state
      postalCode: '123456', // Replace with actual postal code
      addressCountry: 'IN',
    },
    areaServed: [
      'City Name',
      'District Name',
      'Nearby Towns',
      'Surrounding Villages',
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 28.6234567890123, // Replace with actual coordinates
        longitude: 77.1234567890123, // Replace with actual coordinates
      },
      geoRadius: '50 km',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.6234567890123, // Replace with actual coordinates
      longitude: 77.1234567890123, // Replace with actual coordinates
    },
    keywords: [
      'eent bhatta near me',
      'red clay bricks supplier',
      'brick kiln near me',
      'local brick manufacturer',
      'City Name brick supplier',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
    sameAs: [
      // Add social media links when available
      // 'https://www.facebook.com/hanumanbhatta',
      // 'https://www.instagram.com/hanumanbhatta',
      // 'https://twitter.com/hanumanbhatta',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Brick Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'First Class Red Clay Bricks',
            description: 'Premium quality first-class red clay bricks for load-bearing walls and structural applications',
            offers: {
              '@type': 'Offer',
              price: '8500',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Second Class Red Clay Bricks',
            description: 'Quality second-class bricks perfect for partition walls and non-load-bearing structures',
            offers: {
              '@type': 'Offer',
              price: '6500',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Brick Bats (Rora)',
            description: 'Economical brick bats for filling and leveling applications',
            offers: {
              '@type': 'Offer',
              price: '3500',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen">
        {/* Hero Section - Full viewport, no padding */}
        <Hero />

        {/* Section Separator with Pattern */}
        <div className="relative h-16 bg-gradient-to-b from-charcoal to-charcoal-900 overflow-hidden">
          <div className="absolute inset-0 brick-pattern opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terracotta to-transparent"></div>
        </div>

        {/* Live Inventory Ticker */}
        <InventoryTicker />

        {/* Section Separator - Subtle */}
        <div className="relative h-8 bg-gradient-to-b from-charcoal-900 to-sandy-50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta/20 to-transparent"></div>
        </div>

        {/* Our Process Section */}
        <OurProcess />

        {/* Section Separator with Decorative Element */}
        <div className="relative py-8 bg-gradient-to-b from-white to-sandy-50 overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-terracotta"></div>
                <div className="w-2 h-2 rounded-full bg-terracotta/60"></div>
                <div className="w-2 h-2 rounded-full bg-terracotta/30"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Product Catalog Section - Consistent padding */}
        <ProductCatalog />

        {/* Section Separator with Icon */}
        <div className="relative py-8 bg-gradient-to-b from-sandy-50 to-sandy-100 overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="p-3 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-brick">
                <div className="text-2xl">📸</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <Gallery />

        {/* Section Separator with Icon */}
        <div className="relative py-8 bg-gradient-to-b from-white to-white overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="p-3 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-brick">
                <div className="text-2xl">🧮</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Calculator Section - Enhanced spacing */}
        <section id="calculator" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-sandy-50 to-sandy-50 scroll-mt-20">
          <div className="container-custom">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="section-heading">
                Calculate Your <span className="text-gradient">Brick Requirements</span>
              </h2>
              <p className="section-subheading mx-auto mt-4">
                Get instant estimates for your construction project with our intelligent brick calculator
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <BrickCalculator />
            </div>
          </div>
        </section>

        {/* Section Separator - Final */}
        <div className="relative h-12 bg-gradient-to-b from-sandy-50 to-sandy-100 overflow-hidden">
          <div className="absolute inset-0 brick-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent"></div>
        </div>

        {/* Contact Form Section */}
        <ContactForm />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
