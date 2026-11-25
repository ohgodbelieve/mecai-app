import {QR_SIMULATION_PRESETS} from '../data/ecosystemData.js';
import {iconClose, iconQr} from '../utils/icons.js';

export function createQrScannerModal({onDetected}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'overlay-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'qr-modal-title');

  let mediaStream = null;
  let scanTimer = null;

  backdrop.innerHTML = `
    <div class="bottom-sheet">
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="sheet-header">
        <div>
          <h2 id="qr-modal-title" style="font-size:16px;font-weight:700;">Simulasi Scan QR MECAI</h2>
          <p class="meta-line">Kamera perangkat atau pilih sampel QR terenkripsi</p>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-qr-close aria-label="Tutup Pemindai QR">
          ${iconClose()}
        </button>
      </div>
      <div class="sheet-body" style="display:flex;flex-direction:column;gap:16px;">
        <div class="qr-viewfinder">
          <video class="qr-video" data-qr-video autoplay playsinline muted></video>
          <div class="qr-reticle">
            <div class="qr-laser" aria-hidden="true"></div>
          </div>
        </div>
        <div style="text-align:center;">
          <p data-qr-status style="font-size:13px;color:var(--text-secondary);">
            Arahkan kode QR ke bingkai atau pilih salah satu sampel QR di bawah untuk simulasi instan.
          </p>
          <button type="button" class="btn btn-outline btn-sm" data-qr-camera style="margin-top:10px;">
            ${iconQr()} Aktifkan Kamera Perangkat
          </button>
        </div>
        <div>
          <p class="field-label" style="margin-bottom:8px;">Pilih Sampel QR Simulasi:</p>
          <div class="tap-list">
            ${QR_SIMULATION_PRESETS.map(
              (preset) => `
              <button type="button" class="tap-row" data-qr-preset="${preset.id}" data-qr-mode="${preset.mode}">
                <span class="tap-row-left">
                  <span class="tap-row-icon">${iconQr()}</span>
                  <span>
                    <span class="tap-row-title" style="display:block;">${preset.title}</span>
                    <span class="tap-row-sub mono" style="display:block;">${preset.subtitle}</span>
                  </span>
                </span>
                <span style="font-size:12.5px;font-weight:600;color:var(--accent);flex-shrink:0;">Pindai</span>
              </button>
            `
            ).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const videoEl = backdrop.querySelector('[data-qr-video]');
  const statusEl = backdrop.querySelector('[data-qr-status]');

  function stopCamera() {
    if (scanTimer) {
      clearTimeout(scanTimer);
      scanTimer = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }

  async function tryEnableCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      statusEl.textContent = 'Kamera tidak tersedia pada browser ini. Gunakan tombol sampel QR di bawah.';
      return;
    }
    try {
      statusEl.textContent = 'Meminta izin akses kamera...';
      mediaStream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
      videoEl.srcObject = mediaStream;
      statusEl.textContent = 'Kamera aktif. Pilih sampel QR atau arahkan QR ke bingkai pemindai.';
    } catch {
      statusEl.textContent =
        'Izin kamera ditolak atau tidak tersedia di preview. Silakan pilih sampel QR simulasi di bawah.';
    }
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-qr-close]')) {
      close();
      return;
    }
    if (e.target.closest('[data-qr-camera]')) {
      tryEnableCamera();
      return;
    }
    const presetBtn = e.target.closest('[data-qr-preset]');
    if (presetBtn) {
      const id = presetBtn.dataset.qrPreset;
      const mode = presetBtn.dataset.qrMode;
      statusEl.textContent = `Memindai kode ${id}...`;
      scanTimer = setTimeout(() => {
        close();
        onDetected({id, mode});
      }, 650);
    }
  });

  function open() {
    statusEl.textContent =
      'Arahkan kode QR ke bingkai atau pilih salah satu sampel QR di bawah untuk simulasi instan.';
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    stopCamera();
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.body.appendChild(backdrop);
  return {open, close};
}
