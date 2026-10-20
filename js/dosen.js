// ============================================================
// js/dosen.js — SIPMA PNC Dosen Dashboard
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  SIPMAAuth.requireAuth([SIPMAAuth.ROLES.DOSEN]);

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

  var DEMO_MAHASISWA = [
    { nim: '250215033', nama: 'Achmal Maulana', kelas: 'TRPL 2-B', poin: 33, kegiatan: [
      { nama: 'Juara 1 Web Design KMIPN VIII', kategori: 'Prestasi Nasional', poin: 7, status: 'Menunggu' },
      { nama: 'PKKMB 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LDDK 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LKMM 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'Seminar Cyber Security', kategori: 'Seminar Internal', poin: 1, status: 'Disetujui' },
      { nama: 'Panitia Dies Natalis', kategori: 'Organisasi Lokal', poin: 1, status: 'Disetujui' }
    ]},
    { nim: '250215001', nama: 'Budi Santoso', kelas: 'TRPL 2-A', poin: 28, kegiatan: [
      { nama: 'PKKMB 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LDDK 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LKMM 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'Workshop Laravel', kategori: 'Seminar Internal', poin: 1, status: 'Disetujui' },
      { nama: 'Juara 3 Futsal', kategori: 'Prestasi Lokal', poin: 3, status: 'Disetujui' }
    ]},
    { nim: '250215045', nama: 'Siti Nurjanah', kelas: 'TRPL 2-B', poin: 41, kegiatan: [
      { nama: 'PKKMB 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LDDK 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LKMM 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'Ketua BEM 2025', kategori: 'Organisasi Lokal', poin: 5, status: 'Disetujui' },
      { nama: 'Juara 2 UI/UX Competition', kategori: 'Prestasi Nasional', poin: 7, status: 'Disetujui' },
      { nama: 'Panitia Seminar Nasional IT', kategori: 'Organisasi Lokal', poin: 5, status: 'Disetujui' }
    ]},
    { nim: '250215067', nama: 'Rizki Pratama', kelas: 'TRPL 2-A', poin: 24, kegiatan: [
      { nama: 'PKKMB 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LDDK 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LKMM 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' }
    ]},
    { nim: '250215089', nama: 'Dewi Lestari', kelas: 'TRPL 2-B', poin: 37, kegiatan: [
      { nama: 'PKKMB 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LDDK 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'LKMM 2024', kategori: 'Kegiatan Wajib', poin: 8, status: 'Disetujui' },
      { nama: 'Volunteer Kampus Merdeka', kategori: 'Organisasi Nasional', poin: 5, status: 'Disetujui' },
      { nama: 'Workshop Data Science', kategori: 'Seminar Nasional', poin: 3, status: 'Disetujui' },
      { nama: 'Panitia PKKMB 2025', kategori: 'Organisasi Lokal', poin: 5, status: 'Disetujui' }
    ]}
  ];

  var tbody = document.getElementById('tbodyMahasiswa');
  var searchInput = document.getElementById('searchInput');
  var filterStatus = document.getElementById('filterStatus');
  var btnCetakPDF = document.getElementById('btnCetakPDF');
  var toastContainer = document.getElementById('toastContainer');

  var modal = document.getElementById('modalDetail');
  var btnCloseModal = document.getElementById('btnCloseModal');

  var TARGET_POIN = 36;
  var allMahasiswa = DEMO_MAHASISWA;
  var filteredMahasiswa = allMahasiswa;

  function renderTable() {
    tbody.innerHTML = '';

    if (filteredMahasiswa.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Tidak ada data mahasiswa.</td></tr>';
      return;
    }

    filteredMahasiswa.forEach(function (mhs) {
      var statusClass = mhs.poin >= TARGET_POIN ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
      var statusText = mhs.poin >= TARGET_POIN ? 'Memenuhi' : 'Belum Memenuhi';

      var row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition';
      row.innerHTML =
        '<td class="px-6 py-4 font-medium text-gray-900">' + mhs.nama + '</td>' +
        '<td class="px-6 py-4">' + mhs.nim + '</td>' +
        '<td class="px-6 py-4">' + mhs.kelas + '</td>' +
        '<td class="px-6 py-4 text-center font-semibold text-gray-700">' + mhs.poin + '</td>' +
        '<td class="px-6 py-4 text-center">' +
          '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ' + statusClass + '">' + statusText + '</span>' +
        '</td>' +
        '<td class="px-6 py-4 text-center">' +
          '<button data-nim="' + mhs.nim + '" class="btn-detail text-blue-600 hover:text-blue-800 transition text-sm font-semibold">Detail Poin</button>' +
        '</td>';
      tbody.appendChild(row);
    });

    updateStats();
  }

  function updateStats() {
    var total = filteredMahasiswa.length;
    var memenuhi = filteredMahasiswa.filter(function (m) { return m.poin >= TARGET_POIN; }).length;
    var belum = total - memenuhi;
    var totalPoin = filteredMahasiswa.reduce(function (sum, m) { return sum + m.poin; }, 0);
    var rata = total > 0 ? (totalPoin / total).toFixed(1) : 0;

    document.getElementById('totalMahasiswa').textContent = total;
    document.getElementById('totalMemenuhi').textContent = memenuhi;
    document.getElementById('totalBelum').textContent = belum;
    document.getElementById('rataRata').textContent = rata;
  }

  function applyFilters() {
    var search = searchInput.value.toLowerCase().trim();
    var status = filterStatus.value;

    filteredMahasiswa = allMahasiswa.filter(function (mhs) {
      var matchSearch = mhs.nama.toLowerCase().indexOf(search) !== -1 || mhs.nim.indexOf(search) !== -1;
      var matchStatus = true;
      if (status === 'memenuhi') {
        matchStatus = mhs.poin >= TARGET_POIN;
      } else if (status === 'belum') {
        matchStatus = mhs.poin < TARGET_POIN;
      }
      return matchSearch && matchStatus;
    });

    renderTable();
  }

  searchInput.addEventListener('input', applyFilters);
  filterStatus.addEventListener('change', applyFilters);

  tbody.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-detail');
    if (!btn) return;

    var nim = btn.getAttribute('data-nim');
    var mhs = allMahasiswa.find(function (m) { return m.nim === nim; });
    if (!mhs) return;

    document.getElementById('detailNama').textContent = mhs.nama;
    document.getElementById('detailNIM').textContent = mhs.nim;
    document.getElementById('detailTotalPoin').textContent = mhs.poin + ' Poin';

    var tbodyDetail = document.getElementById('tbodyDetail');
    tbodyDetail.innerHTML = '';

    mhs.kegiatan.forEach(function (k) {
      var statusClass = k.status.toLowerCase() === 'disetujui' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
      var row = document.createElement('tr');
      row.innerHTML =
        '<td class="px-4 py-2 text-gray-900">' + k.nama + '</td>' +
        '<td class="px-4 py-2 text-gray-600">' + k.kategori + '</td>' +
        '<td class="px-4 py-2 text-center font-semibold text-gray-700">' + k.poin + '</td>' +
        '<td class="px-4 py-2 text-center"><span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + statusClass + '">' + k.status + '</span></td>';
      tbodyDetail.appendChild(row);
    });

    modal.classList.remove('hidden');
  });

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', function () {
      modal.classList.add('hidden');
    });
  }

  if (btnCetakPDF) {
    btnCetakPDF.addEventListener('click', function () {
      showToast('Fitur cetak PDF sedang dalam pengembangan.', 'info');
    });
  }

  function showToast(message, type) {
    if (!toastContainer) return;

    var colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    var toast = document.createElement('div');
    toast.className = (colors[type] || colors.info)
      + ' text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transform translate-x-full opacity-0 transition-all duration-300';

    var icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
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
