import {MECI_TOPICS} from '../data/ecosystemData.js';
import {iconClose} from '../utils/icons.js';

export function createMeciDrawer({onNavigate}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'overlay-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'meci-drawer-title');

  const messages = [
    {
      sender: 'meci',
      text: 'Halo! Saya Asisten MECI dari PT MEC Akses Inovasi. Ada yang bisa saya bantu terkait verifikasi sertifikat, produk MPV, tes TOEFL PBT/ESP, atau legalitas PSE Komdigi?',
    },
  ];

  backdrop.innerHTML = `
    <div class="bottom-sheet">
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="sheet-header">
        <div>
          <h2 id="meci-drawer-title" style="font-size:16px;font-weight:700;">Asisten MECI</h2>
          <p class="meta-line">Layanan Bantuan Ekosistem MECAI.ai · 24/7 Mandiri</p>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-meci-close aria-label="Tutup Asisten MECI">
          ${iconClose()}
        </button>
      </div>
      <div class="sheet-body" data-meci-body>
        <div class="preset-row" style="margin-bottom:14px;" data-meci-topics>
          ${MECI_TOPICS.map(
            (t) => `<button type="button" class="preset-btn" data-topic-key="${t.key}">${t.label}</button>`
          ).join('')}
        </div>
        <div class="chat-stream" data-meci-stream></div>
      </div>
      <form class="sheet-footer" data-meci-form style="display:flex;gap:8px;">
        <input
          type="text"
          class="input-control"
          data-meci-input
          placeholder="Tanyakan seputar Verify, TOEFL/ESP, atau Komdigi..."
          aria-label="Pertanyaan untuk Asisten MECI"
        />
        <button type="submit" class="btn btn-primary">Kirim</button>
      </form>
    </div>
  `;

  const streamEl = backdrop.querySelector('[data-meci-stream]');
  const bodyEl = backdrop.querySelector('[data-meci-body]');
  const formEl = backdrop.querySelector('[data-meci-form]');
  const inputEl = backdrop.querySelector('[data-meci-input]');

  function renderMessages() {
    streamEl.innerHTML = messages
      .map((msg) => {
        const cls = msg.sender === 'user' ? 'is-user' : 'is-meci';
        const actionHtml = msg.actionTab
          ? `<div class="chat-actions">
               <button type="button" class="btn btn-outline btn-sm" data-meci-nav="${msg.actionTab}">
                 ${msg.actionLabel}
               </button>
             </div>`
          : '';
        return `<div class="chat-msg ${cls}"><div>${escapeHtml(msg.text)}</div>${actionHtml}</div>`;
      })
      .join('');
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function resolveAnswer(query) {
    const q = query.toLowerCase();
    if (q.includes('mpv') || q.includes('produk') || q.includes('hardware') || q.includes('alat')) {
      return MECI_TOPICS[1];
    }
    if (q.includes('sertifikat') || q.includes('verify') || q.includes('qr') || q.includes('verifikasi')) {
      return MECI_TOPICS[0];
    }
    if (q.includes('toefl') || q.includes('esp') || q.includes('tes') || q.includes('daftar') || q.includes('simulasi')) {
      return MECI_TOPICS[2];
    }
    if (q.includes('komdigi') || q.includes('pse') || q.includes('legal') || q.includes('kontak') || q.includes('privasi')) {
      return MECI_TOPICS[3];
    }
    return {
      answer:
        'Terima kasih telah menghubungi Asisten MECI. Anda dapat memilih topik cepat di atas untuk mengecek sertifikat/MPV, mengikuti simulasi TOEFL PBT & ESP, atau menghubungi tim resmi kami di support@mecai.ai.',
      actionLabel: 'Lihat Kontak Resmi',
      actionTab: 'info',
    };
  }

  function submitQuery(text, topicKey = null) {
    const clean = text.trim();
    if (!clean) return;
    messages.push({sender: 'user', text: clean});
    const matched = topicKey
      ? MECI_TOPICS.find((t) => t.key === topicKey) || resolveAnswer(clean)
      : resolveAnswer(clean);
    messages.push({
      sender: 'meci',
      text: matched.answer,
      actionLabel: matched.actionLabel,
      actionTab: matched.actionTab,
    });
    renderMessages();
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-meci-close]')) {
      close();
      return;
    }
    const topicBtn = e.target.closest('[data-topic-key]');
    if (topicBtn) {
      const topic = MECI_TOPICS.find((t) => t.key === topicBtn.dataset.topicKey);
      if (topic) submitQuery(topic.label, topic.key);
      return;
    }
    const navBtn = e.target.closest('[data-meci-nav]');
    if (navBtn) {
      const tab = navBtn.dataset.meciNav;
      close();
      onNavigate(tab);
    }
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    submitQuery(inputEl.value);
    inputEl.value = '';
  });

  function open(initialTopicKey = null) {
    renderMessages();
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (initialTopicKey) {
      const topic = MECI_TOPICS.find((t) => t.key === initialTopicKey);
      if (topic) submitQuery(topic.label, topic.key);
    }
    setTimeout(() => inputEl.focus(), 180);
  }

  function close() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.body.appendChild(backdrop);
  return {open, close};
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
