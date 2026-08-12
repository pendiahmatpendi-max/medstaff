# Database Schema

## 1. Tujuan

Database MedStaff digunakan untuk menyimpan seluruh data yang dibutuhkan dalam pengelolaan pegawai, absensi, pengajuan, notifikasi, dan administrasi Klinik Pratama Unimus.

Database dirancang menggunakan PostgreSQL dan akan diimplementasikan menggunakan Prisma ORM.

---

# 2. Daftar Tabel

Database MedStaff terdiri dari tabel utama berikut:

1. users
2. employee_profiles
3. emergency_contacts
4. educations
5. experiences
6. attendances
7. leave_requests
8. document_change_requests
9. announcements
10. notifications
11. notification_preferences
12. languages
13. user_languages
14. help_articles

---

# 3. Tabel Users

Digunakan untuk menyimpan data akun pengguna aplikasi.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pengguna |
| email | VARCHAR | UNIQUE, NOT NULL | Email pengguna |
| password_hash | VARCHAR | NOT NULL | Password yang sudah di-hash |
| role | VARCHAR | NOT NULL | STAFF atau ADMIN |
| pin_hash | VARCHAR | NULL | PIN yang sudah di-hash |
| is_active | BOOLEAN | NOT NULL | Status akun |
| created_at | TIMESTAMP | NOT NULL | Waktu pembuatan |
| updated_at | TIMESTAMP | NOT NULL | Waktu perubahan |

---

# 4. Tabel Employee Profiles

Menyimpan informasi pribadi dan pekerjaan pegawai.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID profil |
| user_id | UUID | FK, UNIQUE | Relasi ke users |
| employee_id | VARCHAR | UNIQUE, NOT NULL | Nomor induk pegawai |
| full_name | VARCHAR | NOT NULL | Nama lengkap |
| phone | VARCHAR | NOT NULL | Nomor HP |
| birth_place | VARCHAR | NOT NULL | Tempat lahir |
| birth_date | DATE | NOT NULL | Tanggal lahir |
| gender | VARCHAR | NOT NULL | Jenis kelamin |
| identity_number | VARCHAR | NULL | Nomor identitas |
| address | TEXT | NULL | Alamat |
| company_name | VARCHAR | NOT NULL | Nama perusahaan |
| position | VARCHAR | NOT NULL | Jabatan |
| profile_photo | TEXT | NULL | URL/path foto profil |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 5. Tabel Emergency Contacts

Menyimpan kontak darurat pegawai.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID kontak |
| employee_id | UUID | FK | Relasi ke employee_profiles |
| name | VARCHAR | NOT NULL | Nama kontak |
| relationship | VARCHAR | NOT NULL | Hubungan dengan pegawai |
| phone | VARCHAR | NOT NULL | Nomor telepon |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 6. Tabel Educations

Menyimpan riwayat pendidikan pegawai.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pendidikan |
| employee_id | UUID | FK | Relasi ke employee_profiles |
| institution | VARCHAR | NOT NULL | Nama institusi |
| level | VARCHAR | NOT NULL | Jenjang pendidikan |
| major | VARCHAR | NULL | Jurusan |
| start_year | INTEGER | NULL | Tahun mulai |
| end_year | INTEGER | NULL | Tahun selesai |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |

---

# 7. Tabel Experiences

Menyimpan pengalaman kerja pegawai.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pengalaman |
| employee_id | UUID | FK | Relasi ke employee_profiles |
| company_name | VARCHAR | NOT NULL | Nama perusahaan |
| position | VARCHAR | NOT NULL | Jabatan |
| start_date | DATE | NULL | Tanggal mulai |
| end_date | DATE | NULL | Tanggal selesai |
| description | TEXT | NULL | Deskripsi pengalaman |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |

---

# 8. Tabel Attendances

Menyimpan data absensi pegawai.

Absensi terdiri dari:

- Clock In
- Clock Out
- Foto selfie
- Waktu
- Lokasi GPS

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID absensi |
| employee_id | UUID | FK | Relasi pegawai |
| attendance_date | DATE | NOT NULL | Tanggal absensi |
| clock_in | TIMESTAMP | NULL | Waktu masuk |
| clock_out | TIMESTAMP | NULL | Waktu keluar |
| clock_in_photo | TEXT | NULL | Foto selfie saat masuk |
| clock_out_photo | TEXT | NULL | Foto selfie saat keluar |
| clock_in_latitude | DECIMAL | NULL | Latitude masuk |
| clock_in_longitude | DECIMAL | NULL | Longitude masuk |
| clock_out_latitude | DECIMAL | NULL | Latitude keluar |
| clock_out_longitude | DECIMAL | NULL | Longitude keluar |
| status | VARCHAR | NOT NULL | HADIR, TERLAMBAT, IZIN, atau lainnya |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 9. Tabel Leave Requests

Menyimpan pengajuan cuti pegawai.

Pengajuan cuti harus melalui proses persetujuan admin.

Status:

- PENDING
- APPROVED
- REJECTED

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pengajuan |
| employee_id | UUID | FK | Pegawai yang mengajukan |
| leave_type | VARCHAR | NOT NULL | Jenis cuti |
| start_date | DATE | NOT NULL | Tanggal mulai |
| end_date | DATE | NOT NULL | Tanggal selesai |
| reason | TEXT | NOT NULL | Alasan cuti |
| attachment | TEXT | NULL | Lampiran |
| status | VARCHAR | NOT NULL | Status persetujuan |
| reviewed_by | UUID | FK | Admin yang memproses |
| reviewed_at | TIMESTAMP | NULL | Waktu diproses |
| admin_note | TEXT | NULL | Catatan admin |
| created_at | TIMESTAMP | NOT NULL | Waktu pengajuan |
| updated_at | TIMESTAMP | NOT NULL | Waktu perubahan |

---

# 10. Tabel Document Change Requests

Menyimpan pengajuan perubahan data atau berkas pegawai.

Contoh:

- Perubahan alamat
- Perubahan nomor HP
- Perubahan identitas
- Perubahan data pribadi
- Perubahan dokumen

Status:

- PENDING
- APPROVED
- REJECTED

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pengajuan |
| employee_id | UUID | FK | Pegawai yang mengajukan |
| request_type | VARCHAR | NOT NULL | Jenis perubahan |
| description | TEXT | NOT NULL | Penjelasan perubahan |
| old_data | JSONB | NULL | Data lama |
| new_data | JSONB | NULL | Data baru |
| attachment | TEXT | NULL | Dokumen pendukung |
| status | VARCHAR | NOT NULL | Status persetujuan |
| reviewed_by | UUID | FK | Admin yang memproses |
| reviewed_at | TIMESTAMP | NULL | Waktu diproses |
| admin_note | TEXT | NULL | Catatan admin |
| created_at | TIMESTAMP | NOT NULL | Waktu pengajuan |
| updated_at | TIMESTAMP | NOT NULL | Waktu perubahan |

---

# 11. Tabel Announcements

Menyimpan pengumuman yang dibuat oleh admin.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID pengumuman |
| title | VARCHAR | NOT NULL | Judul |
| content | TEXT | NOT NULL | Isi pengumuman |
| image | TEXT | NULL | Gambar |
| created_by | UUID | FK | Admin pembuat |
| published_at | TIMESTAMP | NULL | Waktu publikasi |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 12. Tabel Notifications

Menyimpan notifikasi untuk pengguna.

Notifikasi dapat berasal dari:

- Persetujuan cuti
- Penolakan cuti
- Persetujuan perubahan data
- Penolakan perubahan data
- Pengumuman
- Informasi absensi

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID notifikasi |
| user_id | UUID | FK | Penerima |
| title | VARCHAR | NOT NULL | Judul |
| message | TEXT | NOT NULL | Isi notifikasi |
| type | VARCHAR | NOT NULL | Jenis notifikasi |
| reference_id | UUID | NULL | ID data terkait |
| is_read | BOOLEAN | NOT NULL | Status dibaca |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |

---

# 13. Tabel Notification Preferences

Menyimpan pengaturan notifikasi pengguna.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID |
| user_id | UUID | FK, UNIQUE | Pengguna |
| attendance_notification | BOOLEAN | NOT NULL | Notifikasi absensi |
| leave_notification | BOOLEAN | NOT NULL | Notifikasi cuti |
| document_notification | BOOLEAN | NOT NULL | Notifikasi perubahan dokumen |
| announcement_notification | BOOLEAN | NOT NULL | Notifikasi pengumuman |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 14. Tabel Languages

Menyimpan bahasa yang tersedia pada aplikasi.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID bahasa |
| code | VARCHAR | UNIQUE | Kode bahasa |
| name | VARCHAR | NOT NULL | Nama bahasa |

Contoh:

- id = Bahasa Indonesia
- en = English

---

# 15. Tabel User Languages

Menyimpan bahasa yang dipilih pengguna.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID |
| user_id | UUID | FK, UNIQUE | Pengguna |
| language_id | UUID | FK | Bahasa |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 16. Tabel Help Articles

Menyimpan artikel pada Pusat Bantuan.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | ID artikel |
| title | VARCHAR | NOT NULL | Judul bantuan |
| content | TEXT | NOT NULL | Isi bantuan |
| category | VARCHAR | NOT NULL | Kategori |
| created_by | UUID | FK | Admin pembuat |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui |

---

# 17. Aturan Persetujuan

Beberapa fitur MedStaff membutuhkan persetujuan admin.

## 17.1 Pengajuan Cuti

```text
STAFF
  ↓
Mengajukan Cuti
  ↓
PENDING
  ↓
ADMIN
  ├── APPROVE → Cuti disetujui
  │
  └── REJECT → Cuti ditolak
```

## 17.2 Perubahan Data/Berkas

```text
STAFF
  ↓
Mengajukan Perubahan
  ↓
PENDING
  ↓
ADMIN
  ├── APPROVE → Data diperbarui
  │
  └── REJECT → Perubahan ditolak
```

---

# 18. Role Pengguna

## STAFF

Staff dapat:

- Melihat dashboard
- Melakukan Clock In
- Melakukan Clock Out
- Melihat riwayat absensi
- Melihat daftar pegawai
- Melihat profil pegawai
- Mengajukan cuti
- Melihat status cuti
- Mengajukan perubahan data/berkas
- Melihat status pengajuan
- Melihat notifikasi
- Mengatur profil
- Mengubah password
- Mengatur PIN
- Mengatur bahasa
- Mengakses Pusat Bantuan

## ADMIN

Admin dapat:

- Melihat dashboard admin
- Melihat seluruh pegawai
- Melihat detail pegawai
- Mengelola data pegawai
- Melihat seluruh absensi
- Melihat riwayat absensi
- Mengelola pengajuan cuti
- Menyetujui cuti
- Menolak cuti
- Mengelola pengajuan perubahan data
- Menyetujui perubahan data
- Menolak perubahan data
- Mengelola pengumuman
- Mengirim notifikasi
- Mengelola Pusat Bantuan

---

# 19. Status Pengajuan

Semua pengajuan yang membutuhkan persetujuan menggunakan standar status:

```text
PENDING
APPROVED
REJECTED
```

Status digunakan minimal pada:

- Pengajuan cuti
- Pengajuan perubahan data
- Pengajuan perubahan berkas

---

# 20. Keamanan Database

Data sensitif tidak boleh disimpan dalam bentuk plaintext.

Password dan PIN harus disimpan dalam bentuk hash.

Data seperti:

- Password
- PIN
- Nomor identitas

harus mendapatkan perlindungan tambahan sesuai kebutuhan keamanan aplikasi.

---

# 21. Media dan File

Foto profil, foto selfie absensi, dan dokumen tidak disimpan sebagai binary langsung di tabel database.

Database menyimpan:

```text
URL / PATH FILE
```

Sedangkan file fisiknya disimpan pada media storage.

Contoh:

```text
profile_photo
    ↓
https://storage.example.com/profile/user-001.jpg
```

---

# 22. Catatan Implementasi

Database ini merupakan rancangan awal yang akan diterjemahkan ke dalam Prisma Schema.

Implementasi database dilakukan setelah:

1. ERD selesai.
2. Relasi antar tabel telah diverifikasi.
3. Struktur API ditentukan.
4. Prisma Schema dibuat.
5. Migration database dibuat.
6. Database PostgreSQL dikonfigurasi.

---

# 23. Teknologi Database

| Komponen | Teknologi |
|---|---|
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Backend | NestJS |
| Bahasa | TypeScript |
| Authentication | JWT |