'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setLoading(true);

    // Validation
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Call Supabase sign in
    const { user, userProfile, error } = await signIn(email, password);

    if (error) {
      setErrors({ general: error });
      setLoading(false);
    } else if (user) {
      // Store user data in localStorage for display on other pages
      if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
      setSuccessMessage(`Welcome, ${userProfile?.first_name || 'User'}! Redirecting...`);
      setTimeout(() => {
        router.push('/active');
      }, 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Branding 40% - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 to-slate-800 flex-col justify-between p-8 lg:p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="font-bold text-xl text-slate-900">LF</span>
            </div>
            <span className="text-2xl font-bold">Back2You</span>
          </div>
          <p className="text-slate-300 text-sm mt-2">Recovery Made Simple</p>
        </div>

        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Recover Your Lost Items</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">Connect with finders using NFC cards, QR codes, and 8-digit codes. Secure, fast, and reliable.</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>70% Recovery Rate</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>24/7 Instant Alerts</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Pan-India Coverage</span>
            </li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm">&copy; 2024 Back2You. All rights reserved.</p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome back to Back2You</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs sm:text-sm mb-4">
              {successMessage}
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs sm:text-sm mb-4">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 pr-10 text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="#" 
                className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 sm:my-6 border-t border-gray-300"></div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-slate-900 hover:text-slate-700 font-semibold"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-600">
            <p>By signing in, you agree to our{' '}
              <Link href="/terms" className="text-slate-900 hover:text-slate-700 font-medium">
                Terms
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-slate-900 hover:text-slate-700 font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
