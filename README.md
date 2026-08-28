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


## OBJECT STOAGE SET UP DAN IMPLMENATSI UNUTK MENTIMPAN FOTO
```Enviroment variable
EXPO_PUBLIC_SUPABASE_URL=https://bngpulbmaoglhlxexsiy.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZ3B1bGJtYW9nbGhseGV4c2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NzYzNDAsImV4cCI6MjEwMzQ1MjM0MH0.E1GgN6gj1CfJFwZNcuA75gQZmIcpf1P6B5oNNwrrJ08 

Install dependency client mobile  supabse
`` Bash
npx expo install @supabase/supabase-js react-native-url-polyfill expo-image-picker


🚧 Sedang dalam tahap pengembangan UI/UX dan integrasi fitur absensi.
