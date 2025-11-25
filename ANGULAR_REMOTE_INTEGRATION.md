# Angular Remote Integration Guide

## 📋 Overview

**Host:** Next.js (Pages Router) - `localhost:3000`
**Remote:** Angular 21 - `localhost:4200`

**Remote Configuration:**
```javascript
{
  name: "remoteLogin",
  filename: "remoteEntry.js",
  exposes: {
    './LoginForm': './src/app/login/login.component.ts'
  }
}
```

---

## 🚀 Step-by-Step Integration

### Step 1: Start Both Applications

#### Terminal 1 - Angular Remote
```bash
cd C:\Users\DELL\Documents\competition-v1-remote-login
npm run serve:mf
# or
ng serve --port 4200
```

**Verify Remote Running:**
- Open: `http://localhost:4200`
- Check: `http://localhost:4200/remoteEntry.js` (should return JS file)

#### Terminal 2 - Next.js Host
```bash
cd C:\Users\DELL\Documents\competition-v1
npm run dev
```

**Verify Host Running:**
- Open: `http://localhost:3000`

---

### Step 2: Create Angular Bootstrap Utility

**File:** `utils/bootstrapAngular.ts`

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export async function bootstrapAngularComponent(
  moduleName: string,
  selector: string,
  containerId: string
) {
  try {
    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    // Create Angular element
    const element = document.createElement(selector);
    container.appendChild(element);

    console.log('Angular component bootstrapped:', {
      moduleName,
      selector,
      containerId
    });

    return element;
  } catch (error) {
    console.error('Failed to bootstrap Angular component:', error);
    throw error;
  }
}
```

---

### Step 3: Create Angular Wrapper Component

**File:** `components/AngularLoginWrapper.tsx`

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { loadRemoteModule } from '@/utils/loadRemoteModule';

export function AngularLoginWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAngularComponent = async () => {
      try {
        console.log('Loading Angular remote component...');

        // Load remote module
        const remoteModule = await loadRemoteModule({
          url: 'http://localhost:4200/remoteEntry.js',
          scope: 'remoteLogin',
          module: './LoginForm',
          maxRetries: 2,
          timeout: 5000,
        });

        if (!mounted) return;

        console.log('Remote module loaded:', remoteModule);

        // Angular component loaded successfully
        // Mount component to DOM
        if (containerRef.current) {
          // For Angular components, we need to bootstrap the component
          // This is a simplified approach - you may need to adjust based on your Angular setup

          // Create a custom element for Angular component
          const angularElement = document.createElement('app-login');
          containerRef.current.appendChild(angularElement);

          console.log('Angular component mounted');
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load Angular component:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load remote component');
          setLoading(false);
        }
      }
    };

    loadAngularComponent();

    return () => {
      mounted = false;
      // Cleanup Angular component if needed
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Angular Login Component...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg border border-red-700">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Remote Component</h3>
          <p className="text-gray-400 mb-4">{error}</p>
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

  return (
    <div
      ref={containerRef}
      id="angular-login-container"
      className="min-h-screen bg-gray-900"
    >
      {/* Angular component will be mounted here */}
    </div>
  );
}
```

---

### Step 4: Update Remote Login Loader

**File:** `components/RemoteLoginLoader.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { AngularLoginWrapper } from './AngularLoginWrapper';
import { LoginFallback } from './LoginFallback';

export function RemoteLoginLoader() {
  const [useRemote, setUseRemote] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if remote is available
    const remoteUrl = 'http://localhost:4200/remoteEntry.js';

    fetch(remoteUrl, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          console.log('✅ Remote Angular available');
          setUseRemote(true);
        } else {
          console.warn('⚠️ Remote Angular not available, using fallback');
          setUseRemote(false);
        }
      })
      .catch((error) => {
        console.warn('⚠️ Remote Angular check failed, using fallback:', error);
        setUseRemote(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Checking remote availability...</div>
      </div>
    );
  }

  if (useRemote) {
    return <AngularLoginWrapper />;
  }

  return <LoginFallback />;
}
```

---

### Step 5: Update Login Page (Already Good!)

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
      moduleName="Remote Angular Login"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteLogin />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
```

---

### Step 6: Update Environment Variables

**File:** `.env.local`

```env
# Module Federation
NEXT_PRIVATE_LOCAL_WEBPACK=true

# Remote URLs
NEXT_PUBLIC_REMOTE_LOGIN_URL=http://localhost:4200
NEXT_PUBLIC_USE_REMOTE_LOGIN=true

# Development
NODE_ENV=development
```

---

## 🔧 Angular Remote Setup (Already Done!)

Your Angular remote is already configured correctly:

### webpack.config.js ✅
```javascript
{
  name: "remoteLogin",
  filename: "remoteEntry.js",
  exposes: {
    './LoginForm': './src/app/login/login.component.ts'
  },
  shared: {
    "@angular/core": { singleton: true },
    "@angular/common": { singleton: true },
    "@angular/router": { singleton: true },
    "rxjs": { singleton: true }
  }
}
```

### package.json ✅
```json
{
  "scripts": {
    "serve:mf": "ng serve --port 4200"
  }
}
```

---

## 🧪 Testing Guide

### Test 1: Remote Available (Both Running)

```bash
# Terminal 1
cd competition-v1-remote-login
ng serve --port 4200

# Terminal 2
cd competition-v1
npm run dev

# Browser
# http://localhost:3000/login
```

**Expected:**
- ✅ Health check passes
- ✅ Angular component loads
- ✅ Login form from Angular displays

**Console Check:**
```
✅ Remote Angular available
Loading Angular remote component...
Remote module loaded
Angular component mounted
```

### Test 2: Remote Unavailable (Only Host Running)

```bash
# Terminal 1: Angular NOT running

# Terminal 2
cd competition-v1
npm run dev

# Browser
# http://localhost:3000/login
```

**Expected:**
- ⚠️ Health check fails
- ✅ Fallback to Next.js local login
- ✅ Warning badge shows "Using local login"

**Console Check:**
```
⚠️ Remote Angular not available, using fallback
```

### Test 3: Other Routes Not Affected

```bash
# Terminal 1: Angular NOT running

# Terminal 2
cd competition-v1
npm run dev

# Browser
# http://localhost:3000/about
# http://localhost:3000/
```

**Expected:**
- ✅ Pages load normally
- ✅ No attempt to connect to Angular
- ✅ Zero impact from remote being down

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:4200/remoteEntry.js' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:**

In Angular, update `angular.json`:

```json
{
  "serve": {
    "options": {
      "port": 4200,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }
  }
}
```

Or use a proxy in Angular:

**File:** `proxy.conf.json`
```json
{
  "/": {
    "target": "http://localhost:4200",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Issue 2: remoteEntry.js 404

**Check:**
```bash
# Verify Angular build output
ls dist/competition-v1-remote-login/browser/remoteEntry.js

# Verify serve is working
curl http://localhost:4200/remoteEntry.js
```

**Solution:**
- Ensure Angular is running on port 4200
- Check webpack.config.js is loaded
- Verify build completed successfully

### Issue 3: Angular Component Not Rendering

**Debug Steps:**

1. Check browser console for errors
2. Verify remote module loaded:
```javascript
// In browser console
console.log(window.remoteLogin);
```

3. Check network tab:
- `remoteEntry.js` should be loaded
- Status should be 200

4. Verify Angular component selector:
```typescript
// In login.component.ts
@Component({
  selector: 'app-login',  // ← Must match
  ...
})
```

### Issue 4: Styles Not Loading

**Problem:** Angular styles not applied

**Solution:**

Option 1: Global styles in Angular
```scss
// In Angular global styles.scss
:host {
  display: block;
  // Your styles
}
```

Option 2: Import Angular styles in Next.js
```typescript
// pages/_app.tsx
import '../styles/angular-login.css'; // Export from Angular
```

### Issue 5: Multiple React Versions

**Error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component
```

**Solution:**
This shouldn't happen because Angular doesn't use React, but if it does:

```javascript
// next.config.js
shared: {
  react: { singleton: true, eager: true },
  "react-dom": { singleton: true, eager: true },
}
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (localhost:3000)            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Next.js Host (React)                            │ │
│  │                                                   │ │
│  │  pages/login.tsx                                 │ │
│  │       ↓                                          │ │
│  │  RemoteErrorBoundary                            │ │
│  │       ↓                                          │ │
│  │  RemoteLoginLoader (Health Check)               │ │
│  │       ↓                                          │ │
│  │  ┌─────────────────┐  ┌─────────────────┐     │ │
│  │  │ AngularWrapper  │  │ LoginFallback   │     │ │
│  │  │ (if remote UP)  │  │ (if remote DOWN)│     │ │
│  │  └────────┬────────┘  └─────────────────┘     │ │
│  │           │                                     │ │
│  └───────────┼─────────────────────────────────────┘ │
│              │                                       │
│              │ loadRemoteModule()                    │
│              ↓                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │  Fetch: http://localhost:4200/remoteEntry.js  │  │
│  └───────────────────────────────────────────────┘  │
│              │                                       │
└──────────────┼───────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────┐
│           Angular Remote (localhost:4200)               │
│                                                         │
│  Module Federation Plugin                               │
│  ├─ name: "remoteLogin"                                │
│  ├─ exposes: "./LoginForm"                             │
│  │     └─ login.component.ts                           │
│  └─ shared: [@angular/core, rxjs, etc]                │
│                                                         │
│  remoteEntry.js → Webpack Container                    │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Phase 1: Preparation
- [x] Angular remote running on port 4200
- [x] Next.js host running on port 3000
- [x] Verify remoteEntry.js accessible
- [ ] Test Angular app standalone

### Phase 2: Create Utilities
- [ ] Create `utils/bootstrapAngular.ts`
- [ ] Test bootstrap utility
- [ ] Create error handling

### Phase 3: Create Components
- [ ] Create `components/AngularLoginWrapper.tsx`
- [ ] Create `components/RemoteLoginLoader.tsx`
- [ ] Test with remote UP
- [ ] Test with remote DOWN

### Phase 4: Integration
- [ ] Update `pages/login.tsx` (already done)
- [ ] Add environment variables
- [ ] Test health check
- [ ] Verify fallback works

### Phase 5: Testing
- [ ] Test: Remote UP → Angular component shows
- [ ] Test: Remote DOWN → Fallback shows
- [ ] Test: `/about` not affected
- [ ] Test: CORS working
- [ ] Test: Styles loading

### Phase 6: Polish
- [ ] Add loading states
- [ ] Add error messages
- [ ] Add retry button
- [ ] Add development mode indicator

---

## 🎯 Quick Start Commands

### Start Both Services
```bash
# Terminal 1: Angular Remote
cd C:\Users\DELL\Documents\competition-v1-remote-login
ng serve --port 4200

# Terminal 2: Next.js Host
cd C:\Users\DELL\Documents\competition-v1
npm run dev

# Terminal 3: Test
curl http://localhost:4200/remoteEntry.js
curl http://localhost:3000
```

### Verify Setup
```bash
# Check Angular
http://localhost:4200

# Check Next.js
http://localhost:3000

# Check Remote Entry
http://localhost:4200/remoteEntry.js

# Test Integration
http://localhost:3000/login
```

---

## 📚 Next Steps

1. **Create Angular Wrapper** → `components/AngularLoginWrapper.tsx`
2. **Test Integration** → Both apps running
3. **Implement Error Handling** → Test remote down scenario
4. **Add Monitoring** → Log remote health
5. **Production Ready** → Environment-based URLs

---

## 🔗 References

- [Angular Module Federation](https://github.com/angular-architects/module-federation-plugin)
- [Next.js Module Federation Setup](./MODULE_FEDERATION_SETUP.md)
- [Edge Cases Documentation](./MODULE_FEDERATION_EDGE_CASES.md)

---

**Status:** 📝 Ready for Implementation
**Next Step:** Create AngularLoginWrapper.tsx
**Priority:** High
**Last Updated:** 2025-11-21
