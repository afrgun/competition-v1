# speckit.ai-fixora-consultation.md

# 🧩 Specify — AI Consultation (Fixora Suggestion)

## 🎯 Tujuan
Membuat fitur **Konsultasikan dengan Fixora**, yang mengirimkan input user ke API AI Suggestion dan menampilkan hasil rekomendasi secara dinamis pada dashboard.

---

## ✨ Deskripsi Fitur
Ketika user menekan tombol **“Konsultasikan dengan Fixora”**:

1. Ambil text dari textarea di Dashboard Welcome.
2. Kirim ke API:
   ``` 
  **base url**
  https://e29d425094dc.ngrok-free.app/

   POST /v1/ai/suggest
   ```
3. Body:
   ```json
   { "query": "<text_input_user>" }
   ```
4. API mengembalikan hasil analisis AI.
5. Sistem menampilkan hasilnya dalam card:
   - Suggestion (text analisis lengkap)
   - Confidence score
   - Category
   - Source (AI engine yang digunakan)
   - Cache status

---

## ⚙️ Kriteria Fungsional
- Mengambil text user dari textarea.
- Melakukan POST request ke API.
- Menampilkan hasil analisis AI (suggestion text).
- Menampilkan confidence score, category, dan source.
- Loading state & error state.

---

## 🎨 Kriteria UI/UX
- Card modern untuk menampilkan hasil analisis:
  - Background `bg-gray-800`
  - Border `border-gray-700`
  - Suggestion text dengan format yang readable (whitespace preserved)
  - Badge untuk category dan confidence score
  - Info source AI di footer card
- Loader saat menunggu API.
- Empty state jika hasil kosong atau error.

---

# 🧱 Plan

## Struktur Direktori
src/
 ├─ usecases/ai/getFixoraSuggestion.ts
 ├─ infrastructure/ai/AiRepository.ts
 ├─ presentation/components/
 │   └─ organisms/AiSuggestionCard/
 ├─ app/(dashboard)/dashboard/page.tsx
 └─ shared/types/aisuggestion.ts

---

## Entities
```ts
export interface AiSuggestionResponse {
  suggestion: string;
  confidence: number;
  category: string;
  source: string;
  used_cache: boolean;
}
```

---

## 🔁 Flow
1. User klik "Konsultasikan dengan Fixora".
2. DashboardWelcome memanggil usecase.
3. Usecase → AiRepository → API.
4. Data (suggestion, confidence, category, source) dikembalikan ke UI.
5. UI render menggunakan AiSuggestionCard.

---

# ✅ Tasks

### Domain/Shared
- [ ] Tambahkan type AiSuggestionResponse di shared/types/

### Infrastructure
- [ ] Buat AiRepository.suggest()

### Usecase
- [ ] Buat getFixoraSuggestionInteractor()

### UI Components
- [ ] Buat AiSuggestionCard (organism)
- [ ] Integrasi ke DashboardWelcome

### UX
- [ ] Tambahkan loader saat request API
- [ ] Tambahkan error state
- [ ] Tambahkan empty state

---

# Implement Notes
- Gunakan fetch() atau axios di repository.
- Response berupa single object (bukan array).
- Suggestion text bisa sangat panjang, pastikan UI mendukung multiline text.
- Confidence adalah nilai decimal (0-1), tampilkan sebagai persentase.
- Category: uppercase string (e.g., "SOFTWARE")
- Source: lowercase string (e.g., "gemini")

---

# Deadline
- API integration: 1–2 jam
- UI components: 3 jam
- Page integration: 1 jam
