# Minimum Viable Product (MVP) Definition
## SIPMA — Sistem Informasi Poin Keaktifan Mahasiswa PNC

---

## 1. Objective MVP
Tujuan dari rilis MVP ini adalah untuk menyediakan **Core Functional Product** yang siap diuji dan dipresentasikan pada tugas praktikum MPPL & Pemrograman Web, dengan fokus pada penyelesaian masalah utama transparansi poin dan efisiensi pengajuan dokumen.

---

## 2. Core MVP Features (In-Scope Deliverables)

### 1. Module Dashboard & Progress Tracker (`dashboard.html` & `js/dashboard.js`)
* Ringkasan statistik total poin disetujui dan poin diproses.
* *Progress bar* visual pencapaian target poin kelulusan (SKPI).
* Tabel riwayat pengajuan kegiatan interaktif berbasis DOM.

### 2. Module Smart Input Wizard (`pengajuan.html` & `js/pengajuan.js`)
* Form pengajuan kegiatan dengan kategori, tingkat, dan tanggal.
* Area unggah file sertifikat digital (PDF/JPG/PNG).
* Kalkulasi estimasi poin otomatis secara *real-time* saat kategori dipilih.
* Validasi input formulir di sisi klien (*client-side validation*).

### 3. Module Authentication & Access Control (`login.html`)
* Antarmuka *login* terpisah untuk memisahkan peranan pengguna (*Role-Based Access Control* sederhana).

### 4. Module FAQ & Static Guidance (`chatbot.html`)
* Antarmuka penyedia panduan regulasi poin dan kriteria validitas sertifikat sebagai pengganti buku pedoman cetak.

---

## 3. Out-of-Scope Features (Post-MVP / Deferred)
Fitur-fitur berikut dieksklusi dari rilis MVP berdasarkan pertimbangan keterbatasan SDM dan jadwal semester:
* Engine AI Chatbot RAG berbasis LLM (Dialihkan ke Halaman FAQ Statis).
* Integrasi basis data otomatis dua arah dengan SIAKAD PNC Pusat.
* Aplikasi Mobile Native (Android/iOS).
* Pengesahan TTD Digital Resmi Wadir III / Direktur.

---

## 4. MVP Acceptance Criteria
* [x] Mahasiswa dapat mengakses Dasbor dan melihat progres persentase poin secara visual.
* [x] Form pengajuan dapat menghitung estimasi poin secara otomatis tanpa error JavaScript di *Console*.
* [x] Fitur hapus/batal pada tabel riwayat dapat memperbarui struktur DOM secara dinamis.
* [x] Seluruh kode JavaScript terpisah bersih di dalam folder `js/` dan bebas dari *inline event handler*.
