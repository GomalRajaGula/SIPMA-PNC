// ============================================================
// js/dashboard.js — SIPMA PNC Dashboard Mahasiswa
// Sumber data: SIPMAData (localStorage) — riwayat & stats dinamis.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // AUTH GUARD — Hanya Mahasiswa
  // ==========================================================
  if (!SIPMAAuth.requireAuth([SIPMAAuth.ROLES.MAHASISWA])) return;
  SIPMAAuth.renderSidebar('dashboard.html');

  var user = SIPMAAuth.getCurrentUser();

  var userNameEl = document.querySelector('header p.text-sm.font-semibold');
  if (userNameEl) userNameEl.textContent = user.name;
  var userKelasEl = document.querySelector('header p.text-xs.text-gray-500');
  if (userKelasEl) userKelasEl.textContent = (user.kelas || '') + ' • ' + user.username;

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) SIPMAAuth.logout();
    });
  }

  // ==========================================================
  // Elemen DOM & state
  // ==========================================================
  var totalApprovedEl = document.getElementById('totalApproved');
  var totalPendingEl  = document.getElementById('totalPending');
  var progressBar     = document.getElementById('progressBar');
  var progressText    = document.getElementById('progressText');
  var ewsAlert        = document.getElementById('ewsAlert');
  var ewsMessage      = document.getElementById('ewsMessage');
  var tbody           = document.getElementById('tbodyRiwayat');

  var NIM   = user.username;
  var stats = SIPMAData.getStatsMahasiswa(NIM);
  var TARGET = stats.target;

  // ==========================================================
  // Render tabel riwayat dari localStorage (event delegation)
  // ==========================================================
  function renderTable() {
    if (!tbody) return;

    var list = SIPMAData.getPengajuanByNim(NIM).slice().sort(function (a, b) {
      if (a.tanggal === b.tanggal) return b.id - a.id;
      return a.tanggal < b.tanggal ? 1 : -1;
    });

    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Belum ada riwayat pengajuan. Klik "Pengajuan Baru" untuk mulai.</td></tr>';
      return;
    }

    list.forEach(function (p) {
      var row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition';
      row.setAttribute('data-id', p.id);
      row.setAttribute('data-status', p.status);

      var catatanHtml = (p.status === 'ditolak' && p.catatan)
        ? '<p class="text-[10px] text-red-500 mt-1">' + p.catatan + '</p>' : '';

      var aksiHtml = (p.status === 'disetujui')
        ? '<span class="text-gray-300 text-xs">&mdash;</span>'
        : '<button data-action="delete" class="text-red-400 hover:text-red-600 transition text-xs font-semibold">Hapus</button>';

      var poinTampil = p.status === 'ditolak' ? '-' : p.poin;

      row.innerHTML =
        '<td class="px-6 py-4 font-medium text-gray-900">' + p.kegiatan + '</td>' +
        '<td class="px-6 py-4">' + SIPMAData.getKategoriLabel(p.kategori) + '</td>' +
        '<td class="px-6 py-4">' + SIPMAUI.formatTanggal(p.tanggal) + '</td>' +
        '<td class="px-6 py-4 text-center font-semibold text-gray-700">' + poinTampil + '</td>' +
        '<td class="px-6 py-4 text-center">' + SIPMAUI.badgeStatus(p.status) + catatanHtml + '</td>' +
        '<td class="px-6 py-4 text-center">' + aksiHtml + '</td>';

      tbody.appendChild(row);
    });
  }

  // ==========================================================
  // Statistik + Progress Bar + Early Warning System (R-09)
  // ==========================================================
  function recalcStats() {
    stats = SIPMAData.getStatsMahasiswa(NIM);

    if (totalApprovedEl) totalApprovedEl.textContent = stats.approved;
    if (totalPendingEl)  totalPendingEl.textContent  = stats.pending;

    if (progressText) progressText.textContent = stats.persen + '%';
    if (progressBar)  progressBar.style.width  = stats.persen + '%';

    updateEWS();
  }

  function updateEWS() {
    if (!ewsAlert) return;

    var sisa        = TARGET - stats.approved;
    var wajibKurang = SIPMAData.cekKegiatanWajib(NIM);

    var wajibHtml = '';
    if (wajibKurang.length > 0) {
      wajibHtml = '<br><span class="text-xs">Kegiatan wajib belum disetujui: <span class="font-bold">'
        + wajibKurang.join(', ') + '</span></span>';
    }

    var icon = ewsAlert.querySelector('svg');
    var h3   = ewsAlert.querySelector('h3');

    if (sisa <= 0) {
      ewsAlert.className = 'bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start shadow-sm';
      if (icon) { icon.classList.remove('text-amber-600'); icon.classList.add('text-green-600'); }
      if (h3) { h3.textContent = 'Target Tercapai!'; h3.className = 'text-sm font-bold text-green-800'; }
      if (ewsMessage) {
        ewsMessage.className = 'text-sm text-green-700 mt-1';
        ewsMessage.innerHTML = 'Selamat! Poin keaktifan Anda telah memenuhi syarat minimum <span class="font-bold">'
          + TARGET + ' Poin</span> untuk pendaftaran yudisium.' + wajibHtml;
      }
    } else {
      ewsAlert.className = 'bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start shadow-sm';
      if (icon) { icon.classList.remove('text-green-600'); icon.classList.add('text-amber-600'); }
      if (h3) { h3.textContent = 'Peringatan Sistem EWS'; h3.className = 'text-sm font-bold text-amber-800'; }
      if (ewsMessage) {
        ewsMessage.className = 'text-sm text-amber-700 mt-1';
        ewsMessage.innerHTML = 'Anda masih kekurangan <span class="font-bold">' + sisa
          + ' Poin</span>. Poin harus dipenuhi sebagai syarat pendaftaran yudisium.' + wajibHtml;
      }
    }
  }

  // ==========================================================
  // Event Delegation — tombol Hapus (hanya status menunggu/ditolak)
  // ==========================================================
  if (tbody) {
    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var row = e.target.closest('tr');
      if (!row) return;

      var id = parseInt(row.getAttribute('data-id'), 10);
      var all = SIPMAData.getAllPengajuan();
      var item = null;
      all.forEach(function (p) { if (p.id === id) item = p; });
      if (!item) return;

      if (confirm('Hapus pengajuan "' + item.kegiatan + '"?')) {
        var label = item.kegiatan;
        SIPMAData.deletePengajuan(id);

        row.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(function () {
          renderTable();
          recalcStats();
          SIPMAUI.showToast('Pengajuan "' + label + '" berhasil dihapus.', 'success');
        }, 300);
      }
    });
  }

  // ==========================================================
  // Inisialisasi
  // ==========================================================
  if (progressBar) progressBar.style.width = '0%';
  renderTable();
  setTimeout(recalcStats, 100);

});
