# Wireframe

> Dokumen ini mendefinisikan rancangan struktur layar aplikasi MedStaff untuk pengguna Staff/Pegawai dan Administrator.
>
> Wireframe menjadi acuan sebelum masuk ke tahap UI Design dan implementasi aplikasi.

---

# 1. Authentication

Bagian Authentication digunakan untuk proses awal pengguna sebelum masuk ke aplikasi.

---

## AUTH-01 — Splash Screen

```text
┌──────────────────────────────┐
│                              │
│                              │
│           MEDSTAFF           │
│                              │
│     Employee Management      │
│                              │
│                              │
│             ○ ○ ○            │
│                              │
└──────────────────────────────┘
```

### Komponen

- Logo MedStaff
- Nama aplikasi
- Tagline
- Loading indicator

### Keterangan

Splash Screen ditampilkan ketika aplikasi pertama kali dibuka sebelum pengguna diarahkan ke halaman berikutnya.

---

## AUTH-02 — Onboarding

```text
┌──────────────────────────────┐
│                              │
│        [Illustration]        │
│                              │
│     Kelola Kehadiran        │
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
│                              │
└──────────────────────────────┘
```

### Komponen

- Illustration
- Judul
- Deskripsi
- Page indicator
- Tombol Lanjut
- Tombol Lewati

### Keterangan

Onboarding menjelaskan fungsi utama MedStaff kepada pengguna sebelum login.

---

## AUTH-03 — Login

```text
┌──────────────────────────────┐
│                              │
│            [Logo]            │
│                              │
│       Selamat Datang         │
│       di MedStaff            │
│                              │
│  Email                       │
│  ┌────────────────────────┐  │
│  │ email@example.com       │  │
│  └────────────────────────┘  │
│                              │
│  Password                    │
│  ┌────────────────────────┐  │
│  │ ••••••••••          👁  │  │
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

### Komponen

- Logo
- Email input
- Password input
- Show/hide password
- Lupa Password
- Login button
- Register link

### Keterangan

Pengguna memasukkan email dan password untuk masuk ke aplikasi.

Setelah login, sistem menentukan apakah pengguna merupakan:

- Staff/Pegawai
- Administrator

---

## AUTH-04 — Register

```text
┌──────────────────────────────┐
│ ←        Daftar Akun         │
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
│ │          DAFTAR          │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Data wajib

- Nama lengkap
- Email
- Nomor HP
- Tempat lahir
- Tanggal lahir
- Jenis kelamin
- Nama kontak darurat
- Nomor kontak darurat
- Password

### Keterangan

Data tambahan seperti data pekerjaan dan identitas pegawai dapat dilengkapi setelah akun dibuat atau melalui proses administrasi pegawai.

---

## AUTH-05 — Forgot Password

```text
┌──────────────────────────────┐
│ ←      Lupa Password         │
│                              │
│            [Icon]            │
│                              │
│     Lupa password Anda?      │
│                              │
│ Masukkan email yang          │
│ terdaftar pada MedStaff.     │
│                              │
│ Email                        │
│ ┌──────────────────────────┐ │
│ │ email@example.com        │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │    KIRIM INSTRUKSI       │ │
│ └──────────────────────────┘ │
│                              │
│ Instruksi reset password     │
│ akan dikirim ke email.       │
│                              │
└──────────────────────────────┘
```

### Komponen

- Back button
- Icon
- Email input
- Submit button
- Informasi reset password

### Keterangan

Digunakan ketika pengguna lupa password.

---

# 2. Main Navigation — Staff/Pegawai

Navigasi utama pengguna Staff/Pegawai menggunakan **5 menu tetap**.

```text
┌──────────────────────────────┐
│                              │
│          CONTENT             │
│                              │
│                              │
├──────────────────────────────┤
│ 🏠     👥      📋      🔔    👤 │
│Home   Pegawai Pengajuan Notif Profil
└──────────────────────────────┘
```

### Menu utama

1. Home
2. Pegawai
3. Pengajuan
4. Notifikasi
5. Profil

### Keterangan

**Attendance tidak menjadi menu bottom navigation.**

Attendance diakses melalui:

- Home
- Akses cepat
- Tombol Clock In / Clock Out

---

# 3. Home

## HOME-01 — Dashboard Staff

```text
┌──────────────────────────────┐
│ Selamat pagi, Pendi 👋       │
│ Senin, 10 Agustus 2026       │
│                              │
│ ┌──────────────────────────┐ │
│ │     STATUS ABSENSI       │ │
│ │                          │ │
│ │       Belum Absen        │ │
│ │                          │ │
│ │   [     CLOCK IN     ]   │ │
│ └──────────────────────────┘ │
│                              │
│ 📢 Pengumuman Terbaru        │
│                              │
│ ┌──────────────────────────┐ │
│ │ Informasi Klinik         │ │
│ │ Pengumuman terbaru...    │ │
│ │                      >   │ │
│ └──────────────────────────┘ │
│                              │
│ Akses Cepat                  │
│                              │
│ ┌────────────┐ ┌───────────┐ │
│ │     📷     │ │    📋     │ │
│ │  Absensi   │ │  Riwayat  │ │
│ └────────────┘ └───────────┘ │
│                              │
│ ┌────────────┐ ┌───────────┐ │
│ │     👥     │ │    🔔     │ │
│ │  Pegawai   │ │Notifikasi │ │
│ └────────────┘ └───────────┘ │
│                              │
├──────────────────────────────┤
│ 🏠    👥    📋    🔔    👤  │
│Home Pegawai Pengajuan Notif Profil
└──────────────────────────────┘
```

### Komponen

- Greeting
- Tanggal
- Status absensi
- Tombol Clock In / Clock Out
- Pengumuman
- Akses cepat Absensi
- Akses cepat Riwayat
- Akses cepat Pegawai
- Akses cepat Notifikasi
- Bottom navigation

### Keterangan

Home merupakan halaman utama Staff/Pegawai.

Status absensi berubah sesuai kondisi:

```text
Belum Absen
     ↓
Clock In
     ↓
Sudah Clock In
     ↓
Clock Out
     ↓
Absensi Selesai
```

---

# 4. Attendance

Attendance bukan menu bottom navigation, tetapi merupakan fitur utama yang dapat diakses dari Home.

---

## ATT-01 — Attendance Verification

```text
┌──────────────────────────────┐
│ ←        Absensi             │
│                              │
│        Ambil Selfie         │
│                              │
│      ┌──────────────┐        │
│      │              │        │
│      │    CAMERA    │        │
│      │              │        │
│      └──────────────┘        │
│                              │
│ Pastikan wajah terlihat      │
│ dengan jelas.                │
│                              │
│ ┌──────────────────────────┐ │
│ │      AMBIL FOTO          │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Komponen

- Back button
- Camera preview
- Instruksi selfie
- Capture button

### Keterangan

Pengguna wajib melakukan selfie sebelum absensi dicatat.

---

## ATT-02 — Attendance Confirmation

```text
┌──────────────────────────────┐
│ ←     Konfirmasi Absensi     │
│                              │
│        [Foto Selfie]         │
│                              │
│ Waktu                        │
│ 08:01 WIB                    │
│                              │
│ Lokasi                       │
│ Klinik Pratama Unimus        │
│                              │
│ GPS                          │
│ ✓ Lokasi terdeteksi          │
│                              │
│ Jenis Absensi                │
│ Clock In                     │
│                              │
│ ┌──────────────────────────┐ │
│ │     KONFIRMASI ABSEN     │ │
│ └──────────────────────────┘ │
│                              │
│ [Batal]                      │
└──────────────────────────────┘
```

### Data yang ditampilkan

- Foto selfie
- Waktu
- Lokasi
- GPS
- Jenis absensi
- Status verifikasi

### Keterangan

Sistem mengambil:

- Foto
- Waktu server
- Lokasi GPS

Data tersebut disimpan sebagai data absensi.

---

## ATT-03 — Attendance Success

```text
┌──────────────────────────────┐
│                              │
│             ✓                │
│                              │
│      Absensi Berhasil        │
│                              │
│      Clock In 08:01 WIB      │
│                              │
│      Lokasi terverifikasi    │
│                              │
│        [SELESAI]             │
│                              │
└──────────────────────────────┘
```

### Keterangan

Ditampilkan setelah proses absensi berhasil.

---

## ATT-04 — Clock Out

```text
┌──────────────────────────────┐
│ ←       Clock Out            │
│                              │
│ Status                       │
│ ✓ Sudah Clock In             │
│                              │
│ Clock In                     │
│ 08:01 WIB                    │
│                              │
│ ┌──────────────────────────┐ │
│ │       CLOCK OUT          │ │
│ └──────────────────────────┘ │
│                              │
│ Sistem akan meminta selfie   │
│ dan lokasi kembali.          │
│                              │
└──────────────────────────────┘
```

### Keterangan

Clock Out menggunakan proses verifikasi yang sama:

```text
Clock Out
   ↓
Selfie
   ↓
GPS
   ↓
Waktu
   ↓
Konfirmasi
   ↓
Absensi selesai
```

---

## ATT-05 — Attendance History

```text
┌──────────────────────────────┐
│ ←    Riwayat Absensi         │
│                              │
│ [ Bulan ] [ Tahun ]          │
│                              │
│ ┌──────────────────────────┐ │
│ │ 10 Agustus 2026          │ │
│ │ Clock In   08:01         │ │
│ │ Clock Out  16:05         │ │
│ │ Status     Hadir         │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 09 Agustus 2026          │ │
│ │ Clock In   08:00         │ │
│ │ Clock Out  16:00         │ │
│ │ Status     Hadir         │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Komponen

- Filter bulan
- Filter tahun
- Daftar riwayat
- Clock In
- Clock Out
- Status

---

# 5. Pegawai

## PEGAWAI-01 — Daftar Pegawai

```text
┌──────────────────────────────┐
│ Pegawai                      │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Cari pegawai...       │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [Foto]  Nama Pegawai     │ │
│ │         Staff            │ │
│ │         ID: EMP001    >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [Foto]  Nama Pegawai     │ │
│ │         Security         │ │
│ │         ID: EMP002    >  │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ 🏠    👥    📋    🔔    👤  │
└──────────────────────────────┘
```

### Komponen

- Search
- Foto pegawai
- Nama
- Posisi
- Employee ID
- Detail pegawai

### Keterangan

Pengguna dapat melihat daftar pegawai dan informasi dasar pegawai lain.

---

## PEGAWAI-02 — Detail Pegawai

```text
┌──────────────────────────────┐
│ ←      Detail Pegawai        │
│                              │
│          [Foto]              │
│                              │
│       Nama Pegawai           │
│       Staff                  │
│       EMP001                 │
│                              │
│ Informasi                    │
│ ──────────────────────────── │
│ Nama                         │
│ Nama Pegawai                 │
│                              │
│ Posisi                       │
│ Staff                        │
│                              │
│ Employee ID                  │
│ EMP001                       │
│                              │
│ Nomor HP                     │
│ 08xxxxxxxxxx                │
│                              │
└──────────────────────────────┘
```

### Keterangan

Profil pegawai lain hanya menampilkan informasi yang memang diperbolehkan untuk dilihat oleh pegawai lain.

---

# 6. Pengajuan

Menu Pengajuan menjadi pusat seluruh pengajuan yang dilakukan oleh Staff/Pegawai.

```text
┌──────────────────────────────┐
│ Pengajuan                    │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📅 Pengajuan Cuti        │ │
│ │ Ajukan cuti          >    │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📄 Perubahan Berkas      │ │
│ │ Ubah data/dokumen    >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📋 Pengajuan Lainnya     │ │
│ │ Pengajuan administrasi > │ │
│ └──────────────────────────┘ │
│                              │
│ Riwayat Pengajuan            │
│                              │
│ ┌──────────────────────────┐ │
│ │ Cuti 10-12 Agustus       │ │
│ │ Status: Menunggu         │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ 🏠    👥    📋    🔔    👤  │
└──────────────────────────────┘
```

### Jenis pengajuan

- Pengajuan cuti
- Pengajuan perubahan berkas/data
- Pengajuan administrasi lainnya

### Status pengajuan

- Menunggu
- Disetujui
- Ditolak

---

# 7. Pengajuan Cuti

## CUTI-01 — Form Pengajuan Cuti

```text
┌──────────────────────────────┐
│ ←     Pengajuan Cuti         │
│                              │
│ Jenis Cuti                   │
│ ┌──────────────────────────┐ │
│ │ Pilih jenis cuti      ▼  │ │
│ └──────────────────────────┘ │
│                              │
│ Tanggal Mulai                │
│ ┌──────────────────────────┐ │
│ │ DD / MM / YYYY        📅 │ │
│ └──────────────────────────┘ │
│                              │
│ Tanggal Selesai              │
│ ┌──────────────────────────┐ │
│ │ DD / MM / YYYY        📅 │ │
│ └──────────────────────────┘ │
│                              │
│ Alasan                       │
│ ┌──────────────────────────┐ │
│ │ Tulis alasan...          │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ Lampiran                     │
│ [+ Tambah Lampiran]          │
│                              │
│ ┌──────────────────────────┐ │
│ │      AJUKAN CUTI         │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Komponen

- Jenis cuti
- Tanggal mulai
- Tanggal selesai
- Alasan
- Lampiran
- Tombol Ajukan

---

## CUTI-02 — Detail Pengajuan Cuti

```text
┌──────────────────────────────┐
│ ←    Detail Pengajuan        │
│                              │
│ Pengajuan Cuti               │
│                              │
│ Jenis       Cuti Tahunan     │
│ Mulai       10/08/2026       │
│ Selesai     12/08/2026       │
│ Durasi      3 Hari           │
│                              │
│ Alasan                       │
│ Keperluan pribadi...         │
│                              │
│ Status                       │
│ 🟡 Menunggu Persetujuan      │
│                              │
│ Riwayat Persetujuan          │
│                              │
│ Staff → Admin/HRD            │
│        Menunggu              │
│                              │
└──────────────────────────────┘
```

### Keterangan

Staff dapat melihat status pengajuan cuti secara lengkap.

---

# 8. Persetujuan Cuti — Admin

## CUTI-03 — Daftar Pengajuan Cuti Admin

```text
┌──────────────────────────────┐
│ Persetujuan Cuti             │
│                              │
│ Filter                       │
│ [Menunggu ▼] [Tanggal ▼]     │
│                              │
│ ┌──────────────────────────┐ │
│ │ Nama Pegawai             │ │
│ │ Cuti Tahunan             │ │
│ │ 10 - 12 Agustus 2026     │ │
│ │ Status: Menunggu         │ │
│ │                      >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Nama Pegawai             │ │
│ │ Cuti Sakit               │ │
│ │ 15 Agustus 2026          │ │
│ │ Status: Menunggu         │ │
│ │                      >   │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

## CUTI-04 — Detail Persetujuan Cuti Admin

```text
┌──────────────────────────────┐
│ ←   Persetujuan Cuti         │
│                              │
│ [Foto Pegawai]               │
│ Nama Pegawai                 │
│ EMP001                       │
│ Staff                        │
│                              │
│ Jenis Cuti                   │
│ Cuti Tahunan                 │
│                              │
│ Periode                      │
│ 10 - 12 Agustus 2026        │
│                              │
│ Durasi                       │
│ 3 Hari                       │
│                              │
│ Alasan                       │
│ Keperluan pribadi...         │
│                              │
│ Lampiran                     │
│ [Lihat Lampiran]             │
│                              │
│ ┌──────────────────────────┐ │
│ │         SETUJUI          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │          TOLAK           │ │
│ └──────────────────────────┘ │
│                              │
│ Catatan Admin                │
│ [Opsional]                   │
│                              │
└──────────────────────────────┘
```

### Keputusan Admin

Admin wajib memilih:

- **Setujui**
- **Tolak**

Jika memilih **Tolak**, Admin mengisi alasan penolakan.

### Status setelah keputusan

```text
Menunggu
   ├── Setujui → Disetujui
   │
   └── Tolak   → Ditolak
```

---

# 9. Perubahan Berkas/Data Pegawai

Pengajuan perubahan berkas digunakan ketika pegawai ingin mengubah data atau dokumen yang membutuhkan pemeriksaan Admin.

---

## BERKAS-01 — Form Perubahan Berkas

```text
┌──────────────────────────────┐
│ ←   Perubahan Berkas         │
│                              │
│ Pilih Data                   │
│ ┌──────────────────────────┐ │
│ │ Pilih data yang diubah ▼ │ │
│ └──────────────────────────┘ │
│                              │
│ Data Lama                    │
│ ┌──────────────────────────┐ │
│ │ Data sebelumnya          │ │
│ └──────────────────────────┘ │
│                              │
│ Data Baru                    │
│ ┌──────────────────────────┐ │
│ │ Data yang baru           │ │
│ └──────────────────────────┘ │
│                              │
│ Dokumen Pendukung            │
│ [+ Tambah Dokumen]           │
│                              │
│ Alasan Perubahan             │
│ ┌──────────────────────────┐ │
│ │ Tulis alasan...          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │      AJUKAN PERUBAHAN    │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Contoh perubahan

- Nomor HP
- Alamat
- Data identitas
- Data pendidikan
- Data pengalaman
- Data lainnya yang membutuhkan verifikasi

---

## BERKAS-02 — Detail Pengajuan Perubahan

```text
┌──────────────────────────────┐
│ ←  Detail Perubahan Berkas   │
│                              │
│ Jenis Perubahan              │
│ Alamat                       │
│                              │
│ Data Lama                    │
│ Alamat sebelumnya...         │
│                              │
│ Data Baru                    │
│ Alamat baru...               │
│                              │
│ Dokumen Pendukung            │
│ [Lihat Dokumen]              │
│                              │
│ Alasan                       │
│ Perubahan data...            │
│                              │
│ Status                       │
│ 🟡 Menunggu Persetujuan      │
│                              │
└──────────────────────────────┘
```

---

# 10. Persetujuan Perubahan Berkas — Admin

## BERKAS-03 — Daftar Perubahan Berkas

```text
┌──────────────────────────────┐
│ Persetujuan Perubahan        │
│                              │
│ [Menunggu ▼]                 │
│                              │
│ ┌──────────────────────────┐ │
│ │ Nama Pegawai             │ │
│ │ Perubahan Alamat         │ │
│ │ Status: Menunggu         │ │
│ │                      >   │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Nama Pegawai             │ │
│ │ Perubahan Nomor HP       │ │
│ │ Status: Menunggu         │ │
│ │                      >   │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

## BERKAS-04 — Detail Persetujuan Perubahan

```text
┌──────────────────────────────┐
│ ←  Persetujuan Perubahan     │
│                              │
│ [Foto Pegawai]               │
│ Nama Pegawai                 │
│ EMP001                       │
│                              │
│ Jenis Perubahan              │
│ Alamat                       │
│                              │
│ DATA LAMA                    │
│ Alamat sebelumnya...         │
│                              │
│ DATA BARU                    │
│ Alamat baru...               │
│                              │
│ Dokumen Pendukung            │
│ [Lihat Dokumen]              │
│                              │
│ Alasan                       │
│ Perubahan data...            │
│                              │
│ ┌──────────────────────────┐ │
│ │         SETUJUI          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │          TOLAK           │ │
│ └──────────────────────────┘ │
│                              │
│ Catatan Admin                │
│ [Tulis catatan...]          │
│                              │
└──────────────────────────────┘
```

### Keputusan Admin

Admin wajib memilih:

- Setujui
- Tolak

Jika ditolak, alasan penolakan dicatat.

---

# 11. Pengajuan Lainnya

## PENGAJUAN-01 — Daftar Pengajuan Lainnya

```text
┌──────────────────────────────┐
│ ←   Pengajuan Lainnya        │
│                              │
│ ┌──────────────────────────┐ │
│ │ Jenis Pengajuan           │
│ │ Administrasi          >   │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Status                   │
│ │ Menunggu                 │
│ └──────────────────────────┘ │
│                              │
│ Riwayat                      │
│                              │
│ ┌──────────────────────────┐ │
│ │ Pengajuan Administrasi   │ │
│ │ Status: Disetujui        │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Keterangan

Jenis pengajuan tambahan dapat dikelola oleh Admin sesuai kebutuhan operasional Klinik.

Setiap pengajuan yang membutuhkan persetujuan tetap memiliki:

- Menunggu
- Disetujui
- Ditolak

---

# 12. Notifikasi

## NOTIF-01 — Daftar Notifikasi

```text
┌──────────────────────────────┐
│ Notifikasi                   │
│                              │
│ Hari Ini                     │
│                              │
│ ┌──────────────────────────┐ │
│ │ ✓ Pengajuan Cuti         │ │
│ │ Pengajuan Anda disetujui │ │
│ │ 10 menit lalu             │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📄 Perubahan Berkas      │ │
│ │ Menunggu persetujuan     │ │
│ │ 1 jam lalu               │ │
│ └──────────────────────────┘ │
│                              │
│ Sebelumnya                   │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📢 Pengumuman Klinik     │ │
│ │ Informasi terbaru...     │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ 🏠    👥    📋    🔔    👤  │
└──────────────────────────────┘
```

### Jenis notifikasi

- Hasil persetujuan cuti
- Hasil persetujuan perubahan berkas
- Status pengajuan lainnya
- Pengumuman
- Informasi sistem

---

# 13. Profil Staff

## PROFIL-01 — Profil

```text
┌──────────────────────────────┐
│ Profil                       │
│                              │
│          [Foto]              │
│                              │
│       Nama Pegawai           │
│       Staff                  │
│       EMP001                 │
│                              │
│ ┌──────────────────────────┐ │
│ │ 👤 Data Pribadi       >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 💼 Data Pekerjaan     >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🆘 Kontak Darurat      > │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🎓 Pendidikan         >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 💼 Pengalaman          > │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔐 Password & PIN      > │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🌐 Bahasa              > │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ ❓ Pusat Bantuan        > │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │        KELUAR            │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ 🏠    👥    📋    🔔    👤  │
└──────────────────────────────┘
```

---

# 14. Data Pribadi

## PROFIL-02 — Data Pribadi

```text
┌──────────────────────────────┐
│ ←       Data Pribadi         │
│                              │
│ Nama Lengkap                 │
│ Nama Pegawai                 │
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
│ [Lihat Dokumen]              │
│                              │
│ Alamat                       │
│ Alamat lengkap...            │
│                              │
│ [Ajukan Perubahan]           │
│                              │
└──────────────────────────────┘
```

### Keterangan

Data yang membutuhkan perubahan administratif diarahkan ke:

**Pengajuan → Perubahan Berkas**

Perubahan tidak langsung mengubah data utama sebelum mendapatkan persetujuan.

---

# 15. Data Pekerjaan

## PROFIL-03 — Data Pekerjaan

```text
┌──────────────────────────────┐
│ ←      Data Pekerjaan        │
│                              │
│ Employee ID                  │
│ EMP001                       │
│                              │
│ Perusahaan                   │
│ Klinik Pratama Unimus        │
│                              │
│ Posisi / Jabatan             │
│ Staff                        │
│                              │
│ Status Pegawai               │
│ Aktif                        │
│                              │
└──────────────────────────────┘
```

### Data

- Employee ID
- Nama perusahaan
- Posisi/jabatan
- Status pegawai

---

# 16. Kontak Darurat

## PROFIL-04 — Kontak Darurat

```text
┌──────────────────────────────┐
│ ←      Kontak Darurat        │
│                              │
│ Nama                         │
│ Nama Kontak                  │
│                              │
│ Hubungan                     │
│ Orang Tua                    │
│                              │
│ Nomor Telepon                │
│ 08xxxxxxxxxx                 │
│                              │
└──────────────────────────────┘
```

### Data

- Nama
- Hubungan
- Nomor telepon

---

# 17. Pendidikan

## PROFIL-05 — Pendidikan

```text
┌──────────────────────────────┐
│ ←       Pendidikan           │
│                              │
│ ┌──────────────────────────┐ │
│ │ S1 Informatika            │ │
│ │ Universitas               │ │
│ │ 2023 - Sekarang       >   │ │
│ └──────────────────────────┘ │
│                              │
│ [+ Tambah Pendidikan]        │
│                              │
└──────────────────────────────┘
```

### Keterangan

Pegawai dapat menambahkan riwayat pendidikan.

---

# 18. Pengalaman

## PROFIL-06 — Pengalaman

```text
┌──────────────────────────────┐
│ ←       Pengalaman           │
│                              │
│ ┌──────────────────────────┐ │
│ │ Social Media Marketer     │ │
│ │ Nama Perusahaan           │ │
│ │ 2024 - 2025          >    │ │
│ └──────────────────────────┘ │
│                              │
│ [+ Tambah Pengalaman]        │
│                              │
└──────────────────────────────┘
```

### Keterangan

Pegawai dapat menambahkan pengalaman kerja.

---

# 19. Password & PIN

## PROFIL-07 — Keamanan

```text
┌──────────────────────────────┐
│ ←       Keamanan             │
│                              │
│ Password                     │
│ ┌──────────────────────────┐ │
│ │ Ubah Password          >  │ │
│ └──────────────────────────┘ │
│                              │
│ PIN                          │
│ ┌──────────────────────────┐ │
│ │ Kelola PIN             >  │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Keterangan

Pengguna dapat:

- Mengubah password
- Membuat/mengubah PIN

---

# 20. Bahasa

## PROFIL-08 — Bahasa

```text
┌──────────────────────────────┐
│ ←         Bahasa             │
│                              │
│ Bahasa Aplikasi              │
│                              │
│ ● Bahasa Indonesia           │
│ ○ English                    │
│                              │
└──────────────────────────────┘
```

---

# 21. Pusat Bantuan

## PROFIL-09 — Pusat Bantuan

```text
┌──────────────────────────────┐
│ ←      Pusat Bantuan         │
│                              │
│ 🔍 Cari bantuan...           │
│                              │
│ FAQ                          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Bagaimana cara Clock In? │ │
│ │                       >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Bagaimana mengajukan cuti│ │
│ │                       >  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Bagaimana mengubah data? │ │
│ │                       >  │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

# 22. Administrator

Administrator memiliki akses yang lebih luas dibanding Staff/Pegawai.

Administrator digunakan oleh:

- HRD
- Pimpinan
- Admin yang ditunjuk

Administrator dapat mengelola:

- Pegawai
- Absensi
- Pengajuan
- Cuti
- Perubahan berkas
- Pengajuan lainnya
- Persetujuan
- Pengumuman
- Notifikasi
- Data administrasi pegawai

---

# 23. Admin Dashboard

## ADMIN-01 — Dashboard Administrator

```text
┌────────────────────────────────┐
│ Dashboard Admin                │
│                                │
│ Selamat datang, Admin          │
│ Senin, 10 Agustus 2026         │
│                                │
│ ┌───────────┐ ┌──────────────┐ │
│ │ Pegawai   │ │ Hadir Hari Ini│ │
│ │   125     │ │      112      │ │
│ └───────────┘ └──────────────┘ │
│                                │
│ ┌───────────┐ ┌──────────────┐ │
│ │ Cuti      │ │ Pengajuan    │ │
│ │ Menunggu  │ │ Menunggu     │ │
│ │     8     │ │      12      │ │
│ └───────────┘ └──────────────┘ │
│                                │
│ Persetujuan Menunggu           │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📅 Cuti              5     │ │
│ │ 📄 Perubahan Berkas  4     │ │
│ │ 📋 Lainnya           3     │ │
│ └────────────────────────────┘ │
│                                │
│ Aktivitas Terbaru              │
│ ┌────────────────────────────┐ │
│ │ Pengajuan baru...           │ │
│ │ Pegawai baru...             │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Komponen

- Total pegawai
- Kehadiran hari ini
- Cuti menunggu
- Pengajuan menunggu
- Ringkasan persetujuan
- Aktivitas terbaru

---

# 24. Admin — Manajemen Pegawai

## ADMIN-02 — Daftar Pegawai

```text
┌────────────────────────────────┐
│ Manajemen Pegawai              │
│                                │
│ 🔍 Cari pegawai...             │
│                                │
│ [Semua ▼] [Status ▼]           │
│                                │
│ ┌────────────────────────────┐ │
│ │ [Foto] Nama Pegawai        │ │
│ │        EMP001              │ │
│ │        Staff               │ │
│ │        Aktif            >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ [Foto] Nama Pegawai        │ │
│ │        EMP002              │ │
│ │        Security            │ │
│ │        Aktif            >  │ │
│ └────────────────────────────┘ │
│                                │
│ [+ Tambah Pegawai]             │
│                                │
└────────────────────────────────┘
```

### Fitur Admin

- Melihat pegawai
- Menambah pegawai
- Melihat detail pegawai
- Mengelola status pegawai
- Melihat data pekerjaan
- Melihat data administrasi

---

# 25. Admin — Detail Pegawai

## ADMIN-03 — Detail Pegawai Admin

```text
┌────────────────────────────────┐
│ ←       Detail Pegawai         │
│                                │
│           [Foto]               │
│                                │
│        Nama Pegawai            │
│        EMP001                  │
│        Staff                   │
│                                │
│ Data Pribadi                   │
│ ────────────────────────────── │
│ Nama                           │
│ Nomor HP                       │
│ Email                          │
│ Tempat/Tanggal Lahir           │
│ Jenis Kelamin                  │
│ Alamat                         │
│                                │
│ Data Pekerjaan                 │
│ ────────────────────────────── │
│ Employee ID                    │
│ Perusahaan                     │
│ Jabatan                        │
│ Status                         │
│                                │
│ Dokumen                        │
│ ────────────────────────────── │
│ [Lihat Dokumen]                │
│                                │
│ Riwayat                        │
│ ────────────────────────────── │
│ [Riwayat Absensi]              │
│ [Riwayat Cuti]                 │
│ [Riwayat Pengajuan]            │
│                                │
└────────────────────────────────┘
```

---

# 26. Admin — Monitoring Absensi

## ADMIN-04 — Monitoring Absensi

```text
┌────────────────────────────────┐
│ Monitoring Absensi             │
│                                │
│ [Tanggal 📅] [Status ▼]        │
│                                │
│ Total Hadir       112          │
│ Belum Absen       8            │
│ Terlambat         5            │
│                                │
│ ┌────────────────────────────┐ │
│ │ Nama Pegawai               │ │
│ │ Clock In   08:01           │ │
│ │ Clock Out  16:05           │ │
│ │ Status     Hadir            │ │
│ │                        >   │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Nama Pegawai               │ │
│ │ Clock In   08:15           │ │
│ │ Clock Out  -               │ │
│ │ Status     Hadir            │ │
│ │                        >   │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Keterangan

Admin dapat memonitor kehadiran seluruh pegawai.

---

# 27. Admin — Detail Absensi

## ADMIN-05 — Detail Absensi Pegawai

```text
┌────────────────────────────────┐
│ ←       Detail Absensi         │
│                                │
│ [Foto Pegawai]                 │
│ Nama Pegawai                   │
│ EMP001                         │
│                                │
│ Tanggal                        │
│ 10 Agustus 2026                │
│                                │
│ CLOCK IN                       │
│ 08:01 WIB                      │
│                                │
│ Foto Selfie                    │
│ [Lihat Foto]                   │
│                                │
│ Lokasi                         │
│ Klinik Pratama Unimus          │
│                                │
│ CLOCK OUT                      │
│ 16:05 WIB                      │
│                                │
│ Status                         │
│ Hadir                          │
│                                │
└────────────────────────────────┘
```

---

# 28. Admin — Persetujuan Terpusat

## ADMIN-06 — Pusat Persetujuan

```text
┌────────────────────────────────┐
│ Pusat Persetujuan              │
│                                │
│ [Semua ▼]                      │
│                                │
│ Menunggu Persetujuan           │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📅 Pengajuan Cuti           │ │
│ │ Nama Pegawai               │ │
│ │ Menunggu                >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📄 Perubahan Berkas         │ │
│ │ Nama Pegawai               │ │
│ │ Menunggu                >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📋 Pengajuan Lainnya        │ │
│ │ Nama Pegawai               │ │
│ │ Menunggu                >  │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Keterangan

Ini merupakan pusat seluruh proses approval.

Admin tidak perlu mencari pengajuan dari banyak tempat.

Semua pengajuan yang membutuhkan tindakan ditampilkan di sini.

---

# 29. Admin — Keputusan Persetujuan

Setiap pengajuan yang membutuhkan approval memiliki pola yang sama.

```text
┌────────────────────────────────┐
│ Detail Pengajuan               │
│                                │
│ Data Pemohon                   │
│ Nama Pegawai                   │
│ Employee ID                    │
│ Jabatan                        │
│                                │
│ Detail Pengajuan               │
│ ................................│
│                                │
│ Lampiran                       │
│ [Lihat Lampiran]               │
│                                │
│ Catatan Admin                  │
│ ┌────────────────────────────┐ │
│ │ Tulis catatan...           │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │          SETUJUI           │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │           TOLAK            │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Aturan approval

Semua pengajuan yang membutuhkan persetujuan memiliki tiga status utama:

```text
MENUNGGU
   │
   ├───────────────┐
   ↓               ↓
SETUJUI           TOLAK
   │               │
   ↓               ↓
DISETUJUI          DITOLAK
```

### Jika Ditolak

Admin wajib memberikan alasan penolakan.

### Jika Disetujui

Data pengajuan diproses dan status berubah menjadi Disetujui.

---

# 30. Admin — Pengumuman

## ADMIN-07 — Manajemen Pengumuman

```text
┌────────────────────────────────┐
│ Pengumuman                     │
│                                │
│ ┌────────────────────────────┐ │
│ │ Informasi Klinik            │ │
│ │ Pengumuman terbaru...       │ │
│ │ Aktif                    >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Jadwal Operasional          │ │
│ │ Informasi jadwal...         │ │
│ │ Aktif                    >  │ │
│ └────────────────────────────┘ │
│                                │
│ [+ Buat Pengumuman]            │
│                                │
└────────────────────────────────┘
```

### Fitur

- Membuat pengumuman
- Mengubah pengumuman
- Menghapus/nonaktifkan pengumuman
- Melihat pengumuman aktif

---

# 31. Admin — Notifikasi

## ADMIN-08 — Notifikasi Admin

```text
┌────────────────────────────────┐
│ Notifikasi                     │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🔔 Pengajuan Cuti Baru     │ │
│ │ Membutuhkan persetujuan    │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📄 Perubahan Berkas Baru   │ │
│ │ Membutuhkan pemeriksaan    │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 👤 Pegawai Baru             │ │
│ │ Data pegawai tersedia      │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

---

# 32. Admin — Profil & Pengaturan

## ADMIN-09 — Profil Admin

```text
┌────────────────────────────────┐
│ Profil Admin                   │
│                                │
│           [Foto]               │
│                                │
│        Nama Admin              │
│        HRD / Pimpinan          │
│                                │
│ ┌────────────────────────────┐ │
│ │ Data Akun               >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Keamanan                >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Bahasa                  >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Pusat Bantuan           >  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │          KELUAR             │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

---

# 33. Struktur Navigasi Staff

```text
LOGIN
  │
  ↓
HOME
  │
  ├── Attendance
  │     ├── Selfie
  │     ├── GPS
  │     ├── Waktu
  │     ├── Konfirmasi
  │     └── Berhasil
  │
  ├── Pegawai
  │     ├── Daftar Pegawai
  │     └── Detail Pegawai
  │
  ├── Pengajuan
  │     ├── Pengajuan Cuti
  │     │     ├── Form
  │     │     └── Detail/Status
  │     │
  │     ├── Perubahan Berkas
  │     │     ├── Form
  │     │     └── Detail/Status
  │     │
  │     └── Pengajuan Lainnya
  │
  ├── Notifikasi
  │
  └── Profil
        ├── Data Pribadi
        ├── Data Pekerjaan
        ├── Kontak Darurat
        ├── Pendidikan
        ├── Pengalaman
        ├── Password & PIN
        ├── Bahasa
        └── Pusat Bantuan
```

---

# 34. Struktur Navigasi Administrator

```text
LOGIN
  │
  ↓
ADMIN DASHBOARD
  │
  ├── Manajemen Pegawai
  │     ├── Daftar Pegawai
  │     ├── Tambah Pegawai
  │     └── Detail Pegawai
  │
  ├── Monitoring Absensi
  │     ├── Daftar Absensi
  │     └── Detail Absensi
  │
  ├── Pusat Persetujuan
  │     ├── Cuti
  │     ├── Perubahan Berkas
  │     └── Pengajuan Lainnya
  │
  ├── Pengumuman
  │     ├── Daftar
  │     └── Buat/Edit
  │
  ├── Notifikasi
  │
  └── Profil Admin
        ├── Data Akun
        ├── Keamanan
        ├── Bahasa
        └── Pusat Bantuan
```

---

# 35. Status Sistem Pengajuan

Semua pengajuan menggunakan standar status yang konsisten.

```text
┌───────────────┐
│   MENUNGGU    │
└───────┬───────┘
        │
   ┌────┴────┐
   ↓         ↓
┌───────┐ ┌────────┐
│SETUJUI│ │ TOLAK  │
└───┬───┘ └───┬────┘
    ↓         ↓
┌─────────┐ ┌────────┐
│DISETUJUI│ │DITOLAK │
└─────────┘ └────────┘
```

### Berlaku untuk

- Pengajuan cuti
- Perubahan berkas
- Pengajuan administrasi lainnya
- Pengajuan lain yang membutuhkan persetujuan

---

# 36. Ringkasan Hak Akses

| Fitur | Staff | Admin |
|---|---|---|
| Home | ✓ | ✓ |
| Attendance | ✓ | Monitoring |
| Selfie Absensi | ✓ | Melihat |
| GPS Absensi | ✓ | Melihat |
| Riwayat Absensi | ✓ | ✓ |
| Daftar Pegawai | ✓ | ✓ |
| Detail Pegawai | ✓ | ✓ |
| Pengajuan Cuti | ✓ | ✓ |
| Persetujuan Cuti | - | ✓ |
| Perubahan Berkas | ✓ | ✓ |
| Persetujuan Berkas | - | ✓ |
| Pengajuan Lainnya | ✓ | ✓ |
| Persetujuan Pengajuan | - | ✓ |
| Notifikasi | ✓ | ✓ |
| Profil | ✓ | ✓ |
| Pendidikan | ✓ | Melihat |
| Pengalaman | ✓ | Melihat |
| Pengumuman | Melihat | Kelola |
| Manajemen Pegawai | - | ✓ |
| Monitoring Absensi | - | ✓ |
| Pusat Persetujuan | - | ✓ |

---

# 37. Prinsip Wireframe MedStaff

Wireframe MedStaff menggunakan prinsip berikut:

1. Bottom navigation Staff terdiri dari:
   - Home
   - Pegawai
   - Pengajuan
   - Notifikasi
   - Profil

2. Attendance bukan menu bottom navigation.

3. Attendance menggunakan:
   - Selfie
   - Waktu
   - GPS
   - Clock In
   - Clock Out

4. Semua pengajuan yang membutuhkan persetujuan Admin memiliki:
   - Menunggu
   - Setujui
   - Tolak
   - Disetujui
   - Ditolak

5. Penolakan pengajuan harus memiliki alasan/catatan Admin.

6. Perubahan data penting pegawai tidak langsung mengubah data utama sebelum melalui proses persetujuan.

7. Admin memiliki akses yang lebih luas daripada Staff.

8. Admin dapat melihat dan mengelola:
   - Pegawai
   - Absensi
   - Cuti
   - Perubahan berkas
   - Pengajuan lainnya
   - Persetujuan
   - Pengumuman
   - Notifikasi

9. Profil Staff mencakup:
   - Data pribadi
   - Data pekerjaan
   - Kontak darurat
   - Pendidikan
   - Pengalaman
   - Password
   - PIN
   - Bahasa
   - Pusat bantuan

10. Struktur wireframe ini menjadi acuan untuk tahap UI Design dan implementasi aplikasi.