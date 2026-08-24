# MedStaff API Design

## 1. Overview

API MedStaff digunakan sebagai penghubung antara mobile application, admin system, dan backend server.

Backend menggunakan:

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

Base URL:

```text
/api

2. Authentication API
Login
POST /api/auth/login

Digunakan untuk login staff atau admin.

Request:

{
  "email": "staff@example.com",
  "password": "password"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "email": "staff@example.com",
      "role": "STAFF"
    }
  }
}
Change Password
POST /api/auth/change-password
Change PIN
POST /api/auth/change-pin
3. Profile API
Get My Profile
GET /api/profile
Update Profile
PATCH /api/profile
Get Employee Profile
GET /api/employees/:employeeId

Informasi yang dapat ditampilkan:

Nama
Foto profil
Jabatan
Employee ID
4. Attendance API

Attendance merupakan fitur utama MedStaff.

Clock In
POST /api/attendance/clock-in

Request:

multipart/form-data

Data:

photo
latitude
longitude

Backend akan mencatat:

clockIn
clockInPhoto
clockInLatitude
clockInLongitude
attendanceDate

Waktu Clock In menggunakan waktu dari server.

Clock Out
POST /api/attendance/clock-out

Request:

multipart/form-data

Data:

photo
latitude
longitude

Backend akan mencatat:

clockOut
clockOutPhoto
clockOutLatitude
clockOutLongitude

Waktu Clock Out menggunakan waktu dari server.

Today's Attendance
GET /api/attendance/today

Digunakan untuk mengetahui status attendance hari ini.

Contoh response:

{
  "success": true,
  "data": {
    "attendanceDate": "2026-08-19",
    "clockIn": "2026-08-19T07:30:00Z",
    "clockOut": null,
    "status": "HADIR"
  }
}
Attendance History
GET /api/attendance/history

Digunakan untuk melihat riwayat attendance.

Query:

?page=1
&limit=20
&startDate=2026-08-01
&endDate=2026-08-31
5. Leave Request API
Create Leave Request
POST /api/leave-requests

Data:

leaveType
startDate
endDate
reason
attachment
Get My Leave Requests
GET /api/leave-requests
Get Leave Request Detail
GET /api/leave-requests/:id
6. Document Change Request API

Digunakan ketika staff ingin mengubah data pribadi yang membutuhkan persetujuan admin.

Create Request
POST /api/document-requests

Data:

requestType
description
oldData
newData
attachment
Get My Requests
GET /api/document-requests
Get Request Detail
GET /api/document-requests/:id
7. Education API
Get Education
GET /api/profile/educations
Add Education
POST /api/profile/educations
Update Education
PATCH /api/profile/educations/:id
Delete Education
DELETE /api/profile/educations/:id
8. Experience API
Get Experience
GET /api/profile/experiences
Add Experience
POST /api/profile/experiences
Update Experience
PATCH /api/profile/experiences/:id
Delete Experience
DELETE /api/profile/experiences/:id
9. Emergency Contact API
Get Emergency Contact
GET /api/profile/emergency-contacts
Add Emergency Contact
POST /api/profile/emergency-contacts
Update Emergency Contact
PATCH /api/profile/emergency-contacts/:id
Delete Emergency Contact
DELETE /api/profile/emergency-contacts/:id
10. Announcement API
Get Announcements
GET /api/announcements
Get Announcement Detail
GET /api/announcements/:id

Admin:

POST /api/announcements
PATCH /api/announcements/:id
DELETE /api/announcements/:id
11. Notification API
Get Notifications
GET /api/notifications
Mark Notification as Read
PATCH /api/notifications/:id/read
Mark All as Read
PATCH /api/notifications/read-all
12. Notification Preference API
Get Preferences
GET /api/notification-preferences
Update Preferences
PATCH /api/notification-preferences
13. Language API
Get Available Languages
GET /api/languages
Get My Language
GET /api/profile/language
Change Language
PATCH /api/profile/language
14. Help Center API
Get Help Articles
GET /api/help
Get Help Article Detail
GET /api/help/:id

Admin:

POST /api/help
PATCH /api/help/:id
DELETE /api/help/:id
15. Admin Attendance API

Admin dapat melihat attendance seluruh employee.

Get Attendance List
GET /api/admin/attendance

Query:

?page=1
&limit=20
&employeeId=uuid
&date=2026-08-19
&status=HADIR
Get Attendance Detail
GET /api/admin/attendance/:id
16. Admin Employee API
Get Employees
GET /api/admin/employees
Get Employee Detail
GET /api/admin/employees/:id
Activate Employee
PATCH /api/admin/employees/:id/activate
Deactivate Employee
PATCH /api/admin/employees/:id/deactivate
17. Admin Leave Request API
Get All Leave Requests
GET /api/admin/leave-requests
Approve Leave
PATCH /api/admin/leave-requests/:id/approve
Reject Leave
PATCH /api/admin/leave-requests/:id/reject
18. Admin Document Request API
Get All Requests
GET /api/admin/document-requests
Approve Request
PATCH /api/admin/document-requests/:id/approve
Reject Request
PATCH /api/admin/document-requests/:id/reject
19. Authentication Requirement

Endpoint yang membutuhkan login menggunakan:

Authorization: Bearer <JWT_TOKEN>

Public endpoint hanya endpoint yang memang diperlukan sebelum login.

20. Role Authorization
STAFF

Staff dapat:

Login
Melihat profile
Mengubah profile melalui request
Clock In
Clock Out
Melihat attendance sendiri
Mengajukan izin
Melihat pengumuman
Melihat notifikasi
Mengakses Help Center
ADMIN

Admin dapat:

Mengelola employee
Melihat attendance employee
Mengelola leave request
Mengelola document change request
Mengelola announcement
Mengelola Help Center
Mengelola data sistem sesuai permission
21. Attendance Security

Attendance harus memenuhi ketentuan:

Staff harus login.
Clock In menggunakan selfie.
Clock Out menggunakan selfie.
GPS harus aktif.
Latitude dan longitude harus dikirim.
Waktu attendance ditentukan oleh server.
Clock Out tidak dapat dilakukan sebelum Clock In.
Satu employee hanya memiliki satu attendance per tanggal.
Data lokasi Clock In dan Clock Out disimpan secara terpisah.
Foto attendance disimpan sebagai file dan database menyimpan referensinya.
22. Standard Response

Success:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Operation failed",
  "error": {
    "code": "ERROR_CODE"
  }
}
23. API Development Principle

API MedStaff dikembangkan dengan prinsip:

RESTful API
Consistent response
Authentication
Authorization
Input validation
Error handling
Database integrity
Secure file handling
Server-side timestamp
GPS location tracking


### Setelah selesai


Simpan:


```text
Ctrl + S