# speckit.dashboard-sidebar.md

# 🧩 Specify — Sidebar Dashboard (Multi Role)

## 🎯 Tujuan
Membuat komponen **Sidebar Dashboard** dengan navigasi berbeda antara role **Employee** dan **Admin**. Sidebar digunakan di seluruh halaman dashboard setelah user login.

---

## 🔐 Role Definition
### Employee
Menu:
- Home (`/dashboard/home`)
- My Ticket (`/dashboard/my-ticket`)
- FAQ (`/dashboard/faq`)

### Admin
Menu:
- Ticket (`/dashboard/ticket`)
- List Employee (`/dashboard/employees`)

---

## ⚙️ Kriteria Fungsional
- Sidebar ditampilkan di semua page dalam layout dashboard.
- Role user diambil dari storage atau endpoint `/auth/me`.
- Tampilkan menu sesuai role.
- Menu aktif ditandai (active state).
- Navigasi menggunakan router.
- Sidebar responsif (mobile collapse).

---

## 🎨 Kriteria UI/UX
- Sidebar kiri, background `bg-gray-900`.
- Teks putih, menu aktif `bg-gray-700`.
- Responsif mobile & desktop.
- Icon opsional.

---

# 🧱 Plan

## Struktur Direktori
src/
 ├─ presentation/
 │   └─ components/
 │       ├─ atoms/SidebarItem/
 │       ├─ molecules/SidebarMenu/
 │       └─ organisms/Sidebar/
 ├─ app/(dashboard)/layout.tsx
 ├─ domain/entities/UserRole.ts
 ├─ usecases/auth/getCurrentUser.ts
 └─ shared/constants/menu.ts

---

## 🧩 Entities & Interfaces

```ts
export type UserRole = "employee" | "admin";
```

```ts
export interface MenuItem {
  label: string;
  href: string;
  roles: UserRole[];
  icon?: any;
}
```

---

## 📄 Shared Menu Definition

```ts
export const DASHBOARD_MENU: MenuItem[] = [
  { label: "Home", href: "/dashboard/home", roles: ["employee"] },
  { label: "My Ticket", href: "/dashboard/my-ticket", roles: ["employee"] },
  { label: "FAQ", href: "/dashboard/faq", roles: ["employee"] },

  { label: "Ticket", href: "/dashboard/ticket", roles: ["admin"] },
  { label: "List Employee", href: "/dashboard/employees", roles: ["admin"] },
];
```

---

## 🔁 Flow
1. Ambil role user.
2. Filter menu berdasarkan role.
3. Render Sidebar di dashboard layout.
4. Tandai menu active berdasarkan path.

---

# ✅ Tasks (Checklist)

### Domain
- [ ] Tambahkan `UserRole`.
- [ ] Tambahkan `MenuItem`.

### Infrastructure
- [ ] Buat fungsi `getCurrentUser` bila belum ada.

### Usecases
- [ ] Implementasikan `getCurrentUserInteractor`.

### Shared
- [ ] Tambahkan `DASHBOARD_MENU`.

### Presentation
- Atoms:
  - [ ] `SidebarItem`
- Molecules:
  - [ ] `SidebarMenu`
- Organisms:
  - [ ] `Sidebar`
- Layout:
  - [ ] Integrasikan ke `(dashboard)/layout.tsx`

---

# 💡 Implement Notes

### Filter Menu
```ts
const filteredMenu = DASHBOARD_MENU.filter(item => item.roles.includes(user.role));
```

### Active State
```ts
const isActive = pathname.startsWith(item.href);
```

---

# 📅 Deadline Implementasi
- Dev: 2 hari
- Test: 1 hari


## Revision Log

### Tambahkan Menu Logout
implementation
```ts
const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUserInteractor();
      router.push("/login");
    } catch (error) {
      // Even if logout fails, redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };
```

