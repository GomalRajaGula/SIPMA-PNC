// ============================================================
// js/dosen.js — SIPMA PNC Dashboard Dosen Wali
// Rekap dari SIPMAData (tersambung dengan verifikasi BAAK),
// termasuk cetak rekapitulasi PDF (R-10) via dialog print.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // AUTH GUARD — Hanya Dosen Wali
  // ==========================================================
  if (!SIPMAAuth.requireAuth([SIPMAAuth.ROLES.DOSEN])) return;
  SIPMAAuth.renderSidebar('dosen_dashboard.html');

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

  var tbody         = document.getElementById('tbodyMahasiswa');
  var searchInput   = document.getElementById('searchInput');
  var filterStatus  = document.getElementById('filterStatus');
  var btnCetakPDF   = document.getElementById('btnCetakPDF');
  var modal         = document.getElementById('modalDetail');
  var btnCloseModal = document.getElementById('btnCloseModal');

  var TARGET = SIPMAData.getTarget('D4');

  var STATUS_TXT = { disetujui: 'Disetujui', menunggu: 'Menunggu', ditolak: 'Ditolak' };

  var allMahasiswa      = SIPMAData.getDaftarMahasiswa();
  var filteredMahasiswa = allMahasiswa;

  function renderTable() {
    tbody.innerHTML = '';

    if (filteredMahasiswa.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Tidak ada data mahasiswa.</td></tr>';
      return;
    }

    filteredMahasiswa.forEach(function (mhs) {
      var pendingHtml = mhs.pending > 0
        ? '<div class="text-[10px] text-amber-600">+' + mhs.pending + ' menunggu</div>' : '';
      var statusClass = mhs.memenuhi ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
      var statusText  = mhs.memenuhi ? 'Memenuhi' : 'Belum Memenuhi';

      var row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition';
      row.innerHTML =
        '<td class="px-6 py-4 font-medium text-gray-900">' + mhs.nama + '</td>' +
        '<td class="px-6 py-4">' + mhs.nim + '</td>' +
        '<td class="px-6 py-4">' + mhs.kelas + '</td>' +
        '<td class="px-6 py-4 text-center font-semibold text-gray-700">' + mhs.poin + pendingHtml + '</td>' +
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
    var total     = filteredMahasiswa.length;
    var memenuhi  = filteredMahasiswa.filter(function (m) { return m.memenuhi; }).length;
    var belum     = total - memenuhi;
    var totalPoin = filteredMahasiswa.reduce(function (sum, m) { return sum + m.poin; }, 0);
    var rata      = total > 0 ? (totalPoin / total).toFixed(1) : 0;

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
      if (status === 'memenuhi') matchStatus = mhs.memenuhi;
      else if (status === 'belum') matchStatus = !mhs.memenuhi;
      return matchSearch && matchStatus;
    });

    renderTable();
  }

  searchInput.addEventListener('input', applyFilters);
  filterStatus.addEventListener('change', applyFilters);

  // ==========================================================
  // Modal detail poin per mahasiswa
  // ==========================================================
  tbody.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-detail');
    if (!btn) return;

    var nim = btn.getAttribute('data-nim');
    var rekap = SIPMAData.getRekapMahasiswa(nim);

    document.getElementById('detailNama').textContent = rekap.nama;
    document.getElementById('detailNIM').textContent = rekap.nim;
    document.getElementById('detailTotalPoin').textContent = rekap.poin + ' Poin'
      + (rekap.pending > 0 ? ' (+' + rekap.pending + ' menunggu)' : '');

    var tbodyDetail = document.getElementById('tbodyDetail');
    tbodyDetail.innerHTML = '';

    if (rekap.kegiatan.length === 0) {
      tbodyDetail.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-400">Belum ada kegiatan.</td></tr>';
    }

    rekap.kegiatan.forEach(function (k) {
      var catatanHtml = (k.status === 'ditolak' && k.catatan)
        ? '<p class="text-[10px] text-red-500 mt-1">' + k.catatan + '</p>' : '';
      var row = document.createElement('tr');
      row.innerHTML =
        '<td class="px-4 py-2 text-gray-900">' + k.kegiatan + '</td>' +
        '<td class="px-4 py-2 text-gray-600">' + SIPMAData.getKategoriLabel(k.kategori) + '</td>' +
        '<td class="px-4 py-2 text-center font-semibold text-gray-700">' + (k.status === 'ditolak' ? '-' : k.poin) + '</td>' +
        '<td class="px-4 py-2 text-center">' + SIPMAUI.badgeStatus(k.status) + catatanHtml + '</td>';
      tbodyDetail.appendChild(row);
    });

    SIPMAUI.openModal(modal);
  });

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', function () {
      SIPMAUI.closeModal(modal);
    });
  }

  // ==========================================================
  // R-10 — Cetak Rekapitulasi PDF (via dialog print browser)
  // ==========================================================
  if (btnCetakPDF) {
    btnCetakPDF.addEventListener('click', function () {
      var win = window.open('', '_blank');
      if (!win) {
        SIPMAUI.showToast('Popup diblokir browser. Izinkan popup untuk mencetak.', 'error');
        return;
      }

      var tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      var rowsMain = filteredMahasiswa.map(function (m, i) {
        return '<tr><td>' + (i + 1) + '</td><td>' + m.nama + '</td><td>' + m.nim + '</td><td>' + m.kelas + '</td>'
          + '<td class="c">' + m.poin + '</td><td class="c">' + m.pending + '</td>'
          + '<td class="c">' + (m.memenuhi ? 'Memenuhi' : 'Belum Memenuhi') + '</td></tr>';
      }).join('');

      var details = filteredMahasiswa.map(function (m) {
        var rowsD = m.kegiatan.map(function (k) {
          return '<tr><td>' + k.kegiatan + '</td>'
            + '<td>' + SIPMAData.getKategoriLabel(k.kategori) + '</td>'
            + '<td>' + SIPMAUI.formatTanggal(k.tanggal) + '</td>'
            + '<td class="c">' + (k.status === 'ditolak' ? '-' : k.poin) + '</td>'
            + '<td class="c">' + (STATUS_TXT[k.status] || k.status) + (k.catatan ? ' - ' + k.catatan : '') + '</td></tr>';
        }).join('');

        return '<div class="mhs"><h3>' + m.nama + ' (' + m.nim + ') - ' + m.poin + ' poin disetujui'
          + (m.pending > 0 ? ' (+' + m.pending + ' menunggu)' : '') + '</h3>'
          + '<table><thead><tr><th>Kegiatan</th><th>Kategori</th><th>Tanggal</th><th class="c">Poin</th><th class="c">Status</th></tr></thead>'
          + '<tbody>' + rowsD + '</tbody></table></div>';
      }).join('');

      var html = '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">'
        + '<title>Rekapitulasi Poin - ' + user.name + '</title>'
        + '<style>'
        + 'body{font-family:Helvetica,Arial,sans-serif;color:#111;margin:24px;font-size:12px}'
        + 'h1{font-size:16px;margin:0}h2{font-size:13px;margin:2px 0 10px;color:#444}'
        + 'p.meta{color:#333;margin:0 0 14px}'
        + 'table{border-collapse:collapse;width:100%;margin-bottom:14px}'
        + 'th,td{border:1px solid #bbb;padding:4px 6px;text-align:left}'
        + 'th{background:#f1f5f9}td.c,th.c{text-align:center}'
        + '.mhs h3{font-size:12px;margin:14px 0 4px;border-bottom:1px solid #ddd;padding-bottom:2px}'
        + '.note{color:#666;font-size:10px;margin-top:20px}'
        + '</style></head><body>'
        + '<h1>POLITEKNIK NEGERI CILACAP</h1>'
        + '<h2>SIPMA — Rekapitulasi Poin Keaktifan Mahasiswa Perwalian</h2>'
        + '<p class="meta">Dosen Wali: <strong>' + user.name + '</strong> (NIP: ' + user.nip + ')'
        + ' · Dicetak: ' + tgl + ' · Target SKPI (D4): ' + TARGET + ' poin</p>'
        + '<table><thead><tr><th>No</th><th>Nama</th><th>NIM</th><th>Kelas</th><th class="c">Poin Disetujui</th><th class="c">Menunggu</th><th class="c">Status SKPI</th></tr></thead><tbody>'
        + rowsMain + '</tbody></table>'
        + details
        + '<p class="note">Dokumen ini adalah draf rekapitulasi otomatis dari SIPMA PNC. Pilih "Save as PDF" pada dialog cetak untuk menyimpan dalam format PDF.</p>'
        + '<scr' + 'ipt>window.onload = function () { window.print(); };</scr' + 'ipt>'
        + '</body></html>';

      win.document.write(html);
      win.document.close();

      SIPMAUI.showToast('Jendela cetak dibuka — pilih "Save as PDF" untuk menyimpan.', 'info');
    });
  }

  renderTable();

});
