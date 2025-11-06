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
 │   └─ auth/
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

**base url**
https://e29d425094dc.ngrok-free.app/


#### Api Login
**url**
/v1/auth/login

**method**
POST

**Request Body**
```json
{
  "email": "afri@mail.com",
  "password": "123456"
}
```


**Response dari BE**
```status
200 OK
```

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "success": true
}
```

**Error Response**
```status
401 Unauthorized
```

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  },
  "success": false
}
```


**Entity di Domain**
```ts
// User entity dari /v1/auth/me
export interface User {
  id: string;
  email: string;
  accessToken: string; // disimpan dari login, bukan dari /me response
}

// Login response entity
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
```

**Mapper di Infrastructure**
```ts
// Mapper untuk login response
export const mapLoginResponse = (data: any): LoginResponse => ({
  accessToken: data.access_token,
  tokenType: data.token_type,
  expiresIn: data.expires_in,
});

// Mapper untuk user response dari /v1/auth/me
export const mapUserResponse = (data: any, accessToken: string): User => ({
  id: data.id,
  email: data.email,
  accessToken: accessToken, // token dari login, bukan dari /me
});
```

🧠 **Catatan:**
- Domain tidak boleh tahu bentuk asli response BE.
- Mapper bertugas menyesuaikan struktur data dari API ke bentuk domain entity.
- User entity menggabungkan data dari 2 endpoint: login (token) + /me (id, email)
- Jika API berubah, hanya layer `infrastructure` yang perlu diubah — domain dan UI tetap stabil.

---

#### Api auth Refresh
**url**
/v1/auth/refresh

**method**
POST

**Request Header Parameter**
```
Name: Cookie
Value: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response dari BE**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "success": true
}
```

---

#### Api Logout
**url**
/v1/auth/logout

**method**
POST

**Headers**
```
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**🧠 Note:**
- Gunakan `access_token` yang sama sebagai parameter `refresh_token` di request body

**Response dari BE**
```status
200 OK
```

```json
{
  "data": null,
  "success": true
}
```

---

#### Api Get User
**url**
/v1/auth/me

**method**
GET

**Headers**
```
Authorization: Bearer {access_token}
```

**Response dari BE**
```status
200 OK
```

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "demo@example.com"
  },
  "success": true
}
```

**Error Response**
```status
401 Unauthorized
```

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  },
  "success": false
}
```

**🧠 Note:**
- User entity (id, email) didapat dari endpoint ini, bukan dari login response
- Panggil endpoint ini setelah login berhasil untuk mendapatkan data user

---

### 🔁 Alur Data (Flow)
1. **User** mengisi email & password di form.
2. **LoginForm** memanggil `loginUserInteractor` di layer `usecases`.
3. `loginUserInteractor` memanggil `AuthRepository.login()`.
4. Jika sukses → simpan `access_token` via `storage.ts`.
5. **Call `/v1/auth/me`** dengan `access_token` untuk mendapatkan user data (id, email).
6. Simpan user data ke storage.
7. Navigasi diarahkan ke `/dashboard`.
8. Jika gagal → tampilkan error di form.

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

---

## 📝 Revision Log

### [2024-11-02] - API Integration Update
**Changed:**
- Updated API contract dengan real backend endpoints
- Tambahkan Authorization header untuk `/v1/auth/me` dan `/v1/auth/logout`
- Update flow: Login → Call `/v1/auth/me` → Get user data
- Update Entity & Mapper: Pisahkan `LoginResponse` dan `User` entity
- Clarify: `access_token` digunakan sebagai `refresh_token` parameter

**Added:**
- Endpoint `/v1/auth/me` untuk mendapatkan user data (id, email)
- Endpoint `/v1/auth/refresh` untuk refresh token
- Endpoint `/v1/auth/logout` untuk logout
- Error response documentation untuk setiap endpoint

**Notes:**
- Base URL: `https://e29d425094dc.ngrok-free.app/`
- User entity digabungkan dari 2 responses: login (token) + /me (id, email)
