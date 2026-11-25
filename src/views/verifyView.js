import {CERTIFICATE_RECORDS, MPV_PRODUCT_RECORDS} from '../data/ecosystemData.js';
import {
  iconAlert,
  iconBox,
  iconCheck,
  iconCopy,
  iconQr,
  iconVerify,
} from '../utils/icons.js';
import {
  addVerifyHistory,
  clearVerifyHistory,
  getDynamicCerts,
  getVerifyHistory,
} from '../utils/storage.js';

export function renderVerifyView({
  initialMode = 'cert',
  initialQuery = '',
  onOpenQrScanner,
  onOpenMeci,
  showToast,
}) {
  let mode = initialMode;
  let query = initialQuery;
  let currentResult = null;

  const container = document.createElement('div');
  container.className = 'page-stack';

  function lookupRecord(rawId, targetMode) {
    const id = rawId.trim().toUpperCase();
    if (!id) return null;

    const dynamicCerts = getDynamicCerts();
    const certMatch = CERTIFICATE_RECORDS[id] || dynamicCerts[id];
    const mpvMatch = MPV_PRODUCT_RECORDS[id];

    if (targetMode === 'cert') {
      if (certMatch) return certMatch;
      if (mpvMatch) return mpvMatch;
    } else {
      if (mpvMatch) return mpvMatch;
      if (certMatch) return certMatch;
    }

    return {
      id,
      type: targetMode,
      status: 'invalid',
    };
  }

  function runVerification(inputId, forcedMode = null) {
    const clean = inputId.trim().toUpperCase();
    if (!clean) {
      showToast('Masukkan nomor sertifikat atau ID produk MPV terlebih dahulu.');
      return;
    }
    if (forcedMode) {
      mode = forcedMode;
    }
    query = clean;
    const record = lookupRecord(clean, mode);
    if (record && record.type) {
      mode = record.type;
    }
    currentResult = record;

    const statusLabel =
      record.status === 'valid'
        ? 'Terverifikasi Asli'
        : record.status === 'expired'
        ? 'Masa Berlaku Habis'
        : 'Tidak Terdaftar';

    addVerifyHistory({
      id: record.id,
      type: mode,
      status: record.status,
      statusLabel,
      checkedAt: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'}),
    });

    render();
  }

  function renderResultCard() {
    if (!currentResult) {
      return `
        <div class="surface-subtle">
          <p style="font-size:13.5px;color:var(--text-secondary);">
            Masukkan nomor sertifikat atau ID produk MPV di atas, lalu tekan <strong>Periksa Keaslian</strong> atau gunakan <strong>Simulasi Scan QR</strong>.
          </p>
        </div>
      `;
    }

    if (currentResult.status === 'invalid') {
      return `
        <article class="verify-result is-invalid" aria-live="polite">
          <div class="status-banner-head">
            <span class="status-icon-box">${iconAlert()}</span>
            <div>
              <h3 style="font-size:16px;font-weight:700;color:var(--danger);">ID Tidak Ditemukan / Tidak Terdaftar</h3>
              <p class="meta-line" style="margin-top:4px;">
                <span class="mono">${currentResult.id}</span>
                <span aria-hidden="true">·</span>
                <span>Pastikan format kode benar</span>
              </p>
            </div>
          </div>
          <p style="font-size:13.5px;color:var(--text-primary);">
            Kode tersebut tidak tercatat dalam basis data sertifikat MECAI.ai maupun registrasi MECAI Product Verification (MPV). Jika Anda yakin dokumen atau produk berasal dari mitra resmi, hubungi Asisten MECI.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <button type="button" class="btn btn-outline btn-sm" data-verify-help>Tanya Asisten MECI</button>
          </div>
        </article>
      `;
    }

    if (currentResult.type === 'mpv') {
      return `
        <article class="verify-result is-valid" aria-live="polite">
          <div class="status-banner-head">
            <span class="status-icon-box">${iconCheck()}</span>
            <div>
              <h3 style="font-size:16px;font-weight:700;color:var(--success);">Produk Resmi MECAI Terverifikasi (MPV)</h3>
              <p class="meta-line" style="margin-top:4px;">
                <span class="mono">${currentResult.id}</span>
                <span aria-hidden="true">·</span>
                <span>Perangkat & Lisensi Asli</span>
              </p>
            </div>
          </div>
          <div class="detail-list">
            <div class="detail-row"><span class="detail-key">Nama Produk</span><span class="detail-val">${currentResult.productName}</span></div>
            <div class="detail-row"><span class="detail-key">Nomor Seri</span><span class="detail-val mono">${currentResult.serialNumber}</span></div>
            <div class="detail-row"><span class="detail-key">Kode Batch</span><span class="detail-val mono">${currentResult.batchCode}</span></div>
            <div class="detail-row"><span class="detail-key">Tier Lisensi</span><span class="detail-val">${currentResult.licenseTier}</span></div>
            <div class="detail-row"><span class="detail-key">Status Garansi</span><span class="detail-val">${currentResult.warrantyStatus}</span></div>
            <div class="detail-row"><span class="detail-key">Lokasi / Mitra</span><span class="detail-val">${currentResult.partnerLocation}</span></div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <button type="button" class="btn btn-outline btn-sm" data-copy-id="${currentResult.id}">
              ${iconCopy()} Salin ID MPV
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-download-proof>
              Unduh Bukti Verifikasi
            </button>
          </div>
        </article>
      `;
    }

    const isExpired = currentResult.status === 'expired';
    return `
      <article class="verify-result ${isExpired ? 'is-expired' : 'is-valid'}" aria-live="polite">
        <div class="status-banner-head">
          <span class="status-icon-box">${isExpired ? iconAlert() : iconCheck()}</span>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:${isExpired ? 'var(--warning)' : 'var(--success)'};">
              ${isExpired ? 'Sertifikat Terdaftar — Masa Berlaku Habis' : 'Sertifikat Resmi Terverifikasi Asli'}
            </h3>
            <p class="meta-line" style="margin-top:4px;">
              <span class="mono">${currentResult.id}</span>
              <span aria-hidden="true">·</span>
              <span>${currentResult.issuer}</span>
            </p>
          </div>
        </div>
        <div class="detail-list">
          <div class="detail-row"><span class="detail-key">Nama Pemegang</span><span class="detail-val">${currentResult.holderName}</span></div>
          <div class="detail-row"><span class="detail-key">Program</span><span class="detail-val">${currentResult.program}</span></div>
          <div class="detail-row"><span class="detail-key">Skor / Predikat</span><span class="detail-val tabular-nums">${currentResult.scoreOrGrade}</span></div>
          <div class="detail-row"><span class="detail-key">Tanggal Terbit</span><span class="detail-val">${currentResult.issuedDate}</span></div>
          <div class="detail-row"><span class="detail-key">Berlaku Hingga</span><span class="detail-val">${currentResult.validUntil}</span></div>
          <div class="detail-row"><span class="detail-key">Sidik Digital</span><span class="detail-val mono">${currentResult.hash}</span></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          <button type="button" class="btn btn-outline btn-sm" data-copy-id="${currentResult.id}">
            ${iconCopy()} Salin Tautan Verifikasi
          </button>
          <button type="button" class="btn btn-primary btn-sm" data-download-proof>
            Unduh Ringkasan Bukti
          </button>
        </div>
      </article>
    `;
  }

  function render() {
    const history = getVerifyHistory();
    const presets =
      mode === 'cert'
        ? ['MECAI-CERT-2026-0891', 'MECAI-ESP-2026-0412', 'MECAI-CERT-2024-0045', 'MECAI-FAKE-0000']
        : ['MPV-NODE-AI-7740', 'MPV-KIT-EDU-2026', 'MPV-LAB-EDGE-309', 'MPV-UNKNOWN-111'];

    container.innerHTML = `
      <section class="surface-card">
        <div class="section-header">
          <div>
            <h1 class="section-title" style="font-size:20px;">Verifikasi Sertifikat & Produk MPV</h1>
            <p class="section-subtitle">Pastikan keaslian kredensial digital dan perangkat keras resmi PT MEC Akses Inovasi.</p>
          </div>
        </div>

        <div class="segmented-control" role="tablist" aria-label="Jenis verifikasi" style="margin:14px 0 16px;">
          <button type="button" role="tab" aria-selected="${mode === 'cert'}" class="segment-btn ${mode === 'cert' ? 'is-active' : ''}" data-verify-mode="cert">
            Sertifikat
          </button>
          <button type="button" role="tab" aria-selected="${mode === 'mpv'}" class="segment-btn ${mode === 'mpv' ? 'is-active' : ''}" data-verify-mode="mpv">
            Produk MPV
          </button>
        </div>

        <form data-verify-form style="display:flex;flex-direction:column;gap:12px;">
          <div class="field-group">
            <label for="verify-id-input" class="field-label">
              ${mode === 'cert' ? 'Nomor Sertifikat MECAI' : 'ID Produk / Serial MPV'}
            </label>
            <input
              id="verify-id-input"
              type="text"
              class="input-control mono"
              value="${query}"
              placeholder="${mode === 'cert' ? 'Contoh: MECAI-CERT-2026-0891' : 'Contoh: MPV-NODE-AI-7740'}"
              autocomplete="off"
            />
          </div>

          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;">
            <button type="submit" class="btn btn-primary">
              ${mode === 'cert' ? iconVerify(false) : iconBox()} Periksa Keaslian
            </button>
            <button type="button" class="btn btn-navy" data-open-qr>
              ${iconQr()} Scan QR
            </button>
          </div>
        </form>

        <div style="margin-top:16px;">
          <p class="field-label" style="margin-bottom:8px;">Contoh ID Uji Cepat:</p>
          <div class="preset-row">
            ${presets
              .map(
                (code) => `<button type="button" class="preset-btn" data-preset-id="${code}">${code}</button>`
              )
              .join('')}
          </div>
        </div>
      </section>

      <section>
        ${renderResultCard()}
      </section>

      <section class="surface-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Riwayat Pengecekan</h2>
            <p class="section-subtitle">Ketuk riwayat untuk memeriksa ulang secara instan.</p>
          </div>
          ${
            history.length > 0
              ? `<button type="button" class="btn btn-ghost btn-sm" data-clear-history>Hapus</button>`
              : ''
          }
        </div>
        ${
          history.length === 0
            ? `<p style="font-size:13.5px;color:var(--text-muted);">Belum ada riwayat verifikasi tersimpan.</p>`
            : `<div class="tap-list">
                ${history
                  .map(
                    (h) => `
                  <button type="button" class="tap-row" data-history-id="${h.id}" data-history-mode="${h.type}">
                    <span class="tap-row-left">
                      <span class="tap-row-icon">${h.type === 'mpv' ? iconBox() : iconVerify(false)}</span>
                      <span>
                        <span class="tap-row-title mono" style="display:block;">${h.id}</span>
                        <span class="tap-row-sub" style="display:block;">${h.statusLabel} · Pukul ${h.checkedAt}</span>
                      </span>
                    </span>
                    <span style="font-size:12.5px;font-weight:600;color:var(--accent);">Cek Ulang</span>
                  </button>
                `
                  )
                  .join('')}
               </div>`
        }
      </section>
    `;
  }

  container.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-verify-mode]');
    if (modeBtn) {
      mode = modeBtn.dataset.verifyMode;
      currentResult = null;
      query = '';
      render();
      return;
    }

    if (e.target.closest('[data-open-qr]')) {
      onOpenQrScanner(({id, mode: qrMode}) => {
        runVerification(id, qrMode);
      });
      return;
    }

    const presetBtn = e.target.closest('[data-preset-id]');
    if (presetBtn) {
      runVerification(presetBtn.dataset.presetId, mode);
      return;
    }

    const histBtn = e.target.closest('[data-history-id]');
    if (histBtn) {
      runVerification(histBtn.dataset.historyId, histBtn.dataset.historyMode);
      return;
    }

    if (e.target.closest('[data-clear-history]')) {
      clearVerifyHistory();
      render();
      showToast('Riwayat verifikasi dihapus.');
      return;
    }

    const copyBtn = e.target.closest('[data-copy-id]');
    if (copyBtn) {
      const id = copyBtn.dataset.copyId;
      const url = `${window.location.origin}/#verify?id=${encodeURIComponent(id)}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => showToast('Tautan verifikasi disalin ke clipboard.'));
      } else {
        showToast(`Kode terverifikasi: ${id}`);
      }
      return;
    }

    if (e.target.closest('[data-download-proof]') && currentResult) {
      const lines = [
        'BUKTI VERIFIKASI RESMI — MECAI.AI (PT MEC AKSES INOVASI)',
        `ID Dokumen/Produk : ${currentResult.id}`,
        `Status            : ${currentResult.status.toUpperCase()}`,
        currentResult.holderName ? `Pemegang          : ${currentResult.holderName}` : `Produk            : ${currentResult.productName}`,
        currentResult.program ? `Program           : ${currentResult.program}` : `Nomor Seri        : ${currentResult.serialNumber}`,
        `Waktu Cetak       : ${new Date().toLocaleString('id-ID')}`,
      ].join('\n');
      const blob = new Blob([lines], {type: 'text/plain;charset=utf-8'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `MECAI-Verify-${currentResult.id}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast('Ringkasan bukti verifikasi diunduh.');
      return;
    }

    if (e.target.closest('[data-verify-help]')) {
      onOpenMeci('verify');
    }
  });

  container.addEventListener('submit', (e) => {
    if (e.target.matches('[data-verify-form]')) {
      e.preventDefault();
      const input = container.querySelector('#verify-id-input');
      runVerification(input ? input.value : '');
    }
  });

  if (initialQuery) {
    runVerification(initialQuery, initialMode);
  } else {
    render();
  }

  return container;
}
