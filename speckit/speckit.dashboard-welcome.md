# speckit.dashboard-welcome.md

# 🧩 Specify — Dashboard Welcome + AI Chat Input

## 🎯 Tujuan
Membuat tampilan awal dashboard yang menyapa pengguna dan menyediakan form input seperti UI chat AI modern. Form ini berfungsi sebagai entry point sebelum user membuat ticket atau melakukan konsultasi.

---

## ✨ Deskripsi Fitur
Ketika user masuk ke dashboard:

1. Muncul teks besar: **“Welcome to Dashboard 👋”**
2. Di tengah layar terdapat textarea mirip chat box AI.
3. Placeholder: **“Ada yang bisa dibantu hari ini?”**
4. Di bawah textarea terdapat dua tombol:
   - **Submit Smart Ticket** 
   - **Konsultasikan dengan Fixora**

---

## ⚙️ Kriteria Fungsional
- Menampilkan welcome title di bagian atas halaman.
- Textarea centered dan responsif.
- Tombol:
  - Submit Smart Ticket → redirect
  - Konsultasikan dengan Fixora → handler khusus
- Tidak perlu autentikasi tambahan.

---

## 🎨 Kriteria UI/UX
- Layout center screen.
- Background `bg-gray-900`, text `text-white`.
- Textarea `bg-gray-800 border-gray-700 rounded-xl`.
- Buttons:
  - Primary: `bg-blue-600`
  - Secondary: `bg-gray-600`
- Responsive & modern AI style.

---

# 🧱 Plan

## Struktur Direktori
src/
 ├─ app/(dashboard)/dashboard/page.tsx
 ├─ presentation/components/
 │   ├─ atoms/Textarea/
 │   ├─ molecules/DashboardActionButtons/
 │   └─ organisms/DashboardWelcome/
 └─ shared/constants/messages.ts

---

## Entities (Optional)
Tidak diperlukan untuk fitur UI ini.

---

## 🔁 Flow
1. User membuka `/dashboard`
2. Page memanggil `<DashboardWelcome />`
3. User mengetik di textarea (optional)
4. Klik tombol → navigasi

---

# ✅ Tasks (Checklist)

### Presentation Layer
- [ ] Atoms: `Textarea`
- [ ] Molecules: `DashboardActionButtons`
- [ ] Organisms: `DashboardWelcome`
- [ ] Page: gunakan `DashboardWelcome` di `/dashboard/home/page.tsx`

### Routing
- [ ] Pastikan route `/dashboard/my-ticket/create` ada
- [ ] Tentukan endpoint/halaman konsultasi Fixora

---

# 💡 Implement Notes

### Center Layout
```tsx
<div className="flex flex-col items-center justify-center min-h-screen text-white">
```

### Textarea
```tsx
<textarea
  className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-3/5 min-h-[120px] focus:outline-none resize-none"
  placeholder="Ada yang bisa dibantu hari ini?"
></textarea>
```

### Buttons
```tsx
<div className="flex gap-4 mt-4">
  <Button>Submit Smart Ticket</Button>
  <Button>Konsultasikan dengan Fixora</Button>
</div>
```

---

# 📅 Deadline Implementasi
- UI basic: 3–4 jam
- Routing integration: 1 jam
