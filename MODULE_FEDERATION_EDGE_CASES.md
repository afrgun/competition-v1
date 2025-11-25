# Module Federation Edge Cases & Error Handling

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Safe vs Dangerous Setup](#safe-vs-dangerous-setup)
- [Implementation Strategy](#implementation-strategy)
- [Code Templates](#code-templates)
- [Testing Scenarios](#testing-scenarios)
- [Checklist](#checklist)

---

## ⚠️ Problem Statement

### Edge Case: Remote Application Down/Unavailable

**Scenario:**
- Host (Next.js) di `localhost:3000` running ✅
- Remote (Angular) di `localhost:4200` **MATI** ❌
- User akses various routes

**Critical Questions:**
1. ❓ Apakah `/about` (full host) masih bisa diakses?
2. ❓ Apakah `/login` (pakai remote) crash?
3. ❓ Apakah seluruh host ikut mati?

### Answer Summary

| Setup Method | /about Status | /login Status | Host Impact |
|-------------|---------------|---------------|-------------|
| **Dynamic Import** ✅ | ✅ Works | Fallback | ✅ Isolated |
| **Hardcoded Config** ❌ | ❌ Error/Slow | Error | ❌ Affected |

---

## 🔒 Safe vs Dangerous Setup

### ✅ SAFE Setup (Current Implementation)

**Config: Empty Remotes**
```javascript
// next.config.js
remotes: {
  // Kosong - load secara dynamic
}
```

**Load: Dynamic Import**
```typescript
// pages/login.tsx
const RemoteLogin = dynamic(
  () => import('../components/RemoteLoginLoader'),
  { ssr: false }
);
```

**Result:**
- ✅ `/about` → Tidak terpengaruh sama sekali
- ✅ `/home` → Tidak terpengaruh
- ✅ `/dashboard` → Tidak terpengaruh
- ⚠️ `/login` → Fallback ke local jika remote mati

### ❌ DANGEROUS Setup (AVOID!)

**Config: Hardcoded Remote**
```javascript
// next.config.js - JANGAN LAKUKAN INI! ❌
remotes: {
  loginApp: "loginApp@http://localhost:4200/remoteEntry.js",
}
```

**Result:**
- ❌ Webpack eager load remote di semua page
- ❌ Semua route mencoba koneksi ke remote
- ❌ **Seluruh aplikasi bisa terpengaruh** jika remote mati

---

## 🛡️ Implementation Strategy

### 1. Error Boundary Component

**File:** `components/RemoteErrorBoundary.tsx`

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Remote module failed:', {
      module: this.props.moduleName,
      error,
      errorInfo
    });

    // Optional: Send to error tracking
    // logToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">
              Service Temporarily Unavailable
            </h2>
            <p className="text-gray-400 mb-4">
              {this.props.moduleName || 'Remote module'} is currently unavailable.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Dynamic Remote Loader with Retry

**File:** `utils/loadRemoteModule.ts`

```typescript
interface LoadRemoteModuleOptions {
  url: string;
  scope: string;
  module: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export async function loadRemoteModule({
  url,
  scope,
  module,
  maxRetries = 3,
  retryDelay = 1000,
  timeout = 5000,
}: LoadRemoteModuleOptions): Promise<any> {

  // Load script with timeout
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';

      const timeoutId = setTimeout(() => {
        reject(new Error(\`Timeout loading \${src}\`));
      }, timeout);

      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(\`Failed to load \${src}\`));
      };

      document.head.appendChild(script);
    });
  };

  // Retry logic
  const retry = async (fn: () => Promise<any>, retriesLeft: number): Promise<any> => {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft === 0) throw error;

      console.warn(\`Retrying... (\${retriesLeft} attempts left)\`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return retry(fn, retriesLeft - 1);
    }
  };

  // Main loading logic
  return retry(async () => {
    await loadScript(url);

    // @ts-ignore
    await __webpack_init_sharing__('default');

    // @ts-ignore
    const container = window[scope];

    if (!container) {
      throw new Error(\`Remote container "\${scope}" not found\`);
    }

    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);

    const factory = await container.get(module);
    return factory();

  }, maxRetries);
}
```

### 3. Local Fallback Component

**File:** `components/LoginFallback.tsx`

```typescript
import { LoginForm } from "@/presentation/components/molecules/LoginForm";
import { AuthLayout } from "@/presentation/layouts";

export function LoginFallback() {
  return (
    <AuthLayout>
      <div className="mb-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg text-yellow-200 text-sm">
        ⚠️ Using local login (remote service unavailable)
      </div>
      <LoginForm />
    </AuthLayout>
  );
}
```

### 4. Remote Loader with Health Check

**File:** `components/RemoteLoginLoader.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { loadRemoteModule } from '@/utils/loadRemoteModule';
import { LoginFallback } from './LoginFallback';

export function RemoteLoginLoader() {
  const [RemoteComponent, setRemoteComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const remoteUrl = process.env.NEXT_PUBLIC_REMOTE_LOGIN_URL || 'http://localhost:4200';

    // Health check first
    fetch(\`\${remoteUrl}/remoteEntry.js\`, { method: 'HEAD' })
      .then(async (response) => {
        if (response.ok) {
          // Remote available, load it
          const module = await loadRemoteModule({
            url: \`\${remoteUrl}/remoteEntry.js\`,
            scope: 'loginApp',
            module: './LoginForm',
            maxRetries: 2,
            timeout: 3000,
          });
          setRemoteComponent(() => module.default);
        } else {
          throw new Error('Remote not available');
        }
      })
      .catch((err) => {
        console.warn('Remote unavailable, using fallback:', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Connecting to login service...</div>
      </div>
    );
  }

  if (error || !RemoteComponent) {
    return <LoginFallback />;
  }

  return <RemoteComponent />;
}
```

### 5. Login Page Implementation

**File:** `pages/login.tsx`

```typescript
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { RemoteErrorBoundary } from '@/components/RemoteErrorBoundary';
import { LoginFallback } from '@/components/LoginFallback';

const RemoteLogin = dynamic(
  () => import('../components/RemoteLoginLoader').then(mod => mod.RemoteLoginLoader),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading login...</div>
      </div>
    )
  }
);

export default function LoginPage() {
  return (
    <RemoteErrorBoundary
      fallback={<LoginFallback />}
      moduleName="Remote Login App"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteLogin />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
```

### 6. Environment Variables

**File:** `.env.local`

```env
# Module Federation
NEXT_PRIVATE_LOCAL_WEBPACK=true

# Remote URLs (configurable)
NEXT_PUBLIC_REMOTE_LOGIN_URL=http://localhost:4200

# Feature Flags
NEXT_PUBLIC_USE_REMOTE_LOGIN=true
NEXT_PUBLIC_FALLBACK_ENABLED=true
```

---

## 🎯 Flow Diagram

```
┌──────────────────┐
│  User Hit /login │
└────────┬─────────┘
         │
         ▼
┌────────────────────┐
│  Error Boundary    │
│  Wrapper           │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Health Check      │
│  (HEAD request)    │
│  Timeout: 3s       │
└────────┬───────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
  ✅ OK      ❌ FAIL
    │          │
    │          ▼
    │    ┌──────────────┐
    │    │  Retry 1-3x  │
    │    │  Delay: 1s   │
    │    └──────┬───────┘
    │           │
    │      ┌────┴─────┐
    │      │          │
    │      ▼          ▼
    │    ✅ OK      ❌ FAIL
    │      │          │
    ▼      ▼          ▼
┌──────────────┐  ┌──────────────┐
│ Load Remote  │  │ Local        │
│ Angular      │  │ Fallback     │
│ Component    │  │ Component    │
└──────────────┘  └──────────────┘
```

---

## 🧪 Testing Scenarios

### Scenario 1: Remote UP

```bash
# Terminal 1
npm run dev  # Port 3000

# Terminal 2
ng serve     # Port 4200
```

**Test:**
- ✅ Access `/` → Works
- ✅ Access `/about` → Works
- ✅ Access `/login` → Remote Angular component loads

### Scenario 2: Remote DOWN

```bash
# Terminal 1
npm run dev  # Port 3000

# Terminal 2
# Angular NOT running
```

**Test:**
- ✅ Access `/` → Works (tidak terpengaruh)
- ✅ Access `/about` → Works (tidak terpengaruh)
- ✅ Access `/login` → Fallback to local login component
- ✅ No crash, graceful degradation

**Network Tab Check:**
- `/about`: ❌ No request to `localhost:4200`
- `/login`: ✅ Attempt to `localhost:4200`, then fallback

### Scenario 3: Remote SLOW (Network Lag)

```bash
# Simulate slow network
# Chrome DevTools → Network → Throttling → Slow 3G
```

**Test:**
- ✅ Loading state shows
- ⏱️ After 3s timeout → Fallback
- ✅ User sees local component

### Scenario 4: Remote INTERMITTENT

```bash
# Remote goes up and down randomly
```

**Test:**
- ✅ Retry mechanism works (3 attempts)
- ✅ Eventually fallback if all retries fail

---

## 📊 Monitoring & Logging

### Error Tracking

```typescript
// components/RemoteErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: any) {
  // Log to monitoring service
  if (typeof window !== 'undefined') {
    // Sentry
    // Sentry.captureException(error, { contexts: { errorInfo } });

    // Custom analytics
    // analytics.track('remote_module_error', {
    //   module: this.props.moduleName,
    //   error: error.message,
    // });
  }
}
```

### Health Check Logging

```typescript
// utils/healthCheck.ts
export async function checkRemoteHealth(url: string): Promise<boolean> {
  try {
    const start = performance.now();
    const response = await fetch(url, { method: 'HEAD' });
    const duration = performance.now() - start;

    console.log({
      url,
      status: response.status,
      duration: \`\${duration.toFixed(2)}ms\`,
      healthy: response.ok
    });

    return response.ok;
  } catch (error) {
    console.error('Health check failed:', url, error);
    return false;
  }
}
```

---

## ✅ Implementation Checklist

### Phase 1: Setup Error Handling
- [ ] Create `RemoteErrorBoundary.tsx`
- [ ] Create `loadRemoteModule.ts` utility
- [ ] Add error tracking (Sentry/Analytics)
- [ ] Test error boundary with mock error

### Phase 2: Fallback Strategy
- [ ] Create `LoginFallback.tsx` (local component)
- [ ] Ensure local component works standalone
- [ ] Add visual indicator (warning badge)
- [ ] Test fallback UI/UX

### Phase 3: Dynamic Loading
- [ ] Create `RemoteLoginLoader.tsx`
- [ ] Implement health check
- [ ] Add retry logic
- [ ] Add timeout handling

### Phase 4: Page Integration
- [ ] Update `pages/login.tsx`
- [ ] Wrap with Error Boundary
- [ ] Add Suspense for loading state
- [ ] Test dynamic import

### Phase 5: Environment Config
- [ ] Add `NEXT_PUBLIC_REMOTE_LOGIN_URL` to `.env.local`
- [ ] Add feature flag for enable/disable remote
- [ ] Document environment variables
- [ ] Test with different URLs

### Phase 6: Testing
- [ ] Test remote UP scenario
- [ ] Test remote DOWN scenario
- [ ] Test remote SLOW scenario
- [ ] Test retry mechanism
- [ ] Test health check
- [ ] Verify `/about` not affected when remote down

### Phase 7: Monitoring
- [ ] Setup error logging
- [ ] Add performance tracking
- [ ] Create dashboard for remote health
- [ ] Setup alerts for remote failures

---

## 🚀 Quick Start Implementation

### Minimal Setup (Copy-Paste Ready)

1. **Create Error Boundary:**
```bash
touch components/RemoteErrorBoundary.tsx
# Copy code from section "Error Boundary Component"
```

2. **Create Fallback:**
```bash
touch components/LoginFallback.tsx
# Copy code from section "Local Fallback Component"
```

3. **Update Login Page:**
```bash
# Edit pages/login.tsx
# Wrap with RemoteErrorBoundary + add fallback
```

4. **Test:**
```bash
# Start host only (no remote)
npm run dev

# Access /login → Should show fallback
# Access /about → Should work normal
```

---

## 📚 Resources

- [Module Federation Docs](https://module-federation.io/)
- [Error Boundaries (React)](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js Dynamic Import](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)

---

## 🎯 Key Takeaways

1. **Never hardcode remotes in config** - Always use dynamic loading
2. **Always wrap remote components with Error Boundary**
3. **Always provide fallback component**
4. **Implement health check before loading**
5. **Add retry mechanism with timeout**
6. **Test all failure scenarios**
7. **Monitor remote health in production**

---

**Status:** 📝 Documentation Complete
**Next Steps:** Implement Error Boundary & Fallback
**Priority:** High (Before production deployment)
**Last Updated:** 2025-11-21
