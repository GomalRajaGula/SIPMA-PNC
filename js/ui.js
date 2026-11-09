// ============================================================
// js/ui.js — SIPMA PNC Shared UI Helpers
// Toast, modal, dan helper formatting yang dipakai lintas halaman.
// ============================================================

var SIPMAUI = (function () {

  function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };

    var toast = document.createElement('div');
    toast.className = (colors[type] || colors.info)
      + ' text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transform translate-x-full opacity-0 transition-all duration-300';

    var icon;
    if (type === 'success') {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    } else if (type === 'error') {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    } else {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = icon + '<span>' + message + '</span>';
    container.appendChild(toast);

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

  function openModal(el) {
    if (el) el.classList.remove('hidden');
  }

  function closeModal(el) {
    if (el) el.classList.add('hidden');
  }

  // Format tanggal ISO (yyyy-mm-dd) -> "25 Sep 2026"
  function formatTanggal(iso) {
    if (!iso) return '-';
    var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    var parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    var d = parseInt(parts[2], 10);
    var m = parseInt(parts[1], 10) - 1;
    var y = parts[0];
    if (isNaN(d) || isNaN(m) || !bulan[m]) return iso;
    return d + ' ' + bulan[m] + ' ' + y;
  }

  function badgeStatus(status) {
    var map = {
      disetujui: 'bg-green-100 text-green-700',
      menunggu:  'bg-amber-100 text-amber-700',
      ditolak:   'bg-red-100 text-red-700'
    };
    var label = { disetujui: 'Disetujui', menunggu: 'Menunggu', ditolak: 'Ditolak' };
    var cls = map[status] || 'bg-gray-100 text-gray-700';
    var txt = label[status] || status;
    return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ' + cls + '">' + txt + '</span>';
  }

  return {
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    formatTanggal: formatTanggal,
    badgeStatus: badgeStatus
  };

})();
