'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import jsQR from 'jsqr';

export default function ReturnPage() {
  const [tagId, setTagId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera and scan QR codes
  const startScanner = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMessage({
          type: 'error',
          text: '❌ Camera not supported on this device'
        });
        return;
      }

      setShowScanner(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        const playVideo = () => {
          const playPromise = videoRef.current?.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsScannerActive(true);
                setMessage({ type: null, text: '' });
                console.log('Camera started successfully');
              })
              .catch((error) => {
                console.error('Play error:', error);
                setMessage({
                  type: 'error',
                  text: '❌ Unable to play camera stream. Try again.'
                });
              });
          }
        };

        if (videoRef.current.readyState >= 2) {
          playVideo();
        } else {
          videoRef.current.onloadedmetadata = playVideo;
        }
      }
    } catch (error: any) {
      setShowScanner(false);
      let errorMsg = '❌ Unable to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = '❌ Camera permission denied. Please allow access in settings.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = '❌ No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = '❌ Camera is already in use. Close other apps and try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMsg = '❌ Camera resolution not supported. Try again.';
      }
      
      setMessage({ type: 'error', text: errorMsg });
      console.error('Camera error:', error);
    }
  };

  // Scan for QR codes
  const scanQRCode = () => {
    if (!isScannerActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || !video.videoWidth || !video.videoHeight) {
      requestAnimationFrame(scanQRCode);
      return;
    }

    // Set canvas dimensions to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Draw video frame to canvas
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Scan QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        const detectedCode = code.data;
        console.log('QR detected:', detectedCode);
        
        // Extract 8-digit number from QR code
        const matches = detectedCode.match(/\d{8}/);
        if (matches) {
          const code8Digit = matches[0];
          setTagId(code8Digit);
          stopScanner();
          setMessage({
            type: 'success',
            text: `✅ QR code scanned! Code: ${code8Digit}`
          });
          return;
        }
      }
    } catch (error) {
      console.error('Scan error:', error);
    }

    // Continue scanning
    requestAnimationFrame(scanQRCode);
  };

  // Stop camera
  const stopScanner = () => {
    setIsScannerActive(false);
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (error) {
        console.error('Error stopping stream:', error);
      }
      streamRef.current = null;
    }
    setShowScanner(false);
  };

  // Start scanning when scanner is active
  useEffect(() => {
    if (isScannerActive) {
      scanQRCode();
    }
  }, [isScannerActive]);

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
        setMessage({
          type: 'error',
          text: data.error || 'Invalid code - please check and try again'
        });
        return;
      }

      // Show success message
      setMessage({
        type: 'success',
        text: `Success! We've notified ${data.ownerName} about their item. They will contact you soon!`
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setTagId('');
        setMessage({ type: null, text: '' });
      }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex flex-col">
      {/* Navbar - Professional */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
              <div className="text-5xl mb-3">📍</div>
              <h2 className="text-2xl font-bold mb-1">Locate Owner</h2>
              <p className="text-blue-100 font-light">
                Enter the unique code to notify the owner
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Info Box - Subtle Blue */}
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  📌 Found an item with an 8-digit code? Enter it below and we'll immediately notify the owner.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Scanner Button - Primary */}
                <button
                  type="button"
                  onClick={showScanner ? stopScanner : startScanner}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-base"
                >
                  {showScanner ? '⏹ Stop Scanner' : '📱 Scan QR Code'}
                </button>

                {/* QR Scanner Display - Professional */}
                {showScanner && (
                  <div className="relative w-full bg-black rounded-xl overflow-hidden border border-gray-300 shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      width={1280}
                      height={720}
                      className="w-full h-auto object-cover"
                      style={{ 
                        WebkitPlaysinline: 'true',
                        display: 'block'
                      } as any}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{ display: 'none' }}
                    />
                    {/* Scanning Guide - Elegant */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                      <div className="border-3 border-blue-400 rounded-2xl transition-all"
                        style={{
                          width: '75%',
                          height: '75%',
                          boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.2)',
                        }}
                      />
                    </div>
                    {/* Scanning Text - Centered */}
                    <div className="absolute top-6 left-0 right-0 text-center">
                      <div className="inline-block bg-blue-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg">
                        🔍 Align QR code in frame
                      </div>
                    </div>
                    {/* Loading Indicator */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <div className="inline-block">
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-400 border-t-transparent"></div>
                      </div>
                    </div>
                  </div>
                )}

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
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-center font-mono text-3xl font-bold transition-all disabled:bg-gray-50 disabled:text-gray-400 text-gray-900"
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

                {/* Submit Button - Primary Action */}
                <button
                  type="submit"
                  disabled={tagId.length !== 8 || isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-base"
                >
                  {isSubmitting ? '⏳ Notifying Owner...' : '✓ Confirm & Notify Owner'}
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
