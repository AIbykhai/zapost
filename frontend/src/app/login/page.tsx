"use client";

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-playfair text-center text-gray-900">
            Welcome to <span className="bg-[#F8C4A9] px-2 rounded">AI Social Person</span>
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Your AI-powered social media assistant
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => loginWithRedirect()}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E67E22] hover:bg-[#D35400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67E22]"
          >
            Sign in with Auth0
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          By signing in, you agree to our{' '}
          <a href="#" className="font-medium text-[#E67E22] hover:text-[#D35400]">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
} 