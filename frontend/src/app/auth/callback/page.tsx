'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

// Initialize fonts at module level
const playfair = Playfair_Display({ subsets: ['latin'] });

/**
 * Component that handles the Auth0 callback content
 * 
 * This is wrapped in Suspense because it uses useSearchParams(),
 * which requires a Suspense boundary in Next.js 15+.
 * Without this, the build process would fail with:
 * "useSearchParams() should be wrapped in a suspense boundary"
 */
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Redirect to dashboard
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className={`text-2xl ${playfair.className} text-gray-900`}>Completing sign in...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className={`text-2xl ${playfair.className} text-gray-900`}>Loading...</h1>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
} 