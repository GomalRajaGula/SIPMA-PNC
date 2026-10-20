# Design Specification Document (DESIGN)
## SIPMA — Sistem Informasi Poin Keaktifan Mahasiswa PNC

---

## 1. Design Principles & Guidelines
SIPMA mengusung prinsip antarmuka **Modern, Clean, Accessible, and Responsive** dengan dominasi warna biru institusional yang memberikan kesan profesional dan tepercaya.

### Color Palette (Tailwind CSS Base)
* **Primary (Brand):** `bg-blue-600` (`#2563EB`) & `text-blue-900`
* **Background Canvas:** `bg-gray-50` (`#F9FAFB`)
* **Card & Panel:** `bg-white` (`#FFFFFF`) dengan border `border-gray-200`
* **Status Badges:**
  * Disetujui: `bg-green-100 text-green-700`
  * Menunggu: `bg-yellow-100 text-yellow-700`
  * Ditolak: `bg-red-100 text-red-700`

---

## 2. Information Architecture (IA) & Directory Structure
Struktur proyek menerapkan *Separation of Concerns* (pemisahan file HTML dan JavaScript modular):

```text
SIPMA-PNC/
├── css/                  # (Opsional) Custom Styling tambahan
├── js/                   # Scripts logika DOM & Event Handling
│   ├── dashboard.js      # Interaksi Dasbor & Event Delegation Tabel
│   └── pengajuan.js      # Smart Input Wizard & Validasi Form
├── index.html            # Landing Page / Portal Informasi
├── login.html            # Halaman Autentikasi Pengguna
├── dashboard.html        # Dasbor Progres & Riwayat Mahasiswa
├── pengajuan.html        # Form Smart Input & Upload Sertifikat
├── chatbot.html          # Halaman FAQ / Asisten Informasi (Simulasi UI)
└── README.md
```

---

## 3. UI/UX Layout Specifications

### A. Dashboard Page (`dashboard.html`)
* **Sidebar Navigasi:** Akses cepat ke Dashboard, Pengajuan Poin, Chatbot AI, dan Tombol Keluar.
* **Metric Cards:** Menampilkan 3 kartu ringkasan: Total Poin Disetujui, Poin Menunggu Validasi, dan Progress Bar Persentase Syarat D4 (Target 36 Poin).
* **Riwayat Table:** Menampilkan daftar kegiatan yang pernah diajukan dilengkapi aksi penanganan dinamis (Delete/Cancel via DOM Event Delegation).

### B. Form Pengajuan Poin (`pengajuan.html`)
* **Grid Layout 2 Kolom:**
  * **Kolom Kiri (Main Form):** Input Nama Kegiatan, Dropdown Kategori & Tingkat, Peran, Tanggal Pelaksanaan, serta Box Upload File bergaya Drag-and-Drop.
  * **Kolom Kanan (Informasi Panel):** Card Panduan Validasi BAAK dan Banner Promosi Pintasan ke Chatbot AI.
* **Smart Input Interaction:** Perubahan dropdown kategori secara otomatis memperbarui label estimasi poin tanpa reload halaman.

---

## 4. Technical Frontend Interactivity (DOM & Events)
* **Event Delegation:** Diterapkan pada tabel riwayat `dashboard.html` untuk menangani tombol aksi hapus secara efisien menggunakan `e.target.closest('tr')`.
* **Form Validation:** Validasi real-time pada `pengajuan.html` menggunakan JavaScript untuk memeriksa kelengkapan nama kegiatan, kategori, dan file sebelum diproses.
* **DOM Manipulation:** Mengubah isi teks (`innerHTML`), kelas Tailwind (`classList.add/remove`), serta menghapus node HTML secara dinamis.
