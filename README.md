# MedStaff Mobile

Aplikasi mobile **MedStaff** untuk absensi dan kegiatan pegawai klinik berbasis **React Native + Expo + TypeScript**.

## Fitur

* Welcome Screen
* Registrasi Pegawai
* Login
* Dashboard Home
* Attendance / Absensi
* Activity / Kegiatan
* Notification
* Profile

## Teknologi

* React Native
* Expo SDK 54
* TypeScript
* Android Studio Emulator

## Menjalankan Project

```bash
cd mobile
npm install
npx expo start
```

Tekan **a** untuk membuka di Android Emulator.

## Struktur Project

```text
medstaff/
└── mobile/
    ├── App.tsx
    ├── app.json
    ├── assets/
    ├── package.json
    └── src/
        ├── screens/
        ├── components/
        ├── navigation/
        ├── services/
        ├── hooks/
        └── types/
```

## Status




## 🚨 Peringatan Keamanan Kredensial

* **Secret Key (`sb_secret_...`)**: Memiliki izin bypass RLS penuh. **WAJIB** disimpan hanya di file `.env` pada server backend. Jangan pernah dimasukkan ke dalam kode aplikasi mobile/klien!
* **Anon Key (`sb_publishable_...`)**: Kunci publik yang aman dipakai di sisi klien mobile jika menggunakan Supabase Auth / RLS standar.

---

## ⚙️ 1. Backend Server Setup

### A. Environment Variables (`.env` di Server)

Buat file `.env` di folder server backend Anda:

```env
PORT=3000
SUPABASE_URL=[https://bngpulbmaoglhlxexsiy.supabase.co](https://bngpulbmaoglhlxexsiy.supabase.co)
SUPABASE_SECRET_KEY=sb_secret_1scl533WCtttHYlw9KFiQA_hUzWliY_

```Bash
npm install express @supabase/supabase-js multer dotenv cors

🚧 Sedang dalam tahap pengembangan UI/UX dan integrasi fitur absensi.
