# Wireframe

## 1. Authentication

### AUTH-01 — Splash Screen

```text
┌──────────────────────────────┐
│                              │
│                              │
│           MEDSTAFF           │
│                              │
│     Employee Management      │
│                              │
│                              │
│            ● ● ●             │
│                              │
└──────────────────────────────┘
```

#### Komponen

- Logo MedStaff
- Nama aplikasi
- Tagline
- Loading indicator

---

### AUTH-02 — Onboarding

```text
┌──────────────────────────────┐
│                              │
│          [Illustration]      │
│                              │
│      Kelola Kehadiran       │
│        Lebih Mudah           │
│                              │
│  Absensi dengan selfie,      │
│  waktu, dan lokasi.          │
│                              │
│          ● ○ ○               │
│                              │
│          [Lanjut]             │
│                              │
│            Lewati             │
└──────────────────────────────┘
```

#### Komponen

- Illustration
- Judul
- Deskripsi
- Page indicator
- Tombol Lanjut
- Tombol Lewati

---

### AUTH-03 — Login

```text
┌──────────────────────────────┐
│                              │
│          [Logo]              │
│                              │
│       Selamat Datang         │
│       di MedStaff            │
│                              │
│  Email                       │
│  ┌────────────────────────┐  │
│  │ email@example.com      │  │
│  └────────────────────────┘  │
│                              │
│  Password                    │
│  ┌────────────────────────┐  │
│  │ ••••••••••        👁    │  │
│  └────────────────────────┘  │
│                              │
│       Lupa Password?         │
│                              │
│  ┌────────────────────────┐  │
│  │         LOGIN          │  │
│  └────────────────────────┘  │
│                              │
│     Belum punya akun?        │
│          Daftar              │
│                              │
└──────────────────────────────┘
```

#### Komponen

- Logo
- Email input
- Password input
- Show/hide password
- Lupa password
- Login button
- Register link

---

### AUTH-04 — Register

```text
┌──────────────────────────────┐
│ ←       Buat Akun            │
│                              │
│ Nama Lengkap                 │
│ ┌──────────────────────────┐ │
│ │ Nama lengkap             │ │
│ └──────────────────────────┘ │
│                              │
│ Email                        │
│ ┌──────────────────────────┐ │
│ │ Email                    │ │
│ └──────────────────────────┘ │
│                              │
│ Nomor HP                     │
│ ┌──────────────────────────┐ │
│ │ 08xxxxxxxxxx             │ │
│ └──────────────────────────┘ │
│                              │
│ Tempat Lahir                 │
│ ┌──────────────────────────┐ │
│ │ Tempat lahir             │ │
│ └──────────────────────────┘ │
│                              │
│ Tanggal Lahir                │
│ ┌──────────────────────────┐ │
│ │ DD / MM / YYYY           │ │
│ └──────────────────────────┘ │
│                              │
│ Jenis Kelamin                │
│ ○ Laki-laki   ○ Perempuan   │
│                              │
│ Kontak Darurat               │
│ ┌──────────────────────────┐ │
│ │ Nama kontak              │ │
│ └──────────────────────────┘ │
│                              │
│ Nomor Kontak Darurat         │
│ ┌──────────────────────────┐ │
│ │ 08xxxxxxxxxx             │ │
│ └──────────────────────────┘ │
│                              │
│ Password                     │
│ ┌──────────────────────────┐ │
│ │ ••••••••••               │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │        DAFTAR            │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

#### Komponen

Data wajib:

- Nama lengkap
- Email
- Nomor HP
- Tempat lahir
- Tanggal lahir
- Jenis kelamin
- Nama kontak darurat
- Nomor kontak darurat
- Password

---

### AUTH-05 — Forgot Password

```text
┌──────────────────────────────┐
│ ←      Lupa Password         │
│                              │
│          [Icon]              │
│                              │
│    Atur Ulang Password       │
│                              │
│ Masukkan email yang terdaftar│
│ untuk mendapatkan instruksi  │
│ pengaturan ulang password.   │
│                              │
│ Email                        │
│ ┌──────────────────────────┐ │
│ │ email@example.com        │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │     KIRIM INSTRUKSI      │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

#### Komponen

- Back button
- Icon
- Email input
- Submit button
- Informasi reset password

---

# 2. Dashboard

### DASH-01 — Dashboard

```text
┌──────────────────────────────┐
│                              │
│  Selamat pagi, Pendi 👋      │
│  Senin, 10 Agustus 2026     │
│                              │
│  ┌────────────────────────┐  │
│  │     STATUS ABSENSI     │  │
│  │                        │  │
│  │      Belum Absen       │  │
│  │                        │  │
│  │   [      CLOCK IN     ]│  │
│  └────────────────────────┘  │
│                              │
│  ──────────────────────────  │
│                              │
│  📢 Pengumuman Terbaru       │
│                              │
│  ┌────────────────────────┐  │
│  │ Informasi Klinik       │  │
│  │ Pengumuman terbaru...  │  │
│  │                  >     │  │
│  └────────────────────────┘  │
│                              │
│  Akses Cepat                 │
│                              │
│  ┌──────────┐ ┌──────────┐  │
│  │ 📷       │ │ 📋       │  │
│  │ Absensi  │ │ Riwayat  │  │
│  └──────────┘ └──────────┘  │
│                              │
│  ┌──────────┐ ┌──────────┐  │
│  │ 👥       │ │ 🔔       │  │
│  │ Pegawai  │ │ Notifikasi│ │
│  └──────────┘ └──────────┘  │
│                              │
│ ──────────────────────────── │
│ 🏠       🕘       👥   🔔  👤│
│ Home   Attendance Employee  │
│                    Profile  │
└──────────────────────────────┘

---

# 3. Attendance

## ATT-01 — Attendance Home

```text
┌──────────────────────────────┐
│ ←       Attendance           │
│                              │
│  Senin, 10 Agustus 2026      │
│                              │
│  ┌────────────────────────┐  │
│  │       STATUS HARI INI  │  │
│  │                        │  │
│  │     Belum Clock In     │  │
│  │                        │  │
│  │   [     CLOCK IN     ] │  │
│  └────────────────────────┘  │
│                              │
│  Riwayat Hari Ini            │
│                              │
│  Clock In                    │
│  --:-- WIB                   │
│                              │
│  Clock Out                   │
│  --:-- WIB                   │
│                              │
│  [ Lihat Riwayat Absensi ]   │
│                              │
└──────────────────────────────┘
```

### Kondisi setelah Clock In

```text
┌──────────────────────────────┐
│       STATUS HARI INI        │
│                              │
│       Sudah Clock In         │
│                              │
│       08:01 WIB              │
│                              │
│   [      CLOCK OUT       ]   │
└──────────────────────────────┘
```

---

# ATT-02 — Clock In

```text
┌──────────────────────────────┐
│ ←          Clock In          │
│                              │
│      Ambil Foto Selfie       │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │                        │  │
│  │       CAMERA           │  │
│  │                        │  │
│  │         ○              │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Pastikan wajah terlihat     │
│  jelas di dalam kamera.      │
│                              │
│        [ AMBIL FOTO ]        │
│                              │
└──────────────────────────────┘
```

### Proses

```text
Clock In
   ↓
Meminta izin kamera
   ↓
Meminta izin lokasi
   ↓
Membuka kamera
   ↓
Selfie
   ↓
Preview
```

---

# ATT-03 — Selfie Camera

```text
┌──────────────────────────────┐
│ ←        Ambil Selfie       │
│                              │
│                              │
│      ┌──────────────┐        │
│      │              │        │
│      │              │        │
│      │    WAJAH     │        │
│      │              │        │
│      │              │        │
│      └──────────────┘        │
│                              │
│                              │
│             ●                │
│                              │
│   Pastikan wajah berada      │
│   di dalam area kamera.      │
│                              │
└──────────────────────────────┘
```

---

# ATT-04 — Selfie Preview & Confirmation

```text
┌──────────────────────────────┐
│ ←      Konfirmasi Foto       │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │                        │  │
│  │     FOTO SELFIE       │  │
│  │                        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Foto sudah sesuai?          │
│                              │
│  [ Ambil Ulang ] [ Gunakan ] │
│                              │
└──────────────────────────────┘
```

---

# ATT-05 — Attendance Result

Setelah pengguna mengonfirmasi foto, sistem mengambil waktu dan lokasi lalu menyimpan data absensi.

```text
┌──────────────────────────────┐
│        Absensi Berhasil      │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │     FOTO SELFIE       │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  ✓ Clock In                  │
│                              │
│  Senin, 10 Agustus 2026      │
│  08:01:32 WIB                │
│                              │
│  📍 Lokasi                   │
│  Klinik Pratama Unimus       │
│                              │
│  Koordinat                   │
│  -6.xxxxx, 110.xxxxx         │
│                              │
│  Status                      │
│  ✓ Berhasil                  │
│                              │
│       [ SELESAI ]            │
│                              │
└──────────────────────────────┘
```

### Data yang ditampilkan

- Foto selfie hasil absensi
- Jenis absensi
- Tanggal
- Jam
- Lokasi
- Koordinat GPS
- Status absensi

---

# ATT-06 — Clock Out

Alurnya sama seperti Clock In.

```text
Attendance
   ↓
Clock Out
   ↓
GPS
   ↓
Selfie Camera
   ↓
Preview Foto
   ↓
Konfirmasi
   ↓
Simpan Absensi
   ↓
Attendance Result
```

### Clock Out Screen

```text
┌──────────────────────────────┐
│ ←         Clock Out          │
│                              │
│      Ambil Foto Selfie       │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │        CAMERA          │  │
│  │                        │  │
│  │          ○             │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Pastikan wajah terlihat     │
│  jelas di dalam kamera.      │
│                              │
│        [ AMBIL FOTO ]        │
│                              │
└──────────────────────────────┘
```

---

# ATT-07 — Attendance History

```text
┌──────────────────────────────┐
│ ←    Riwayat Absensi         │
│                              │
│ [ Agustus 2026 ▼ ]           │
│                              │
│ ┌──────────────────────────┐ │
│ │ Senin, 10 Agustus 2026   │ │
│ │                          │ │
│ │ Clock In    08:01 WIB    │ │
│ │ Clock Out   17:02 WIB    │ │
│ │                          │ │
│ │ Status: Lengkap      >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Jumat, 7 Agustus 2026    │ │
│ │                          │ │
│ │ Clock In    08:05 WIB    │ │
│ │ Clock Out   17:10 WIB    │ │
│ │                          │ │
│ │ Status: Lengkap      >   │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

# ATT-08 — Attendance Detail

```text
┌──────────────────────────────┐
│ ←      Detail Absensi        │
│                              │
│ Clock In                     │
│ Senin, 10 Agustus 2026       │
│ 08:01:32 WIB                 │
│                              │
│ ┌────────────────────────┐   │
│ │                        │   │
│ │     FOTO SELFIE        │   │
│ │                        │   │
│ └────────────────────────┘   │
│                              │
│ Lokasi                       │
│ Klinik Pratama Unimus        │
│                              │
│ Koordinat                    │
│ -6.xxxxx, 110.xxxxx          │
│                              │
│ Status                       │
│ ✓ Valid                      │
│                              │
└──────────────────────────────┘
```

---

# Attendance State

## Belum Absen

```text
Clock In tersedia
Clock Out tidak tersedia
```

## Sudah Clock In

```text
Clock In tersimpan
Clock Out tersedia
```

## Sudah Clock Out

```text
Clock In tersimpan
Clock Out tersimpan
Absensi hari ini selesai
```

## Gagal Lokasi

```text
Lokasi tidak ditemukan

[ Coba Lagi ]
```

## Gagal Kamera

```text
Kamera tidak dapat digunakan

[ Coba Lagi ]
```

## Gagal Internet

```text
Tidak dapat terhubung ke server

[ Coba Lagi ]
```

---

# 4. Employee

## EMP-01 — Employee List

```text
┌──────────────────────────────┐
│         Employee             │
│                              │
│  ┌────────────────────────┐  │
│  │ 🔍 Cari pegawai...     │  │
│  └────────────────────────┘  │
│                              │
│  Daftar Pegawai              │
│                              │
│  ┌────────────────────────┐  │
│  │  [Foto]  Ahmad Fauzan  │  │
│  │          Perawat       │  │
│  │          ID: EMP001    │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  [Foto]  Siti Aminah   │  │
│  │          Administrasi  │  │
│  │          ID: EMP002    │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  [Foto]  Budi Santoso  │  │
│  │          Security      │  │
│  │          ID: EMP003    │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

### Komponen

- Search bar
- Foto profil
- Nama pegawai
- Jabatan
- ID karyawan
- Tombol menuju detail pegawai

---

## EMP-02 — Employee Detail

```text
┌──────────────────────────────┐
│ ←      Profil Pegawai        │
│                              │
│          [ FOTO ]            │
│                              │
│       Ahmad Fauzan           │
│       Perawat                │
│       ID: EMP001             │
│                              │
│  ──────────────────────────  │
│                              │
│  Informasi Pegawai           │
│                              │
│  Nama                        │
│  Ahmad Fauzan                │
│                              │
│  Jabatan                     │
│  Perawat                     │
│                              │
│  ID Karyawan                 │
│  EMP001                      │
│                              │
└──────────────────────────────┘
```

### Informasi yang ditampilkan

Saat pengguna melihat profil pegawai lain, informasi yang ditampilkan adalah:

- Foto profil
- Nama
- Jabatan
- ID karyawan

**Tidak menampilkan informasi pribadi sensitif seperti:**

- Nomor HP
- Alamat
- Email pribadi
- Identitas
- Kontak darurat
- Tanggal lahir

Informasi tersebut tetap berada pada profil pribadi masing-masing pegawai.

---

## Employee Search State

### Tidak ada hasil

```text
┌──────────────────────────────┐
│                              │
│          [Icon]              │
│                              │
│    Pegawai tidak ditemukan   │
│                              │
│ Coba gunakan kata kunci lain │
│                              │
└──────────────────────────────┘
```

---

## Employee Loading State

```text
┌──────────────────────────────┐
│                              │
│      Memuat data pegawai     │
│                              │
│            ● ● ●             │
│                              │
└──────────────────────────────┘
```

---

# 5. Notification

## NOTIF-01 — Notification List

```text
┌──────────────────────────────┐
│        Notification          │
│                              │
│  ┌────────────────────────┐  │
│  │ 🔔  Pengumuman Baru    │  │
│  │     Informasi dari HRD │  │
│  │     10 Agustus 2026    │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 🕐  Absensi Berhasil   │  │
│  │     Clock In 08:01 WIB │  │
│  │     Hari ini           │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 📢  Informasi Klinik   │  │
│  │     Pengumuman baru    │  │
│  │     8 Agustus 2026     │  │
│  │                    >   │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

### Komponen

- Judul halaman
- Icon notifikasi
- Judul notifikasi
- Ringkasan
- Tanggal/waktu
- Status sudah/belum dibaca
- Tombol menuju detail

---

## NOTIF-02 — Notification Detail

```text
┌──────────────────────────────┐
│ ←      Detail Notifikasi     │
│                              │
│ 🔔                           │
│                              │
│ Pengumuman Baru              │
│                              │
│ Dari: HRD                    │
│ 10 Agustus 2026              │
│                              │
│ ──────────────────────────   │
│                              │
│ Informasi                    │
│                              │
│ Isi informasi atau           │
│ pengumuman ditampilkan       │
│ secara lengkap di halaman    │
│ ini.                         │
│                              │
└──────────────────────────────┘
```

### Komponen

- Back button
- Icon
- Judul
- Pengirim
- Tanggal
- Isi notifikasi

---

## Notification Categories

Notifikasi dapat berasal dari:

### 1. Attendance

Contoh:

```text
Clock In berhasil
Clock Out berhasil
Absensi gagal
```

### 2. Announcement

Contoh:

```text
Pengumuman dari HRD
Informasi dari pimpinan
Informasi klinik
```

### 3. Account

Contoh:

```text
Perubahan password
Perubahan PIN
Aktivitas akun
```

---

## Notification State

### Belum Dibaca

```text
● Pengumuman Baru
```

Ditampilkan dengan indikator unread.

### Sudah Dibaca

```text
Pengumuman Baru
```

Tidak memiliki indikator unread.

---

## Empty State

Jika tidak ada notifikasi:

```text
┌──────────────────────────────┐
│                              │
│          [ Bell ]            │
│                              │
│     Belum ada notifikasi     │
│                              │
│     Notifikasi terbaru       │
│     akan muncul di sini.     │
│                              │
└──────────────────────────────┘
```

---

# 6. Profile

## PROF-01 — My Profile

```text
┌──────────────────────────────┐
│            Profile           │
│                              │
│          [ FOTO ]            │
│                              │
│       Nama Pegawai           │
│       Jabatan                │
│       ID: EMP001             │
│                              │
│  ┌────────────────────────┐  │
│  │ Personal Information > │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ Job Information      > │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ Emergency Contact     >│  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ Education             >│  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ Experience            >│  │
│  └────────────────────────┘  │
│                              │
│  Security                    │
│  ┌────────────────────────┐  │
│  │ Change Password       >│  │
│  ├────────────────────────┤  │
│  │ Change PIN            >│  │
│  └────────────────────────┘  │
│                              │
│  Settings                    │
│  ┌────────────────────────┐  │
│  │ Language              >│  │
│  │ Help Center            >│  │
│  │ About Application     >│  │
│  └────────────────────────┘  │
│                              │
│          [ Logout ]           │
│                              │
└──────────────────────────────┘
```

---

# PROF-02 — Personal Information

```text
┌──────────────────────────────┐
│ ←   Personal Information     │
│                              │
│ Nama Lengkap                 │
│ Ahmad Fauzan                 │
│                              │
│ Nomor HP                     │
│ 08xxxxxxxxxx                 │
│                              │
│ Email                        │
│ email@example.com            │
│                              │
│ Tempat Lahir                 │
│ Semarang                     │
│                              │
│ Tanggal Lahir                │
│ 01 Januari 2000              │
│                              │
│ Jenis Kelamin                │
│ Laki-laki                    │
│                              │
│ Identitas                    │
│ [ Data Identitas ]           │
│                              │
│ Alamat                       │
│ [ Alamat lengkap ]           │
│                              │
│       [ EDIT PROFIL ]        │
│                              │
└──────────────────────────────┘
```

---

# PROF-03 — Edit Personal Information

```text
┌──────────────────────────────┐
│ ←    Edit Personal           │
│                              │
│ Nama Lengkap                 │
│ ┌──────────────────────────┐ │
│ │ Ahmad Fauzan             │ │
│ └──────────────────────────┘ │
│                              │
│ Nomor HP                     │
│ ┌──────────────────────────┐ │
│ │ 08xxxxxxxxxx             │ │
│ └──────────────────────────┘ │
│                              │
│ Email                        │
│ ┌──────────────────────────┐ │
│ │ email@example.com        │ │
│ └──────────────────────────┘ │
│                              │
│ Tempat Lahir                 │
│ ┌──────────────────────────┐ │
│ │ Semarang                 │ │
│ └──────────────────────────┘ │
│                              │
│ Tanggal Lahir                │
│ ┌──────────────────────────┐ │
│ │ 01 / 01 / 2000           │ │
│ └──────────────────────────┘ │
│                              │
│ Jenis Kelamin                │
│ ○ Laki-laki  ○ Perempuan    │
│                              │
│ Identitas                    │
│ ┌──────────────────────────┐ │
│ │ Nomor identitas          │ │
│ └──────────────────────────┘ │
│                              │
│ Alamat                       │
│ ┌──────────────────────────┐ │
│ │ Alamat lengkap           │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# PROF-04 — Job Information

```text
┌──────────────────────────────┐
│ ←     Job Information        │
│                              │
│ ID Karyawan                  │
│ EMP001                       │
│                              │
│ Nama Perusahaan              │
│ Klinik Pratama Unimus        │
│                              │
│ Posisi / Jabatan             │
│ Perawat                      │
│                              │
└──────────────────────────────┘
```

Informasi pekerjaan:

- ID karyawan
- Nama perusahaan
- Posisi/jabatan

---

# PROF-05 — Emergency Contact

```text
┌──────────────────────────────┐
│ ←    Emergency Contact       │
│                              │
│ Nama                         │
│ Ahmad Fauzi                 │
│                              │
│ Hubungan Keluarga            │
│ Ayah                         │
│                              │
│ Nomor HP                     │
│ 08xxxxxxxxxx                 │
│                              │
│       [ EDIT ]               │
│                              │
└──────────────────────────────┘
```

---

# PROF-06 — Edit Emergency Contact

```text
┌──────────────────────────────┐
│ ←   Edit Emergency Contact   │
│                              │
│ Nama                         │
│ ┌──────────────────────────┐ │
│ │ Nama kontak              │ │
│ └──────────────────────────┘ │
│                              │
│ Hubungan Keluarga             │
│ ┌──────────────────────────┐ │
│ │ Pilih hubungan        ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ Nomor HP                     │
│ ┌──────────────────────────┐ │
│ │ 08xxxxxxxxxx             │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# PROF-07 — Education List

```text
┌──────────────────────────────┐
│ ←        Education           │
│                              │
│  Pendidikan                  │
│                              │
│ ┌──────────────────────────┐ │
│ │ S1 Informatika           │ │
│ │ Universitas ABC          │ │
│ │ 2022 - 2026          >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ SMA                       │ │
│ │ SMA Negeri 1              │ │
│ │ 2019 - 2022          >   │ │
│ └──────────────────────────┘ │
│                              │
│       [ + TAMBAH ]           │
│                              │
└──────────────────────────────┘
```

---

# PROF-08 — Add Education

```text
┌──────────────────────────────┐
│ ←     Add Education          │
│                              │
│ Jenjang Pendidikan           │
│ ┌──────────────────────────┐ │
│ │ Pilih jenjang         ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ Institusi                    │
│ ┌──────────────────────────┐ │
│ │ Nama sekolah/universitas │ │
│ └──────────────────────────┘ │
│                              │
│ Tahun Mulai                  │
│ ┌──────────────────────────┐ │
│ │ YYYY                     │ │
│ └──────────────────────────┘ │
│                              │
│ Tahun Selesai                │
│ ┌──────────────────────────┐ │
│ │ YYYY                     │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# PROF-09 — Edit Education

Struktur sama dengan Add Education, tetapi field telah berisi data yang dapat diubah.

```text
Education
↓
Pilih Data
↓
Edit
↓
Simpan
↓
Education List
```

---

# PROF-10 — Experience List

```text
┌──────────────────────────────┐
│ ←       Experience           │
│                              │
│  Pengalaman Kerja            │
│                              │
│ ┌──────────────────────────┐ │
│ │ Perawat                  │ │
│ │ Klinik ABC               │ │
│ │ 2023 - 2026          >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Asisten Perawat          │ │
│ │ Klinik XYZ               │ │
│ │ 2022 - 2023          >   │ │
│ └──────────────────────────┘ │
│                              │
│       [ + TAMBAH ]           │
│                              │
└──────────────────────────────┘
```

---

# PROF-11 — Add Experience

```text
┌──────────────────────────────┐
│ ←     Add Experience         │
│                              │
│ Posisi / Jabatan             │
│ ┌──────────────────────────┐ │
│ │ Nama posisi              │ │
│ └──────────────────────────┘ │
│                              │
│ Nama Perusahaan              │
│ ┌──────────────────────────┐ │
│ │ Nama perusahaan          │ │
│ └──────────────────────────┘ │
│                              │
│ Tahun Mulai                  │
│ ┌──────────────────────────┐ │
│ │ YYYY                     │ │
│ └──────────────────────────┘ │
│                              │
│ Tahun Selesai                │
│ ┌──────────────────────────┐ │
│ │ YYYY                     │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# PROF-12 — Edit Experience

Struktur sama dengan Add Experience.

```text
Experience
↓
Pilih Data
↓
Edit
↓
Simpan
↓
Experience List
```

---

# PROF-13 — Change Password

```text
┌──────────────────────────────┐
│ ←     Change Password        │
│                              │
│ Password Lama                │
│ ┌──────────────────────────┐ │
│ │ ••••••••••           👁   │ │
│ └──────────────────────────┘ │
│                              │
│ Password Baru                │
│ ┌──────────────────────────┐ │
│ │ ••••••••••           👁   │ │
│ └──────────────────────────┘ │
│                              │
│ Konfirmasi Password          │
│ ┌──────────────────────────┐ │
│ │ ••••••••••           👁   │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# PROF-14 — Change PIN

```text
┌──────────────────────────────┐
│ ←        Change PIN          │
│                              │
│          Ubah PIN            │
│                              │
│ PIN Lama                     │
│                              │
│       ● ● ● ● ● ●            │
│                              │
│ PIN Baru                     │
│                              │
│       ○ ○ ○ ○ ○ ○            │
│                              │
│ Konfirmasi PIN               │
│                              │
│       ○ ○ ○ ○ ○ ○            │
│                              │
│      [ SIMPAN PIN ]          │
│                              │
└──────────────────────────────┘
```

---

# PROF-15 — Language

```text
┌──────────────────────────────┐
│ ←         Language           │
│                              │
│ Bahasa                       │
│                              │
│ ● Bahasa Indonesia           │
│                              │
│ ○ English                    │
│                              │
│                              │
└──────────────────────────────┘
```

---

# PROF-16 — Help Center

```text
┌──────────────────────────────┐
│ ←       Help Center          │
│                              │
│ Pusat Bantuan                │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Cari bantuan...       │ │
│ └──────────────────────────┘ │
│                              │
│ FAQ                          │
│                              │
│ ▼ Bagaimana cara Clock In?  │
│                              │
│ ▼ Bagaimana cara Clock Out? │
│                              │
│ ▼ Mengapa lokasi tidak valid?│
│                              │
│ ▼ Bagaimana mengubah PIN?   │
│                              │
│ ▼ Bagaimana mengubah profil?│
│                              │
│                              │
│ Butuh bantuan lebih lanjut?  │
│                              │
│       [ HUBUNGI ADMIN ]      │
│                              │
└──────────────────────────────┘
```

---

# PROF-17 — About Application

```text
┌──────────────────────────────┐
│ ←    About Application       │
│                              │
│          [ LOGO ]            │
│                              │
│          MedStaff            │
│                              │
│ Employee Management          │
│ Application                  │
│                              │
│ Version 1.0.0                │
│                              │
│ Klinik Pratama Unimus        │
│                              │
│ © 2026 MedStaff              │
│                              │
└──────────────────────────────┘
```

---

# 7. Administrator

Administrator digunakan oleh **HRD atau pimpinan** untuk mengelola data pegawai, absensi, dan informasi yang berkaitan dengan operasional karyawan.

---

## ADMIN-01 — Admin Dashboard

```text
┌──────────────────────────────┐
│                              │
│  Selamat datang, Admin       │
│  Klinik Pratama Unimus       │
│                              │
│  ┌────────────────────────┐  │
│  │ Total Pegawai          │  │
│  │          45            │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────┐ ┌──────────┐ │
│  │ Hadir      │ │ Belum    │ │
│  │    38      │ │    7     │ │
│  └────────────┘ └──────────┘ │
│                              │
│  ┌────────────┐ ┌──────────┐ │
│  │ Terlambat  │ │ Izin     │ │
│  │     3      │ │    4     │ │
│  └────────────┘ └──────────┘ │
│                              │
│  Aktivitas Terbaru           │
│                              │
│  Ahmad Fauzan                │
│  Clock In — 08:01 WIB        │
│                              │
│  Siti Aminah                 │
│  Clock In — 08:05 WIB        │
│                              │
│  ──────────────────────────  │
│  Dashboard  Pegawai  Absen  │
│             Laporan  Lainnya│
└──────────────────────────────┘
```

### Komponen

- Total pegawai
- Jumlah hadir
- Jumlah belum hadir
- Jumlah terlambat
- Jumlah izin
- Aktivitas absensi terbaru
- Navigasi administrator

---

# ADMIN-02 — Employee Management

```text
┌──────────────────────────────┐
│ ←    Employee Management     │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Cari pegawai...       │ │
│ └──────────────────────────┘ │
│                              │
│ [+ Tambah Pegawai]           │
│                              │
│ ┌──────────────────────────┐ │
│ │ [Foto] Ahmad Fauzan      │ │
│ │ Perawat                 │ │
│ │ EMP001                  │ │
│ │ Status: Aktif        >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [Foto] Siti Aminah       │ │
│ │ Administrasi            │ │
│ │ EMP002                  │ │
│ │ Status: Aktif        >  │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Fungsi

Admin dapat:

- Melihat daftar pegawai
- Mencari pegawai
- Menambahkan pegawai
- Melihat detail pegawai
- Mengubah data pegawai
- Mengaktifkan pegawai
- Menonaktifkan pegawai

---

# ADMIN-03 — Add Employee

```text
┌──────────────────────────────┐
│ ←       Tambah Pegawai       │
│                              │
│ Nama Lengkap                 │
│ ┌──────────────────────────┐ │
│ │ Nama lengkap             │ │
│ └──────────────────────────┘ │
│                              │
│ Email                        │
│ ┌──────────────────────────┐ │
│ │ Email                    │ │
│ └──────────────────────────┘ │
│                              │
│ Nomor HP                     │
│ ┌──────────────────────────┐ │
│ │ 08xxxxxxxxxx             │ │
│ └──────────────────────────┘ │
│                              │
│ ID Karyawan                  │
│ ┌──────────────────────────┐ │
│ │ EMPXXX                   │ │
│ └──────────────────────────┘ │
│                              │
│ Jabatan                      │
│ ┌──────────────────────────┐ │
│ │ Pilih jabatan         ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ Status                       │
│ ● Aktif   ○ Tidak Aktif     │
│                              │
│       [ SIMPAN ]             │
│                              │
└──────────────────────────────┘
```

---

# ADMIN-04 — Employee Detail

```text
┌──────────────────────────────┐
│ ←      Detail Pegawai        │
│                              │
│          [ FOTO ]            │
│                              │
│       Ahmad Fauzan           │
│       Perawat                │
│       EMP001                 │
│                              │
│ Status                       │
│ ● Aktif                      │
│                              │
│ ──────────────────────────   │
│                              │
│ Informasi Personal           │
│                              │
│ Nomor HP                     │
│ 08xxxxxxxxxx                 │
│                              │
│ Email                        │
│ email@example.com            │
│                              │
│ Alamat                       │
│ [Alamat pegawai]             │
│                              │
│                              │
│ [ EDIT ]   [ NONAKTIFKAN ]   │
│                              │
└──────────────────────────────┘
```

---

# ADMIN-05 — Attendance Management

```text
┌──────────────────────────────┐
│      Attendance Management   │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📅 10 Agustus 2026    ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Cari pegawai...       │ │
│ └──────────────────────────┘ │
│                              │
│ Filter                       │
│ [Semua ▼]                   │
│                              │
│ ┌──────────────────────────┐ │
│ │ Ahmad Fauzan             │ │
│ │ Clock In  08:01          │ │
│ │ Clock Out 17:02          │ │
│ │ Status: Lengkap       >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Siti Aminah              │ │
│ │ Clock In  08:05          │ │
│ │ Clock Out --:--          │ │
│ │ Status: Belum Clock Out  │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Filter

Admin dapat memfilter:

- Semua
- Hadir
- Belum hadir
- Terlambat
- Izin
- Tidak hadir

---

# ADMIN-06 — Attendance Detail

```text
┌──────────────────────────────┐
│ ←     Detail Absensi         │
│                              │
│ Ahmad Fauzan                 │
│ EMP001                       │
│                              │
│ Clock In                     │
│                              │
│ ┌────────────────────────┐   │
│ │                        │   │
│ │     FOTO SELFIE        │   │
│ │                        │   │
│ └────────────────────────┘   │
│                              │
│ Waktu                        │
│ 08:01:32 WIB                 │
│                              │
│ Lokasi                       │
│ Klinik Pratama Unimus        │
│                              │
│ Koordinat                    │
│ -6.xxxxx, 110.xxxxx          │
│                              │
│ Status                       │
│ ✓ Valid                      │
│                              │
└──────────────────────────────┘
```

Admin dapat melihat bukti absensi berupa:

- Foto selfie
- Tanggal
- Jam
- Lokasi
- Koordinat
- Status

---

# ADMIN-07 — Attendance Correction

Jika diperlukan koreksi absensi, admin dapat mengakses fitur koreksi berdasarkan hak akses yang diberikan.

```text
┌──────────────────────────────┐
│ ←     Koreksi Absensi        │
│                              │
│ Pegawai                      │
│ Ahmad Fauzan                 │
│                              │
│ Tanggal                      │
│ 10 Agustus 2026              │
│                              │
│ Jenis                        │
│ Clock In                     │
│                              │
│ Waktu Sebelumnya             │
│ 08:01 WIB                    │
│                              │
│ Waktu Baru                   │
│ ┌──────────────────────────┐ │
│ │ 08:00                   │ │
│ └──────────────────────────┘ │
│                              │
│ Alasan Koreksi               │
│ ┌──────────────────────────┐ │
│ │ Masukkan alasan...       │ │
│ └──────────────────────────┘ │
│                              │
│       [ SIMPAN KOREKSI ]     │
│                              │
└──────────────────────────────┘
```

Setiap koreksi harus memiliki:

- Admin yang melakukan koreksi
- Waktu koreksi
- Data sebelum koreksi
- Data setelah koreksi
- Alasan koreksi

---

# ADMIN-08 — Announcement Management

```text
┌──────────────────────────────┐
│   Announcement Management    │
│                              │
│ [+ Buat Pengumuman]          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Informasi Klinik         │ │
│ │ 10 Agustus 2026          │ │
│ │ Status: Published     >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Jadwal Rapat             │ │
│ │ 8 Agustus 2026           │ │
│ │ Status: Published     >  │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

# ADMIN-09 — Create Announcement

```text
┌──────────────────────────────┐
│ ←     Buat Pengumuman        │
│                              │
│ Judul                        │
│ ┌──────────────────────────┐ │
│ │ Judul pengumuman         │ │
│ └──────────────────────────┘ │
│                              │
│ Isi                          │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │ Tulis pengumuman...      │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ Target                       │
│ ● Semua Pegawai              │
│ ○ Pegawai Tertentu           │
│                              │
│       [ PUBLIKASIKAN ]       │
│                              │
└──────────────────────────────┘
```

---

# ADMIN-10 — Reports

```text
┌──────────────────────────────┐
│          Reports             │
│                              │
│ Periode                     │
│ ┌──────────────────────────┐ │
│ │ Agustus 2026          ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ Ringkasan                    │
│                              │
│ Total Kehadiran              │
│ 850                          │
│                              │
│ Terlambat                    │
│ 32                           │
│                              │
│ Izin                         │
│ 18                           │
│                              │
│ Tidak Hadir                  │
│ 10                           │
│                              │
│ [ Lihat Detail ]             │
│                              │
└──────────────────────────────┘
```

---

# ADMIN-11 — Admin Profile

```text
┌──────────────────────────────┐
│         Admin Profile        │
│                              │
│          [ FOTO ]            │
│                              │
│       Nama Admin             │
│       HRD                    │
│                              │
│ ┌──────────────────────────┐ │
│ │ Informasi Akun         > │ │
│ ├──────────────────────────┤ │
│ │ Change Password        > │ │
│ ├──────────────────────────┤ │
│ │ Change PIN             > │ │
│ ├──────────────────────────┤ │
│ │ Language               > │ │
│ └──────────────────────────┘ │
│                              │
│          [ Logout ]          │
│                              │
└──────────────────────────────┘
```

---

# Administrator Access

Hak akses administrator ditentukan berdasarkan role.

## HRD

Dapat:

- Melihat pegawai
- Menambah pegawai
- Mengubah data pegawai
- Mengaktifkan/nonaktifkan pegawai
- Melihat absensi
- Melakukan koreksi sesuai kewenangan
- Membuat pengumuman
- Melihat laporan

## Pimpinan

Dapat:

- Melihat pegawai
- Melihat absensi
- Melihat laporan
- Melihat pengumuman
- Mengelola pengumuman sesuai kewenangan

Hak akses akan diterapkan melalui sistem role dan permission pada backend.