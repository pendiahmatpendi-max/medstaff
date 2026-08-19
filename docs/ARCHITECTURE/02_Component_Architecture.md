# Component Architecture

## 1. Overview

MedStaff menggunakan modular architecture pada backend untuk memisahkan setiap fungsi sistem berdasarkan tanggung jawabnya.

Setiap module memiliki fungsi dan domain masing-masing sehingga sistem lebih mudah dikembangkan, diuji, dan dipelihara.

---

## 2. Backend Components

Backend MedStaff terdiri dari beberapa module utama:

```text
NestJS Backend
│
├── Auth
├── Employees
├── Attendance
├── Leave
├── Documents
├── Notifications
├── Announcements
├── Help Center
├── Language
├── Prisma
└── Common
```

---

## 3. Auth Module

Auth Module menangani proses authentication dan authorization.

Tanggung jawab:

* Login
* Register atau pembuatan akun oleh Admin
* JWT authentication
* Password hashing
* PIN management
* Token validation
* Role authorization
* Logout/session management

Role yang digunakan:

```text
STAFF
ADMIN
```

---

## 4. Employees Module

Employees Module menangani data karyawan.

Tanggung jawab:

* Data employee profile
* Employee ID
* Nama
* Nomor telepon
* Email
* Tempat dan tanggal lahir
* Gender
* Nomor identitas
* Alamat
* Perusahaan
* Jabatan
* Profile photo
* Emergency contact
* Education
* Experience

Module ini juga menyediakan data yang diperlukan untuk menampilkan daftar dan profil karyawan.

---

## 5. Attendance Module

Attendance Module menangani absensi karyawan.

Tanggung jawab:

* Clock In
* Clock Out
* Selfie attendance
* GPS location
* Waktu attendance
* Attendance status
* Riwayat attendance
* Monitoring attendance

Data utama:

```text
Clock In
├── Photo
├── Latitude
├── Longitude
└── Time

Clock Out
├── Photo
├── Latitude
├── Longitude
└── Time
```

---

## 6. Leave Module

Leave Module menangani pengajuan izin dan cuti.

Staff dapat:

* Membuat pengajuan
* Melihat pengajuan
* Melihat status pengajuan
* Melihat catatan Admin

Admin dapat:

* Melihat pengajuan
* Menyetujui pengajuan
* Menolak pengajuan
* Memberikan catatan

Status:

```text
PENDING
APPROVED
REJECTED
```

---

## 7. Documents Module

Documents Module menangani pengajuan perubahan data atau dokumen karyawan.

Staff dapat:

* Membuat request perubahan
* Menambahkan deskripsi
* Menambahkan attachment
* Melihat status request

Admin dapat:

* Melihat request
* Menyetujui request
* Menolak request
* Memberikan catatan

Status:

```text
PENDING
APPROVED
REJECTED
```

---

## 8. Notifications Module

Notifications Module menangani pemberitahuan kepada pengguna.

Jenis notification dapat berasal dari:

* Attendance
* Leave
* Document
* Announcement
* System

Fungsi:

* Membuat notification
* Menampilkan notification
* Menandai notification sebagai read
* Mengelola notification preference

---

## 9. Announcements Module

Announcements Module menangani informasi atau pengumuman dari Admin.

Admin dapat:

* Membuat announcement
* Mengubah announcement
* Menghapus announcement
* Mempublikasikan announcement

Staff dapat:

* Melihat announcement
* Membuka detail announcement

---

## 10. Help Center Module

Help Center menyediakan informasi bantuan bagi pengguna.

Fungsi:

* Menampilkan artikel bantuan
* Mengelompokkan artikel berdasarkan kategori
* Membuat artikel bantuan
* Mengubah artikel
* Menghapus artikel

Admin memiliki akses pengelolaan Help Center.

---

## 11. Language Module

Language Module menangani pengaturan bahasa aplikasi.

Fungsi:

* Menampilkan pilihan bahasa
* Menyimpan bahasa pengguna
* Mengambil bahasa pengguna
* Mengubah bahasa pengguna

Bahasa dapat dikembangkan sesuai kebutuhan aplikasi.

---

## 12. Prisma Module

Prisma Module menjadi penghubung antara NestJS dengan PostgreSQL.

Alur:

```text
Controller
    ↓
Service
    ↓
Prisma Service
    ↓
Prisma ORM
    ↓
PostgreSQL
```

Prisma bertanggung jawab terhadap operasi database.

---

## 13. Common Module

Common Module berisi komponen yang digunakan oleh beberapa module.

Contohnya:

* Guards
* Decorators
* DTO utilities
* Filters
* Interceptors
* Pipes
* Constants
* Shared utilities

Tujuannya adalah menghindari duplikasi kode.

---

## 14. Module Relationship

Hubungan antar module:

```text
                         ┌──────────┐
                         │   Auth   │
                         └────┬─────┘
                              │
                              ▼
┌────────────┐         ┌─────────────┐
│ Employees  │◄────────│   Common    │
└─────┬──────┘         └─────────────┘
      │
      ├──────────────┐
      ▼              ▼
┌────────────┐  ┌────────────┐
│ Attendance │  │    Leave   │
└─────┬──────┘  └─────┬──────┘
      │               │
      └───────┬───────┘
              ▼
       ┌──────────────┐
       │    Prisma    │
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │ PostgreSQL   │
       └──────────────┘

┌──────────────┐
│  Documents   │
└──────┬───────┘
       │
       ▼
    Prisma

┌──────────────┐
│Notifications │
└──────┬───────┘
       │
       ▼
    Prisma

┌──────────────┐
│Announcements │
└──────┬───────┘
       │
       ▼
    Prisma

┌──────────────┐
│ Help Center  │
└──────┬───────┘
       │
       ▼
    Prisma

┌──────────────┐
│  Language    │
└──────┬───────┘
       │
       ▼
    Prisma
```

---

## 15. Mobile Component Architecture

Mobile application menggunakan pembagian berdasarkan fitur.

```text
mobile/
│
├── app/
├── components/
├── constants/
├── hooks/
├── services/
├── stores/
├── types/
└── utils/
```

Feature utama:

```text
Authentication
Dashboard
Attendance
Employees
Leave
Documents
Notifications
Announcements
Help Center
Settings
```

---

## 16. Admin and Staff Access

### Staff

```text
Auth
 ↓
Dashboard
 ├── Attendance
 ├── Profile
 ├── Employees
 ├── Leave
 ├── Documents
 ├── Notifications
 ├── Announcements
 ├── Help Center
 └── Settings
```

### Admin

```text
Auth
 ↓
Admin Dashboard
 ├── Employees
 ├── Attendance
 ├── Leave Management
 ├── Document Requests
 ├── Announcements
 ├── Notifications
 ├── Help Center
 └── Settings
```

---

## 17. Component Design Principles

Component architecture MedStaff mengikuti prinsip:

1. Single Responsibility
2. Separation of Concerns
3. Modular Design
4. Reusable Components
5. Clear Module Boundaries
6. Role-Based Access
7. Maintainable Code
8. Scalable Architecture

---

## 18. Summary

Component architecture memisahkan sistem MedStaff berdasarkan domain dan tanggung jawab.

Backend menggunakan NestJS modules, sedangkan mobile application menggunakan feature-based structure.

Setiap module berkomunikasi melalui service dan repository/database layer yang sesuai.

Struktur ini memungkinkan pengembangan fitur dilakukan secara bertahap tanpa mengganggu module lainnya.
