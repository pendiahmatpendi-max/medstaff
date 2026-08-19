# System Architecture

## 1. Overview

MedStaff adalah aplikasi mobile untuk membantu pengelolaan kepegawaian dan aktivitas staf Klinik Pratama Unimus.

Sistem terdiri dari aplikasi mobile untuk pengguna, backend sebagai penyedia REST API, serta PostgreSQL sebagai database utama.

Arsitektur sistem dirancang menggunakan pendekatan client-server dengan pemisahan antara frontend mobile, backend, dan database.

---

## 2. Technology Stack

### Mobile Application

* React Native
* Expo
* TypeScript

### Backend

* NestJS
* TypeScript
* REST API
* JWT Authentication

### Database

* PostgreSQL

### ORM

* Prisma

### Version Control

* Git
* GitHub

---

## 3. System Components

### 3.1 Mobile Application

Mobile application digunakan oleh Staff dan Admin untuk mengakses fitur MedStaff melalui perangkat Android.

Fungsi utama:

* Login
* Dashboard
* Attendance
* Employee Profile
* Employee List
* Leave
* Documents
* Notifications
* Announcements
* Help Center
* Language
* Settings

---

### 3.2 Backend API

Backend dibangun menggunakan NestJS dan berfungsi sebagai pusat pemrosesan data aplikasi.

Backend bertanggung jawab terhadap:

* Authentication
* Authorization
* Employee Management
* Attendance Management
* Leave Management
* Document Management
* Notification Management
* Announcement Management
* Help Center
* Language Management
* Database Access

---

### 3.3 Authentication

Sistem menggunakan JWT untuk melakukan authentication.

Alur authentication:

```text
Mobile App
    ↓
Login
    ↓
NestJS Auth API
    ↓
Validasi User
    ↓
JWT Token
    ↓
Mobile App
```

Token digunakan oleh mobile application ketika mengakses endpoint yang membutuhkan authentication.

---

### 3.4 Database

PostgreSQL digunakan sebagai database utama MedStaff.

Database menyimpan:

* User
* Employee Profile
* Emergency Contact
* Education
* Experience
* Attendance
* Leave Request
* Document Change Request
* Announcement
* Notification
* Notification Preference
* Language
* User Language
* Help Article

---

### 3.5 Prisma ORM

Prisma digunakan sebagai ORM untuk menghubungkan NestJS dengan PostgreSQL.

Alur akses database:

```text
Mobile App
    ↓
REST API
    ↓
NestJS Service
    ↓
Prisma
    ↓
PostgreSQL
```

---

## 4. User Roles

MedStaff memiliki dua role utama:

### Staff

Staff dapat:

* Melakukan login
* Melihat dashboard
* Melakukan Clock In
* Melakukan Clock Out
* Mengirim foto selfie untuk attendance
* Menggunakan lokasi GPS saat attendance
* Melihat profil sendiri
* Melihat profil staf lain
* Mengajukan izin/cuti
* Mengajukan perubahan data/dokumen
* Melihat notifikasi
* Melihat pengumuman
* Mengakses Help Center
* Mengatur bahasa
* Mengubah password dan PIN

### Admin

Admin memiliki akses pengelolaan sistem yang lebih luas.

Admin dapat:

* Mengelola data staff
* Melihat data attendance
* Mengelola pengajuan izin/cuti
* Memproses perubahan data/dokumen
* Mengelola announcement
* Mengelola notification
* Mengelola Help Center
* Mengelola data pendukung sistem

---

## 5. Main System Flow

Alur utama sistem:

```text
User
  ↓
Mobile Application
  ↓
Authentication
  ↓
JWT Token
  ↓
REST API
  ↓
NestJS
  ↓
Business Logic
  ↓
Prisma ORM
  ↓
PostgreSQL
```

Response dari database diproses oleh backend kemudian dikirim kembali ke mobile application.

```text
PostgreSQL
    ↓
Prisma
    ↓
NestJS
    ↓
REST API
    ↓
Mobile Application
    ↓
User
```

---

## 6. Attendance Architecture

Attendance merupakan salah satu fitur utama MedStaff.

Saat Staff melakukan Clock In atau Clock Out, aplikasi mengambil:

* Foto selfie
* Waktu attendance
* Latitude
* Longitude
* Status attendance

Alurnya:

```text
Staff
  ↓
Attendance Screen
  ↓
Camera
  ↓
Selfie
  ↓
GPS Location
  ↓
Current Time
  ↓
Attendance API
  ↓
NestJS
  ↓
Prisma
  ↓
PostgreSQL
```

Data attendance kemudian dapat digunakan untuk kebutuhan monitoring oleh Admin.

---

## 7. Security Architecture

Keamanan sistem menggunakan beberapa mekanisme:

* JWT Authentication
* Password hashing
* PIN hashing
* Role-based authorization
* Protected API endpoints
* Environment variables untuk konfigurasi sensitif
* Validasi request pada backend

Password dan PIN tidak disimpan dalam bentuk plaintext.

---

## 8. Project Architecture

Struktur utama project:

```text
medstaff/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── documents/
│   │   ├── notifications/
│   │   ├── announcements/
│   │   ├── help/
│   │   ├── language/
│   │   ├── common/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── .env
│
├── mobile/
│
└── docs/
    └── ARCHITECTURE/
```

---

## 9. Communication Architecture

Mobile application berkomunikasi dengan backend melalui REST API.

```text
React Native
     │
     │ HTTP/HTTPS
     ▼
NestJS REST API
     │
     │ Prisma
     ▼
PostgreSQL
```

Pada tahap development, backend dijalankan pada environment lokal.

Pada tahap deployment, komunikasi akan menggunakan HTTPS.

---

## 10. Architecture Principles

MedStaff menggunakan prinsip:

1. Separation of Concerns
2. Modular Backend Architecture
3. RESTful API
4. Secure Authentication
5. Role-Based Authorization
6. Centralized Database Management
7. Maintainable Project Structure
8. Scalable Architecture

---

## 11. Architecture Summary

Arsitektur MedStaff memisahkan aplikasi menjadi tiga bagian utama:

```text
┌──────────────────────────────┐
│        Mobile Application    │
│    React Native + Expo       │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│        Backend API           │
│       NestJS + TypeScript    │
│                              │
│ Auth | Employees | Attendance│
│ Leave | Documents | etc.     │
└──────────────┬───────────────┘
               │
               │ Prisma ORM
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
└──────────────────────────────┘
```

Arsitektur ini menjadi dasar untuk tahap Database Design dan Backend/API Development berikutnya.
