// ============================================================
// js/baak.js — SIPMA PNC BAAK Validation Board
// Antrean dari SIPMAData (pengajuan mahasiswa), preview dokumen
// asli bila ada lampiran, approve/reject tersimpan permanen.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // AUTH GUARD — Hanya Staf BAAK
  // ==========================================================
  if (!SIPMAAuth.requireAuth([SIPMAAuth.ROLES.BAAK])) return;
  SIPMAAuth.renderSidebar('baak_dashboard.html');

  var user = SIPMAAuth.getCurrentUser();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userNIP').textContent = 'NIP: ' + user.nip;

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) SIPMAAuth.logout();
    });
  }

  var tbody          = document.getElementById('tbodyAntrean');
  var searchInput    = document.getElementById('searchInput');
  var modal          = document.getElementById('modalVerifikasi');
  var btnCloseModal  = document.getElementById('btnCloseModal');
  var btnSetujui     = document.getElementById('btnSetujui');
  var btnTolak       = document.getElementById('btnTolak');
  var catatanBAAK    = document.getElementById('catatanBAAK');
  var previewBox     = document.getElementById('previewBox');

  var previewPlaceholder = previewBox ? previewBox.innerHTML : '';

  var allPengajuan      = SIPMAData.getAntreanBAAK();
  var filteredPengajuan = allPengajuan;
  var currentPengajuan  = null;

  var statsDisetujui = 0;
  var statsDitolak   = 0;

  // ==========================================================
  // Render tabel antrean
  // ==========================================================
  function renderTable() {
    tbody.innerHTML = '';

    if (filteredPengajuan.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-400">Tidak ada pengajuan dalam antrean.</td></tr>';
      updateStats();
      return;
    }

    filteredPengajuan.forEach(function (p) {
      var row = document.createElement('tr');
      row.className = 'hover:bg-blue-50 transition cursor-pointer';
      row.setAttribute('data-id', p.id);
      row.innerHTML =
        '<td class="px-6 py-4 font-medium text-gray-900">' + p.nama + '</td>' +
        '<td class="px-6 py-4">' + p.nim + '</td>' +
        '<td class="px-6 py-4">' + p.kegiatan + '</td>' +
        '<td class="px-6 py-4">' + SIPMAData.getKategoriLabel(p.kategori) + '</td>' +
        '<td class="px-6 py-4">' + SIPMAUI.formatTanggal(p.tanggal) + '</td>' +
        '<td class="px-6 py-4 text-center font-semibold text-gray-700">' + p.poin + '</td>' +
        '<td class="px-6 py-4 text-center">' +
          '<button class="btn-verifikasi text-blue-600 hover:text-blue-800 transition text-sm font-semibold">Verifikasi</button>' +
        '</td>';
      tbody.appendChild(row);
    });

    updateStats();
  }

  function updateStats() {
    document.getElementById('totalAntrean').textContent = filteredPengajuan.length;
    document.getElementById('totalDisetujui').textContent = statsDisetujui;
    document.getElementById('totalDitolak').textContent = statsDitolak;
  }

  function applySearch() {
    var search = searchInput.value.toLowerCase().trim();

    filteredPengajuan = allPengajuan.filter(function (p) {
      return p.nama.toLowerCase().indexOf(search) !== -1 ||
             p.nim.indexOf(search) !== -1 ||
             p.kegiatan.toLowerCase().indexOf(search) !== -1;
    });

    renderTable();
  }

  function refresh() {
    allPengajuan = SIPMAData.getAntreanBAAK();
    applySearch();
  }

  searchInput.addEventListener('input', applySearch);

  // ==========================================================
  // Preview dokumen (lampiran asli dari pengajuan mahasiswa)
  // ==========================================================
  function renderPreview(p) {
    if (!previewBox) return;

    if (p.fileData && p.fileType && p.fileType.indexOf('image/') === 0) {
      previewBox.innerHTML = '<img src="' + p.fileData + '" alt="Preview sertifikat" class="max-h-full max-w-full object-contain">';
      return;
    }

    if (p.fileData && p.fileType === 'application/pdf') {
      previewBox.innerHTML = '<iframe src="' + p.fileData + '" class="w-full h-full" title="Preview PDF"></iframe>';
      return;
    }

    previewBox.innerHTML = previewPlaceholder;
  }

  // ==========================================================
  // Buka modal verifikasi (klik baris)
  // ==========================================================
  tbody.addEventListener('click', function (e) {
    var row = e.target.closest('tr[data-id]');
    if (!row) return;

    var id = parseInt(row.getAttribute('data-id'), 10);
    var found = null;
    allPengajuan.forEach(function (p) { if (p.id === id) found = p; });
    currentPengajuan = found;
    if (!currentPengajuan) return;

    document.getElementById('vNama').textContent     = currentPengajuan.nama;
    document.getElementById('vNIM').textContent      = currentPengajuan.nim;
    document.getElementById('vKegiatan').textContent = currentPengajuan.kegiatan;
    document.getElementById('vKategori').textContent = SIPMAData.getKategoriLabel(currentPengajuan.kategori);
    document.getElementById('vTingkat').textContent  = SIPMAData.getTingkatLabel(currentPengajuan.tingkat);
    document.getElementById('vTanggal').textContent  = SIPMAUI.formatTanggal(currentPengajuan.tanggal);
    document.getElementById('vPoin').textContent     = currentPengajuan.poin + ' Poin';
    catatanBAAK.value = '';

    renderPreview(currentPengajuan);
    SIPMAUI.openModal(modal);
  });

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', function () {
      SIPMAUI.closeModal(modal);
      currentPengajuan = null;
    });
  }

  // ==========================================================
  // Setujui / Tolak — update permanen via SIPMAData
  // ==========================================================
  if (btnSetujui) {
    btnSetujui.addEventListener('click', function () {
      if (!currentPengajuan) return;

      SIPMAData.setStatusPengajuan(currentPengajuan.id, 'disetujui', '');
      statsDisetujui++;

      SIPMAUI.showToast('Pengajuan "' + currentPengajuan.kegiatan + '" berhasil disetujui.', 'success');
      SIPMAUI.closeModal(modal);
      currentPengajuan = null;
      refresh();
    });
  }

  if (btnTolak) {
    btnTolak.addEventListener('click', function () {
      if (!currentPengajuan) return;

      var catatan = catatanBAAK.value.trim();
      if (!catatan) {
        SIPMAUI.showToast('Catatan BAAK wajib diisi untuk penolakan.', 'error');
        return;
      }

      SIPMAData.setStatusPengajuan(currentPengajuan.id, 'ditolak', catatan);
      statsDitolak++;

      SIPMAUI.showToast('Pengajuan "' + currentPengajuan.kegiatan + '" ditolak. Catatan: ' + catatan, 'error');
      SIPMAUI.closeModal(modal);
      currentPengajuan = null;
      refresh();
    });
  }

  renderTable();

});
