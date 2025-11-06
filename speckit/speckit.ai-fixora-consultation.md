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
   POST https://private-anon-816463f8b5-vibecoding.apiary-mock.com/v1/ai/suggest
   ```
3. Body:
   ```json
   { "query": "<text_input_user>" }
   ```
4. API mengembalikan daftar rekomendasi (`candidates`).
5. Sistem menampilkan hasilnya dalam list/card:
   - Rank
   - Content Snippet
   - Category
   - Tags

---

## ⚙️ Kriteria Fungsional
- Mengambil text user dari textarea.
- Melakukan POST request ke API.
- Menampilkan hasil rekomendasi AI.
- Loading state & error state.
- Mendukung list hasil lebih dari 1 item.

---

## 🎨 Kriteria UI/UX
- Card list modern:
  - Background `bg-gray-800`
  - Border `border-gray-700`
  - Tags dengan style chips
- Loader saat menunggu API.
- Empty state jika hasil kosong.

---

# 🧱 Plan

## Struktur Direktori
src/
 ├─ usecases/ai/getFixoraSuggestion.ts
 ├─ infrastructure/ai/AiRepository.ts
 ├─ presentation/components/
 │   ├─ molecules/AiSuggestionCard/
 │   └─ organisms/AiSuggestionList/
 ├─ app/(dashboard)/dashboard/page.tsx
 └─ shared/types/aisuggestion.ts

---

## Entities
```ts
export interface AiSuggestionItem {
  rank: number;
  score: number;
  entry_id: string;
  chunk_index: number;
  content_snippet: string;
  category: string;
  tags: string[];
}

export interface AiSuggestionResponse {
  success: boolean;
  data: { candidates: AiSuggestionItem[] };
}
```

---

## 🔁 Flow
1. User klik “Konsultasikan dengan Fixora”.
2. DashboardWelcome memanggil usecase.
3. Usecase → AiRepository → API.
4. Data dikembalikan ke UI.
5. UI render menggunakan AiSuggestionList & AiSuggestionCard.

---

# ✅ Tasks

### Domain/Shared
- [ ] Tambahkan type AiSuggestionItem & AiSuggestionResponse

### Infrastructure
- [ ] Buat AiRepository.suggest()

### Usecase
- [ ] Buat getFixoraSuggestionInteractor()

### UI Components
- [ ] Buat AiSuggestionCard
- [ ] Buat AiSuggestionList
- [ ] Integrasi ke DashboardWelcome

### UX
- [ ] Tambahkan loader & error state
- [ ] Tambahkan empty state

---

# Implement Notes
- Gunakan fetch() atau axios di repository.
- Render list berdasarkan candidates array.

---

# Deadline
- API integration: 1–2 jam
- UI components: 3 jam
- Page integration: 1 jam
