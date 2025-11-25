# Module Federation Setup Guide

## ✅ Setup Status

Setup Module Federation dengan Pages Router sudah selesai dan siap digunakan.

## 📋 Konfigurasi Yang Sudah Diterapkan

### 1. Dependencies
- ✅ `@module-federation/nextjs-mf@^8.8.47` - Installed
- ✅ `webpack@^5.103.0` - Installed
- ✅ `cross-env@^10.1.0` - Installed

### 2. Environment Variables (`.env.local`)
```env
NEXT_PRIVATE_LOCAL_WEBPACK=true
```

### 3. Scripts (`package.json`)
```json
{
  "dev": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next dev",
  "build": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next build"
}
```

### 4. Module Federation Config (`next.config.js`)

**Key Features:**
- ✅ Client-side only (menghindari SSR conflicts)
- ✅ React singleton dengan eager loading
- ✅ Skip Next internals sharing
- ✅ Remote object kosong (siap untuk ditambahkan)

**Current Config:**
```javascript
{
  name: "host",
  filename: "static/chunks/remoteEntry.js",
  remotes: {}, // Kosong, siap untuk remote
  shared: {
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true }
  }
}
```

## 🚀 Cara Menjalankan

### Development Server
```bash
npm run dev
```

Server akan jalan di: `http://localhost:3000`

### Build Production
```bash
npm run build
```

## ✅ Testing Checklist

### Basic Tests (Tanpa Remote)
- [ ] Dev server berjalan tanpa error
- [ ] Home page (`/`) load dengan benar
- [ ] About page (`/about`) load dengan benar
- [ ] Login page (`/login`) load dengan benar
- [ ] Dashboard pages berfungsi normal
- [ ] `remoteEntry.js` ter-generate di `.next/static/chunks/`

### Verifikasi Module Federation
```bash
# Check remoteEntry.js exists
ls .next/static/chunks/remoteEntry.js

# Check browser console (tidak ada error React hooks)
# Buka http://localhost:3000 dan cek console
```

## 📦 Cara Menambahkan Remote (Nanti)

Ketika sudah siap menambahkan remote login:

### 1. Update `next.config.js`
```javascript
remotes: {
  loginApp: "loginApp@http://localhost:3001/remoteEntry.js",
}
```

### 2. Buat Dynamic Import di Page
```typescript
// pages/login.tsx
import dynamic from 'next/dynamic';

const RemoteLoginForm = dynamic(
  () => import('loginApp/LoginForm'),
  { ssr: false }
);

export default function LoginPage() {
  return <RemoteLoginForm />;
}
```

### 3. Error Boundary (Recommended)
```typescript
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Remote failed to load. Using fallback.</div>;
    }
    return this.props.children;
  }
}
```

## 🐛 Troubleshooting

### Error: Invalid hook call
**Solusi:** Sudah ditangani dengan config `eager: true` dan client-side only

### Error: Cannot read properties of null
**Solusi:** Sudah ditangani dengan `skipSharingNextInternals: true`

### Remote tidak load
**Checklist:**
1. Pastikan remote app sudah running
2. Check CORS settings
3. Verify URL remote di browser
4. Check browser console untuk error network

### Build gagal
**Checklist:**
1. Hapus folder `.next`: `rm -rf .next`
2. Hapus `node_modules/.cache`
3. Run `npm run build` lagi

## 📝 Notes

- **Pages Router:** Lebih stabil untuk Module Federation dibanding App Router
- **Client-side Only:** Config saat ini hanya client-side (no SSR) untuk stabilitas
- **Empty Remotes:** Remote object kosong sekarang, siap untuk ditambahkan nanti
- **Singleton React:** Mencegah duplikasi React instance

## 🔗 Resources

- [Module Federation Docs](https://module-federation.io/)
- [Next.js Module Federation](https://github.com/module-federation/nextjs-mf)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)

---

**Status:** ✅ Ready for Testing
**Last Updated:** 2025-11-21
