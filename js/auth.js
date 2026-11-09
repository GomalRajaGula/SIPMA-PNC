// ============================================================
// js/auth.js — SIPMA PNC Authentication & RBAC Module
// ============================================================

var SIPMAAuth = (function () {

  var ROLES = {
    MAHASISWA: 'mahasiswa',
    DOSEN: 'dosen',
    BAAK: 'baak'
  };

  var DEMO_USERS = [
    { username: '250215033', password: 'mhs123', role: ROLES.MAHASISWA, name: 'Achmal Maulana', kelas: 'TRPL 2-B' },
    { username: '250215001', password: 'mhs123', role: ROLES.MAHASISWA, name: 'Budi Santoso', kelas: 'TRPL 2-A' },
    { username: '197001011995', password: 'dosen123', role: ROLES.DOSEN, name: 'Dr. Suparman, M.Kom', nip: '197001011995' },
    { username: '198505152010', password: 'baak123', role: ROLES.BAAK, name: 'Sri Wahyuni, S.Kom', nip: '198505152010' }
  ];

  var ROLE_DASHBOARDS = {
    mahasiswa: 'dashboard.html',
    dosen: 'dosen_dashboard.html',
    baak: 'baak_dashboard.html'
  };

  function login(username, password, role) {
    var user = DEMO_USERS.find(function (u) {
      return u.username === username && u.password === password && u.role === role;
    });

    if (user) {
      localStorage.setItem('currentUserRole', user.role);
      localStorage.setItem('currentUserName', user.name);
      localStorage.setItem('currentUserUsername', user.username);
      if (user.kelas) localStorage.setItem('currentUserKelas', user.kelas);
      if (user.nip) localStorage.setItem('currentUserNIP', user.nip);
      localStorage.setItem('isLoggedIn', 'true');
      return { success: true, user: user };
    }

    return { success: false, message: 'Username, password, atau role tidak cocok.' };
  }

  function logout() {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserUsername');
    localStorage.removeItem('currentUserKelas');
    localStorage.removeItem('currentUserNIP');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  }

  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  function getCurrentUser() {
    if (!isLoggedIn()) return null;
    return {
      role: localStorage.getItem('currentUserRole'),
      name: localStorage.getItem('currentUserName'),
      username: localStorage.getItem('currentUserUsername'),
      kelas: localStorage.getItem('currentUserKelas'),
      nip: localStorage.getItem('currentUserNIP')
    };
  }

  function requireAuth(allowedRoles) {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }

    var user = getCurrentUser();
    if (allowedRoles && allowedRoles.indexOf(user.role) === -1) {
      alert('Akses ditolak. Anda tidak memiliki hak akses ke halaman ini.');
      window.location.href = ROLE_DASHBOARDS[user.role] || 'login.html';
      return false;
    }

    return true;
  }

  function redirectToDashboard(role) {
    window.location.href = ROLE_DASHBOARDS[role] || 'dashboard.html';
  }

  // Daftar menu sidebar per role (dipakai untuk sidebar dinamis di semua halaman)
  var SIDEBAR_MENU = {
    mahasiswa: [
      { href: 'dashboard.html',  label: 'Dashboard',       icon: 'grid' },
      { href: 'pengajuan.html',  label: 'Pengajuan Poin',  icon: 'doc' },
      { href: 'katalog.html',    label: 'Katalog Poin',    icon: 'book' },
      { href: 'chatbot.html',    label: 'Chatbot AI',      icon: 'chat' }
    ],
    dosen: [
      { href: 'dosen_dashboard.html', label: 'Dashboard Perwalian', icon: 'users' },
      { href: 'katalog.html',         label: 'Katalog Poin',        icon: 'book' },
      { href: 'chatbot.html',         label: 'Chatbot AI',          icon: 'chat' }
    ],
    baak: [
      { href: 'baak_dashboard.html', label: 'Validation Board', icon: 'check' },
      { href: 'katalog.html',        label: 'Katalog Poin',     icon: 'book' },
      { href: 'chatbot.html',        label: 'Chatbot AI',       icon: 'chat' }
    ]
  };

  var ICONS = {
    grid:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>',
    doc:   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    chat:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>',
    users: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
    check: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    book:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>'
  };

  // Bangun ulang navigasi sidebar sesuai role aktif.
  // Dipanggil tiap halaman setelah requireAuth, supaya tidak ada lagi
  // menu mahasiswa yang bocor ke halaman dosen/baak.
  function renderSidebar(activePage) {
    var user = getCurrentUser();
    if (!user) return false;

    var menu = SIDEBAR_MENU[user.role];
    var nav  = document.querySelector('aside nav');
    if (!menu || !nav) return false;

    var current = activePage || window.location.pathname.split('/').pop();
    nav.innerHTML = '';

    menu.forEach(function (item) {
      var a = document.createElement('a');
      var isActive = item.href === current;
      a.href = item.href;
      a.className = isActive
        ? 'flex items-center px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm'
        : 'flex items-center px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium text-sm transition';
      a.innerHTML = '<svg class="w-5 h-5 mr-3 ' + (isActive ? 'text-blue-600' : 'text-gray-400')
        + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + (ICONS[item.icon] || '') + '</svg>' + item.label;
      nav.appendChild(a);
    });

    return true;
  }

  return {
    ROLES: ROLES,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    requireAuth: requireAuth,
    redirectToDashboard: redirectToDashboard,
    renderSidebar: renderSidebar,
    SIDEBAR_MENU: SIDEBAR_MENU
  };

})();
