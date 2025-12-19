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
          text: 'Camera not supported on this device'
        });
        return;
      }

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
        setShowScanner(true);
        setIsScannerActive(true);

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Play error:', error);
            setMessage({
              type: 'error',
              text: 'Unable to play camera stream'
            });
          });
        }
      }
    } catch (error: any) {
      let errorMsg = 'Unable to access camera';
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow access in browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use. Please close other apps.';
      }
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  // Scan for QR codes
  const scanQRCode = () => {
    if (!isScannerActive || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      const detectedCode = code.data;
      // Extract 8-digit number from QR code
      const matches = detectedCode.match(/\d{8}/);
      if (matches) {
        const code8Digit = matches[0];
        setTagId(code8Digit);
        stopScanner();
        setMessage({
          type: 'success',
          text: `QR code scanned! Code: ${code8Digit}`
        });
      }
    } else {
      // Continue scanning
      requestAnimationFrame(scanQRCode);
    }
  };

  // Stop camera
  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
    setIsScannerActive(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Navbar - Responsive */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            <div className="w-[clamp(2rem,5vw,2.5rem)] h-[clamp(2rem,5vw,2.5rem)] bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center">
              <span className="font-bold text-white" style={{fontSize: 'clamp(0.75rem,1.5vw,1rem)'}}>LF</span>
            </div>
            <span className="font-bold text-gray-800 hidden sm:inline" style={{fontSize: 'clamp(0.875rem,2vw,1.5rem)'}}>Back2You</span>
          </Link>
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 font-semibold transition px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.35rem,0.75vw,0.5rem)] bg-gray-100 rounded text-[clamp(0.65rem,1.2vw,0.875rem)] whitespace-nowrap"
          >
            Back Home
          </Link>
        </div>
      </nav>

      {/* Main Content - Fully Responsive */}
      <div className="flex-1 flex items-center justify-center px-[clamp(0.75rem,3vw,1rem)] py-[clamp(1.5rem,3vw,2rem)]">
        <div className="w-full max-w-[clamp(280px,90vw,500px)]">
          {/* Hero Section */}
          <div className="text-center mb-[clamp(1.5rem,3vw,2rem)] text-white">
            <h1 className="font-bold mb-[clamp(0.75rem,1.5vw,1rem)] leading-tight"
              style={{fontSize: 'clamp(1.5rem,5vw,2.5rem)'}}>
              Found an Item?
            </h1>
            <p className="text-gray-300" style={{fontSize: 'clamp(0.875rem,2vw,1.125rem)'}}>
              Help reunite it with its owner
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-[clamp(1rem,2vw,1.5rem)] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-[clamp(1.5rem,3vw,2rem)] text-white text-center">
              <div style={{fontSize: 'clamp(2rem,6vw,3rem)'}} className="mb-[clamp(0.5rem,1vw,0.75rem)]">💝</div>
              <h2 className="font-bold" 
                style={{fontSize: 'clamp(1.25rem,3vw,1.875rem)'}}
              >
                Return This Item
              </h2>
              <p className="text-pink-100 mt-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.75rem,1.5vw,0.875rem)'}}
              >
                Your kindness matters
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                  Found an item with an 8-digit code? Enter it below and we'll notify the owner immediately!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Scanner Button */}
                <button
                  type="button"
                  onClick={showScanner ? stopScanner : startScanner}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg text-sm sm:text-base"
                >
                  {showScanner ? '❌ Stop Scanner' : '📱 Scan QR Code'}
                </button>

                {/* QR Scanner Display */}
                {showScanner && (
                  <div className="relative w-full bg-black rounded-xl overflow-hidden border-4 border-blue-500">
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
                        display: 'block',
                        transform: 'scaleX(-1)'
                      } as any}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{ display: 'none' }}
                    />
                    {/* Scanning Guide Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-4 border-yellow-400 rounded-2xl"
                        style={{
                          width: '80%',
                          height: '80%',
                          boxShadow: 'inset 0 0 20px rgba(250, 204, 21, 0.5)',
                        }}
                      />
                      <div className="absolute top-4 text-yellow-300 text-sm font-bold">
                        🔍 Point camera at QR code
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                    Enter the 8-Digit Code
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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-center font-mono text-2xl sm:text-3xl font-bold transition-all disabled:bg-gray-100 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1 sm:mt-2 text-right">{tagId.length}/8 digits</p>
                </div>

                {/* Message Display */}
                {message.type && (
                  <div className={`p-3 sm:p-4 rounded-xl font-semibold text-xs sm:text-sm animate-fade-in ${
                    message.type === 'success' 
                      ? 'bg-green-100 border-2 border-green-500 text-green-800' 
                      : 'bg-red-100 border-2 border-red-500 text-red-800'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={tagId.length !== 8 || isSubmitting}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-lg"
                >
                  {isSubmitting ? 'Sending Email...' : 'Confirm & Notify Owner'}
                </button>
              </form>

              {/* Support Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Don't see a code? The item may not be registered yet. Please contact us at <span className="font-semibold">support@lostfoundguard.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6 sm:mt-8 text-gray-300">
            <p className="text-xs sm:text-sm leading-relaxed">
              Thank you for being kind and helping reunite lost items with their owners!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
