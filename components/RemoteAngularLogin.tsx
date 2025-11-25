'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { loginUserInteractor } from '@/usecases/auth';
import { checkRemoteHealth } from '@/shared/utils/loadRemoteModule';
import { LoginFallback } from './LoginFallback';

const REMOTE_URL = process.env.NEXT_PUBLIC_REMOTE_LOGIN_URL || 'http://localhost:4200';
const USE_REMOTE = process.env.NEXT_PUBLIC_USE_REMOTE_LOGIN !== 'false';

type LoadingState = 'checking' | 'loading' | 'ready' | 'fallback' | 'error';

interface Props {
  /** Force fallback mode (skip remote check) */
  forceFallback?: boolean;
}

/**
 * RemoteAngularLogin - Unified Module Federation Wrapper
 *
 * Combines health check, web component loading, and fallback logic in a single component.
 *
 * Flow:
 * 1. Check if remote is available (health check)
 * 2. If available: Load Angular web component via Module Federation
 * 3. If unavailable: Show local fallback
 * 4. Handle login events from Angular component
 */
export function RemoteAngularLogin({ forceFallback = false }: Props) {
  const router = useRouter();
  const [state, setState] = useState<LoadingState>('checking');
  const [error, setError] = useState<string | null>(null);
  const webComponentRef = useRef<HTMLElement | null>(null);

  const queryForceFallback = router.query.fallback === 'true';
  const shouldUseFallback = forceFallback || queryForceFallback || !USE_REMOTE;

  // ========================================
  // 1. HEALTH CHECK & WEB COMPONENT LOADING
  // ========================================
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      // Skip remote if fallback forced
      if (shouldUseFallback) {
        console.log('[RemoteAngularLogin] Using local fallback (forced or feature disabled)');
        if (isMounted) setState('fallback');
        return;
      }

      // Health check
      console.log('[RemoteAngularLogin] Checking remote availability...');
      try {
        const remoteUrl = `${REMOTE_URL}/remoteEntry.js`;
        const isHealthy = await checkRemoteHealth(remoteUrl, 3000);

        if (!isHealthy) {
          console.warn('[RemoteAngularLogin] ⚠️ Remote unhealthy, using fallback');
          if (isMounted) setState('fallback');
          return;
        }

        console.log('[RemoteAngularLogin] ✅ Remote healthy, loading web component...');
        if (isMounted) setState('loading');

        // Load web component via Module Federation
        // @ts-ignore - Remote module from Module Federation
        await import('remoteLogin/webcomponent');

        if (isMounted) {
          console.log('[RemoteAngularLogin] ✅ Web component loaded');
          setState('ready');
        }
      } catch (err) {
        console.error('[RemoteAngularLogin] ❌ Load failed:', err);

        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setError(errorMessage);
          setState('error');
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [shouldUseFallback]);

  // ========================================
  // 2. EVENT LISTENER FOR LOGIN SUBMISSION
  // ========================================
  useEffect(() => {
    const element = webComponentRef.current;
    if (!element || state !== 'ready') return;

    const handleLoginSubmit = async (event: Event) => {
      // Cast to CustomEvent to access detail property
      const customEvent = event as CustomEvent<{ email: string; password: string }>;
      const { email, password } = customEvent.detail;
      console.log('✅ [RemoteAngularLogin] Received login event:', { email });

      try {
        const result = await loginUserInteractor({ email, password });

        if (result.success) {
          console.log('[RemoteAngularLogin] ✅ Login successful');

          // Route based on role
          if (result.user.role === 'employee') {
            router.push('/dashboard');
          } else {
            router.push('/dashboard/tickets');
          }
        } else {
          throw new Error(result.error || 'Login failed');
        }
      } catch (error) {
        console.error('❌ [RemoteAngularLogin] Login failed:', error);

        // Show error via Angular component
        const angularElement = element as any;
        if (angularElement && typeof angularElement.setError === 'function') {
          const errorMsg = error instanceof Error ? error.message : 'Login failed';
          angularElement.setError(errorMsg);
        }
      }
    };

    element.addEventListener('loginSubmit', handleLoginSubmit);
    console.log('[RemoteAngularLogin] Event listener attached');

    return () => {
      element.removeEventListener('loginSubmit', handleLoginSubmit);
      console.log('[RemoteAngularLogin] Event listener removed');
    };
  }, [state, router]);

  // ========================================
  // 3. RENDER BASED ON STATE
  // ========================================

  // Loading states
  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-pulse rounded-full h-12 w-12 bg-gray-700 mx-auto mb-4"></div>
          </div>
          <p className="text-gray-400 text-sm">Checking remote service...</p>
        </div>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Angular Component
          </h2>
          <p className="text-gray-400 text-sm">
            Connecting to remote service...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
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
              <button
                onClick={() => router.push('/login?fallback=true')}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Use Local Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback state
  if (state === 'fallback') {
    return <LoginFallback />;
  }

  // Ready state - render Angular web component
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
