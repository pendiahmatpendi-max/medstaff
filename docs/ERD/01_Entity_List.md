# Entity List

## 1. Overview

Dokumen ini berisi daftar entity yang digunakan dalam sistem MedStaff.

Entity ditentukan berdasarkan kebutuhan sistem, SRS, User Flow, Wireframe, serta kebutuhan Staff/Pegawai dan Admin.

Daftar entity ini menjadi dasar untuk pembuatan ERD, database schema, dan Prisma schema.

---

## 2. User

Menyimpan data akun yang digunakan untuk login ke sistem.

### Data utama

- User ID
- Email
- Password
- Role
- Status akun
- Created At
- Updated At

### Role

- Staff
- Admin

---

## 3. Employee

Menyimpan data pegawai.

### Data utama

- Employee ID
- User ID
- Employee Number
- Full Name
- Profile Photo
- Phone Number
- Email
- Birth Place
- Birth Date
- Gender
- Identity Number
- Address
- Company
- Position
- Created At
- Updated At

---

## 4. Emergency Contact

Menyimpan data kontak darurat pegawai.

### Data utama

- Emergency Contact ID
- Employee ID
- Name
- Relationship
- Phone Number
- Created At
- Updated At

---

## 5. Education

Menyimpan riwayat pendidikan pegawai.

### Data utama

- Education ID
- Employee ID
- Institution
- Degree
- Field of Study
- Start Year
- End Year
- Created At
- Updated At

---

## 6. Experience

Menyimpan riwayat pengalaman kerja pegawai.

### Data utama

- Experience ID
- Employee ID
- Company
- Position
- Start Date
- End Date
- Description
- Created At
- Updated At

---

## 7. Attendance

Menyimpan data absensi pegawai.

### Data utama

- Attendance ID
- Employee ID
- Attendance Type
- Attendance Date
- Attendance Time
- Latitude
- Longitude
- Location Address
- Status
- Created At
- Updated At

### Attendance Type

- Clock In
- Clock Out

---

## 8. Attendance Photo

Menyimpan informasi foto selfie yang digunakan untuk absensi.

### Data utama

- Attendance Photo ID
- Attendance ID
- File URL
- File Name
- Created At

Satu data Attendance dapat memiliki data foto absensi.

---

## 9. Leave Request

Menyimpan pengajuan cuti pegawai.

### Data utama

- Leave Request ID
- Employee ID
- Leave Type
- Start Date
- End Date
- Reason
- Attachment
- Status
- Created At
- Updated At

### Status

- Pending
- Approved
- Rejected

---

## 10. Permission Request

Menyimpan pengajuan izin pegawai.

### Data utama

- Permission Request ID
- Employee ID
- Permission Type
- Date
- Reason
- Attachment
- Status
- Created At
- Updated At

### Status

- Pending
- Approved
- Rejected

---

## 11. Profile Change Request

Menyimpan pengajuan perubahan data profil pegawai.

### Data utama

- Profile Change Request ID
- Employee ID
- Change Type
- Old Value
- New Value
- Reason
- Status
- Created At
- Updated At

### Status

- Pending
- Approved
- Rejected

---

## 12. Document

Menyimpan data dokumen pegawai.

### Data utama

- Document ID
- Employee ID
- Document Type
- Document Number
- File URL
- File Name
- Status
- Created At
- Updated At

---

## 13. Document Change Request

Menyimpan pengajuan perubahan atau pembaruan dokumen pegawai.

### Data utama

- Document Change Request ID
- Employee ID
- Document ID
- Request Type
- File URL
- Reason
- Status
- Created At
- Updated At

### Status

- Pending
- Approved
- Rejected

---

## 14. Approval

Menyimpan proses persetujuan pengajuan oleh Admin.

Approval digunakan untuk pengajuan:

- Cuti
- Izin
- Perubahan profil
- Perubahan dokumen

### Data utama

- Approval ID
- Admin User ID
- Request Type
- Request ID
- Action
- Note
- Created At

### Action

- Approved
- Rejected

---

## 15. Notification

Menyimpan notifikasi untuk pengguna.

### Data utama

- Notification ID
- User ID
- Title
- Message
- Notification Type
- Is Read
- Created At

### Notification Type

- Attendance
- Leave
- Permission
- Profile Change
- Document Change
- Announcement
- System

---

## 16. Announcement

Menyimpan pengumuman yang dibuat oleh Admin.

### Data utama

- Announcement ID
- Admin User ID
- Title
- Content
- Image URL
- Published At
- Status
- Created At
- Updated At

---

## 17. Relationship Summary

Hubungan utama antar entity:

```text
User
 │
 └── Employee
       │
       ├── Emergency Contact
       ├── Education
       ├── Experience
       ├── Attendance
       │     └── Attendance Photo
       │
       ├── Leave Request
       │
       ├── Permission Request
       │
       ├── Profile Change Request
       │
       └── Document
              │
              └── Document Change Request

User
 │
 └── Notification

User (Admin)
 │
 ├── Approval
 └── Announcement