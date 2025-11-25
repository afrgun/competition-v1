import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { RemoteErrorBoundary } from '@/components/RemoteErrorBoundary';
import { LoginFallback } from '@/components/LoginFallback';

// Dynamic import to ensure client-side only loading
const RemoteLogin = dynamic(
  () => import('../../components/RemoteLoginLoader').then(mod => mod.RemoteLoginLoader),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading login...</p>
        </div>
      </div>
    )
  }
);

export default function LoginPage() {
  return (
    <RemoteErrorBoundary
      fallback={<LoginFallback />}
      moduleName="Remote Angular Login"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteLogin />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
