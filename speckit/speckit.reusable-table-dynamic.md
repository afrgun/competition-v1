# 🧩 Full Prompt Spec — Reusable Dynamic Table (Next.js + Tailwind + React Table + Framer Motion + Dark Mode)

## ⚙️ Prompt 1 — Reusable Table v2 (Search + Sort + Filter)

Buatkan komponen **Reusable Dynamic Table v2** menggunakan:
- **Next.js (App Router)**
- **TypeScript + TailwindCSS**
- **TanStack React Table v8**
- Desain: minimalis, responsif, dengan kemampuan:
  - **Search (global & per kolom)**
  - **Sorting ASC/DESC**
  - **Filtering by category / status**
  - **Pagination**
  - **Dynamic columns & rows**

### 🧩 Props
```ts
interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  globalFilter?: boolean;
  filters?: { key: string; label: string; options: string[] }[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
}
```

### 🧱 Struktur Komponen
```
components/
 ├─ ui/
 │   ├─ Table.tsx
 │   ├─ TableHeader.tsx
 │   ├─ TableBody.tsx
 │   ├─ SearchInput.tsx
 │   └─ FilterDropdown.tsx
 └─ features/
     └─ DataTable/
         └─ DataTable.tsx
```

### 🧠 Fungsi Utama
- Gunakan `useReactTable` dari TanStack.
- Gunakan `useGlobalFilter` & `useSortBy`.
- Tambahkan input search global di atas tabel.
- Tambahkan dropdown filter untuk kolom tertentu.
- Tampilkan ikon panah naik/turun saat kolom di-sort.
- Pagination di bawah tabel.

### 🎨 Desain
- Header tabel sticky (bg-gray-100 dark:bg-gray-800).
- Baris hover → warna biru lembut.
- Gunakan transisi `transition-all ease-in-out duration-200`.
- Tambahkan state loading skeleton (shimmer effect).

### 🧩 Contoh Penggunaan
```tsx
import { DataTable } from "@/components/features/DataTable";

const columns = [
  { accessorKey: "asset_code", header: "Kode Aset" },
  { accessorKey: "name", header: "Nama Aset" },
  { accessorKey: "category", header: "Kategori" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "location", header: "Lokasi" },
];

const filters = [
  { key: "status", label: "Status", options: ["Aktif", "Maintenance", "Rusak"] },
  { key: "category", label: "Kategori", options: ["Hardware", "Network", "Software"] },
];

<DataTable
  columns={columns}
  data={assets}
  globalFilter
  filters={filters}
  onRowClick={(row) => console.log(row)}
/>;
```

---

## 🧱 Prompt 2 — Integrasi Table ke Modul CMS (Assets & Tickets)

### 📦 1. Assets Module
- Halaman: `/admin/assets`
- Fetch data dari `GET /api/v1/assets`
- Field:
  - `asset_code`, `name`, `category`, `status`, `location`, `purchase_date`
- Tombol “Add Asset” → modal tambah aset baru.
- Klik row → navigasi `/admin/assets/[id]`.
- Gunakan DataTable v2 dengan search, filter, dan sort.

### Contoh
```tsx
import { DataTable } from "@/components/features/DataTable";
import { useQuery } from "@tanstack/react-query";

export default function AssetsPage() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => fetch("/api/v1/assets").then(res => res.json())
  });

  const columns = [
    { accessorKey: "asset_code", header: "Kode Aset" },
    { accessorKey: "name", header: "Nama Aset" },
    { accessorKey: "category", header: "Kategori" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "location", header: "Lokasi" },
  ];

  const filters = [
    { key: "status", label: "Status", options: ["Aktif", "Maintenance", "Rusak"] },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Daftar Aset</h1>
        <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
          + Tambah Aset
        </button>
      </div>
      <DataTable
        columns={columns}
        data={assets}
        globalFilter
        filters={filters}
        loading={isLoading}
        onRowClick={(row) => console.log("Detail aset:", row)}
      />
    </div>
  );
}
```

### 🧾 2. Tickets Module
```tsx
const filters = [
  { key: "status", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] },
  { key: "priority", label: "Prioritas", options: ["Low", "Medium", "High", "Critical"] },
];

<DataTable
  columns={columns}
  data={tickets}
  globalFilter
  filters={filters}
  onRowClick={(row) => router.push(`/admin/tickets/${row.id}`)}
/>;
```

---

## 🎨 Prompt 3 — UI Upgrade (Framer Motion + Dark Mode Toggle)

### ⚡️ Framer Motion Animations
```tsx
import { motion, AnimatePresence } from "framer-motion";

<motion.table
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <AnimatePresence>
    {rows.map((row) => (
      <motion.tr
        key={row.id}
        whileHover={{ scale: 1.01 }}
        exit={{ opacity: 0 }}
      >
        ...
      </motion.tr>
    ))}
  </AnimatePresence>
</motion.table>
```

### 🌙 Dark Mode Toggle
```tsx
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
};
```

### CSS Tailwind Dark Support
```css
.dark table { @apply bg-gray-900 text-gray-100; }
.dark th { @apply bg-gray-800; }
.dark tr:hover { @apply bg-gray-700; }
```

---

## 💫 UX Enhancements
- `scroll-behavior: smooth;` untuk transisi tabel.
- `transition-all duration-300 ease-in-out` untuk perubahan filter.
- Gunakan warna netral `slate` / `gray` agar nyaman di semua mode.

---

## ✅ Hasil Akhir
- Komponen tabel **reusable, interaktif, dan estetis**.
- Bisa dipakai di **modul aset & tiket** cukup dengan mengganti kolom/data.
- Mendukung **dark mode**, **animasi halus**, dan **clean architecture**.
