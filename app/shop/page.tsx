'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, X } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function Shop() {
  const products = [
    {
      id: 1,
      name: 'NFC Card',
      price: 399,
      description: 'Durable NFC card for tracking your valuables',
      features: ['Waterproof', 'Thin & lightweight', 'Instant notifications', 'Lifetime access']
    },
    {
      id: 2,
      name: 'QR Sticker',
      price: 149,
      description: 'Adhesive QR sticker for quick recovery',
      features: ['Easy to apply', 'Durable coating', '24/7 alerts', 'Pan-India reach']
    }
  ];

  const nfcProduct = products[0];
  const qrProduct = products[1];

  const qrCodeImages = [
    '/QR-CODES/QR1.png',
    '/QR-CODES/QR2.png',
    '/QR-CODES/QR3.png',
    '/QR-CODES/QR4.png',
    '/QR-CODES/QR5.png',
    '/QR-CODES/QR6.png',
    '/QR-CODES/QR7.png',
    '/QR-CODES/QR8.png',
    '/QR-CODES/QR9.png',
    '/QR-CODES/QR10.png',
    '/QR-CODES/QR11.png',
    '/QR-CODES/QR12.jpg',
  ];

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCodes, setSelectedQrCodes] = useState<string[]>([]);

  const toggleQrSelection = (src: string) => {
    setSelectedQrCodes((prev) =>
      prev.includes(src) ? prev.filter((item) => item !== src) : [...prev, src]
    );
  };

  const handleOpenQrModal = () => {
    setSelectedQrCodes([]);
    setIsQrModalOpen(true);
  };

  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
  };

  const selectedCount = selectedQrCodes.length;
  const totalAmount = selectedCount * qrProduct.price;

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

      {/* Product Sections: Left = NFC Tags, Right = QR Codes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: NFC Tags */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">NFC Tags</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="uppercase tracking-wide text-sm text-gray-500 font-semibold mb-1">Product</p>
                    <h3 className="text-2xl font-bold text-gray-900">{nfcProduct.name}</h3>
                    <p className="text-gray-600 mt-2">{nfcProduct.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{nfcProduct.price}</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {nfcProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-gray-900 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded hover:bg-gray-800 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Right: QR Codes */}
            <div className="md:border-l md:border-black md:pl-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Codes</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="uppercase tracking-wide text-sm text-gray-500 font-semibold mb-1">Product</p>
                    <h3 className="text-2xl font-bold text-gray-900">{qrProduct.name}</h3>
                    <p className="text-gray-600 mt-2">{qrProduct.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{qrProduct.price}</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {qrProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-gray-900 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded hover:bg-gray-800 flex items-center justify-center"
                  onClick={handleOpenQrModal}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>

              {/* QR Code Image Gallery (outside the Buy Now box) */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Sample QR Codes</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {qrCodeImages.map((src, index) => (
                    <div
                      key={src}
                      className="relative w-full pt-[115%] overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <Image
                        src={src}
                        alt={`QR code ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Buy Now Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Select Your QR Stickers</h3>
              <button
                onClick={handleCloseQrModal}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
          <div className="p-6 overflow-y-auto">
            <p className="text-sm text-gray-600 mb-4">
              Tap on one or more QR sticker designs below to select them.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {qrCodeImages.map((src, index) => {
                const isSelected = selectedQrCodes.includes(src);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => toggleQrSelection(src)}
                    className={`relative aspect-square w-full rounded-2xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`QR code ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 120px, (min-width: 768px) 25vw, 33vw"
                      className="object-contain p-3 bg-gray-50"
                    />
                  </button>
                );
              })}
            </div>
          </div>

            {/* Modal Footer Summary */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-800">
                <p>
                  Total QR stickers selected: <span className="font-semibold">{selectedCount}</span>
                </p>
                <p>
                  Total amount: <span className="font-semibold">₹{totalAmount}</span>
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseQrModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
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
