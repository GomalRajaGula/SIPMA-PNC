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

  return {
    ROLES: ROLES,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    requireAuth: requireAuth,
    redirectToDashboard: redirectToDashboard
  };

})();
