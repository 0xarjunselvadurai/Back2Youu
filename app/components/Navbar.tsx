'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { supabase, signOut } from '@/lib/supabase';

interface UserProfile {
  user_fname: string;
  user_lname: string;
  user_email: string;
}

export default function Navbar() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

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
    
    // Also check Supabase auth session so we can show Activate
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking session in Navbar:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    // Clear local profile and Supabase session
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    setIsAuthenticated(false);
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="w-full px-[clamp(0.75rem,3vw,2rem)]">
        <div className="flex justify-between items-center py-[clamp(0.75rem,2vw,1rem)]">
          {/* Logo - Text Brand */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-bold tracking-tight text-gray-900" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)' }}>
              Back2You
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-[clamp(1rem,3vw,2rem)]">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full font-medium transition text-[clamp(0.75rem,2vw,0.875rem)] ${
                pathname === '/'
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`px-3 py-1 rounded-full font-medium transition text-[clamp(0.75rem,2vw,0.875rem)] ${
                pathname === '/shop'
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-1 rounded-full font-medium transition text-[clamp(0.75rem,2vw,0.875rem)] ${
                pathname === '/how-it-works'
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1 rounded-full font-medium transition text-[clamp(0.75rem,2vw,0.875rem)] ${
                pathname === '/about'
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/news-feed"
              className={`px-3 py-1 rounded-full font-medium transition text-[clamp(0.75rem,2vw,0.875rem)] ${
                pathname === '/news-feed'
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              News Feed
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-[clamp(0.5rem,2vw,1rem)]">
            {isAuthenticated && (
              <Link href="/active" className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-[clamp(0.7rem,1.5vw,0.875rem)]">
                Activate
              </Link>
            )}
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

          {/* Mobile: main actions live inside the slide-out menu, so we only show the hamburger here */}
          <div className="lg:hidden flex items-center gap-[clamp(0.35rem,1vw,0.5rem)]" />

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
            <div className="px-[clamp(0.75rem,3vw,2rem)] py-[clamp(1rem,2vw,1.5rem)] space-y-[clamp(0.5rem,2vw,1rem)] text-right">
              {/* Mobile Links */}
              <Link
                href="/"
                className={`block rounded-md px-2 py-1 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)] ml-auto ${
                  pathname === '/'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`block rounded-md px-2 py-1 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)] ml-auto ${
                  pathname === '/shop'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/how-it-works"
                className={`block rounded-md px-2 py-1 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)] ml-auto ${
                  pathname === '/how-it-works'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className={`block rounded-md px-2 py-1 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)] ml-auto ${
                  pathname === '/about'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/news-feed"
                className={`block rounded-md px-2 py-1 font-medium transition text-[clamp(0.875rem,2.5vw,1rem)] ml-auto ${
                  pathname === '/news-feed'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                News Feed
              </Link>

              <div className="border-t border-gray-200 pt-[clamp(0.5rem,1.5vw,0.75rem)] space-y-[clamp(0.35rem,1vw,0.5rem)] flex flex-wrap gap-2 justify-end">
                {isAuthenticated && (
                  <Link
                    href="/active"
                    className="inline-flex px-3 py-1.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition text-[clamp(0.7rem,1.8vw,0.8rem)] whitespace-nowrap"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Activate
                  </Link>
                )}
                <Link
                  href="/return"
                  className="inline-flex px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-semibold hover:from-purple-600 hover:to-pink-600 transition text-[clamp(0.7rem,1.8vw,0.8rem)] whitespace-nowrap"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Return
                </Link>

                {userProfile ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex px-3 py-1.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition text-[clamp(0.7rem,1.8vw,0.8rem)] whitespace-nowrap"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex px-3 py-1.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md font-medium transition text-[clamp(0.7rem,1.8vw,0.8rem)] whitespace-nowrap"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex px-3 py-1.5 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition text-[clamp(0.7rem,1.8vw,0.8rem)] whitespace-nowrap"
                      onClick={() => setMobileMenuOpen(false)}
                    >
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
