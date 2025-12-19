'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface UserProfile {
  user_fname: string;
  user_lname: string;
  user_email: string;
}

export default function Navbar() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Retrieve user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="w-full px-[clamp(0.75rem,3vw,2rem)]">
        <div className="flex justify-between items-center py-[clamp(0.75rem,2vw,1rem)]">
          {/* Logo - Fluid Sizing */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/finit.png" 
              alt="findit logo" 
              width={120} 
              height={40}
              className="h-[clamp(2rem,6vw,2.5rem)] w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-[clamp(1rem,3vw,2rem)]">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
              Shop
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
              About Us
            </Link>
            <Link href="/news-feed" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
              News Feed
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-[clamp(0.5rem,2vw,1rem)]">
            <Link href="/active" className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-[clamp(0.7rem,1.5vw,0.875rem)]">
              Active
            </Link>
            <Link href="/return" className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition text-[clamp(0.7rem,1.5vw,0.875rem)]">
              Return
            </Link>
            
            {userProfile ? (
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)]">
                <span className="text-gray-700 font-semibold text-[clamp(0.75rem,2vw,0.875rem)] hidden sm:inline whitespace-nowrap">
                  {userProfile.user_fname} {userProfile.user_lname}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]">
                  Login
                </Link>
                <Link href="/register" className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition text-[clamp(0.7rem,1.5vw,0.875rem)]">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Action Buttons - Smaller width on mobile */}
          <div className="lg:hidden flex items-center gap-[clamp(0.35rem,1vw,0.5rem)]">
            <Link href="/active" className="px-[clamp(0.4rem,1vw,0.6rem)] py-[clamp(0.4rem,0.8vw,0.5rem)] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-[clamp(0.65rem,1.2vw,0.75rem)] whitespace-nowrap">
              Active
            </Link>
            <Link href="/return" className="px-[clamp(0.4rem,1vw,0.6rem)] py-[clamp(0.4rem,0.8vw,0.5rem)] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition text-[clamp(0.65rem,1.2vw,0.75rem)] whitespace-nowrap">
              Return
            </Link>
            
            {userProfile ? (
              <button 
                onClick={handleLogout}
                className="px-[clamp(0.4rem,1vw,0.6rem)] py-[clamp(0.4rem,0.8vw,0.5rem)] bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-[clamp(0.65rem,1.2vw,0.75rem)] whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="px-[clamp(0.4rem,1vw,0.6rem)] py-[clamp(0.4rem,0.8vw,0.5rem)] text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.65rem,1.2vw,0.75rem)] whitespace-nowrap">
                  Login
                </Link>
                <Link href="/register" className="px-[clamp(0.4rem,1vw,0.6rem)] py-[clamp(0.4rem,0.8vw,0.5rem)] bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition text-[clamp(0.65rem,1.2vw,0.75rem)] whitespace-nowrap">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X size={28} className="text-gray-800" />
            ) : (
              <Menu size={28} className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-[clamp(0.75rem,3vw,2rem)] py-[clamp(1rem,2vw,1.5rem)] space-y-[clamp(0.5rem,2vw,1rem)]">
              {/* Mobile Links */}
              <Link href="/" className="block text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)]" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="block text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)]" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/how-it-works" className="block text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)]" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)]" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/news-feed" className="block text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)]" onClick={() => setMobileMenuOpen(false)}>
                News Feed
              </Link>

              <div className="border-t border-gray-200 pt-[clamp(0.75rem,2vw,1rem)] space-y-[clamp(0.5rem,1.5vw,0.75rem)]">
                <Link href="/active" className="block w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center text-[clamp(0.75rem,2vw,0.875rem)]" onClick={() => setMobileMenuOpen(false)}>
                  Active Items
                </Link>
                <Link href="/return" className="block w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center text-[clamp(0.75rem,2vw,0.875rem)]" onClick={() => setMobileMenuOpen(false)}>
                  Return Item
                </Link>

                {userProfile ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-[clamp(0.75rem,2vw,0.875rem)]"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="block w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] text-center text-gray-700 hover:text-gray-900 font-medium transition text-[clamp(0.75rem,2vw,0.875rem)]" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" className="block w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition text-center text-[clamp(0.75rem,2vw,0.875rem)]" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
