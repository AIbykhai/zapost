'use client';

import React from 'react';
import AuthProvider from '@/components/auth/AuthProvider';

/**
 * Client-side providers wrapper for the application
 * 
 * This component serves as a central place to wrap the application with
 * client-side only providers like Auth0Provider. It's used in layout.tsx
 * to ensure these providers only run on the client side.
 * 
 * This pattern resolves the "createContext is not a function" error in Next.js 15+
 * by ensuring context providers only run in the client environment.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 