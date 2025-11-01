# /speckit.constitution.md

## 🧭 Project Constitution — Vibe Coding Competition

### Project Type
Belum ditentukan (menunggu dari panitia), namun diasumsikan memiliki:
- Landing Page (public)
- Dashboard (private)
- Authentication (Login/Register)

### Tech Stack
**Frontend:**
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Context API / Zustand (sesuai kebutuhan)
- API Communication: Fetch / Axios
- Testing: Jest + React Testing Library

**General Principle:**
- Clean Architecture (Uncle Bob) adapted for Frontend
- Atomic Design for component structure

---

## 🧩 Architectural Structure

### Folder Layers
src/
├─ domain/              → Entity & interface (pure TypeScript, no dependency)
├─ usecases/            → Application logic (interactors)
├─ infrastructure/      → API services, repositories, external integrations
├─ presentation/        → Components (UI-only logic)
│  ├─ components/
│  │  ├─ atoms/         → Basic reusable UI (Button, Input, Text, etc)
│  │  ├─ molecules/     → Composition of atoms (FormField, Card, etc)
│  │  └─ organisms/     → Complex UI sections (LoginForm, DashboardGrid)
│  └─ layouts/          → Shared layouts (e.g., AuthLayout, MainLayout)
├─ app/                 → Routing layer (App Router: page.tsx, layout.tsx, loading.tsx)
│  ├─ (auth)/           → Auth routes (login, register)
│  └─ (dashboard)/      → Private routes (home, analytics, etc)
└─ shared/              → Utils, constants, and config (helpers, types, storage)

### Folder Responsibilities

- **domain** — berisi entity inti dan value object, tidak memiliki dependency eksternal.  
- **usecases** — berisi logika aplikasi (interactors) yang menghubungkan domain dan infrastructure.  
- **infrastructure** — menangani komunikasi API, integrasi eksternal, serta penyimpanan data seperti `fetch`, `axios`, dan `localStorage`.  
- **presentation** — berisi layer UI yang menerapkan komponen berdasarkan prinsip **Atomic Design**.  
- **app** — menjadi entry point routing dan logika segment-level menggunakan **Next.js App Router**.  
- **shared** — menyimpan utilitas umum seperti `types`, `helpers`, dan konfigurasi global.



### Rules
- `presentation` layer **tidak boleh langsung** memanggil `infrastructure`.
- Semua komunikasi ke backend dilakukan via `usecases`.
- Komponen UI wajib mengikuti prinsip **Atomic Design**.
- Pastikan dependency mengalir **satu arah**:  
  `domain → usecases → infrastructure → presentation`
- Gunakan `index.ts` untuk re-export pada setiap folder.

---

## 🎨 UI & Design System

### Atomic Design Structure

- **Atoms** — contoh: `Button`, `Input`, `Text`  
  Komponen UI terkecil yang dapat digunakan kembali.

- **Molecules** — contoh: `FormField`, `Card`, `NavItem`  
  Kombinasi dari beberapa atom untuk membentuk unit yang lebih kompleks.

- **Organisms** — contoh: `LoginForm`, `DashboardGrid`, `HeroSection`  
  Bagian UI besar yang terdiri dari beberapa molecules dan atoms.

- **Layouts** — contoh: `MainLayout`, `AuthLayout`  
  Mendefinisikan struktur pada level halaman.

- **Pages** — contoh: `app/(auth)/login/page.tsx`  
  Titik masuk utama untuk navigasi pengguna.


### Folder pattern example:**
```
src/presentation/components/atoms/Button/
├─ Button.tsx
├─ Button.test.tsx
├─ Button.stories.tsx
└─ index.ts
```


### 🎨 UI/UX Guidelines
- **Responsif** di semua viewport (mobile-first)
- **Pixel Perfect** terhadap Figma
- Gunakan warna dan spacing konsisten dengan Tailwind config
- Hindari inline styles
- Pastikan layout tetap stabil pada mode dark/light (jika diaktifkan)

---

## 🚀 MVP Definition
Focus utama: Dapat dipublish online dan didemokan dengan stabil.

✅ UI/UX responsif  
✅ Konversi Figma ke code (jika dibutuhkan)  
✅ Functionality berjalan sempurna  
✅ Pixel-perfect dengan desain  
✅ Integration Test dasar (BE connection)

---

## 📐 Code Convention
- Formatter: **Prettier Standard**
- Naming:
  - Components & folders → PascalCase
  - Functions, variables → camelCase
- Hindari `any`
- Gunakan async/await dengan return type eksplisit
- No console.log di production

---

## 🧩 Metodologi Pengembangan (Speckit Workflow)

Setiap fitur dikembangkan dengan mengikuti tahapan **Speckit Workflow** berikut:

1. **Specify** — Menentukan tujuan dan kriteria fitur (apa yang harus dibuat).  
2. **Plan** — Menentukan komponen, service, dan flow yang akan digunakan.  
3. **Tasks** — Menuliskan checklist implementasi teknis.  
4. **Implement** — Tahapan implementasi final di kode.

Seluruh tahapan tersebut **digabung dalam satu file Markdown per fitur**, agar lebih efisien dan mudah dibaca oleh manusia maupun AI.

Setiap fitur disimpan dengan format nama:
`speckit.[nama-fitur].md`

Contoh:
- `speckit.auth-login.md`
- `speckit.dashboard.md`
- `speckit.landing-page.md`

Struktur di dalam file:
```markdown
# Specify
...

# Plan
...

# Tasks
...

# Implement
...


---

## 🧪 Testing
- Framework: Jest + React Testing Library
- Coverage minimal: 60%
- Test wajib untuk:
  - Component critical (Button, Input, Form)
  - Usecase logic
  - Integration API call

---

## 🚀 Deployment
- Target: Dapat diakses online via Vercel / Netlify
- Pastikan build tidak error (`npm run build`)
- Pastikan `.env` tidak dikomit
- Gunakan environment `NEXT_PUBLIC_` untuk expose variable ke FE

---

## 🧾 Changelog & Revision
Gunakan section `## Revision Log` di bawah setiap Speckit file untuk mencatat perubahan penting (UI, logic, struktur).

---

## 🧩 Example Feature Speckit Files
/speckit/
├─ constitution.md
├─ speckit.auth-login.md
├─ speckit.dashboard-overview.md
└─ speckit.landing-page.md

---

## 🧭 Author & Version
- Created by: Frontend Team — Vibe Coding
- Version: 1.0.0 (base setup)
- Date: (isi setelah kickoff)