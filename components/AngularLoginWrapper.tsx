'use client';

import { loginUserInteractor } from '@/usecases/auth';
import React, { useEffect, useState } from 'react';

import { useRouter } from "next/navigation";

const REMOTE_URL = process.env.NEXT_PUBLIC_REMOTE_LOGIN_URL;

export function AngularLoginWrapper() {
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webComponentRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadWebComponent = async () => {
      try {
        console.log('[AngularWrapper] Loading Angular Web Component...');

        // Dynamically import the Web Component from remote
        // @ts-ignore - Remote module loaded via Module Federation
        await import('remoteLogin/webcomponent');

        if (!isMounted) return;

        console.log('[AngularWrapper] ✅ Web Component loaded successfully');
        setLoading(false);
      } catch (err) {
        console.error('[AngularWrapper] ❌ Failed to load Web Component:', err);

        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    loadWebComponent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Setup event listener for loginSubmit event
  useEffect(() => {
    const element = webComponentRef.current;
    if (!element) return;

    const handleLoginSubmit = async (event: any) => {
      const { email, password } = event.detail;
      console.log('✅ [Next.js Host] Received login event:', { email });

      try {
        // TODO: Replace with your actual authentication logic
        const result = await loginUserInteractor({
          email,
          password,
        });


        if (result.success) {
          // Redirect to dashboard
        console.log(result)
          if (result.user.role === 'employee') {
            router.push("/dashboard");
          } else {
            router.push("/dashboard/tickets");
          }
        }
        // console.log('🔐 [Next.js Host] Authenticating...', { email, password });

        // // Example: Call your Next.js API route
        // const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });

        // if (!response.ok) {
        //   throw new Error('Authentication failed');
        // }

        // const data = await response.json();
        // console.log('✅ [Next.js Host] Login successful:', data);

        // // TODO: Handle successful login (redirect, store token, etc.)
        // // Example:
        // // localStorage.setItem('token', data.token);
        // // router.push('/dashboard');

      } catch (error) {
        console.error('❌ [Next.js Host] Login failed:', error);

        // Show error to user via Angular component
        const angularElement = element as any;
        if (angularElement && typeof angularElement.setError === 'function') {
          angularElement.setError('Login failed. Please try again.');
        }
      }
    };

    // Add event listener for CustomEvent
    element.addEventListener('loginSubmit', handleLoginSubmit);
    console.log('[AngularWrapper] Event listener attached for loginSubmit');

    // Cleanup
    return () => {
      element.removeEventListener('loginSubmit', handleLoginSubmit);
      console.log('[AngularWrapper] Event listener removed');
    };
  }, [loading]); // Re-run when loading changes (component mounted)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Angular Login Component
          </h2>
          <p className="text-gray-400 text-sm">
            Connecting to remote service...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="text-center p-8 bg-gray-800 rounded-lg border border-red-700">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">
              Failed to Load Remote Component
            </h3>
            <p className="text-gray-400 mb-4 text-sm">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/login?fallback=true';
                }}
                className="block w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Use Local Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Info badge - can be removed in production */}
      <div className="bg-blue-900 border-b border-blue-700 px-4 py-2">
        <div className="container mx-auto">
          <p className="text-blue-200 text-sm">
            🔗 Using remote Angular Web Component from{' '}
            <code className="bg-blue-800 px-2 py-1 rounded text-xs">
              {REMOTE_URL}
            </code>
          </p>
        </div>
      </div>

      {/* Angular Web Component */}
      <angular-login ref={webComponentRef as any} />
    </div>
  );
}
