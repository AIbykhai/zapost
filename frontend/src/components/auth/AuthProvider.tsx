'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Client-side only Auth0 provider component
 * 
 * This component is needed because Auth0Provider uses React's createContext
 * which must be executed only on the client side. Next.js 15+ requires this approach
 * rather than using Auth0Provider directly in layout.tsx which runs on both server and client.
 * 
 * The component uses useState and useEffect to ensure it only fully renders on the client,
 * preventing "createContext is not a function" errors during server-side rendering.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  // This state ensures we only fully render the Auth0Provider on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On the server or during first client render, just render children without Auth0
  if (!isMounted) {
    return <>{children}</>;
  }

  // Only process these on the client side
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      {children}
    </Auth0Provider>
  );
} 