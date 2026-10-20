// ============================================================
// js/baak.js — SIPMA PNC BAAK Validation Board
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  SIPMAAuth.requireAuth([SIPMAAuth.ROLES.BAAK]);

  var user = SIPMAAuth.getCurrentUser();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userNIP').textContent = 'NIP: ' + user.nip;

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        SIPMAAuth.logout();
      }
    });
  }

  var DEMO_PENGAJUAN = [
    { id: 1, nama: 'Achmal Maulana', nim: '250215033', kegiatan: 'Juara 1 Lomba Web Design KMIPN VIII', kategori: 'Prestasi Lomba', tingkat: 'Nasional', tanggal: '25 Sep 2026', poin: 7 },
    { id: 2, nama: 'Budi Santoso', nim: '250215001', kegiatan: 'Volunteer Kampus Merdeka Batch 6', kategori: 'Kepengurusan Organisasi', tingkat: 'Nasional', tanggal: '23 Sep 2026', poin: 5 },
    { id: 3, nama: 'Siti Nurjanah', nim: '250215045', kegiatan: 'Workshop Machine Learning', kategori: 'Seminar/Workshop', tingkat: 'Nasional', tanggal: '20 Sep 2026', poin: 3 },
    { id: 4, nama: 'Dewi Lestari', nim: '250215089', kegiatan: 'Panitia PKKMB 2026', kategori: 'Kepengurusan Organisasi', tingkat: 'Internal', tanggal: '18 Sep 2026', poin: 5 },
    { id: 5, nama: 'Rizki Pratama', nim: '250215067', kegiatan: 'Juara 2 Hackathon ITFest', kategori: 'Prestasi Lomba', tingkat: 'Provinsi', tanggal: '15 Sep 2026', poin: 5 }
  ];

  var tbody = document.getElementById('tbodyAntrean');
  var searchInput = document.getElementById('searchInput');
  var toastContainer = document.getElementById('toastContainer');

  var modal = document.getElementById('modalVerifikasi');
  var btnCloseModal = document.getElementById('btnCloseModal');
  var btnSetujui = document.getElementById('btnSetujui');
  var btnTolak = document.getElementById('btnTolak');
  var catatanBAAK = document.getElementById('catatanBAAK');

  var allPengajuan = DEMO_PENGAJUAN;
  var filteredPengajuan = allPengajuan;
  var currentPengajuan = null;

  var statsDisetujui = 0;
  var statsDitolak = 0;

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
        '<td class="px-6 py-4">' + p.kategori + '</td>' +
        '<td class="px-6 py-4">' + p.tanggal + '</td>' +
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

  searchInput.addEventListener('input', applySearch);

  tbody.addEventListener('click', function (e) {
    var row = e.target.closest('tr[data-id]');
    if (!row) return;

    var id = parseInt(row.getAttribute('data-id'), 10);
    currentPengajuan = allPengajuan.find(function (p) { return p.id === id; });
    if (!currentPengajuan) return;

    document.getElementById('vNama').textContent = currentPengajuan.nama;
    document.getElementById('vNIM').textContent = currentPengajuan.nim;
    document.getElementById('vKegiatan').textContent = currentPengajuan.kegiatan;
    document.getElementById('vKategori').textContent = currentPengajuan.kategori;
    document.getElementById('vTingkat').textContent = currentPengajuan.tingkat;
    document.getElementById('vTanggal').textContent = currentPengajuan.tanggal;
    document.getElementById('vPoin').textContent = currentPengajuan.poin + ' Poin';
    catatanBAAK.value = '';

    modal.classList.remove('hidden');
  });

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', function () {
      modal.classList.add('hidden');
      currentPengajuan = null;
    });
  }

  if (btnSetujui) {
    btnSetujui.addEventListener('click', function () {
      if (!currentPengajuan) return;

      allPengajuan = allPengajuan.filter(function (p) { return p.id !== currentPengajuan.id; });
      filteredPengajuan = filteredPengajuan.filter(function (p) { return p.id !== currentPengajuan.id; });

      statsDisetujui++;

      showToast('Pengajuan "' + currentPengajuan.kegiatan + '" berhasil disetujui.', 'success');
      modal.classList.add('hidden');
      currentPengajuan = null;
      renderTable();
    });
  }

  if (btnTolak) {
    btnTolak.addEventListener('click', function () {
      if (!currentPengajuan) return;

      var catatan = catatanBAAK.value.trim();
      if (!catatan) {
        showToast('Catatan BAAK wajib diisi untuk penolakan.', 'error');
        return;
      }

      allPengajuan = allPengajuan.filter(function (p) { return p.id !== currentPengajuan.id; });
      filteredPengajuan = filteredPengajuan.filter(function (p) { return p.id !== currentPengajuan.id; });

      statsDitolak++;

      showToast('Pengajuan "' + currentPengajuan.kegiatan + '" ditolak. Catatan: ' + catatan, 'error');
      modal.classList.add('hidden');
      currentPengajuan = null;
      renderTable();
    });
  }

  function showToast(message, type) {
    if (!toastContainer) return;

    var colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    var toast = document.createElement('div');
    toast.className = (colors[type] || colors.info)
      + ' text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transform translate-x-full opacity-0 transition-all duration-300';

    var icon = type === 'success'
      ? '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
      : '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

    toast.innerHTML = icon + '<span>' + message + '</span>';
    toastContainer.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    });

    setTimeout(function () {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  renderTable();

});
