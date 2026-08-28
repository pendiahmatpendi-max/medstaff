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

# 📦 Supabase Object Storage — Implementation & Setup Guide (Expo React Native)

Dokumentasi *end-to-end* konfigurasi dan implementasi **Supabase Object Storage** untuk mengunggah dan menyimpan foto pada aplikasi mobile React Native (Expo).

---

## 🛠️ 1. Environment Setup

Buat file `.env` pada *root directory* proyek Expo Anda dan tambahkan kredensial berikut:

```env
EXPO_PUBLIC_SUPABASE_URL=[https://bngpulbmaoglhlxexsiy.supabase.co](https://bngpulbmaoglhlxexsiy.supabase.co)
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZ3B1bGJtYW9nbGhseGV4c2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NzYzNDAsImV4cCI6MjEwMzQ1MjM0MH0.E1GgN6gj1CfJFwZNcuA75gQZmIcpf1P6B5oNNwrrJ08

```Bash
npx expo install @supabase/supabase-js react-native-url-polyfill expo-image-picker

🚧 Sedang dalam tahap pengembangan UI/UX dan integrasi fitur absensi.
