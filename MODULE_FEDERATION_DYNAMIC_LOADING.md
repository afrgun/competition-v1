# Module Federation - Dynamic Loading Approach

## 📖 Overview

Project ini menggunakan **Dynamic Loading** approach untuk Module Federation, bukan hardcoded di `next.config.js`.

## 🎯 Why Dynamic Loading?

### Hardcoded Approach ❌
```javascript
// next.config.js
remotes: {
  "loginApp": "loginApp@http://localhost:4200/remoteEntry.js",
}
```

**Problems:**
- ❌ Remote loaded di **semua page** → bundle size besar
- ❌ Jika remote mati → **host bisa crash**
- ❌ URL fixed → tidak bisa ganti via env
- ❌ Tidak ada health check

### Dynamic Loading Approach ✅
```javascript
// next.config.js
remotes: {}, // KOSONG
```

**Benefits:**
- ✅ Remote **hanya load di /login** → bundle kecil
- ✅ Route lain **tidak terpengaruh** jika remote mati
- ✅ URL **configurable** via `.env.local`
- ✅ Ada **health check** sebelum load
- ✅ Ada **retry mechanism** (3x attempts)
- ✅ Ada **automatic fallback** ke local component

---

## 🏗️ Architecture

### 1. Config Layer: `next.config.js`
```javascript
remotes: {}, // Kosong untuk dynamic loading
```

### 2. Environment Config: `.env.local`
```env
NEXT_PUBLIC_REMOTE_LOGIN_URL=http://localhost:4200
NEXT_PUBLIC_USE_REMOTE_LOGIN=true
```

### 3. Health Check: `checkRemoteHealth()`
```typescript
// shared/utils/loadRemoteModule.ts
export async function checkRemoteHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 3000 });
    return response.ok;
  } catch {
    return false;
  }
}
```

**What it does:**
- HEAD request ke `remoteEntry.js`
- Timeout 3 detik
- Return `true` jika remote UP, `false` jika DOWN

### 4. Dynamic Loader: `loadRemoteModule()`
```typescript
// shared/utils/loadRemoteModule.ts
export async function loadRemoteModule({
  url,      // http://localhost:4200/remoteEntry.js
  scope,    // remoteLogin
  module,   // ./LoginForm
  maxRetries = 3,
  timeout = 5000,
}): Promise<any> {
  return retry(async () => {
    // 1. Load script via <script> tag
    await loadScript(url, timeout);

    // 2. Initialize webpack sharing
    await __webpack_init_sharing__('default');

    // 3. Get container from window
    const container = window[scope];

    // 4. Initialize container
    await container.init(__webpack_share_scopes__.default);

    // 5. Get module factory
    const factory = await container.get(module);

    // 6. Execute factory
    return factory();
  }, maxRetries, retryDelay);
}
```

**What it does:**
- Load remote script dynamically
- Retry 3x dengan delay 1 detik
- Timeout per attempt: 5 detik
- Throw error jika semua retry gagal

### 5. Remote Loader: `RemoteLoginLoader`
```typescript
// components/RemoteLoginLoader.tsx
export function RemoteLoginLoader() {
  const [useRemote, setUseRemote] = useState(false);

  useEffect(() => {
    const checkRemote = async () => {
      const isHealthy = await checkRemoteHealth(`${REMOTE_URL}/remoteEntry.js`);
      setUseRemote(isHealthy);
    };
    checkRemote();
  }, []);

  return useRemote ? <AngularLoginWrapper /> : <LoginFallback />;
}
```

**What it does:**
- Check remote health dulu (3 detik timeout)
- Jika UP → load `AngularLoginWrapper`
- Jika DOWN → show `LoginFallback`

### 6. Angular Wrapper: `AngularLoginWrapper`
```typescript
// components/AngularLoginWrapper.tsx
useEffect(() => {
  const loadAngularComponent = async () => {
    const remoteModule = await loadRemoteModule({
      url: `${REMOTE_URL}/remoteEntry.js`,
      scope: 'remoteLogin',
      module: './LoginForm',
      maxRetries: 2,
      timeout: 5000,
    });

    await bootstrapAngularComponent({
      moduleName: 'remoteLogin',
      selector: 'app-login',
      containerId: 'angular-login-container',
    });
  };

  loadAngularComponent();
}, []);
```

**What it does:**
- Load remote module dari Angular
- Bootstrap Angular component ke React container
- Handle loading states & errors
- Cleanup on unmount

### 7. Error Boundary: `RemoteErrorBoundary`
```typescript
// components/RemoteErrorBoundary.tsx
export class RemoteErrorBoundary extends Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback; // Show LoginFallback
    }
    return this.props.children;
  }
}
```

**What it does:**
- Catch errors dari remote loading
- Automatically fallback ke local component

---

## 🔄 Complete Flow

```
User visits /login
      ↓
RemoteErrorBoundary wraps everything
      ↓
RemoteLoginLoader checks health
      ↓
Is remote healthy? ← checkRemoteHealth()
      ↓
    YES → Load AngularLoginWrapper
      ↓
      loadRemoteModule() with retry
      ↓
      Success? → Bootstrap Angular component
      ↓
      Fail? → Error Boundary → LoginFallback

    NO → LoginFallback (local component)
```

---

## 📦 Files Structure

```
competition-v1/
├── next.config.js                        # remotes: {} (empty)
├── .env.local                            # NEXT_PUBLIC_REMOTE_LOGIN_URL
├── pages/
│   └── login/
│       └── index.tsx                     # Entry point with ErrorBoundary
├── components/
│   ├── RemoteLoginLoader.tsx             # Health check + conditional loader
│   ├── AngularLoginWrapper.tsx           # React wrapper for Angular
│   ├── LoginFallback.tsx                 # Local fallback component
│   └── RemoteErrorBoundary.tsx           # Error boundary
└── shared/
    └── utils/
        ├── loadRemoteModule.ts            # Dynamic loader with retry
        └── bootstrapAngular.ts            # Angular bootstrap utility
```

---

## 🧪 Testing Scenarios

### Scenario 1: Remote UP ✅
```bash
# Terminal 1: Angular running
cd C:\Users\DELL\Documents\competition-v1-remote-login
ng serve --port 4200

# Terminal 2: Next.js running
cd C:\Users\DELL\Documents\competition-v1
npm run dev
```

**Expected:**
1. Visit `http://localhost:3000/login`
2. Health check passes (3s max)
3. Angular component loads
4. Blue info badge shows: "Using remote Angular login component"
5. Console logs:
   ```
   [RemoteLoader] ✅ Remote Angular available
   [AngularWrapper] ✅ Angular component bootstrapped successfully
   ```

### Scenario 2: Remote DOWN ❌
```bash
# Angular NOT running
# Only Next.js running
npm run dev
```

**Expected:**
1. Visit `http://localhost:3000/login`
2. Health check fails (3s max)
3. Fallback to local component
4. Yellow warning badge shows: "Using Local Login"
5. Console logs:
   ```
   [RemoteLoader] ⚠️ Remote Angular not available, using fallback
   ```

### Scenario 3: Other Routes Unaffected ✅
```bash
# Angular NOT running
# Only Next.js running
```

**Expected:**
1. Visit `http://localhost:3000/` → Works ✅
2. Visit `http://localhost:3000/about` → Works ✅
3. Visit `http://localhost:3000/dashboard` → Works ✅
4. **No network requests** to localhost:4200 on these pages

### Scenario 4: Forced Fallback
```bash
# Both running, but force fallback
http://localhost:3000/login?fallback=true
```

**Expected:**
- Always uses local login
- Skips health check entirely

---

## 🛠️ Configuration

### Enable/Disable Remote Login
```env
# .env.local

# Enable remote login
NEXT_PUBLIC_USE_REMOTE_LOGIN=true

# Disable remote login (always use local)
NEXT_PUBLIC_USE_REMOTE_LOGIN=false
```

### Change Remote URL
```env
# .env.local

# Development
NEXT_PUBLIC_REMOTE_LOGIN_URL=http://localhost:4200

# Production
NEXT_PUBLIC_REMOTE_LOGIN_URL=https://login.example.com
```

### Adjust Timeouts
```typescript
// components/RemoteLoginLoader.tsx
const isHealthy = await checkRemoteHealth(remoteUrl, 3000); // 3s timeout

// components/AngularLoginWrapper.tsx
const remoteModule = await loadRemoteModule({
  timeout: 5000,     // 5s per attempt
  maxRetries: 2,     // 2 retries
});
```

---

## ⚙️ How It Works: Technical Details

### 1. Script Injection
```typescript
function loadScript(src: string, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    const timeoutId = setTimeout(() => {
      script.remove();
      reject(new Error(`Timeout loading ${src}`));
    }, timeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    document.head.appendChild(script);
  });
}
```

### 2. Webpack Runtime API
```typescript
// Webpack runtime globals (injected by Module Federation plugin)
declare global {
  const __webpack_init_sharing__: (scope: string) => Promise<void>;
  const __webpack_share_scopes__: any;
}

// Initialize sharing scope
await __webpack_init_sharing__('default');
```

### 3. Container Initialization
```typescript
// Get container from window object
const container = window['remoteLogin']; // Dari Angular webpack config

// Initialize container with shared scope
await container.init(__webpack_share_scopes__.default);
```

### 4. Module Factory
```typescript
// Get module factory
const factory = await container.get('./LoginForm'); // Dari Angular exposes

// Execute factory to get module
const Module = factory();
```

### 5. Angular Bootstrap
```typescript
// Create Angular component element
const element = document.createElement('app-login');

// Append to container
const container = document.getElementById('angular-login-container');
container.appendChild(element);

// Angular automatically bootstraps via platformBrowserDynamic()
```

---

## 🔍 Debugging

### Check if Remote is Available
```bash
# Should return JavaScript code (not 404)
curl http://localhost:4200/remoteEntry.js
```

### Check Console Logs
```javascript
// In browser console
console.log(window.remoteLogin); // Should show container object
```

### Force Reload Remote
```javascript
// Remove existing script
document.querySelector('script[src*="remoteEntry.js"]')?.remove();

// Reload page
window.location.reload();
```

### Check Network Tab
- ✅ `localhost:4200/remoteEntry.js` - Status 200
- ✅ Additional Angular chunks loaded
- ❌ No errors in console

---

## 📊 Performance

### Expected Timings
| Action | Expected | Max Acceptable |
|--------|----------|----------------|
| Health Check | 100-300ms | 3000ms |
| Remote Load | 500-1000ms | 5000ms |
| Fallback Trigger | ~3000ms | 5000ms |
| Component Mount | 200-500ms | 2000ms |

### Bundle Size Impact
```
Dynamic Loading:
✅ Home page: NO remote code loaded
✅ About page: NO remote code loaded
✅ Login page: Remote loaded ONLY when accessed

Hardcoded:
❌ Home page: Remote code loaded
❌ About page: Remote code loaded
❌ Login page: Remote code loaded
```

---

## 🚀 Deployment

### Development
```bash
# Start both services
cd C:\Users\DELL\Documents\competition-v1-remote-login
ng serve --port 4200

cd C:\Users\DELL\Documents\competition-v1
npm run dev
```

### Production
```bash
# Build Angular remote
cd competition-v1-remote-login
ng build --configuration production
# Deploy to CDN/server

# Update Next.js env
NEXT_PUBLIC_REMOTE_LOGIN_URL=https://your-remote-domain.com

# Build Next.js
cd competition-v1
npm run build
npm run start
```

---

## ✅ Benefits Summary

1. **Isolation** - Route lain tidak terpengaruh jika remote mati
2. **Resilience** - Automatic fallback ke local component
3. **Flexibility** - URL configurable via environment variables
4. **Performance** - Remote hanya load di page yang butuh
5. **Reliability** - Health check + retry mechanism
6. **UX** - Graceful degradation dengan loading states

---

## 📚 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing scenarios
- [MODULE_FEDERATION_EDGE_CASES.md](./MODULE_FEDERATION_EDGE_CASES.md) - Edge cases
- [ANGULAR_REMOTE_INTEGRATION.md](./ANGULAR_REMOTE_INTEGRATION.md) - Angular integration

---

**Status:** ✅ Dynamic Loading Implemented
**Last Updated:** 2025-11-21
