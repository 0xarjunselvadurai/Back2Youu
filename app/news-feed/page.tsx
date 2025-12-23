'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function NewsFeed() {
  const news = [
    {
      id: 1,
      date: 'December 15, 2024',
      title: 'Back2You Reaches 10,000 Successful Recoveries',
      excerpt: 'We celebrate a major milestone as our community in India successfully recovered its 10,000th item. This achievement reflects the trust and dedication of users across the country.',
      category: 'Milestone',
      image: 'bg-blue-100'
    },
    {
      id: 2,
      date: 'December 10, 2024',
      title: 'New Features: Enhanced Location Tracking',
      excerpt: 'We\'ve upgraded our location tracking system for better accuracy and privacy. Users can now track item locations in real-time with improved precision.',
      category: 'Product',
      image: 'bg-green-100'
    },
    {
      id: 3,
      date: 'December 5, 2024',
      title: 'Success Story: How Sarah Recovered Her Lost Passport',
      excerpt: 'Read about Sarah\'s incredible journey of recovering her passport within hours of losing it at the airport. A testament to the power of community.',
      category: 'Story',
      image: 'bg-purple-100'
    },
    {
      id: 4,
      date: 'November 30, 2024',
      title: 'Expansion: Back2You Now Available Across India',
      excerpt: 'Our platform has expanded to serve users across India. We\'re committed to making item recovery accessible nationwide.',
      category: 'Expansion',
      image: 'bg-orange-100'
    },
    {
      id: 5,
      date: 'November 25, 2024',
      title: 'Partnership Announcement: Integration with Major Airlines',
      excerpt: 'We\'re excited to announce a partnership with major airlines in India to provide NFC cards at airport terminals across the country.',
      category: 'Partnership',
      image: 'bg-pink-100'
    },
    {
      id: 6,
      date: 'November 20, 2024',
      title: 'Security Update: Enhanced Data Protection',
      excerpt: 'We\'ve implemented military-grade encryption for all user data. Your privacy and security are our top priorities.',
      category: 'Security',
      image: 'bg-red-100'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News Feed</h1>
          <p className="text-gray-600 text-lg">Stay updated with the latest news and stories from Back2You</p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                {/* Image Placeholder */}
                <div className={`${article.image} h-40 flex items-center justify-center`}>
                  <span className="text-gray-400 font-semibold">{article.category}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {article.date}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{article.title}</h3>

                  <p className="text-gray-600 mb-4">{article.excerpt}</p>

                  <div className="flex items-center text-gray-900 font-semibold hover:translate-x-2 transition-transform">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8">Get the latest news and updates delivered to your inbox</p>
          
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
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
