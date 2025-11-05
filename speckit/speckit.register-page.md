# speckit.register-page.md

## 🧩 Specify — Register Page

### 🎯 Tujuan
Menyediakan halaman **Register (Sign Up)** untuk peserta baru yang ingin membuat akun sebelum mengikuti Vibe Coding Competition.

---

### 🔗 Figma Design
👉 [Lihat desain di Figma](https://www.figma.com/design/S48mW84uclEbLdDEzxB8Lx/-Surveyor--tSurvey-Journey-Overview?node-id=2791-106927&t=zpY8yAK4282zCPAJ-4) 

---

### ⚙️ Kriteria Fungsional
- Menampilkan form registrasi dengan field:
  - Full Name
  - Email
  - Phone Number
  - Job Role
  - Institution/Company
  - Password
  - Checkbox confirmation
  - Button
- Validasi input:
  - Semua field wajib diisi.
  - Checkbox confirmation wajib dicentang.
  - Email harus valid.
  - Password minimal 6 karakter, setidaknya ada 1 capital, setidaknya ada 1 special character.
- Saat klik tombol **Register**:
  - Tampilkan loader selama proses.
  - Kirim data ke endpoint `POST /auth/register`.
  - Jika sukses → redirect ke `/login`.
  - Jika gagal → tampilkan pesan error dari backend.

---

### 🎨 Kriteria UI/UX
- Layout responsif (mobile dan desktop).  
- Form berada di tengah layar, dengan warna latar `bg-gray-900` dan teks `text-white`.  
- Gunakan gaya visual yang konsisten dengan halaman login.  
- Tombol `Register` berwarna `bg-blue-600 hover:bg-blue-700`.  
- Gunakan font Poppins dan radius 8px.  
- Tambahkan teks kecil di bawah form:  
  “Sudah punya akun? [Login](/login)”  
- Saat loading, tampilkan komponen `Loader`.

---

## 🧱 Plan

### 📁 Struktur Direktori

src/
 ├─ app/
 │   └─ (auth)/
 │       └─ register/
 │           ├─ page.tsx
 │           └─ layout.tsx (opsional)
 ├─ domain/
 │   └─ entities/
 │       └─ user.ts
 ├─ usecases/
 │   └─ auth/
 │       └─ registerUser.ts
 ├─ infrastructure/
 │   └─ auth/
 │       └─ AuthRepository.ts
 ├─ presentation/
 │   └─ components/
 │       ├─ atoms/
 │       │   ├─ Input.tsx
 │       │   ├─ Button.tsx
 │       │   └─ Loader.tsx
 │       ├─ molecules/
 │       │   └─ RegisterForm.tsx
 │       └─ organisms/
 │           └─ RegisterSection.tsx
 └─ shared/
     └─ utils/
         └─ storage.ts

---

### 🧩 Entities & Interfaces

```ts
// src/domain/entities/RegisterPayload.ts
export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  institution: string;
  password: string;
  confirmTerms: boolean;
}

// src/domain/entities/User.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  jobRole?: string;
  institution?: string;
  token?: string;
}
```

---

### 🔁 Flow
1. **User** mengisi form registrasi.  
2. **RegisterForm** memanggil `registerUserInteractor` dari `usecases/auth/registerUser.ts`.  
3. Usecase memanggil `AuthRepository.register(payload)`.  
4. Jika sukses → redirect ke `/login`.  
5. Jika gagal → tampilkan pesan error di form.

---

## ✅ Tasks (Checklist)

### 🧩 Domain
- [ ] Buat `RegisterPayload` interface.  
- [ ] Tambahkan `User` entity jika belum ada.

### ⚙️ Infrastructure
- [ ] Tambahkan fungsi `register` di `AuthRepository` untuk memanggil endpoint `POST /auth/register`.

### 🧠 Usecase
- [ ] Buat `registerUserInteractor` yang memanggil `AuthRepository.register`.  
- [ ] Return hasil success/error ke layer presentation.

### 💅 Presentation
- [ ] Buat atom `Text` dan `Button` jika belum ada.
- [ ] Buat atom `TextField` jika belum ada.
- [ ] Buat atom `Checkbox` untuk confirmation.
- [ ] Untuk tampilan Header, jika memungkinkan dibuat secara atomic juga.
- [ ] Buat `RegisterForm` molecule (berisi 6 input, 1 checkbox, 1 tombol, dan loader).
- [ ] Buat `RegisterSection` organism untuk tampilan utama.
- [ ] Buat page `src/app/(auth)/register/page.tsx`.
- [ ] Tambahkan link ke `/login` di bawah form.
- [ ] Pastikan tampilan sesuai desain Figma.  

---

## 💡 Implement Notes

### 🧠 Usecase Example
```ts
// usecases/auth/registerUser.ts
import { AuthRepository } from "@/infrastructure/auth/AuthRepository";
import { RegisterPayload } from "@/domain/entities/RegisterPayload";

export const registerUserInteractor = async (payload: RegisterPayload) => {
  try {
    const response = await AuthRepository.register(payload);
    return { success: true, message: "Registration success", data: response };
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};
```

---

### 💅 Page Example
```tsx
// src/app/(auth)/register/page.tsx
import RegisterSection from "@/presentation/components/organisms/RegisterSection";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <RegisterSection />
    </main>
  );
}
```

---

## 🔗 Integrasi MCP
- Link desain Figma harus disertakan di bagian **Specify → Figma Design**.  
- Pastikan nama komponen di Figma sesuai dengan struktur Atomic Design di repo (`Atoms`, `Molecules`, `Organisms`).  
- Claude MCP dapat membaca `speckit.register-page.md` ini untuk memahami struktur pengembangan sesuai desain.

---

## 📅 Deadline Implementasi
Target selesai: **3 November 2025**  
Testing & review UI dengan Figma Sync: **4 November 2025**  
Demo internal: **5 November 2025**
