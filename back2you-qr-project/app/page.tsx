'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import QRScanner from './components/QRScanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Use Responsive Navbar Component */}
      <Navbar />

      {/* Hero Section - Fully Responsive */}
      <section className="bg-white py-[clamp(3rem,10vw,5rem)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="font-bold text-gray-900 mb-[clamp(1rem,2vw,1.5rem)] leading-tight"
              style={{fontSize: 'clamp(1.75rem, 6vw, 3.5rem)'}}>
              Recover Your Lost Items
            </h1>
            <p className="mb-[clamp(1.5rem,3vw,2rem)] leading-relaxed"
              style={{fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#4b5563'}}>
              Connect with finders using NFC cards, QR codes, and 8-digit codes.<br/>Secure, fast, and reliable recovery.
            </p>
            <Link
              href="/shop"
              className="inline-block px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
              style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* QR Scanner Section */}
      <section className="bg-gray-100 py-[clamp(3rem,8vw,4rem)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-bold mb-[clamp(1rem,2vw,1.5rem)]"
            style={{fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'}}>
            Scan Your QR Code
          </h2>
          <QRScanner />
        </div>
      </section>

      {/* CTA Section - Fluid Typography */}
      <section className="bg-gray-900 text-white py-[clamp(3rem,8vw,4rem)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-bold mb-[clamp(1rem,2vw,1.5rem)]"
            style={{fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'}}>
            Start Protecting Your Items Today
          </h2>
          <p className="text-gray-300 mb-[clamp(1.5rem,3vw,2rem)] max-w-2xl mx-auto"
            style={{fontSize: 'clamp(0.875rem, 2vw, 1rem)'}}>
            Join thousands of users who have successfully recovered their lost items with Back2You.
          </p>
          <Link
            href="/register"
            className="inline-block px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)] bg-white text-gray-900 font-medium rounded hover:bg-gray-100 transition"
            style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer - Responsive Layout */}
      <footer className="bg-white border-t border-gray-200 py-[clamp(2rem,5vw,3rem)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,3vw,2rem)] mb-[clamp(1.5rem,2vw,2rem)]">
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Product
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link></li>
                <li><Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Company
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/news-feed" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Legal
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-[clamp(1.5rem,2vw,2rem)] text-center"
            style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)', color: '#6b7280'}}>
            <p>&copy; 2024 Back2You. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}