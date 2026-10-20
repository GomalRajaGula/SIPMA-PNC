// ============================================================
// js/chatbot.js — SIPMA PNC
// Praktikum 3 & 6: Event Handling, Dynamic Node Creation,
//   Event Delegation pada Quick Suggestion Buttons
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  var chatInput      = document.getElementById('chatInput');
  var btnSend        = document.getElementById('btnSend');
  var messageArea    = document.getElementById('messageArea');
  var suggestionsBox = document.getElementById('suggestionsBox');

  var FAQ = {
    'berapa poin syarat yudisium d4':
      'Untuk jenjang <strong>D4 (Sarjana Terapan)</strong> di PNC, batas minimal kumulatif poin keaktifan adalah <strong>36 Poin</strong>.',
    'berapa poin untuk juara lomba nasional':
      'Juara lomba tingkat <strong>Nasional</strong> mendapatkan <strong>7 Poin</strong>. Jika tingkat Provinsi mendapatkan <strong>5 Poin</strong>, dan Internal/Kampus mendapatkan <strong>3 Poin</strong>.',
    'sertifikat apa aja yang wajib':
      'Sertifikat wajib meliputi: <strong>PKKMB</strong> (8 Poin), <strong>LDDK</strong> (8 Poin), dan <strong>LKMM</strong> (8 Poin). Ketiganya bersifat mandatori untuk syarat yudisium.',
    'cara mengajukan sertifikat':
      'Buka menu <strong>Pengajuan Poin</strong> di sidebar, lalu isi form dengan nama kegiatan, kategori, tingkat, peran, tanggal, dan unggah file sertifikat (PDF/JPG/PNG maks 2 MB).',
    'berapa lama proses verifikasi':
      'Proses verifikasi oleh BAAK memakan waktu maksimal <strong>3x24 jam kerja</strong>. Status dapat dipantau di halaman Dashboard.'
  };

  function getTimestamp() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m + ' ' + ampm;
  }

  function createUserBubble(text) {
    var wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-3 justify-end';
    wrapper.innerHTML =
      '<div class="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-lg">'
        + '<p class="text-sm leading-relaxed">' + text + '</p>'
        + '<span class="text-[10px] text-blue-200 mt-2 block text-right">' + getTimestamp() + '</span>'
      + '</div>'
      + '<div class="w-8 h-8 rounded-lg bg-gray-300 overflow-hidden shrink-0">'
        + '<img src="https://ui-avatars.com/api/?name=Achmal+Maulana&background=0D8ABC&color=fff" alt="User Avatar" class="w-full h-full object-cover">'
      + '</div>';
    return wrapper;
  }

  function createBotBubble(html) {
    var wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-3';
    wrapper.innerHTML =
      '<div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">AI</div>'
      + '<div class="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-lg">'
        + '<p class="text-sm text-gray-800 leading-relaxed">' + html + '</p>'
        + '<span class="text-[10px] text-gray-400 mt-2 block">' + getTimestamp() + '</span>'
      + '</div>';
    return wrapper;
  }

  function createTypingIndicator() {
    var wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-3';
    wrapper.id = 'typingIndicator';
    wrapper.innerHTML =
      '<div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">AI</div>'
      + '<div class="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">'
        + '<div class="flex items-center gap-1">'
          + '<span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>'
          + '<span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>'
          + '<span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>'
        + '</div>'
      + '</div>';
    return wrapper;
  }

  function findAnswer(question) {
    var q = question.toLowerCase().trim();

    for (var key in FAQ) {
      if (q.indexOf(key) !== -1 || key.indexOf(q) !== -1) {
        return FAQ[key];
      }
    }

    var keywords = {
      'poin':       'Untuk informasi detail poin, silakan cek halaman <strong>Dashboard</strong> atau tanyakan pertanyaan yang lebih spesifik, misalnya: "Berapa poin syarat yudisium D4?"',
      'sertifikat': 'Sertifikat yang diunggah harus dalam format <strong>PDF, JPG, atau PNG</strong> dengan ukuran maksimal <strong>2 MB</strong>. Pastikan nama mahasiswa tertera jelas.',
      'yudisium':   'Syarat yudisium D4 di PNC memerlukan minimal <strong>36 Poin</strong> keaktifan, termasuk kegiatan wajib PKKMB, LDDK, dan LKMM.',
      'organisasi': 'Kepengurusan organisasi/panitia memberikan poin: <strong>Nasional 5</strong>, <strong>Provinsi 3</strong>, <strong>Internal 1 Poin</strong>.',
      'seminar':    'Keikutsertaan seminar/workshop memberikan poin: <strong>Nasional 3</strong>, <strong>Provinsi 2</strong>, <strong>Internal 1 Poin</strong>.'
    };

    for (var kw in keywords) {
      if (q.indexOf(kw) !== -1) {
        return keywords[kw];
      }
    }

    return 'Maaf, saya belum bisa menjawab pertanyaan tersebut. Coba tanyakan seputar <strong>poin keaktifan</strong>, <strong>syarat yudisium</strong>, atau <strong>cara pengajuan sertifikat</strong>.';
  }

  function sendMessage(text) {
    if (!text.trim() || !messageArea) return;

    if (suggestionsBox) suggestionsBox.classList.add('hidden');

    messageArea.appendChild(createUserBubble(text));

    var typing = createTypingIndicator();
    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    setTimeout(function () {
      var indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();

      var answer = findAnswer(text);
      messageArea.appendChild(createBotBubble(answer));
      messageArea.scrollTop = messageArea.scrollHeight;
    }, 1000);

    if (chatInput) chatInput.value = '';
  }

  if (btnSend) {
    btnSend.addEventListener('click', function (e) {
      e.preventDefault();
      if (chatInput) sendMessage(chatInput.value);
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });
  }

  if (suggestionsBox) {
    suggestionsBox.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      sendMessage(btn.textContent.trim());
    });
  }

});
