'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { signUp } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    notificationChannel: 'WhatsApp'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const { user, userProfile, error } = await signUp(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.notificationChannel
      );

      if (error) {
        setErrors({ general: error });
      } else if (user) {
        // Show email confirmation message
        setSuccessMessage('Account created! Check your email to confirm your account before signing in.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          notificationChannel: 'WhatsApp'
        });
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">Protect your valuables with our advanced recovery system. Get started in minutes.</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Quick Setup</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Secure & Private</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Always Protected</span>
            </li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm">&copy; 2024 Back2You. All rights reserved.</p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Create Account</h1>
            <p className="text-xs sm:text-sm text-gray-600">Join Back2You today</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-100 border border-green-300 text-green-700 rounded text-xs sm:text-sm">
              {successMessage}
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-100 border border-red-300 text-red-700 rounded text-xs sm:text-sm">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className={`w-full px-2 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 text-xs sm:text-sm ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className={`w-full px-2 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 text-xs sm:text-sm ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email ID
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className={`w-full px-2 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 text-xs sm:text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-2 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 pr-8 sm:pr-10 text-xs sm:text-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 sm:top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-2 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white text-gray-900 pr-8 sm:pr-10 text-xs sm:text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 sm:top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Notification Channel */}
            <div className="pt-1 sm:pt-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Preferred Notification Channel
              </label>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="whatsapp"
                    name="notificationChannel"
                    value="WhatsApp"
                    checked={formData.notificationChannel === 'WhatsApp'}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 border-gray-300 focus:ring-slate-900"
                  />
                  <label htmlFor="whatsapp" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    WhatsApp
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sms"
                    name="notificationChannel"
                    value="SMS"
                    checked={formData.notificationChannel === 'SMS'}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 border-gray-300 focus:ring-slate-900"
                  />
                  <label htmlFor="sms" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    SMS
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 text-xs sm:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-3 sm:my-4 lg:my-6 border-t border-gray-300"></div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-slate-900 hover:text-slate-700 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 lg:mt-8 text-center text-xs text-gray-600">
            <p>By creating an account, you agree to our{' '}
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
