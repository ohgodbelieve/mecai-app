import './styles/main.css';

import {createMeciDrawer} from './components/meciDrawer.js';
import {createQrScannerModal} from './components/qrScannerModal.js';
import {
  iconChat,
  iconHome,
  iconInfo,
  iconToefl,
  iconVerify,
} from './utils/icons.js';
import {renderHomeView} from './views/homeView.js';
import {renderInfoView} from './views/infoView.js';
import {renderToeflView} from './views/toeflView.js';
import {renderVerifyView} from './views/verifyView.js';

const NAV_ITEMS = [
  {id: 'home', label: 'Beranda', icon: iconHome},
  {id: 'verify', label: 'Verify', icon: iconVerify},
  {id: 'toefl', label: 'TOEFL/ESP', icon: iconToefl},
  {id: 'info', label: 'Akun/Info', icon: iconInfo},
];

const state = {
  activeTab: 'home',
  verifyMode: 'cert',
  verifyQuery: '',
};

const appRoot = document.getElementById('app');

appRoot.innerHTML = `
  <div class="app-shell">
    <header class="top-header">
      <div class="top-header-inner">
        <button type="button" class="brand-wordmark" data-nav-tab="home">
          <span>MECAI<span class="brand-wordmark-dot">.ai</span></span>
        </button>

        <nav class="desktop-nav" aria-label="Navigasi utama">
          ${NAV_ITEMS.map(
            (item) => `
            <button type="button" class="desktop-nav-link" data-nav-tab="${item.id}">
              ${item.label}
            </button>
          `
          ).join('')}
        </nav>

        <div class="header-actions">
          <button type="button" class="btn btn-navy btn-sm" data-header-meci>
            ${iconChat()} Asisten MECI
          </button>
        </div>
      </div>
    </header>

    <main class="main-content" id="main-view"></main>

    <nav class="bottom-nav" aria-label="Navigasi bawah aplikasi">
      <div class="bottom-nav-grid" data-bottom-nav></div>
    </nav>

    <div class="toast-container" id="toast-container" aria-live="polite"></div>
  </div>
`;

const mainViewEl = document.getElementById('main-view');
const bottomNavEl = appRoot.querySelector('[data-bottom-nav]');
const toastContainerEl = document.getElementById('toast-container');

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;
  toastContainerEl.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

const meciDrawer = createMeciDrawer({
  onNavigate: (tab) => navigateTo(tab),
});

let qrDetectedCallback = null;
const qrModal = createQrScannerModal({
  onDetected: (payload) => {
    if (qrDetectedCallback) {
      qrDetectedCallback(payload);
    }
  },
});

function navigateTo(tabId, options = {}) {
  if (!NAV_ITEMS.some((n) => n.id === tabId)) return;
  state.activeTab = tabId;
  if (options.verifyMode) state.verifyMode = options.verifyMode;
  if (typeof options.verifyQuery === 'string') state.verifyQuery = options.verifyQuery;

  window.location.hash = tabId === 'home' ? '#beranda' : `#${tabId}`;
  renderShellNav();
  renderCurrentView();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function renderShellNav() {
  appRoot.querySelectorAll('.desktop-nav-link').forEach((btn) => {
    const active = btn.dataset.navTab === state.activeTab;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });

  bottomNavEl.innerHTML = NAV_ITEMS.map((item) => {
    const active = item.id === state.activeTab;
    return `
      <button
        type="button"
        class="bottom-nav-btn ${active ? 'is-active' : ''}"
        data-nav-tab="${item.id}"
        aria-current="${active ? 'page' : 'false'}"
      >
        ${item.icon(active)}
        <span class="bottom-nav-label">${item.label}</span>
      </button>
    `;
  }).join('');
}

function renderCurrentView() {
  mainViewEl.innerHTML = '';
  let viewNode = null;

  if (state.activeTab === 'home') {
    viewNode = renderHomeView({
      onNavigate: (tab) => navigateTo(tab),
      onOpenMeci: (topic) => meciDrawer.open(topic),
      onStartVerifyMode: (mode, query) => navigateTo('verify', {verifyMode: mode, verifyQuery: query}),
    });
  } else if (state.activeTab === 'verify') {
    viewNode = renderVerifyView({
      initialMode: state.verifyMode,
      initialQuery: state.verifyQuery,
      onOpenQrScanner: (cb) => {
        qrDetectedCallback = cb;
        qrModal.open();
      },
      onOpenMeci: (topic) => meciDrawer.open(topic),
      showToast,
    });
  } else if (state.activeTab === 'toefl') {
    viewNode = renderToeflView({
      onVerifyCert: (certId) => navigateTo('verify', {verifyMode: 'cert', verifyQuery: certId}),
      showToast,
    });
  } else if (state.activeTab === 'info') {
    viewNode = renderInfoView({
      onOpenMeci: (topic) => meciDrawer.open(topic),
      showToast,
    });
  }

  if (viewNode) {
    mainViewEl.appendChild(viewNode);
  }
}

appRoot.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-nav-tab]');
  if (navBtn) {
    navigateTo(navBtn.dataset.navTab);
    return;
  }

  if (e.target.closest('[data-header-meci]')) {
    meciDrawer.open();
  }
});

// Sync initial hash route if present
const initialHash = window.location.hash.replace('#', '');
if (initialHash === 'verify') state.activeTab = 'verify';
else if (initialHash === 'toefl' || initialHash === 'toefl-esp') state.activeTab = 'toefl';
else if (initialHash === 'info' || initialHash === 'akun-info') state.activeTab = 'info';

renderShellNav();
renderCurrentView();
