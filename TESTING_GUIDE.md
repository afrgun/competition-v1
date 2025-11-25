# Testing Guide - Angular Remote Integration

## 🚀 Quick Start

### Prerequisites
- [x] Next.js host ready at `C:\Users\DELL\Documents\competition-v1`
- [x] Angular remote ready at `C:\Users\DELL\Documents\competition-v1-remote-login`
- [x] All wrapper components implemented ✅

---

## 📋 Testing Scenarios

### Scenario 1: Remote UP (Full Integration Test)

**Setup:**
```bash
# Terminal 1: Start Angular Remote
cd C:\Users\DELL\Documents\competition-v1-remote-login
ng serve --port 4200

# Terminal 2: Start Next.js Host
cd C:\Users\DELL\Documents\competition-v1
npm run dev
```

**Verify Angular is running:**
```bash
# Open browser or use curl
http://localhost:4200

# Check remoteEntry.js
http://localhost:4200/remoteEntry.js
# Should return JavaScript file (not 404)
```

**Test Next.js Integration:**
1. Open: `http://localhost:3000/login`
2. **Expected:**
   - Loading spinner appears briefly
   - Blue info badge shows: "Using remote Angular login component"
   - Angular login form displays
3. **Console Check:**
   ```
   [RemoteLoader] Checking remote availability...
   [RemoteLoader] ✅ Remote Angular available
   [AngularWrapper] Starting to load Angular component...
   [LoadRemote] Loading remote module...
   [LoadRemote] ✅ Script loaded
   [LoadRemote] ✅ Module loaded successfully
   [AngularWrapper] ✅ Angular component bootstrapped successfully
   ```

**Browser DevTools:**
- **Network Tab:**
  - ✅ Request to `localhost:4200/remoteEntry.js` (Status: 200)
  - ✅ Additional Angular chunks loaded
- **Console:**
  - ❌ No errors
  - ✅ Success logs from RemoteLoader and AngularWrapper
- **Elements Tab:**
  - ✅ `<div id="angular-login-container">` present
  - ✅ `<app-login>` component inside

---

### Scenario 2: Remote DOWN (Fallback Test)

**Setup:**
```bash
# Terminal 1: Angular NOT running (stop it if running)

# Terminal 2: Start Next.js Host only
cd C:\Users\DELL\Documents\competition-v1
npm run dev
```

**Test Fallback:**
1. Open: `http://localhost:3000/login`
2. **Expected:**
   - "Checking remote service availability..." appears briefly
   - Yellow warning badge appears: "Using Local Login"
   - Next.js local login form displays
3. **Console Check:**
   ```
   [RemoteLoader] Checking remote availability...
   [RemoteLoader] ⚠️ Remote Angular not available, using fallback
   ```

**Visual Verification:**
- ✅ Page still works
- ✅ Warning message clear and user-friendly
- ✅ Local login form functional
- ❌ No crash or error screens

---

### Scenario 3: Other Routes Not Affected

**Setup:**
```bash
# Terminal 1: Angular NOT running
# Terminal 2: Next.js running
```

**Test:**
1. Open: `http://localhost:3000/` (home page)
   - ✅ Should load normally
   - ✅ No attempt to contact `localhost:4200`

2. Open: `http://localhost:3000/about`
   - ✅ Should load normally
   - ✅ Gradient background works
   - ✅ No errors in console

3. Open: `http://localhost:3000/dashboard`
   - ✅ Should redirect to login or load dashboard
   - ✅ Not affected by remote status

**Network Tab Check:**
- ❌ NO requests to `localhost:4200` on these pages
- ✅ Only requests when explicitly visiting `/login`

---

### Scenario 4: Forced Fallback

**Test URL Parameter:**
```
http://localhost:3000/login?fallback=true
```

**Expected:**
- ✅ Always uses local login
- ✅ Skips remote check entirely
- ✅ Yellow warning badge shows

---

### Scenario 5: Feature Flag Disabled

**Edit `.env.local`:**
```env
NEXT_PUBLIC_USE_REMOTE_LOGIN=false
```

**Restart Dev Server:**
```bash
npm run dev
```

**Test:**
1. Open: `http://localhost:3000/login`
2. **Expected:**
   - ✅ Immediately shows local login
   - ✅ No remote check performed
   - ✅ Warning badge displays

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error in Console:**
```
Access to fetch at 'http://localhost:4200/remoteEntry.js' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:**
Angular `angular.json`:
```json
{
  "serve": {
    "options": {
      "port": 4200,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
}
```

### Issue 2: remoteEntry.js 404

**Check:**
```bash
curl http://localhost:4200/remoteEntry.js
```

**If 404:**
1. Verify Angular is running: `ng serve --port 4200`
2. Check webpack.config.js is loaded
3. Rebuild: `ng build`

### Issue 3: Angular Component Not Rendering

**Debug Steps:**

1. **Check Console Logs:**
   - Look for "[AngularWrapper]" logs
   - Check for module loading errors

2. **Verify Window Object:**
   ```javascript
   // In browser console
   console.log(window.remoteLogin);
   // Should show container object
   ```

3. **Check Component Selector:**
   In Angular `login.component.ts`:
   ```typescript
   @Component({
     selector: 'app-login',  // ← Must match ANGULAR_SELECTOR in wrapper
     ...
   })
   ```

4. **Network Tab:**
   - `remoteEntry.js` Status: 200 ✅
   - Additional chunks loaded ✅

### Issue 4: Infinite Loading

**Symptoms:**
- Spinner never stops
- Component never mounts

**Debug:**
1. Check console for errors
2. Verify Angular app exports component correctly
3. Check webpack config exposes correct path:
   ```javascript
   exposes: {
     './LoginForm': './src/app/login/login.component.ts'
   }
   ```

### Issue 5: Styles Not Appearing

**Problem:** Angular component renders but has no styles

**Solutions:**

**Option 1:** Include Angular styles globally
```typescript
// pages/_app.tsx
import '../styles/angular-remote.css';
```

**Option 2:** Angular component includes its styles
```typescript
// login.component.ts
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],  // ← Ensure this is included
  encapsulation: ViewEncapsulation.None  // ← Optional: disable encapsulation
})
```

---

## ✅ Success Checklist

### Pre-Test
- [ ] Angular remote running on port 4200
- [ ] Next.js host running on port 3000
- [ ] No other services using these ports
- [ ] `.env.local` configured correctly

### During Test
- [ ] Health check completes (3 seconds max)
- [ ] Loading states appear properly
- [ ] No console errors in either scenario
- [ ] Network requests complete successfully
- [ ] Components render fully

### Remote UP Tests
- [ ] Remote availability check passes
- [ ] remoteEntry.js loads (200 status)
- [ ] Angular component mounts
- [ ] Info badge shows remote URL
- [ ] Login form displays correctly
- [ ] Styles applied properly

### Remote DOWN Tests
- [ ] Health check fails gracefully
- [ ] Fallback triggers automatically
- [ ] Warning message displays
- [ ] Local login works normally
- [ ] No error screens

### Isolation Tests
- [ ] `/` page not affected
- [ ] `/about` page not affected
- [ ] `/dashboard` page not affected
- [ ] Only `/login` checks remote

---

## 📊 Performance Metrics

### Expected Timings

| Action | Expected Time | Acceptable Range |
|--------|---------------|------------------|
| Health Check | ~100-300ms | < 3000ms |
| Remote Load | ~500-1000ms | < 5000ms |
| Fallback Trigger | ~3000ms | < 5000ms |
| Component Mount | ~200-500ms | < 2000ms |

### Monitoring Points

```javascript
// In browser console, check:
performance.getEntriesByType('resource')
  .filter(e => e.name.includes('4200'))
  .forEach(e => console.log(e.name, e.duration + 'ms'));
```

---

## 🎯 Quick Commands Reference

```bash
# Start Angular Remote
cd C:\Users\DELL\Documents\competition-v1-remote-login
ng serve --port 4200

# Start Next.js Host
cd C:\Users\DELL\Documents\competition-v1
npm run dev

# Check Remote Health
curl http://localhost:4200/remoteEntry.js

# Force Fallback
http://localhost:3000/login?fallback=true

# Test Both Services
curl http://localhost:3000 && curl http://localhost:4200
```

---

## 📝 Component Files Created

✅ All implemented and ready:

1. `shared/utils/bootstrapAngular.ts` - Angular bootstrap utility
2. `shared/utils/loadRemoteModule.ts` - Module Federation loader with retry
3. `components/AngularLoginWrapper.tsx` - React wrapper for Angular
4. `components/RemoteLoginLoader.tsx` - Health check + loader
5. `components/LoginFallback.tsx` - Local fallback component
6. `components/RemoteErrorBoundary.tsx` - Error boundary
7. `pages/login/index.tsx` - Updated login page

---

## 🔗 Related Documentation

- [MODULE_FEDERATION_SETUP.md](./MODULE_FEDERATION_SETUP.md) - Initial setup
- [MODULE_FEDERATION_EDGE_CASES.md](./MODULE_FEDERATION_EDGE_CASES.md) - Edge cases
- [ANGULAR_REMOTE_INTEGRATION.md](./ANGULAR_REMOTE_INTEGRATION.md) - Integration guide

---

**Status:** ✅ Ready for Testing
**Next Step:** Start both services and test!
**Last Updated:** 2025-11-21
