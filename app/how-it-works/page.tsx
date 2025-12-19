'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Product',
      description: 'Select from our NFC cards or QR stickers based on your needs and budget.',
      details: [
        'NFC cards for premium protection',
        'QR stickers for quick recovery',
        'Both provide 24/7 coverage'
      ]
    },
    {
      number: 2,
      title: 'Attach & Register',
      description: 'Attach your product to your valuable item and register it in your account.',
      details: [
        'Simple registration process',
        'Add item details and photos',
        'Set up emergency contacts'
      ]
    },
    {
      number: 3,
      title: 'Get Found',
      description: 'When someone finds your item, they can easily contact you through our app.',
      details: [
        'Instant notifications',
        'Direct messaging system',
        'Secure payment for finders'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-gray-600 text-lg">Our simple 3-step process makes item recovery effortless</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
                <p className="text-gray-600 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, detailIdx) => (
                    <li key={detailIdx} className="flex items-start">
                      <Check className="w-5 h-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Back2You?</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Discovery</h3>
                <p className="text-gray-600">Your items are discoverable instantly when someone scans your NFC card or QR code.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Chat</h3>
                <p className="text-gray-600">Communicate directly with finders through our secure in-app messaging system.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Location Tracking</h3>
                <p className="text-gray-600">Know exactly where your item is and track the finder's location for safe pickup.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                <p className="text-gray-600">Reward finders safely with our integrated payment system. No direct financial information shared.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Coverage</h3>
                <p className="text-gray-600">Our system works around the clock to help you recover your lost items anytime, anywhere.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Network</h3>
                <p className="text-gray-600">Connect with a worldwide community of users dedicated to helping each other recover valuables.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Protect your valuables today with our simple and affordable solutions.</p>
          <Link href="/shop" className="inline-block px-8 py-3 bg-white text-gray-900 font-medium rounded hover:bg-gray-100">
            Browse Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/shop" className="hover:text-gray-900">Shop</Link></li>
                <li><Link href="/how-it-works" className="hover:text-gray-900">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/news-feed" className="hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Twitter</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Back2You. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
