// ============================================================
// js/dashboard.js — SIPMA PNC
// Praktikum 1-6: DOM Selection, Dynamic Styling, Event Handling,
//   Timers & Animation, Dynamic Node Creation & Event Delegation
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // PRAKTIKUM 1 & 2 — DOM Selection & Dynamic Styling
  // ==========================================================

  var totalApprovedEl = document.getElementById('totalApproved');
  var totalPendingEl  = document.getElementById('totalPending');
  var progressBar     = document.getElementById('progressBar');
  var progressText    = document.getElementById('progressText');
  var ewsAlert        = document.getElementById('ewsAlert');
  var ewsMessage      = document.getElementById('ewsMessage');
  var tbody           = document.getElementById('tbodyRiwayat');
  var toastContainer  = document.getElementById('toastContainer');

  var TARGET_POIN = 36;

  var STATUS_STYLES = {
    disetujui: { bg: 'bg-green-100', text: 'text-green-700' },
    menunggu:  { bg: 'bg-amber-100', text: 'text-amber-700' },
    ditolak:   { bg: 'bg-red-100',   text: 'text-red-700'   }
  };

  function applyBadgeStyles() {
    if (!tbody) return;

    tbody.querySelectorAll('tr').forEach(function (row) {
      var status = (row.getAttribute('data-status') || '').toLowerCase();
      var badge  = row.querySelector('.status-badge');
      if (!badge || !STATUS_STYLES[status]) return;

      badge.className = 'status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium '
        + STATUS_STYLES[status].bg + ' ' + STATUS_STYLES[status].text;
    });
  }

  applyBadgeStyles();

  // ==========================================================
  // PRAKTIKUM 5 — Recalculate Stats & Animated Progress Bar
  // ==========================================================

  function recalculateStats() {
    if (!tbody) return;

    var approved = 0;
    var pending  = 0;

    tbody.querySelectorAll('tr').forEach(function (row) {
      var poinCell = row.querySelector('td:nth-child(4)');
      var status   = (row.getAttribute('data-status') || '').toLowerCase();
      if (!poinCell) return;

      var poin = parseInt(poinCell.textContent.trim(), 10);
      if (isNaN(poin)) return;

      if (status === 'disetujui') {
        approved += poin;
      } else if (status === 'menunggu') {
        pending += poin;
      }
    });

    if (totalApprovedEl) totalApprovedEl.textContent = approved;
    if (totalPendingEl)  totalPendingEl.textContent  = pending;

    var percent = Math.min(Math.round((approved / TARGET_POIN) * 100), 100);
    if (progressText) progressText.textContent = percent + '%';
    if (progressBar)  progressBar.style.width  = percent + '%';

    updateEWS(approved);
  }

  function updateEWS(approved) {
    if (!ewsAlert) return;

    var sisa = TARGET_POIN - approved;

    if (sisa <= 0) {
      ewsAlert.className = 'bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start shadow-sm';
      ewsAlert.querySelector('svg').classList.remove('text-amber-600');
      ewsAlert.querySelector('svg').classList.add('text-green-600');
      ewsAlert.querySelector('h3').textContent = 'Target Tercapai!';
      ewsAlert.querySelector('h3').className = 'text-sm font-bold text-green-800';
      if (ewsMessage) {
        ewsMessage.className = 'text-sm text-green-700 mt-1';
        ewsMessage.innerHTML = 'Selamat! Poin keaktifan Anda telah memenuhi syarat minimum <span class="font-bold">' + TARGET_POIN + ' Poin</span> untuk pendaftaran yudisium.';
      }
    } else {
      ewsAlert.className = 'bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start shadow-sm';
      ewsAlert.querySelector('svg').classList.remove('text-green-600');
      ewsAlert.querySelector('svg').classList.add('text-amber-600');
      ewsAlert.querySelector('h3').textContent = 'Peringatan Sistem EWS';
      ewsAlert.querySelector('h3').className = 'text-sm font-bold text-amber-800';
      if (ewsMessage) {
        ewsMessage.className = 'text-sm text-amber-700 mt-1';
        ewsMessage.innerHTML = 'Anda masih kekurangan <span class="font-bold">' + sisa + ' Poin</span>. Poin harus dipenuhi sebagai syarat pendaftaran yudisium.';
      }
    }
  }

  progressBar.style.width = '0%';

  setTimeout(function () {
    recalculateStats();
  }, 100);

  // ==========================================================
  // PRAKTIKUM 3 — Event Handling & Lifecycle
  // ==========================================================

  var btnPengajuan = document.getElementById('btnPengajuanBaru');
  if (btnPengajuan) {
    btnPengajuan.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'pengajuan.html';
    });
  }

  // ==========================================================
  // PRAKTIKUM 5 — Toast Notification (auto-dismiss 3.5 detik)
  // ==========================================================

  function showToast(message, type) {
    if (!toastContainer) return;

    var colors = {
      success: 'bg-green-500',
      error:   'bg-red-500',
      info:    'bg-blue-500'
    };

    var toast = document.createElement('div');
    toast.className = (colors[type] || colors.info)
      + ' text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transform translate-x-full opacity-0 transition-all duration-300';

    var icon = '';
    if (type === 'success') {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    } else if (type === 'error') {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    } else {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = icon + '<span>' + message + '</span>';
    toastContainer.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    });

    setTimeout(function () {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  // ==========================================================
  // PRAKTIKUM 6 — Event Delegation & Dynamic Node Removal
  // ==========================================================

  if (tbody) {
    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var row = e.target.closest('tr');
      if (!row) return;

      var nameCell = row.querySelector('td:first-child');
      var label    = nameCell ? nameCell.textContent.trim() : 'kegiatan ini';

      if (confirm('Hapus pengajuan "' + label + '"?')) {
        row.classList.add('opacity-0', 'transition-opacity', 'duration-300');

        setTimeout(function () {
          row.remove();
          recalculateStats();
          applyBadgeStyles();
          showToast('Pengajuan "' + label + '" berhasil dihapus.', 'success');
        }, 300);
      }
    });
  }

});
