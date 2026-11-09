// ============================================================
// js/data.js — SIPMA PNC Shared Data Layer
// Sumber data bersama (localStorage) + aturan poin ber-versi.
// Dimuat sebelum script halaman lain pada semua halaman dashboard.
// ============================================================

var SIPMAData = (function () {

  // ----------------------------------------------------------
  // Keys localStorage
  // ----------------------------------------------------------
  var KEY_PENGAJUAN = 'sipma_pengajuan';
  var KEY_MAHASISWA = 'sipma_mahasiswa';

  // ----------------------------------------------------------
  // R-06 — Rule Versioning Bobot Poin per Angkatan
  // Setiap angkatan punya tabel bobot sendiri. Mengubah bobot
  // untuk angkatan baru tidak mengubah data historis angkatan lama.
  // ----------------------------------------------------------
  var POIN_RULES = {
    '2026': {
      label: 'Kurikulum 2026',
      target: { D4: 36, D3: 24 },
      map: {
        '1': { nasional: 7, provinsi: 5, lokal: 3 },   // Prestasi Lomba
        '2': { nasional: 5, provinsi: 3, lokal: 1 },   // Organisasi / Panitia
        '3': { nasional: 3, provinsi: 2, lokal: 1 },   // Seminar / Workshop
        '4': { nasional: 8, provinsi: 8, lokal: 8 }    // Kegiatan Wajib
      }
    },
    '2025': {
      label: 'Kurikulum 2025',
      target: { D4: 36, D3: 24 },
      map: {
        '1': { nasional: 6, provinsi: 4, lokal: 2 },
        '2': { nasional: 4, provinsi: 2, lokal: 1 },
        '3': { nasional: 2, provinsi: 1, lokal: 1 },
        '4': { nasional: 8, provinsi: 8, lokal: 8 }
      }
    }
  };

  var ACTIVE_ANGKATAN = '2026';

  var KATEGORI_LABEL = {
    '1': 'Prestasi Lomba / Kompetisi',
    '2': 'Kepengurusan Organisasi / Panitia',
    '3': 'Seminar / Workshop / Pelatihan',
    '4': 'Kegiatan Wajib Kampus (PKKMB/ORPEL)'
  };

  var TINGKAT_LABEL = {
    nasional: 'Nasional',
    provinsi: 'Provinsi',
    lokal: 'Internal / Kampus PNC'
  };

  // Katalog regulasi poin (R-04 — FAQ & Katalog Regulasi Poin)
  var KATALOG_REGULASI = [
    { kategori: 'Prestasi Lomba / Kompetisi', tingkat: 'Nasional',  poin: 7, catatan: 'Juara/peserta lomba tingkat nasional' },
    { kategori: 'Prestasi Lomba / Kompetisi', tingkat: 'Provinsi',  poin: 5, catatan: 'Juara/peserta lomba tingkat provinsi' },
    { kategori: 'Prestasi Lomba / Kompetisi', tingkat: 'Internal',  poin: 3, catatan: 'Juara/peserta lomba internal PNC' },
    { kategori: 'Kepengurusan Organisasi / Panitia', tingkat: 'Nasional', poin: 5, catatan: 'Pengurus/panitia tingkat nasional' },
    { kategori: 'Kepengurusan Organisasi / Panitia', tingkat: 'Provinsi', poin: 3, catatan: 'Pengurus/panitia tingkat provinsi' },
    { kategori: 'Kepengurusan Organisasi / Panitia', tingkat: 'Internal', poin: 1, catatan: 'Pengurus/panitia internal PNC' },
    { kategori: 'Seminar / Workshop / Pelatihan', tingkat: 'Nasional', poin: 3, catatan: 'Peserta seminar/workshop nasional' },
    { kategori: 'Seminar / Workshop / Pelatihan', tingkat: 'Provinsi', poin: 2, catatan: 'Peserta seminar/workshop provinsi' },
    { kategori: 'Seminar / Workshop / Pelatihan', tingkat: 'Internal', poin: 1, catatan: 'Peserta seminar/workshop internal' },
    { kategori: 'Kegiatan Wajib Kampus (PKKMB/ORPEL)', tingkat: 'Semua', poin: 8, catatan: 'PKKMB, LDDK, LKMM — wajib, bobot tetap 8' }
  ];

  var KEGIATAN_WAJIB = ['PKKMB', 'LDDK', 'LKMM'];

  // ----------------------------------------------------------
  // Helper internal
  // ----------------------------------------------------------
  function getRules(angkatan) {
    return POIN_RULES[angkatan] || POIN_RULES[ACTIVE_ANGKATAN];
  }

  function readStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed === null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function seedIfEmpty() {
    if (localStorage.getItem(KEY_PENGAJUAN) === null) {
      var seed = buildSeedPengajuan();
      writeStore(KEY_PENGAJUAN, seed);
    }
  }

  // Data demo awal: identik dengan riwayat yang dulu hardcoded di dashboard.html
  function buildSeedPengajuan() {
    return [
      { id: 1, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Juara 1 Lomba Web Design KMIPN VIII', kategori: '1', tingkat: 'nasional',
        peran: 'Peserta', tanggal: '2026-09-25', poin: 7, status: 'menunggu', catatan: '' },

      { id: 2, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Panitia Divisi Perlengkapan Dies Natalis TRPL', kategori: '2', tingkat: 'lokal',
        peran: 'Anggota', tanggal: '2026-09-10', poin: 1, status: 'disetujui', catatan: '' },

      { id: 3, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Pengenalan Kehidupan Kampus bagi Mahasiswa (PKKMB)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-09-05', poin: 8, status: 'disetujui', catatan: '' },

      { id: 4, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-20', poin: 8, status: 'disetujui', catatan: '' },

      { id: 5, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Dasar Disiplin & Kepemimpinan (LDDK)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-15', poin: 8, status: 'disetujui', catatan: '' },

      { id: 6, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Peserta Seminar Cyber Security', kategori: '3', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-12', poin: 1, status: 'disetujui', catatan: '' },

      { id: 7, nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B',
        kegiatan: 'Sertifikat TOEFL ITP 450', kategori: '3', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-01', poin: 0, status: 'ditolak', catatan: 'Sertifikat blur' },

      { id: 8, nim: '250215001', nama: 'Budi Santoso', kelas: 'TRPL 2-A',
        kegiatan: 'Volunteer Kampus Merdeka Batch 6', kategori: '2', tingkat: 'nasional',
        peran: 'Volunteer', tanggal: '2026-09-23', poin: 5, status: 'menunggu', catatan: '' },

      { id: 9, nim: '250215001', nama: 'Budi Santoso', kelas: 'TRPL 2-A',
        kegiatan: 'Pengenalan Kehidupan Kampus bagi Mahasiswa (PKKMB)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-09-05', poin: 8, status: 'disetujui', catatan: '' },

      { id: 10, nim: '250215001', nama: 'Budi Santoso', kelas: 'TRPL 2-A',
        kegiatan: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-20', poin: 8, status: 'disetujui', catatan: '' },

      { id: 11, nim: '250215001', nama: 'Budi Santoso', kelas: 'TRPL 2-A',
        kegiatan: 'Latihan Dasar Disiplin & Kepemimpinan (LDDK)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-15', poin: 8, status: 'disetujui', catatan: '' },

      { id: 12, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Workshop Machine Learning', kategori: '3', tingkat: 'nasional',
        peran: 'Peserta', tanggal: '2026-09-20', poin: 3, status: 'menunggu', catatan: '' },

      { id: 13, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Ketua BEM 2025', kategori: '2', tingkat: 'lokal',
        peran: 'Ketua', tanggal: '2026-01-15', poin: 1, status: 'disetujui', catatan: '' },

      { id: 14, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Juara 2 UI/UX Competition', kategori: '1', tingkat: 'nasional',
        peran: 'Peserta', tanggal: '2026-09-18', poin: 7, status: 'disetujui', catatan: '' },

      { id: 15, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Pengenalan Kehidupan Kampus bagi Mahasiswa (PKKMB)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-09-05', poin: 8, status: 'disetujui', catatan: '' },

      { id: 16, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-20', poin: 8, status: 'disetujui', catatan: '' },

      { id: 17, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Dasar Disiplin & Kepemimpinan (LDDK)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-15', poin: 8, status: 'disetujui', catatan: '' },

      { id: 18, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Panitia Seminar Nasional IT', kategori: '2', tingkat: 'lokal',
        peran: 'Panitia', tanggal: '2026-09-12', poin: 1, status: 'disetujui', catatan: '' },

      { id: 19, nim: '250215067', nama: 'Rizki Pratama', kelas: 'TRPL 2-A',
        kegiatan: 'Juara 2 Hackathon ITFest', kategori: '1', tingkat: 'provinsi',
        peran: 'Peserta', tanggal: '2026-09-15', poin: 5, status: 'menunggu', catatan: '' },

      { id: 20, nim: '250215067', nama: 'Rizki Pratama', kelas: 'TRPL 2-A',
        kegiatan: 'Pengenalan Kehidupan Kampus bagi Mahasiswa (PKKMB)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-09-05', poin: 8, status: 'disetujui', catatan: '' },

      { id: 21, nim: '250215067', nama: 'Rizki Pratama', kelas: 'TRPL 2-A',
        kegiatan: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-20', poin: 8, status: 'disetujui', catatan: '' },

      { id: 22, nim: '250215067', nama: 'Rizki Pratama', kelas: 'TRPL 2-A',
        kegiatan: 'Latihan Dasar Disiplin & Kepemimpinan (LDDK)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-15', poin: 8, status: 'disetujui', catatan: '' },

      { id: 23, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Panitia PKKMB 2026', kategori: '2', tingkat: 'lokal',
        peran: 'Panitia', tanggal: '2026-09-18', poin: 1, status: 'menunggu', catatan: '' },

      { id: 24, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Pengenalan Kehidupan Kampus bagi Mahasiswa (PKKMB)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-09-05', poin: 8, status: 'disetujui', catatan: '' },

      { id: 25, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-20', poin: 8, status: 'disetujui', catatan: '' },

      { id: 26, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Latihan Dasar Disiplin & Kepemimpinan (LDDK)', kategori: '4', tingkat: 'lokal',
        peran: 'Peserta', tanggal: '2026-08-15', poin: 8, status: 'disetujui', catatan: '' },

      { id: 27, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Volunteer Kampus Merdeka', kategori: '2', tingkat: 'nasional',
        peran: 'Volunteer', tanggal: '2026-09-22', poin: 5, status: 'disetujui', catatan: '' },

      { id: 28, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Workshop Data Science', kategori: '3', tingkat: 'nasional',
        peran: 'Peserta', tanggal: '2026-09-08', poin: 3, status: 'disetujui', catatan: '' },

      { id: 29, nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B',
        kegiatan: 'Juara 3 Lomba Cipta Aplikasi Provinsi Jateng', kategori: '1', tingkat: 'provinsi',
        peran: 'Peserta', tanggal: '2026-09-14', poin: 5, status: 'disetujui', catatan: '' },

      { id: 30, nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B',
        kegiatan: 'Juara 3 LKPT Wilayah Provinsi', kategori: '1', tingkat: 'provinsi',
        peran: 'Peserta', tanggal: '2026-09-11', poin: 5, status: 'disetujui', catatan: '' }
    ];
  }

  // Daftar mahasiswa perwalian (untuk dashboard Dosen Wali)
  var MAHASISWA = [
    { nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B' },
    { nim: '250215001', nama: 'Budi Santoso',   kelas: 'TRPL 2-A' },
    { nim: '250215045', nama: 'Siti Nurjanah',  kelas: 'TRPL 2-B' },
    { nim: '250215067', nama: 'Rizki Pratama',  kelas: 'TRPL 2-A' },
    { nim: '250215089', nama: 'Dewi Lestari',   kelas: 'TRPL 2-B' }
  ];

  // ----------------------------------------------------------
  // API Publik
  // ----------------------------------------------------------
  function getAngkatanAktif() { return ACTIVE_ANGKATAN; }

  function getTarget(jenjang) {
    var rules = getRules(ACTIVE_ANGKATAN);
    return rules.target[jenjang || 'D4'] || rules.target.D4;
  }

  // Hitung poin dari kategori + tingkat sesuai aturan angkatan aktif
  function getPoin(kategori, tingkat, angkatan) {
    var rules = getRules(angkatan);
    if (!rules.map[kategori]) return 0;
    var val = rules.map[kategori][tingkat];
    return val === undefined ? 0 : val;
  }

  function getKategoriLabel(k) { return KATEGORI_LABEL[k] || k; }
  function getTingkatLabel(t) { return TINGKAT_LABEL[t] || t; }
  function getKatalog() { return KATALOG_REGULASI; }
  function getKegiatanWajib() { return KEGIATAN_WAJIB.slice(); }

  function getAllPengajuan() {
    return readStore(KEY_PENGAJUAN, []);
  }

  // Filter riwayat milik satu mahasiswa
  function getPengajuanByNim(nim) {
    return getAllPengajuan().filter(function (p) { return p.nim === nim; });
  }

  // Antrean yang menunggu verifikasi (untuk BAAK)
  function getAntreanBAAK() {
    return getAllPengajuan().filter(function (p) { return p.status === 'menunggu'; });
  }

  function nextId() {
    var all = getAllPengajuan();
    var max = 0;
    all.forEach(function (p) { if (p.id > max) max = p.id; });
    return max + 1;
  }

  function addPengajuan(item) {
    var all = getAllPengajuan();
    item.id = nextId();
    item.status = 'menunggu';
    all.push(item);
    var ok = writeStore(KEY_PENGAJUAN, all);
    return { ok: ok, item: item };
  }

  function deletePengajuan(id) {
    var all = getAllPengajuan().filter(function (p) { return p.id !== id; });
    writeStore(KEY_PENGAJUAN, all);
  }

  // BAAK: setujui / tolak pengajuan
  function setStatusPengajuan(id, status, catatan) {
    var all = getAllPengajuan();
    all.forEach(function (p) {
      if (p.id === id) {
        p.status = status;
        p.catatan = catatan || '';
      }
    });
    writeStore(KEY_PENGAJUAN, all);
  }

  // Rekap per mahasiswa (untuk dashboard Dosen Wali)
  function getRekapMahasiswa(nim) {
    var mhs = resolveMahasiswa(nim);
    var list = getPengajuanByNim(nim);
    var approved = 0, pending = 0;
    list.forEach(function (p) {
      if (p.status === 'disetujui') approved += p.poin;
      else if (p.status === 'menunggu') pending += p.poin;
    });
    return {
      nim: nim,
      nama: mhs.nama,
      kelas: mhs.kelas,
      poin: approved,
      pending: pending,
      target: getTarget('D4'),
      memenuhi: approved >= getTarget('D4'),
      kegiatan: list
    };
  }

  function resolveMahasiswa(nim) {
    var found = null;
    MAHASISWA.forEach(function (m) { if (m.nim === nim) found = m; });
    if (found) return found;
    // fallback: ambil dari data pengajuan bila nim belum terdaftar
    var list = getPengajuanByNim(nim);
    if (list.length > 0) {
      return { nim: nim, nama: list[0].nama, kelas: list[0].kelas };
    }
    return { nim: nim, nama: nim, kelas: '-' };
  }

  function getDaftarMahasiswa() {
    return MAHASISWA.map(function (m) { return getRekapMahasiswa(m.nim); });
  }

  function getStatsMahasiswa(nim) {
    var list = getPengajuanByNim(nim);
    var approved = 0, pending = 0;
    list.forEach(function (p) {
      if (p.status === 'disetujui') approved += p.poin;
      else if (p.status === 'menunggu') pending += p.poin;
    });
    var target = getTarget('D4');
    return {
      list: list,
      approved: approved,
      pending: pending,
      target: target,
      persen: Math.min(Math.round((approved / target) * 100), 100)
    };
  }

  // R-09 — Deteksi kegiatan wajib yang belum disetujui (Early Warning)
  function cekKegiatanWajib(nim) {
    var list = getPengajuanByNim(nim);
    var missing = [];
    KEGIATAN_WAJIB.forEach(function (nama) {
      var ok = list.some(function (p) {
        return p.status === 'disetujui' &&
               p.kegiatan.toUpperCase().indexOf(nama) !== -1;
      });
      if (!ok) missing.push(nama);
    });
    return missing;
  }

  seedIfEmpty();

  return {
    KEY_PENGAJUAN: KEY_PENGAJUAN,
    POIN_RULES: POIN_RULES,
    getAngkatanAktif: getAngkatanAktif,
    getTarget: getTarget,
    getPoin: getPoin,
    getKategoriLabel: getKategoriLabel,
    getTingkatLabel: getTingkatLabel,
    getKatalog: getKatalog,
    getKegiatanWajib: getKegiatanWajib,
    getAllPengajuan: getAllPengajuan,
    getPengajuanByNim: getPengajuanByNim,
    getAntreanBAAK: getAntreanBAAK,
    addPengajuan: addPengajuan,
    deletePengajuan: deletePengajuan,
    setStatusPengajuan: setStatusPengajuan,
    getRekapMahasiswa: getRekapMahasiswa,
    getDaftarMahasiswa: getDaftarMahasiswa,
    getStatsMahasiswa: getStatsMahasiswa,
    cekKegiatanWajib: cekKegiatanWajib
  };

})();
