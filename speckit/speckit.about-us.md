# speckit.about-us.md

# 🧩 Specify — Halaman About Us (Fixora)

## 🎯 Tujuan
Membuat halaman **About Us** yang menjelaskan apa itu Fixora, fitur utama, teknologi yang digunakan, serta keunggulan platform. Halaman ini bersifat informatif dan menjadi representasi profesional untuk pengunjung publik.

---

## ✨ Konten yang Harus Ditampilkan

### Judul Utama
**Fixora — Solusi Smart IT Ticketing**

### Deskripsi Utama
Fixora adalah platform IT ticketing modern berbasis AI yang dirancang untuk menyederhanakan alur kerja helpdesk dan meningkatkan produktivitas bagi karyawan maupun team IT support. Platform ini diharapkan dapat meningkatkan kepuasan user internal dan mengoptimalkan produktivitas organisasi melalui AI adaptif. Dengan Tagline Think less. Resolve faster. Aplikasi ini dikembangkan dalam ajang **Vibe Coding Competition** dan berhasil meraih **Juara 1**.  

---

## 🔍 Section: Fitur Utama
- Dashboard berbasis role:
  - Employee: Home, My Ticket, FAQ
  - Admin: Ticket Management, List Employee
- Smart Ticket Intake (AI-Generated)
- Asisten Konsultasi “Fixora AI” dengan tema One Time Consultation
- List Ticket Dinamis
- Landing Page

---

## 🌟 Section: Keunggulan Fixora
- Cepat & Efisien  
- UX responsif dan presisi  
- Integrasi AI kuat  
- Arsitektur scalable  

---

## Section Screenshot
- ![Screenshot 1](./public/landing.png)
- ![Screenshot 2](./public/login.png)
- ![Screenshot 3](./public/dash-employee.png)
- ![Screenshot 4](./public/fixora-1.png)
- ![Screenshot 5](./public/fixora-2.png)
- ![Screenshot 6](./public/ticket-employee.png)
- ![Screenshot 6](./public/ticket-admin.png)

---

# 🧱 Plan

## Struktur direktori
root/
├─ app/about/page.tsx
├─ presentation/components/organisms/AboutHero/
├─ presentation/components/organisms/AboutFeatures/
├─ presentation/components/organisms/AboutArchitecture/
├─ presentation/components/organisms/AboutAdvantages/
└─ presentation/components/organisms/AboutPrototypeLink/


## Komponen yang Dibuat
- AboutHero → judul + deskripsi  
- AboutFeatures → list fitur utama  
- AboutArchitecture → list teknologi & arsitektur  
- AboutAdvantages → keunggulan Fixora  
- AboutPrototypeLink → tombol / link ke Gamma  

---

# ✅ Tasks (Checklist)

### UI Components
- [ ] Buat `AboutHero`
- [ ] Buat `AboutFeatures`
- [ ] Buat `AboutArchitecture`
- [ ] Buat `AboutAdvantages`
- [ ] Buat `AboutPrototypeLink`

### Page
- [ ] Buat halaman `/about-us`
- [ ] Import seluruh organism
- [ ] Pastikan responsif mobile & desktop  
- [ ] Gunakan spacing & styling konsisten (tailwind utility)

### UX & Branding
- [ ] Font Poppins  
- [ ] Warna konsisten dengan tema Fixora  
- [ ] Tambahkan animasi halus untuk transition (opsional)

---

# 📝 Implement Notes
- Seluruh section ditampilkan secara vertical stacked dengan spacing nyaman.  
- Gunakan card layout untuk bagian keunggulan agar mudah dibaca.  
- Link Gamma ditampilkan sebagai tombol **Lihat Prototype**.

---

# 📅 Estimasi Waktu
- Pembuatan komponen: 2–3 jam  
- Styling & layout: 1 jam  
- Final review: 30 menit  
