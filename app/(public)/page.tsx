import Hero from '@/components/Hero';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import FaqSection from '@/components/FaqSection';

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

// SSR enabled for complete search engine and AI crawler crawlability
const InventoryTicker = dynamic(() => import('@/components/InventoryTicker'), {
  loading: () => <SectionLoader label="Loading live inventory..." />,
});

const OurProcess = dynamic(() => import('@/components/OurProcess'), {
  loading: () => <SectionLoader label="Loading manufacturing process..." />,
});

const ProductCatalog = dynamic(() => import('@/components/ProductCatalog'), {
  loading: () => <SectionLoader label="Loading product catalog..." />,
});

const BrickCalculator = dynamic(() => import('@/components/BrickCalculator'), {
  loading: () => <SectionLoader label="Loading brick calculator..." />,
});

const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <SectionLoader label="Loading gallery..." />,
});

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <SectionLoader label="Loading contact form..." />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <SectionLoader label="Loading footer..." />,
});

export const metadata: Metadata = {
  title: 'Hanuman Bhatta Company | Premium Red Clay Bricks & Eent Bhatta in Gohana, Haryana',
  description:
    'Hanuman Bhatta Company is a trusted red clay brick manufacturer (ईंट भट्टा) located in Kahlpa, Gohana, Haryana. Supplying high-strength Grade-1 and Grade-2 construction bricks directly from the kiln to builders, contractors, and homeowners across Gohana, Sonipat, Rohtak, and Jind.',
  alternates: {
    canonical: 'https://hanuman-bhatta-gohana.vercel.app',
  },
  openGraph: {
    title: 'Hanuman Bhatta Company | Red Clay Brick Manufacturer in Gohana, Haryana',
    description:
      'Direct kiln-fired red clay bricks (अव्वल व दोयम ईंट). High compressive strength and dependable tractor-trolley delivery across Gohana, Sonipat, Rohtak, and Jind.',
    url: 'https://hanuman-bhatta-gohana.vercel.app',
    siteName: 'Hanuman Bhatta Company',
    locale: 'en_IN',
    type: 'website',
  },
  verification: {
    google: 'GPXdLVfz7VrN1GQvtheZckmthkPYJKhFporw7MmlKDk',
  },
};

export default function Home() {
  return (
    <>
      {/* Search Engine & AI Structured Data */}
      <JsonLd />

      <main className="min-h-screen bg-sandy text-charcoal">
        {/* Hero Section */}
        <Hero />

        {/* Live Inventory Ticker */}
        <InventoryTicker />

        {/* Section Separator with Icon */}
        <div className="relative py-8 bg-gradient-to-b from-sandy-50 to-white overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="p-3 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-brick">
                <div className="text-2xl">🔥</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Our Process Section */}
        <OurProcess />

        {/* Section Separator with Icon */}
        <div className="relative py-8 bg-gradient-to-b from-white to-sandy-50 overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="p-3 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-brick">
                <div className="text-2xl">🧱</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Product Catalog Section */}
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

        {/* Calculator Section */}
        <section id="calculator" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-sandy-50 to-sandy-50 scroll-mt-20">
          <div className="container-custom">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="section-heading">
                Calculate Your <span className="text-gradient">Brick Requirements</span>
              </h2>
              <p className="section-subheading mx-auto mt-4">
                Get instant estimates for your construction project with our intelligent brick calculator. Estimates include standard mortar margins and wastage.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <BrickCalculator />
            </div>
          </div>
        </section>

        {/* Section Separator with Icon */}
        <div className="relative py-8 bg-gradient-to-b from-sandy-50 to-white overflow-hidden">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sandy-400 to-sandy-400"></div>
              <div className="p-3 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-brick">
                <div className="text-2xl">💡</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-sandy-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Generative Engine Optimization (GEO) & FAQ Section */}
        <FaqSection />

        {/* Section Separator - Final */}
        <div className="relative h-12 bg-gradient-to-b from-sandy-50 to-sandy-100 overflow-hidden">
          <div className="absolute inset-0 brick-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent"></div>
        </div>

        {/* Contact Form & Google Maps Section */}
        <ContactForm />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
