'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AngularLoginWrapper } from './AngularLoginWrapper';
import { LoginFallback } from './LoginFallback';
import { checkRemoteHealth } from '@/shared/utils/loadRemoteModule';

const REMOTE_URL = process.env.NEXT_PUBLIC_REMOTE_LOGIN_URL || 'http://localhost:4200';
const USE_REMOTE = process.env.NEXT_PUBLIC_USE_REMOTE_LOGIN !== 'false';

export function RemoteLoginLoader() {
  const router = useRouter();
  const [useRemote, setUseRemote] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);
  const forceFallback = router.query.fallback === 'true';

  useEffect(() => {
    // If feature flag disabled or forced fallback, skip check
    if (!USE_REMOTE || forceFallback) {
      console.log('[RemoteLoader] Using local fallback (feature disabled or forced)');
      setUseRemote(false);
      setIsChecking(false);
      return;
    }

    // Check if remote is available
    const checkRemote = async () => {
      console.log('[RemoteLoader] Checking remote availability...');

      try {
        const remoteUrl = `${REMOTE_URL}/remoteEntry.js`;
        const isHealthy = await checkRemoteHealth(remoteUrl, 3000);

        if (isHealthy) {
          console.log('[RemoteLoader] ✅ Remote Angular available');
          setUseRemote(true);
        } else {
          console.warn('[RemoteLoader] ⚠️ Remote Angular not available, using fallback');
          setUseRemote(false);
        }
      } catch (error) {
        console.error('[RemoteLoader] ❌ Remote check failed:', error);
        setUseRemote(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRemote();
  }, [forceFallback]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-pulse rounded-full h-12 w-12 bg-gray-700 mx-auto mb-4"></div>
          </div>
          <p className="text-gray-400">Checking remote service availability...</p>
        </div>
      </div>
    );
  }

  if (useRemote) {
    return <AngularLoginWrapper />;
  }

  return <LoginFallback />;
}
