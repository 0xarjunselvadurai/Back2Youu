'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function Shop() {
  const products = [
    {
      id: 1,
      name: 'NFC Card',
      price: 4.99,
      description: 'Durable NFC card for tracking your valuables',
      features: ['Waterproof', 'Thin & lightweight', 'Instant notifications', 'Lifetime access']
    },
    {
      id: 2,
      name: 'QR Sticker',
      price: 1.99,
      description: 'Adhesive QR sticker for quick recovery',
      features: ['Easy to apply', 'Durable coating', '24/7 alerts', 'Global reach']
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Shop Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">Choose the perfect solution to protect your valuables</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-gray-900 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 bg-gray-900 text-white font-semibold rounded hover:bg-gray-800 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
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
