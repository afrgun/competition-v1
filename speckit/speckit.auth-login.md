# speckit.auth-login.md

## 🧩 Specify — Fitur Login Page

### 🎯 Tujuan
Menyediakan halaman login agar pengguna dapat mengakses dashboard aplikasi.

### 🎯 Deskripsi Singkat
- Halaman ini merupakan entry point utama bagi pengguna yang sudah memiliki akun.
- Mengautentikasi pengguna melalui endpoint `POST /auth/login`.
- Menyimpan token hasil login untuk digunakan dalam sesi aplikasi.
- Jika login berhasil, pengguna diarahkan ke `/dashboard`.

---

### ⚙️ Kriteria Fungsional
- Menampilkan form dengan field:
  - Email (type email)
  - Password (type password)
- Validasi input (email valid dan password minimal 6 karakter)
- Tombol **"Login"** aktif jika semua input valid
- Loading state saat proses login berlangsung
- Jika sukses → redirect ke `/dashboard`
- Jika gagal → tampilkan pesan error dari backend
- Token disimpan dengan mekanisme `localStorage` atau `cookie`

---

### 🎨 Kriteria UI/UX
- Layout responsif (mobile & desktop)
- Form berada di tengah layar (centered)
- Menggunakan background `bg-gray-900` dan text `text-white`
- Tombol `Login` berwarna `bg-blue-600 hover:bg-blue-700`
- Gunakan font `medium` dan radius `8px`
- Saat loading, tampilkan `Loader` (atom)

---

## 🧱 Plan

### 🧩 Arsitektur & Struktur File

src/
 ├─ app/
 │   └─ (auth)/
 │       └─ login/
 │           ├─ page.tsx              → halaman login utama
 │           └─ layout.tsx (opsional) → layout khusus auth
 ├─ domain/
 │   └─ entities/
 │       └─ user.ts
 ├─ usecases/
 │   └─ auth/
 │       └─ loginUser.ts
 ├─ infrastructure/
 │   └─ auth/
 │       └─ AuthRepository.ts
 ├─ presentation/
 │   └─ components/
 │       ├─ atoms/
 │       │   ├─ Input.tsx
 │       │   ├─ Button.tsx
 │       │   └─ Loader.tsx
 │       └─ molecules/
 │           └─ LoginForm.tsx
 └─ shared/
     └─ utils/
         └─ storage.ts

---

### 🧩 Entities & Interfaces

#### 1. Versi Minimal (Tahap Awal / Belum Ada API Final)
Gunakan struktur sederhana hanya untuk kebutuhan FE dan UI.

```ts
// src/domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

// src/domain/entities/AuthCredentials.ts
export interface AuthCredentials {
  email: string;
  password: string;
}
```

#### 2. Versi API Contract (Jika BE Sudah Fix)
Jika backend sudah punya kontrak JSON final, sinkronkan di sini dan tambahkan mapper di `infrastructure`.

**Contoh Response dari BE**
```json
{
  "id": "user_001",
  "fullname": "Afri",
  "email": "afri@mail.com",
  "access_token": "abcd123"
}
```

**Entity di Domain**
```ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}
```

**Mapper di Infrastructure**
```ts
export const mapUserResponse = (data: any): User => ({
  id: data.id,
  fullName: data.fullname,
  email: data.email,
  accessToken: data.access_token,
});
```

🧠 **Catatan:**
- Domain tidak boleh tahu bentuk asli response BE.  
- Mapper bertugas menyesuaikan struktur data dari API ke bentuk domain entity.  
- Jika API berubah, hanya layer `infrastructure` yang perlu diubah — domain dan UI tetap stabil.

---

### 🔁 Alur Data (Flow)
1. **User** mengisi email & password di form.
2. **LoginForm** memanggil `loginUserInteractor` di layer `usecases`.
3. `loginUserInteractor` memanggil `AuthRepository.login()`.
4. Jika sukses → token disimpan via `storage.ts`.
5. Navigasi diarahkan ke `/dashboard`.
6. Jika gagal → tampilkan error di form.

---

## ✅ Tasks (Checklist)

### 🧩 Domain
- [ ] Buat `UserCredentials` & `UserToken` interface di `domain/entities/user.ts`

### ⚙️ Infrastructure
- [ ] Buat `AuthRepository` dengan fungsi `login(email, password)` yang memanggil endpoint `/auth/login`

### 🧠 Usecase
- [ ] Buat `loginUserInteractor` yang memanggil `AuthRepository.login`
- [ ] Return token atau error message sesuai response

### 💅 Presentation
- [ ] Buat atom `Input`
- [ ] Buat atom `Button`
- [ ] Gunakan atom `Loader` (sudah ada)
- [ ] Buat molecule `LoginForm` (berisi 2 input + button)
- [ ] Buat page `LoginPage.tsx`
- [ ] Tambahkan state loading dan error
- [ ] Panggil usecase `loginUserInteractor`
- [ ] Redirect ke `/dashboard` jika berhasil

### 🧰 Shared
- [ ] Tambahkan helper `storage.ts` (untuk get/set/remove token)

---

## 💡 Implement Notes

### 🧠 Login Logic
```ts
// usecases/auth/loginUser.ts
import { AuthRepository } from "@/infrastructure/auth/AuthRepository";

export const loginUserInteractor = async (email: string, password: string) => {
  try {
    const token = await AuthRepository.login(email, password);
    return { success: true, token };
  } catch (error: any) {
    return { success: false, message: error?.message || "Login gagal" };
  }
};

// shared/utils/storage.ts
export const setToken = (token: string) => localStorage.setItem("access_token", token);
export const getToken = () => localStorage.getItem("access_token");
export const clearToken = () => localStorage.removeItem("access_token");

// src/app/(auth)/login/page.tsx
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg">
        <h1 className="text-2xl font-medium mb-4 text-center">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
```
