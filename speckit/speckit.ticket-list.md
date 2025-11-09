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
 
 ### 🆕 NEW ADJUSTMENT — Fitur Assign Ticket ke Admin
Tambahkan tombol **“Assign”** di setiap baris tabel yang akan membuka **modal dialog** untuk melakukan *assign tiket ke admin atau teknisi tertentu*.

#### 🔗 Endpoint API Baru
POST (http://private-anon-9d923a4b14-vibecoding.apiary-mock.com/v1/tickets/{assigned_to}/assign) 
headers:
content-type: application/json
access-control-allow-origin: *
access-control-allow-methods: options,get,head,post,put,delete,trace,connect
access-control-expose-headers: content-type
access-control-max-age: 10
x-apiary-transaction-id: 690c7d4266f726009405d5cd
content-length: 839

Body JSON:
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Laptop cannot connect to Wi-Fi",
    "description": "My laptop suddenly cannot detect any Wi-Fi networks. I've tried restarting but the issue persists.",
    "status": "IN_PROGRESS",
    "category": "network",
    "priority": "high",
    "created_by": "666ddc5b-b83d-4766-a96b-37aad45b9523",
    "assigned_to": "123e4567-e89b-12d3-a456-426614174000",
    "ai_insight": {
      "text": "Based on your description, try these steps:
1. Check if airplane mode is disabled
2. Update Wi-Fi drivers
3. Reset network settings
4. Contact IT if issue persists",
      "confidence": 0.85
    },
    "created_at": "2025-01-06T10:30:00Z",
    "updated_at": "2025-01-06T11:00:00Z"
  },
  "success": true
}