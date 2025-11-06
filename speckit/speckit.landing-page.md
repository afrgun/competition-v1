# speckit.landing-page.md

## 🧩 Specify — Landing Page Vibe Coding Competition

### 🎯 Tujuan
Menampilkan halaman utama (landing page) yang memberikan informasi event **Vibe Coding Competition**, menampilkan waktu hitung mundur (countdown), dan menyediakan tombol **Login** di header untuk peserta yang sudah memiliki akun.

---

### ⚙️ Kriteria Fungsional
- Menampilkan teks utama: `Vibe Coding Competition`.
- Menampilkan countdown menuju tanggal **6 November 2025 pukul 09:00 WIB**.
- Setelah waktu countdown berakhir, teks berubah menjadi `"Competition Started!"`.
- Header menampilkan tombol **Login** di pojok kanan atas.
- Klik tombol **Login** akan mengarahkan pengguna ke halaman `/login`.

---

### 🎨 Kriteria UI/UX
- Layout responsif (mobile & desktop).  
- Header fixed di bagian atas, dengan warna latar `bg-gray-900` dan text `text-white`.  
- Teks utama besar dan di tengah layar (`text-4xl` hingga `text-6xl`).  
- Countdown ditampilkan di bawah teks utama dengan font `monospace`.  
- Gunakan font Poppins medium.  
- Background halaman `bg-black` atau `bg-gradient-to-b from-gray-900 to-gray-800`.  
- Animasi ringan (fade-in) untuk teks dan countdown.

---

## 🧱 Plan

### 📁 Struktur Direktori

src/
 ├─ app/
 │   └─ (public)/
 │       └─ page.tsx                → landing page utama
 ├─ domain/
 │   └─ entities/
 │       └─ countdown.ts
 ├─ usecases/
 │   └─ countdown/
 │       └─ getRemainingTime.ts
 ├─ presentation/
 │   └─ components/
 │       ├─ atoms/
 │       │   ├─ Text.tsx
 │       │   ├─ Button.tsx
 │       │   └─ Timer.tsx
 │       ├─ molecules/
 │       │   ├─ CountdownDisplay.tsx
 │       └─ organisms/
 │           ├─ HeroSection.tsx
 │           └─ HeaderNav.tsx
 └─ shared/
     └─ utils/
         └─ dateHelper.ts

---

### 🧩 Entities & Interfaces

```ts
// src/domain/entities/Countdown.ts
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

// src/domain/entities/Event.ts
export interface Event {
  title: string;
  startDate: string; // ISO string
}
```

---

### 🔁 Flow
1. **HeroSection** menampilkan judul event dan countdown.  
2. **CountdownDisplay** menerima data countdown dari usecase `getRemainingTime`.  
3. Usecase menghitung selisih waktu antara sekarang dan `2025-11-06T09:00:00+07:00`.  
4. Jika waktu sudah lewat → tampilkan `"Competition Started!"`.  
5. **HeaderNav** menampilkan tombol `Login` yang mengarah ke `/login`.

---

## ✅ Tasks (Checklist)

### 🧩 Domain
- [ ] Buat interface `Countdown` & `Event`.

### ⚙️ Usecase
- [ ] Buat fungsi `getRemainingTime(eventDate: string)` untuk menghitung selisih waktu.
- [ ] Return hasil dalam bentuk `Countdown`.

### 💅 Presentation
- [ ] Buat atom `Text` dan `Button` jika belum ada.  
- [ ] Buat atom `Timer` untuk menampilkan sisa waktu (hh:mm:ss).  
- [ ] Buat molecule `CountdownDisplay` untuk menggabungkan komponen `Timer` dan label teks.  
- [ ] Buat organism `HeroSection` untuk menampilkan teks utama dan countdown.  
- [ ] Buat organism `HeaderNav` untuk menampilkan tombol `Login` di kanan atas.  
- [ ] Buat `page.tsx` sebagai entry point landing page.  

### 🧰 Shared
- [ ] Tambahkan `dateHelper.ts` dengan fungsi `getTimeDiffInSeconds(targetDate: string)`.

---

## 💡 Implement Notes

### 🧠 Usecase Example
```ts
// usecases/countdown/getRemainingTime.ts
import { Countdown } from "@/domain/entities/Countdown";

export const getRemainingTime = (targetDate: string): Countdown => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isFinished: diff === 0,
  };
};
```

---

### 💅 UI Example (Simplified)
```tsx
// presentation/components/organisms/HeroSection.tsx
"use client";
import { useEffect, useState } from "react";
import { getRemainingTime } from "@/usecases/countdown/getRemainingTime";

export default function HeroSection() {
  const [countdown, setCountdown] = useState(() =>
    getRemainingTime("2025-11-06T09:00:00+07:00")
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getRemainingTime("2025-11-06T09:00:00+07:00"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-[90vh] text-white text-center">
      <h1 className="text-5xl font-bold mb-4">Vibe Coding Competition</h1>
      {countdown.isFinished ? (
        <p className="text-lg mt-2 text-green-400">Competition Started!</p>
      ) : (
        <p className="font-mono text-3xl">
          {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
        </p>
      )}
    </section>
  );
}
```
