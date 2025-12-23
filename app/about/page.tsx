'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Zap } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Back2You</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            We're on a mission to make item recovery simple, secure, and accessible to everyone. Our innovative platform connects lost items with honest finders, creating a community of trust and reliability.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Heart className="w-12 h-12 text-gray-900 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
              To provide a secure, efficient, and reliable platform that helps people in India recover their lost items and connects them with honest finders across the country.
            </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <Zap className="w-12 h-12 text-gray-900 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                A world where no one has to suffer the loss of their valuable items, and where finders are rewarded for their honesty and compassion.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <Users className="w-12 h-12 text-gray-900 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600">
                Trust, transparency, and community. We believe in building a platform where integrity is rewarded and everyone can make a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Back2You was born from a simple realization: losing valuable items is one of the most frustrating experiences, but most people who find items genuinely want to return them. The gap between the two just needed a better bridge.
            </p>

            <p>
              Our founder experienced the loss of a cherished family heirloom at an airport. Despite efforts to recover it, the process was confusing, time-consuming, and ultimately unsuccessful. This motivated us to create a solution that leverages modern technology to make item recovery effortless for everyone.
            </p>

            <p>
              We started with a simple vision: use NFC cards and QR codes to create an instant connection between lost items and their finders. Today, Back2You has expanded to include advanced features like real-time chat, secure payments, and location tracking.
            </p>

            <p>
            Thousands of items have been successfully recovered through our platform, and we're just getting started. Our community of honest finders and cautious owners across India is growing every day.
          </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">70%</div>
              <p className="text-gray-300">Item Recovery Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-gray-300">Platform Availability</p>
            </div>
            <div>
            <div className="text-4xl font-bold mb-2">India</div>
            <p className="text-gray-300">Coverage Across India</p>
          </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Be part of a nationwide movement in India dedicated to helping each other recover what matters most.
        </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800">
            Get Started Today
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
