# Product Requirement Document (PRD)
## SIPMA — Sistem Informasi Poin Keaktifan Mahasiswa PNC

| Property | Details |
| :--- | :--- |
| **Project Name** | Rancang Bangun Sistem Informasi Poin Keaktifan Mahasiswa (SIPMA) |
| **Institution** | Politeknik Negeri Cilacap (PNC) |
| **Project Manager**| Achmal Maulana |
| **Target Release** | Semester Ganjil 2026/2027 |
| **Status** | Baseline Confirmed (Practical 5 Baseline) |

---

## 1. Executive Summary
SIPMA adalah aplikasi berbasis *Web Application* terpusat yang dirancang untuk mendigitalisasi proses pengajuan, pencatatan, kalkulasi otomatis, dan validasi poin keaktifan mahasiswa sebagai syarat pendamping ijazah (SKPI) di Politeknik Negeri Cilacap. Sistem ini menyelesaikan masalah krisis transparansi poin di tingkat mahasiswa serta memotong antrean verifikasi manual di BAAK.

---

## 2. Problem Statement & User Pain Points
1. **Mahasiswa:**
   * Tidak mengetahui akumulasi poin keaktifan secara *real-time* (61% mahasiswa panik di akhir masa studi).
   * Takut berkas fisik sertifikat/SK hilang sebelum masa pendaftaran yudisium.
   * Bingung menghitung estimasi poin karena aturan pedoman poin yang rumit.
2. **Staf BAAK:**
   * Kewalahan menghadapi penumpukan berkas pengajuan fisik/digital di akhir semester.
   * Proses verifikasi lambat karena harus mengunduh file sertifikat satu per satu secara manual.
3. **Pihak Kampus / Admin:**
   * Risiko timbulnya masalah integritas data historis saat ada pembaruan aturan bobot poin kegiatan antar angkatan.

---

## 3. Goals & Success Metrics (OKRs)
* **Peningkatan Transparansi:** 100% mahasiswa dapat memantau akumulasi poin & persentase kelayakan SKPI kapan saja melalui Dasbor Visual.
* **Percepatan Validasi (SLA BAAK):** Memangkas waktu verifikasi BAAK dari minggu ke batas maksimal **3x24 jam kerja**.
* **Zero Error Calculation:** Mengeliminasi kesalahan hitung poin manual dengan fitur *Smart Input Wizard*.

---

## 4. Requirement Identification & MoSCoW Prioritization

| ID | Requirement Name | Type | Priority | Scope Status |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | Dasbor Pelacakan Progres Poin Visual | Functional | Must Have | In Scope |
| **R-02** | Repositori Digital Sertifikat/SK | Functional | Must Have | In Scope |
| **R-03** | Smart Input Wizard & Kalkulasi Poin Otomatis | Functional | Must Have | In Scope |
| **R-04** | Halaman FAQ & Katalog Regulasi Poin | Functional | Must Have | In Scope |
| **R-05** | Validation Board BAAK dengan Preview Dokumen | Functional | Must Have | In Scope |
| **R-06** | Skema Rule Versioning Bobot Poin per Angkatan | Functional | Must Have | In Scope |
| **R-07** | Security Property Map & RBAC | Non-Functional | Should Have | In Scope |
| **R-08** | Chatbot Cerdas AI berbasis RAG | Functional | Could Have | Out of Scope |
| **R-09** | Peringatan / Indikator Poin Kegiatan Wajib | Functional | Could Have | Out of Scope |
| **R-10** | Export Draf Rekapitulasi Format PDF | Functional | Should Have | In Scope |
| **R-11** | Integrasi Otomatis Dua Arah ke SIAKAD PNC | Non-Functional | Won't Have | Out of Scope |

---

## 5. Scope Boundary (Batas Proyek)
* **Proyek Mencakup:** Web application terpusat untuk pengajuan, kalkulasi otomatis, repositori sertifikat, Halaman FAQ regulasi, *Validation Board* BAAK, *Rule Versioning*, RBAC, dan cetak PDF rekapitulasi.
* **Proyek Tidak Mencakup:** Integrasi basis data otomatis secara langsung ke server SIAKAD PNC, pembangunan aplikasi *mobile native*, pengembangan model AI Chatbot RAG, serta birokrasi pengesahan TTD Digital SKPI Final.
