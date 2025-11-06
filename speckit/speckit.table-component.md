# speckit.table-component.md

# 🧩 Specify — Reusable Table Component (Atomic Design)

## 🎯 Tujuan
Membuat komponen tabel yang reusable dengan dynamic columns dan dynamic data, mengikuti prinsip Atomic Design.

## ✨ Deskripsi Fitur
- Merender tabel berdasarkan props `columns` dan `data`.
- Mendukung custom cell renderer.
- Memiliki struktur Atomic Design: Atoms, Molecules, Organisms.
- Mendukung responsive horizontal scroll.

## ⚙️ Kriteria Fungsional
- Props `columns`:
```ts
type Column = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => JSX.Element;
};
```

- Props `data`: `Record<string, any>[]`
- Jika `render` ada → gunakan custom renderer.
- Jika tidak → tampilkan text biasa.
- Jika data kosong → tampilkan pesan default.

## 🎨 Kriteria UI/UX
- Header: `bg-gray-800 text-white p-3`
- Row: `hover:bg-gray-700`
- Cell: `p-3 border border-gray-700`
- Wrapper responsive: `overflow-x-auto`
- Font Poppins

# 🧱 Plan
## Struktur Direktori
src/presentation/components/
- atoms/
  - Table/
  - TableRow/
  - TableHeader/
  - TableCell/
- molecules/
  - TableHead/
  - TableBody/
- organisms/
  - TableContainer/

# ✅ Tasks
- [ ] Implement atoms
- [ ] Implement molecules
- [ ] Implement organism TableContainer
- [ ] Add empty state UI
- [ ] Add example usage

# 📅 Deadline
- Total 4–6 jam implementasi
