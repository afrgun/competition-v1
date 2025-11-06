# speckit.tickets-list.md

# 🧩 Specify — List Tickets (Dashboard)

## 🎯 Tujuan
Membuat halaman **List Tickets** yang menampilkan daftar tiket dari backend menggunakan API GET.  
Data ditampilkan dalam format tabel menggunakan komponen TableContainer (Atomic Design).

## 🔗 Endpoint API
GET https://private-anon-9d923a4b14-vibecoding.apiary-mock.com/v1/tickets

## ⚙️ Kriteria Fungsional
- Ambil data tiket via GET API.
- Tampilkan tabel dengan kolom: Title, Category, Priority, Status, Created At.
- Mendukung loading state dan error state.
- Opsi tombol “View Detail” (opsional).

## 🎨 Kriteria UI/UX
- Tabel responsif.
- Badge status & priority.
- Layout mengikuti dashboard dengan sidebar.

# 🧱 Plan
Struktur direktori:
src/
├─ app/(dashboard)/dashboard/tickets/page.tsx
├─ usecases/tickets/getTickets.ts
├─ infrastructure/tickets/TicketRepository.ts
├─ presentation/components/organisms/TicketsTable/
└─ shared/types/tickets.ts

# 🧩 Entities
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  created_by: string;
  assigned_to: any;
  created_at: string;
  updated_at: string;
}

# 🔁 Flow
1. Page → getTickets usecase → TicketRepository → API.
2. API response → UI → render Tabel.

# ✅ Tasks
- [ ] Implementasi TicketRepository.getTickets()
- [ ] Implementasi getTicketsInteractor()
- [ ] Buat organism `TicketsTable`
- [ ] Integrasi pada `/dashboard/tickets/page.tsx`
 