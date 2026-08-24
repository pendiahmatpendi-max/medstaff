# Backend Layer Architecture

## 1. Overview

Backend MedStaff menggunakan NestJS dengan pendekatan modular dan layered architecture.

Setiap request dari mobile application melewati beberapa layer sebelum berinteraksi dengan database.

## 2. Request Flow

```text
Mobile App
    ↓
Controller
    ↓
Guard / Validation
    ↓
Service
    ↓
Prisma Service
    ↓
PostgreSQL

Response:

PostgreSQL
    ↓
Prisma Service
    ↓
Service
    ↓
Controller
    ↓
Mobile App

3. Controller Layer

Controller bertanggung jawab menerima HTTP request dan mengembalikan HTTP response.

Controller tidak menangani business logic utama.

Contoh endpoint:

POST /auth/login
GET /employees/profile
POST /attendance/clock-in
POST /attendance/clock-out
GET /attendance/history

4. Guard Layer

Guard digunakan untuk mengontrol akses request.

Fungsi utama:

Authentication
JWT validation
Role authorization

Role:

STAFF
ADMIN

5. Validation Layer

Semua input dari mobile application harus divalidasi sebelum diproses.

Contoh data attendance:

Clock In / Clock Out
├── selfie/photo
├── latitude
├── longitude
└── timestamp

Validasi meliputi:

Required fields
Data type
Format
Range latitude
Range longitude
File/photo validation

6. Service Layer

Service menangani business logic aplikasi.

Contoh AttendanceService:

Clock In
Clock In
 ↓
Validasi employee
 ↓
Cek attendance hari ini
 ↓
Validasi lokasi
 ↓
Simpan foto
 ↓
Simpan waktu
 ↓
Simpan latitude
 ↓
Simpan longitude
 ↓
Update attendance
Clock Out
Clock Out
 ↓
Cari attendance hari ini
 ↓
Pastikan Clock In sudah dilakukan
 ↓
Validasi lokasi
 ↓
Simpan foto
 ↓
Simpan waktu
 ↓
Simpan latitude
 ↓
Simpan longitude
 ↓
Update attendance

7. Prisma Layer

Prisma Service menjadi akses database utama.

Service
   ↓
PrismaService
   ↓
Prisma Client
   ↓
PostgreSQL

Service tidak melakukan koneksi database secara langsung.

8. Database Layer

Database menggunakan PostgreSQL.

Model utama:

User
EmployeeProfile
EmergencyContact
Education
Experience
Attendance
LeaveRequest
DocumentChangeRequest
Announcement
Notification
NotificationPreference
Language
UserLanguage
HelpArticle
9. Attendance Data

Attendance wajib menyimpan data Clock In dan Clock Out secara terpisah.

Attendance
│
├── attendanceDate
│
├── Clock In
│   ├── clockIn
│   ├── clockInPhoto
│   ├── clockInLatitude
│   └── clockInLongitude
│
└── Clock Out
    ├── clockOut
    ├── clockOutPhoto
    ├── clockOutLatitude
    └── clockOutLongitude

Lokasi Clock In dan Clock Out disimpan secara terpisah sehingga data lokasi tidak saling menimpa.

10. Attendance Request Flow
Clock In
Mobile
  ↓
Camera
  ↓
Selfie
  ↓
GPS
  ↓
POST /attendance/clock-in
  ↓
AttendanceController
  ↓
AttendanceService
  ↓
PrismaService
  ↓
PostgreSQL

Data yang dikirim dari mobile:

photo
latitude
longitude

Waktu Clock In dicatat oleh backend.

Clock Out
Mobile
  ↓
Camera
  ↓
Selfie
  ↓
GPS
  ↓
POST /attendance/clock-out
  ↓
AttendanceController
  ↓
AttendanceService
  ↓
PrismaService
  ↓
PostgreSQL

Data yang dikirim dari mobile:

photo
latitude
longitude

Waktu Clock Out dicatat oleh backend.

11. File Storage

Foto attendance tidak disimpan sebagai binary langsung di tabel database.

Database menyimpan referensi atau path foto:

clockInPhoto
clockOutPhoto

File foto dapat disimpan pada storage yang ditentukan pada tahap implementation.

12. Error Handling

Backend harus memberikan response yang konsisten.

Success:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Operation failed"
}
13. Security Principles

Backend harus menerapkan:

Password hashing
PIN hashing
JWT authentication
Role-based authorization
Input validation
File validation
Database constraints
Environment variables
Secure error handling
14. Architecture Principles

Backend mengikuti prinsip:

Separation of Concerns
Single Responsibility
Modular Architecture
Layered Architecture
Secure by Default
Validation Before Processing
Database Integrity
Scalable Design
15. Summary

Backend MedStaff menggunakan NestJS modular architecture dengan layered architecture.

Alur utama:

Mobile
 ↓
Controller
 ↓
Guard / Validation
 ↓
Service
 ↓
Prisma
 ↓
PostgreSQL

Architecture ini menjadi dasar implementasi backend MedStaff.



### 4. Simpan


Tekan:


```text
Ctrl + S