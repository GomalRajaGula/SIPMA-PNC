# SIPMA — Sistem Informasi Poin Keaktifan Mahasiswa PNC

Aplikasi web **HTML + CSS + JavaScript murni** (tanpa backend) untuk mendigitalisasi pengajuan, pencatatan, kalkulasi otomatis, dan validasi poin keaktifan mahasiswa Politeknik Negeri Cilacap sebagai syarat pendamping ijazah (SKPI).

## Menjalankan

Tidak perlu build tool apa pun. Jalankan server statis dari folder proyek:

    python3 -m http.server 8000

Lalu buka http://localhost:8000 di browser modern.

## Akun Demo

| Role       | Username     | Password | Dashboard            |
|------------|--------------|----------|----------------------|
| Mahasiswa  | 250215033    | mhs123   | dashboard.html       |
| Mahasiswa  | 250215001    | mhs123   | dashboard.html       |
| Dosen Wali | 197001011995 | dosen123 | dosen_dashboard.html |
| Staf BAAK  | 198505152010 | baak123  | baak_dashboard.html  |

## Fitur Utama

- Dasbor progres poin + Early Warning System (sisa poin & kegiatan wajib).
- Smart Input Wizard: estimasi poin otomatis mengikuti versi aturan bobot per angkatan (rule versioning).
- Pengajuan & riwayat tersimpan di localStorage — tersambung antar halaman (dashboard mahasiswa, antrean BAAK, rekap dosen).
- Validation Board BAAK: preview dokumen sertifikat, setujui / tolak dengan catatan (catatan wajib saat menolak).
- Dashboard Dosen Wali: rekap perwalian, pencarian & filter SKPI, detail poin, cetak rekapitulasi PDF.
- Halaman Katalog Poin: tabel bobot poin per kategori & tingkat + pemilih versi aturan.
- Chatbot AI (FAQ statis) seputar regulasi poin.
- RBAC sederhana 3 role dengan auth guard + sidebar dinamis per role.

## Struktur Singkat

- index.html — landing page
- login.html — autentikasi (dropdown role)
- dashboard.html, pengajuan.html, chatbot.html, katalog.html — area mahasiswa (chatbot & katalog untuk semua role)
- dosen_dashboard.html, baak_dashboard.html — area Dosen Wali & Staf BAAK
- js/auth.js — autentikasi + permission guard + sidebar dinamis
- js/data.js — lapisan data bersama (localStorage) + aturan poin ber-versi
- js/ui.js — toast, modal, formatter bersama
- js/*.js lainnya — logika per halaman
- css/styles.css — styling tambahan + aturan cetak

## Reset Data Demo

Data tersimpan di localStorage browser pada key `sipma_pengajuan`. Bersihkan storage situs untuk kembali ke data demo awal.
