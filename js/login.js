// ============================================================
// js/login.js — SIPMA PNC Login Handler
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  if (SIPMAAuth.isLoggedIn()) {
    var user = SIPMAAuth.getCurrentUser();
    SIPMAAuth.redirectToDashboard(user.role);
    return;
  }

  var form          = document.getElementById('formLogin');
  var roleSelect    = document.getElementById('roleSelect');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var labelUsername = document.getElementById('labelUsername');
  var toastContainer = document.getElementById('toastContainer');

  var errorRole     = document.getElementById('errorRole');
  var errorUsername = document.getElementById('errorUsername');
  var errorPassword = document.getElementById('errorPassword');

  roleSelect.addEventListener('change', function () {
    var role = roleSelect.value;
    if (role === 'mahasiswa') {
      labelUsername.textContent = 'NIM';
      usernameInput.placeholder = 'Masukkan NIM';
    } else if (role === 'dosen' || role === 'baak') {
      labelUsername.textContent = 'NIP';
      usernameInput.placeholder = 'Masukkan NIP';
    } else {
      labelUsername.textContent = 'NIM / NIP';
      usernameInput.placeholder = 'Masukkan NIM atau NIP';
    }
    clearError(errorRole);
  });

  usernameInput.addEventListener('input', function () { clearError(errorUsername); });
  passwordInput.addEventListener('input', function () { clearError(errorPassword); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    clearAllErrors();
    var isValid = true;

    var role     = roleSelect.value;
    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();

    if (!role) {
      showError(errorRole, 'Role wajib dipilih.');
      isValid = false;
    }

    if (!username) {
      showError(errorUsername, 'Username wajib diisi.');
      isValid = false;
    }

    if (!password) {
      showError(errorPassword, 'Password wajib diisi.');
      isValid = false;
    }

    if (!isValid) {
      showToast('Mohon lengkapi semua data login.', 'error');
      return;
    }

    var result = SIPMAAuth.login(username, password, role);

    if (result.success) {
      showToast('Login berhasil! Mengalihkan ke dashboard...', 'success');
      setTimeout(function () {
        SIPMAAuth.redirectToDashboard(result.user.role);
      }, 1500);
    } else {
      showToast(result.message, 'error');
      showError(errorUsername, 'Periksa kembali username, password, dan role.');
    }
  });

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    var input = el.previousElementSibling;
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.classList.add('border-red-400');
      input.classList.remove('border-gray-300');
    }
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
    var input = el.previousElementSibling;
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.classList.remove('border-red-400');
      input.classList.add('border-gray-300');
    }
  }

  function clearAllErrors() {
    [errorRole, errorUsername, errorPassword].forEach(clearError);
  }

  function showToast(message, type) {
    if (!toastContainer) return;

    var colors = { success: 'bg-green-500', error: 'bg-red-500' };
    var toast = document.createElement('div');
    toast.className = (colors[type] || colors.error)
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

});
