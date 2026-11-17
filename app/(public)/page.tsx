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

      <main className="min-h-screen bg-sand text-charcoal">
        {/* Hero Section */}
        <Hero />

        {/* Live Inventory & Dispatch Capacity */}
        <InventoryTicker />

        {/* Manufacturing Process */}
        <OurProcess />

        {/* Product Catalog & Technical Specifications */}
        <ProductCatalog />

        {/* Facility & Production Gallery */}
        <Gallery />

        {/* Architectural Brick Estimator */}
        <section id="calculator" className="py-20 md:py-28 bg-white border-y border-sand-300 scroll-mt-20">
          <div className="container-custom">
            <div className="max-w-3xl mb-12 md:mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 block">
                Quantity Planning &amp; Estimation
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-charcoal tracking-tight">
                Calculate Brick Requirements
              </h2>
              <p className="mt-4 text-base md:text-lg text-charcoal-600 leading-relaxed">
                Estimate required brick volume, mortar allowance, and standard tractor-trolley loads for residential or commercial construction walls.
              </p>
            </div>
            
            <div className="max-w-5xl">
              <BrickCalculator />
            </div>
          </div>
        </section>

        {/* Generative Engine Optimization (GEO) & Factual FAQ Section */}
        <FaqSection />

        {/* Direct Kiln Contact, Inquiry & Logistics */}
        <ContactForm />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
