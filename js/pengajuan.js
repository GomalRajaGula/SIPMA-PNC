// ============================================================
// js/pengajuan.js — SIPMA PNC
// Praktikum 1-6: DOM Selection, Dynamic Styling, Event Handling,
//   Form Validation, Smart Input Wizard, Timers, Drag & Drop
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // PRAKTIKUM 1 & 2 — DOM Selection via getElementById
  // ==========================================================

  var form            = document.getElementById('formPengajuan');
  var namaInput       = document.getElementById('namaKegiatan');
  var kategoriSelect  = document.getElementById('kategoriKegiatan');
  var tingkatSelect   = document.getElementById('tingkatLevel');
  var peranInput      = document.getElementById('peranKegiatan');
  var tanggalInput    = document.getElementById('tanggalPelaksanaan');
  var fileInput       = document.getElementById('fileSertifikat');
  var dropZone        = document.getElementById('dropZone');
  var dropZoneText    = document.getElementById('dropZoneText');
  var estimasiEl      = document.getElementById('estimasiPoin');
  var toastContainer  = document.getElementById('toastContainer');

  var errorNama     = document.getElementById('errorNama');
  var errorKategori = document.getElementById('errorKategori');
  var errorTingkat  = document.getElementById('errorTingkat');
  var errorPeran    = document.getElementById('errorPeran');
  var errorTanggal  = document.getElementById('errorTanggal');
  var errorFile     = document.getElementById('errorFile');

  // ==========================================================
  // PRAKTIKUM 5 — Smart Input Wizard (Estimasi Poin Real-Time)
  // ==========================================================

  var POIN_MAP = {
    '1': { nasional: 7, provinsi: 5, lokal: 3 },
    '2': { nasional: 5, provinsi: 3, lokal: 1 },
    '3': { nasional: 3, provinsi: 2, lokal: 1 },
    '4': { nasional: 8, provinsi: 8, lokal: 8 }
  };

  function updateEstimasi() {
    if (!estimasiEl || !kategoriSelect || !tingkatSelect) return;

    var kat = kategoriSelect.value;
    var tkt = tingkatSelect.value;

    if (kat && tkt && POIN_MAP[kat] && POIN_MAP[kat][tkt] !== undefined) {
      var poin = POIN_MAP[kat][tkt];
      estimasiEl.innerHTML = '<svg class="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
        + 'Estimasi Poin Otomatis: <span class="text-lg ml-1">' + poin + ' Poin</span>';
      estimasiEl.classList.remove('hidden');
    } else {
      estimasiEl.innerHTML = '';
      estimasiEl.classList.add('hidden');
    }
  }

  if (kategoriSelect) kategoriSelect.addEventListener('change', updateEstimasi);
  if (tingkatSelect)  tingkatSelect.addEventListener('change', updateEstimasi);

  // ==========================================================
  // PRAKTIKUM 3 — Drag & Drop Event Handling
  // ==========================================================

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });

    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropZone.classList.add('border-blue-400', 'bg-blue-50');
    });

    dropZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    });

    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');

      var files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        handleFile(files[0]);
      }
    });
  }

  function handleFile(file) {
    var allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    var maxSize = 2 * 1024 * 1024;

    clearError(errorFile);

    if (allowed.indexOf(file.type) === -1) {
      showError(errorFile, 'Format file tidak didukung. Gunakan PDF, PNG, atau JPG.');
      fileInput.value = '';
      return;
    }

    if (file.size > maxSize) {
      showError(errorFile, 'Ukuran file melebihi batas maksimal 2 MB.');
      fileInput.value = '';
      return;
    }

    if (dropZoneText) {
      dropZoneText.innerHTML = '<span class="text-green-600 font-semibold">' + file.name + '</span>'
        + ' <span class="text-gray-400 text-xs">(' + (file.size / 1024).toFixed(0) + ' KB)</span>';
    }
    dropZone.classList.add('border-green-400');
    dropZone.classList.remove('border-gray-300');
  }

  // ==========================================================
  // PRAKTIKUM 2 — Dynamic Styling Helper (Error State)
  // ==========================================================

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');

    var input = el.previousElementSibling;
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.classList.add('border-red-400', 'ring-red-200');
      input.classList.remove('border-gray-300');
    }
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');

    var input = el.previousElementSibling;
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.classList.remove('border-red-400', 'ring-red-200');
      input.classList.add('border-gray-300');
    }
  }

  function clearAllErrors() {
    [errorNama, errorKategori, errorTingkat, errorPeran, errorTanggal, errorFile].forEach(clearError);
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
    } else {
      icon = '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
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
  // PRAKTIKUM 4 — Client-Side Form Validation (Inline Errors)
  // ==========================================================

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      clearAllErrors();
      var isValid = true;

      if (!namaInput || !namaInput.value.trim()) {
        showError(errorNama, 'Nama Kegiatan wajib diisi.');
        isValid = false;
      }

      if (!kategoriSelect || !kategoriSelect.value) {
        showError(errorKategori, 'Kategori Kegiatan wajib dipilih.');
        isValid = false;
      }

      if (!tingkatSelect || !tingkatSelect.value) {
        showError(errorTingkat, 'Tingkat / Level wajib dipilih.');
        isValid = false;
      }

      if (!peranInput || !peranInput.value.trim()) {
        showError(errorPeran, 'Peran Dalam Kegiatan wajib diisi.');
        isValid = false;
      }

      if (!tanggalInput || !tanggalInput.value) {
        showError(errorTanggal, 'Tanggal Pelaksanaan wajib diisi.');
        isValid = false;
      }

      if (!fileInput || fileInput.files.length === 0) {
        showError(errorFile, 'File sertifikat wajib diunggah.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Mohon lengkapi semua data yang diperlukan.', 'error');
        return;
      }

      showToast('Pengajuan berhasil dikirim! Menunggu verifikasi BAAK.', 'success');

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 2000);
    });
  }

  // ==========================================================
  // PRAKTIKUM 3 — Clear error on input change (real-time UX)
  // ==========================================================

  if (namaInput)      namaInput.addEventListener('input',  function () { clearError(errorNama); });
  if (kategoriSelect) kategoriSelect.addEventListener('change', function () { clearError(errorKategori); });
  if (tingkatSelect)  tingkatSelect.addEventListener('change',  function () { clearError(errorTingkat); });
  if (peranInput)     peranInput.addEventListener('input',  function () { clearError(errorPeran); });
  if (tanggalInput)   tanggalInput.addEventListener('change', function () { clearError(errorTanggal); });
  if (fileInput)      fileInput.addEventListener('change',  function () { clearError(errorFile); });

});
