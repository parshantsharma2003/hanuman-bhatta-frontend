import Link from 'next/link';
import { ArrowLeft, Home, Calculator, Phone, Package } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Hanuman Bhatta Company Gohana',
  description: 'The requested page could not be found. Explore red clay bricks, brick calculator, or contact Hanuman Bhatta Company in Gohana, Haryana.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sandy-50 flex flex-col justify-between text-charcoal font-sans">
      <header className="border-b border-sandy-300 bg-white/90 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-6 bg-[#B8402C] rounded-[2px] flex items-center justify-center text-white text-[10px] font-mono font-bold tracking-wider">
              HB
            </div>
            <span className="text-xl font-bold font-display text-[#242321] tracking-tight">
              Hanuman Bhatta Company
            </span>
          </Link>
          <a
            href="tel:+919996669463"
            className="hidden sm:inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-terracotta-dark transition-colors"
          >
            <Phone size={16} />
            <span>+91 99966 69463</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white border-2 border-sandy-300 rounded-2xl p-8 sm:p-12 shadow-brick text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terracotta/10 text-terracotta font-display font-extrabold text-4xl mb-6">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-charcoal-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-charcoal-600 mb-8 leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily unavailable. 
            You can return to the homepage or explore our brick manufacturing and estimation tools below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3 px-5 rounded-xl transition-all shadow-brick text-sm"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center justify-center gap-2 bg-sandy-100 hover:bg-sandy-200 text-charcoal-900 font-bold py-3 px-5 rounded-xl border border-sandy-300 transition-all text-sm"
            >
              <Package size={18} />
              <span>Our Bricks Range</span>
            </Link>
            <Link
              href="/#calculator"
              className="inline-flex items-center justify-center gap-2 bg-sandy-100 hover:bg-sandy-200 text-charcoal-900 font-bold py-3 px-5 rounded-xl border border-sandy-300 transition-all text-sm"
            >
              <Calculator size={18} />
              <span>Brick Calculator</span>
            </Link>
            <a
              href="https://wa.me/919996669463?text=Hello%20Hanuman%20Bhatta,%20I%20need%20assistance%20with%20brick%20pricing%20and%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-5 rounded-xl transition-all text-sm"
            >
              <Phone size={18} />
              <span>WhatsApp Us</span>
            </a>
          </div>

          <div className="border-t border-sandy-200 pt-6 text-xs text-charcoal-500">
            <p>Hanuman Bhatta Company • Kahlpa-Bhanderi Road, V.P.O. Kahlpa, Gohana, Haryana 131301</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-sandy-300 bg-white px-6 py-4 text-center text-xs text-charcoal-500">
        © {new Date().getFullYear()} Hanuman Bhatta Company. All rights reserved.
      </footer>
    </div>
  );
}
