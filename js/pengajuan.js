// ============================================================
// js/pengajuan.js — SIPMA PNC Form Pengajuan Poin (Mahasiswa)
// Estimasi poin dari SIPMAData (rule versioning), submit tersimpan
// ke localStorage sehingga tampil di dashboard & antrean BAAK.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // AUTH GUARD — Hanya Mahasiswa
  // ==========================================================
  if (!SIPMAAuth.requireAuth([SIPMAAuth.ROLES.MAHASISWA])) return;
  SIPMAAuth.renderSidebar('pengajuan.html');

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
  // Elemen DOM
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

  var errorNama     = document.getElementById('errorNama');
  var errorKategori = document.getElementById('errorKategori');
  var errorTingkat  = document.getElementById('errorTingkat');
  var errorPeran    = document.getElementById('errorPeran');
  var errorTanggal  = document.getElementById('errorTanggal');
  var errorFile     = document.getElementById('errorFile');

  var RULES_LABEL = SIPMAData.POIN_RULES[SIPMAData.getAngkatanAktif()].label;
  var currentFile = null; // { name, type, size, dataUrl }

  // ==========================================================
  // Smart Input Wizard — Estimasi poin real-time (rule versioned)
  // ==========================================================
  function updateEstimasi() {
    if (!estimasiEl || !kategoriSelect || !tingkatSelect) return;

    var kat = kategoriSelect.value;
    var tkt = tingkatSelect.value;

    if (kat && tkt) {
      var poin = SIPMAData.getPoin(kat, tkt);
      if (poin > 0) {
        estimasiEl.innerHTML = '<svg class="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
          + 'Estimasi Poin Otomatis: <span class="text-lg ml-1">' + poin + ' Poin</span>'
          + '<span class="text-[10px] font-normal text-blue-500 ml-2">Aturan ' + RULES_LABEL + '</span>';
        estimasiEl.classList.remove('hidden');
        return;
      }
    }

    estimasiEl.innerHTML = '';
    estimasiEl.classList.add('hidden');
  }

  if (kategoriSelect) kategoriSelect.addEventListener('change', updateEstimasi);
  if (tingkatSelect)  tingkatSelect.addEventListener('change', updateEstimasi);

  // ==========================================================
  // Drag & Drop Upload Sertifikat
  // ==========================================================
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
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
    currentFile = null;

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

    // Baca file sebagai Data URL agar bisa disimpan & dipreview BAAK
    var reader = new FileReader();
    reader.onload = function (ev) {
      currentFile = { name: file.name, type: file.type, size: file.size, dataUrl: ev.target.result };
    };
    reader.readAsDataURL(file);
  }

  // ==========================================================
  // Validasi inline (dynamic styling)
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
  // Submit — simpan ke SIPMAData (localStorage)
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
        SIPMAUI.showToast('Mohon lengkapi semua data yang diperlukan.', 'error');
        return;
      }

      var item = {
        nim:      user.username,
        nama:     user.name,
        kelas:    user.kelas || '',
        kegiatan: namaInput.value.trim(),
        kategori: kategoriSelect.value,
        tingkat:  tingkatSelect.value,
        peran:    peranInput.value.trim(),
        tanggal:  tanggalInput.value,
        poin:     SIPMAData.getPoin(kategoriSelect.value, tingkatSelect.value)
      };

      if (currentFile) {
        item.fileName = currentFile.name;
        item.fileType = currentFile.type;
        item.fileData = currentFile.dataUrl;
      }

      var res = SIPMAData.addPengajuan(item);

      // Antisipasi kuota localStorage penuh: simpan ulang tanpa lampiran
      if (!res.ok && item.fileData) {
        delete item.fileData;
        res = SIPMAData.addPengajuan(item);
        SIPMAUI.showToast('Lampiran terlalu besar untuk penyimpanan lokal — pengajuan tersimpan tanpa lampiran.', 'info');
      }

      SIPMAUI.showToast('Pengajuan berhasil dikirim! Menunggu verifikasi BAAK.', 'success');

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1500);
    });
  }

  // Clear error saat input berubah (real-time UX)
  if (namaInput)      namaInput.addEventListener('input',  function () { clearError(errorNama); });
  if (kategoriSelect) kategoriSelect.addEventListener('change', function () { clearError(errorKategori); });
  if (tingkatSelect)  tingkatSelect.addEventListener('change',  function () { clearError(errorTingkat); });
  if (peranInput)     peranInput.addEventListener('input',  function () { clearError(errorPeran); });
  if (tanggalInput)   tanggalInput.addEventListener('change', function () { clearError(errorTanggal); });
  if (fileInput)      fileInput.addEventListener('change',  function () { clearError(errorFile); });

});
