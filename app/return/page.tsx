'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReturnPage() {
  const [tagId, setTagId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemDetails, setItemDetails] = useState<{ tagCategory: string; tagDescription: string } | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagId || tagId.length !== 8) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid 8-digit code'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    try {
      // Call the API to send email to owner
      const response = await fetch('/api/send-return-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setItemDetails(null);
        setMessage({
          type: 'error',
          text: data.error || 'Invalid code - please check and try again'
        });
        return;
      }

      // Show item details and prompt for mobile number
      setItemDetails({
        tagCategory: data.tagCategory,
        tagDescription: data.tagDescription,
      });
      setMessage({
        type: 'success',
        text: `Item found. Category: ${data.tagCategory}. Description: ${data.tagDescription}. Please enter your mobile number to connect with the owner.`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred - please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Navbar - Professional */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">B2Y</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:inline">Back2You</span>
          </Link>
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 font-medium transition px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            ← Back Home
          </Link>
        </div>
      </nav>

      {/* Main Content - Professional Layout */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Return Found Item
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Help reunite items with their rightful owners
            </p>
          </div>

          {/* Main Card - Professional White */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with subtle gradient */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-8 py-8 text-white">
              <div className="text-5xl mb-3">📍</div>
              <h2 className="text-2xl font-bold mb-1">Locate Owner</h2>
              <p className="text-blue-100 font-light">
                Enter the unique code to notify the owner
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Info Box - Subtle Blue */}
              <div className="bg-blue-100 border-l-4 border-blue-400 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  📌 Found an item with an 8-digit code? Enter it below and we'll immediately notify the owner.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Field - Professional */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    8-Digit Code
                  </label>
                  <input
                    type="text"
                    placeholder="00000000"
                    maxLength={8}
                    value={tagId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setTagId(value);
                      setMessage({ type: null, text: '' });
                    }}
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-center font-mono text-3xl font-bold transition-all disabled:bg-gray-50 disabled:text-gray-400 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right font-medium">{tagId.length}/8 digits</p>
                </div>

                {/* Message Display - Professional */}
                {message.type && (
                  <div className={`p-4 rounded-lg font-medium text-sm border-l-4 animate-fade-in ${
                    message.type === 'success' 
                      ? 'bg-green-50 border-l-green-500 text-green-800' 
                      : 'bg-red-50 border-l-red-500 text-red-800'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Item details and mobile number input after successful lookup */}
                {itemDetails && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 font-semibold">Tag Category: <span className="font-normal">{itemDetails.tagCategory}</span></p>
                      <p className="text-sm text-gray-700 font-semibold mt-1">Tag Description: <span className="font-normal">{itemDetails.tagDescription}</span></p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Your Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button - Primary Action */}
                <button
                  type="submit"
                  disabled={tagId.length !== 8 || isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-base"
                >
                  {isSubmitting ? '⏳ Processing...' : '✓ Confirm'}
                </button>
              </form>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Support Info - Footer */}
              <div className="text-center">
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  No code visible? The item may not be registered. <br />
                  <span className="font-semibold text-gray-900">Contact: support@back2you.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 text-gray-600 font-light">
            <p className="text-sm leading-relaxed">
              Thank you for your kindness in helping reunite<br />
              lost items with their owners.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
