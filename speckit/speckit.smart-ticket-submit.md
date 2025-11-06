# speckit.smart-ticket-submit.md

# 🧩 Specify — Submit Smart Ticket (AI Intake)

## 🎯 Tujuan
Membuat fitur **Submit Smart Ticket**, yaitu pengguna dapat mengirimkan deskripsi masalah, lalu backend melakukan AI intake untuk membuat tiket baru secara otomatis.

---

## 🔗 Endpoint API
**POST**
https://private-anon-816463f8b5-vibecoding.apiary-mock.com/v1/tickets/ai-intake

### 📤 Request Body
```json
{
  "description": "<text_input_user>",
  "created_by": "<userId_from_v1/auth/me>"
}
```

### ✅ Validasi
- Input deskripsi wajib diisi sebelum API dipanggil.
- `created_by` diambil dari endpoint `/v1/auth/me`.

---

## 📥 Example Response
Hanya membaca field:
```json
{ "success": true }
```

Jika success → redirect / refresh list ticket → tampilkan UI success.

---

# ⚙️ Kriteria Fungsional
- Mengambil `description` dari textarea smart ticket.
- Ambil userId dari `/v1/auth/me` (sudah login).
- Melakukan POST request ke AI Intake API.
- Jika sukses:
  - munculkan notifikasi “Smart Ticket berhasil dikirim”
  - redirect ke `/dashboard/tickets`
- Jika gagal:
  - munculkan error toast “Gagal mengirim Smart Ticket”
  - jangan redirect
- Tombol disabled saat loading.

---

# 🎨 Kriteria UI/UX
- Form sederhana dengan textarea besar.
- Tombol: **Submit Smart Ticket**
- Loading:
  - Tombol berubah menjadi “Mengirim…”
- Success message:
  - Toast hijau
- Error message:
  - Toast merah

---

# 🧱 Plan

## Struktur Direktori
```
src/
 ├─ usecases/tickets/submitSmartTicket.ts
 ├─ infrastructure/tickets/TicketRepository.ts (extend)
 ├─ presentation/components/molecules/SmartTicketForm/
 ├─ app/(dashboard)/dashboard/smart-ticket/page.tsx
 └─ shared/types/tickets.ts
```

---

# 🧩 Entities
```ts
export interface SubmitSmartTicketPayload {
  description: string;
  created_by: string;
}

export interface SubmitSmartTicketResponse {
  success: boolean;
  data?: any;
}
```

---

# 🔁 Flow
1. User isi textarea.
2. Klik “Submit Smart Ticket”.
3. SmartTicketForm memanggil usecase → repository → API.
4. Response success:
   - tampilkan toast
   - redirect ke `/dashboard/tickets`
5. Response error:
   - tampilkan toast error.

---

# ✅ Tasks Checklist

### Domain & Shared
- [ ] Tambahkan interface payload & response.

### Infrastructure — TicketRepository
- [ ] Tambahkan function `submitSmartTicket(payload)`.

### Usecase
- [ ] Buat `submitSmartTicketInteractor()`.

### UI
- [ ] Buat `SmartTicketForm` (molecule).
- [ ] Integrasikan ke page `/dashboard/smart-ticket/page.tsx`.
- [ ] Tambahkan loading state & toast.

### Routing
- [ ] Redirect ke `/dashboard/tickets` jika berhasil.

---

# 📝 Implement Notes
- Gunakan fetch() atau axios.
- Jangan render detail AI response — cukup cek `success: true`.
- AI-generated metadata (title, priority, dll) tidak perlu ditampilkan.

---

# 📅 Deadline
- Repository + Usecase: 1–2 jam
- UI Form: 1 jam
- Integrasi page: 1 jam
