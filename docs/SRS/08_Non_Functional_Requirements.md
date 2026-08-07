# Non Functional Requirements

## Kebutuhan Non Fungsional

Selain memenuhi kebutuhan fungsional, aplikasi MedStaff harus memenuhi kebutuhan non-fungsional berikut.

---

## NFR-001 Performance

- Waktu login maksimal 3 detik pada koneksi internet yang stabil.
- Proses Clock In dan Clock Out maksimal 5 detik setelah foto dan lokasi berhasil diperoleh.
- Dashboard dapat dimuat dalam waktu maksimal 3 detik.

---

## NFR-002 Security

- Password pengguna harus disimpan dalam bentuk terenkripsi (hashed).
- Seluruh komunikasi antara aplikasi dan server menggunakan protokol HTTPS.
- Autentikasi menggunakan JSON Web Token (JWT).
- Pengguna hanya dapat mengakses data sesuai hak aksesnya.

---

## NFR-003 Reliability

- Sistem harus mampu menyimpan data absensi tanpa kehilangan data.
- Data pengguna harus tetap tersedia meskipun aplikasi ditutup dan dibuka kembali.
- Sistem harus menangani kesalahan jaringan dengan memberikan informasi yang jelas kepada pengguna.

---

## NFR-004 Availability

- Backend dapat diakses selama 24 jam.
- Sistem tetap dapat digunakan selama server dalam kondisi normal.

---

## NFR-005 Usability

- Antarmuka aplikasi harus mudah dipahami oleh seluruh karyawan.
- Navigasi harus sederhana dan konsisten.
- Informasi penting mudah ditemukan oleh pengguna.

---

## NFR-006 Compatibility

- Aplikasi berjalan pada perangkat Android minimal versi 10 (API Level 29).
- Backend dapat diakses melalui jaringan internet.

---

## NFR-007 Scalability

- Sistem dirancang agar mudah dikembangkan dengan penambahan fitur baru di masa mendatang.
- Struktur database mendukung pertambahan jumlah pengguna.

---

## NFR-008 Maintainability

- Struktur kode mengikuti standar pengembangan yang telah ditentukan.
- Dokumentasi sistem selalu diperbarui ketika terdapat perubahan.

---

## NFR-009 Backup

- Database dapat dicadangkan (backup) secara berkala.
- Data penting dapat dipulihkan apabila terjadi kegagalan sistem.