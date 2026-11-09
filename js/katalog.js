// ============================================================
// js/katalog.js — SIPMA PNC Katalog Regulasi Poin
// Menampilkan tabel bobot poin per kategori & tingkat,
// termasuk pemilih versi aturan per angkatan (R-04 & R-06).
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // AUTH GUARD — Semua Role
  // ==========================================================
  if (!SIPMAAuth.requireAuth([
    SIPMAAuth.ROLES.MAHASISWA,
    SIPMAAuth.ROLES.DOSEN,
    SIPMAAuth.ROLES.BAAK
  ])) return;

  SIPMAAuth.renderSidebar('katalog.html');

  var user = SIPMAAuth.getCurrentUser();

  var userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = user.name;
  var userInfoEl = document.getElementById('userInfo');
  if (userInfoEl) {
    userInfoEl.textContent = user.kelas
      ? (user.kelas + ' • ' + user.username)
      : ('NIP: ' + user.nip);
  }

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) SIPMAAuth.logout();
    });
  }

  // ==========================================================
  // Elemen DOM
  // ==========================================================
  var versionSelect = document.getElementById('versionSelect');
  var tbodyKatalog  = document.getElementById('tbodyKatalog');
  var versiAktifEl  = document.getElementById('versiAktif');
  var versiNoteEl   = document.getElementById('versiNote');
  var targetD4El    = document.getElementById('targetD4');
  var targetD3El    = document.getElementById('targetD3');
  var wajibListEl   = document.getElementById('wajibList');

  var KATEGORI_ORDER = ['1', '2', '3', '4'];
  var TINGKAT_ORDER  = ['nasional', 'provinsi', 'lokal'];
  var ANGKATAN_AKTIF = SIPMAData.getAngkatanAktif();

  // ==========================================================
  // Dropdown versi aturan (mis. 2026, 2025)
  // ==========================================================
  function buildVersionOptions() {
    if (!versionSelect) return;

    Object.keys(SIPMAData.POIN_RULES).forEach(function (kode) {
      var rules = SIPMAData.POIN_RULES[kode];
      var opt = document.createElement('option');
      opt.value = kode;
      opt.textContent = 'Kurikulum ' + kode + ' (' + rules.label + ')'
        + (kode === ANGKATAN_AKTIF ? ' — aktif' : '');
      versionSelect.appendChild(opt);
    });

    versionSelect.value = ANGKATAN_AKTIF;
  }

  // ==========================================================
  // Render tabel bobot poin untuk versi aturan terpilih
  // ==========================================================
  function renderKatalog(angkatan) {
    var rules = SIPMAData.POIN_RULES[angkatan];
    if (!rules || !tbodyKatalog) return;

    tbodyKatalog.innerHTML = '';

    KATEGORI_ORDER.forEach(function (kat) {
      var tingkats = kat === '4' ? ['lokal'] : TINGKAT_ORDER;

      tingkats.forEach(function (tkt) {
        var poin = rules.map[kat] ? rules.map[kat][tkt] : 0;

        var row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        row.innerHTML =
          '<td class="px-6 py-3.5 font-medium text-gray-900">' + SIPMAData.getKategoriLabel(kat) + '</td>' +
          '<td class="px-6 py-3.5">' + (kat === '4' ? 'Semua Tingkat' : SIPMAData.getTingkatLabel(tkt)) + '</td>' +
          '<td class="px-6 py-3.5 text-center"><span class="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">' + poin + ' Poin</span></td>';
        tbodyKatalog.appendChild(row);
      });
    });

    if (targetD4El) targetD4El.textContent = rules.target.D4;
    if (targetD3El) targetD3El.textContent = rules.target.D3;

    if (versiAktifEl) {
      versiAktifEl.textContent = 'Kurikulum ' + ANGKATAN_AKTIF + ' (' + SIPMAData.POIN_RULES[ANGKATAN_AKTIF].label + ')';
    }

    if (versiNoteEl) {
      versiNoteEl.textContent = 'Menampilkan versi: ' + rules.label + ' — angkatan ' + angkatan
        + (angkatan === ANGKATAN_AKTIF
            ? ' (berlaku untuk pengajuan baru)'
            : ' (histori, tidak digunakan untuk pengajuan baru)');
    }
  }

  // ==========================================================
  // Daftar kegiatan wajib
  // ==========================================================
  function renderWajib() {
    if (!wajibListEl) return;

    var wajib = SIPMAData.getKegiatanWajib();
    wajib.forEach(function (nama) {
      var li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      li.innerHTML =
        '<span class="text-amber-500 font-bold">&bull;</span>' +
        '<span><strong>' + nama + '</strong> — wajib diikuti, bobot tetap 8 Poin. Sertifikat wajib diunggah melalui menu Pengajuan Poin.</span>';
      wajibListEl.appendChild(li);
    });
  }

  // ==========================================================
  // Event & inisialisasi
  // ==========================================================
  if (versionSelect) {
    versionSelect.addEventListener('change', function () {
      renderKatalog(versionSelect.value);
    });
  }

  buildVersionOptions();
  renderKatalog(ANGKATAN_AKTIF);
  renderWajib();

});
