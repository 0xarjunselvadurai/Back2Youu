'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'email') {
          setStatus('error');
          setMessage('Invalid confirmation link');
          return;
        }

        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email');
          return;
        }

        setStatus('success');
        setMessage('Email confirmed successfully! Redirecting to login...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred');
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirming Email</h1>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Success!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-4">✕</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Sign Up Again
              </Link>
              <Link
                href="/login"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
