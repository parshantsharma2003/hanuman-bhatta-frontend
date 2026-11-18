import React from 'react';
import { FAQ_DATA } from '@/lib/faqData';

export default function JsonLd() {
  const baseUrl = 'https://hanuman-bhatta-gohana.vercel.app';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'Hanuman Bhatta Company',
    alternateName: [
      'Hanuman Bhatta Gohana',
      'Hanuman Eent Bhatta',
      'हनुमान भट्टा कंपनी',
      'Hanuman Brick Kiln Kahlpa',
    ],
    description:
      'Hanuman Bhatta Company is a trusted red clay brick manufacturer and eent bhatta located in Kahlpa, Gohana, Haryana. We manufacture and supply high-strength Grade-1 and Grade-2 construction bricks directly from the kiln to builders, contractors, and homeowners.',
    url: baseUrl,
    telephone: '+919996669463',
    email: 'info@hanumanbhatta.com',
    priceRange: '₹₹',
    image: `${baseUrl}/placeholder-brick-kiln.svg`,
    logo: `${baseUrl}/favicon.svg`,
    hasMap:
      'https://www.google.com/maps/place/Hanuman+Bhatta+company/@29.1052208,76.5948049,19z/data=!3m1!4b1!4m6!3m5!1s0x390d8d78522f1c3d:0x3c4e4e4aaec68a13!8m2!3d29.1052208!4d76.5954486!16s%2Fg%2F11t_5ns_6j',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kahlpa-Bhanderi Road, V.P.O. Kahlpa',
      addressLocality: 'Gohana',
      addressRegion: 'Haryana',
      postalCode: '131301',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.1052208,
      longitude: 76.5954486,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Gohana' },
      { '@type': 'City', name: 'Sonipat' },
      { '@type': 'City', name: 'Rohtak' },
      { '@type': 'City', name: 'Jind' },
      { '@type': 'City', name: 'Safidon' },
      { '@type': 'City', name: 'Panipat' },
      { '@type': 'AdministrativeArea', name: 'Haryana' },
    ],
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'First-Class Red Clay Bricks (अव्वल ईंट)',
          description:
            'Premium Grade-1 kiln-fired red clay bricks with 10.5+ N/mm² compressive strength, uniform terracotta color, and metallic ringing sound for load-bearing walls.',
        },
      },
      {
        '@type': 'Offer',
        price: '8.00',
        priceCurrency: 'INR',
        itemOffered: {
          '@type': 'Product',
          name: 'Second Class Bricks (Duyam / 2 Number Eent / दुयम)',
          description:
            'Reliable Grade-2 construction bricks (Duyam / 2 Number Eent / दुयम) at 8 rupee per brick (₹8,000 per 1,000 bricks) for internal partition walls, boundary walls, and plastered masonry.',
        },
      },
      {
        '@type': 'Offer',
        price: '9.00',
        priceCurrency: 'INR',
        itemOffered: {
          '@type': 'Product',
          name: 'Premium Bricks',
          description:
            'High-strength premium kiln-fired red clay bricks at 9 rupee per brick (₹9,000 per 1,000 bricks) with 10.5+ N/mm² compressive strength for load-bearing walls and exterior structures.',
        },
      },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Hanuman Bhatta Company',
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919996669463',
      contactType: 'sales and customer service',
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kahlpa-Bhanderi Road, V.P.O. Kahlpa',
      addressLocality: 'Gohana',
      addressRegion: 'Haryana',
      postalCode: '131301',
      addressCountry: 'IN',
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Hanuman Bhatta Company',
    description:
      'Official website of Hanuman Bhatta Company - Red clay brick manufacturer and supplier in Gohana, Haryana.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: ['en-IN', 'hi-IN'],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Our Bricks',
        item: `${baseUrl}/#products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Manufacturing Process',
        item: `${baseUrl}/#process`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Brick Calculator',
        item: `${baseUrl}/#calculator`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact & Location',
        item: `${baseUrl}/#contact`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
