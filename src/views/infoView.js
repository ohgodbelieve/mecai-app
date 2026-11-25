import {LEGAL_INFO} from '../data/ecosystemData.js';
import {iconChat, iconCheck, iconCopy} from '../utils/icons.js';
import {
  getRegistrations,
  getSimulationResults,
  getUserProfile,
  getVerifyHistory,
  saveUserProfile,
} from '../utils/storage.js';

export function renderInfoView({onOpenMeci, showToast}) {
  const container = document.createElement('div');
  container.className = 'page-stack';

  function render() {
    const profile = getUserProfile();
    const verifyCount = getVerifyHistory().length;
    const regCount = getRegistrations().length;
    const simCount = getSimulationResults().length;

    container.innerHTML = `
      <section class="surface-card">
        <div class="section-header">
          <div>
            <h1 class="section-title" style="font-size:20px;">Akun & Informasi Resmi</h1>
            <p class="section-subtitle">Profil peserta, legalitas PSE Komdigi, kontak PT MEC Akses Inovasi, dan bantuan Asisten MECI.</p>
          </div>
        </div>

        <div class="kpi-strip" style="margin:14px 0 18px;">
          <div class="kpi-item">
            <div class="kpi-value tabular-nums">${verifyCount}</div>
            <div class="kpi-label">Cek Verify Tersimpan</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value tabular-nums">${regCount}</div>
            <div class="kpi-label">Pendaftaran Aktif</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value tabular-nums">${simCount}</div>
            <div class="kpi-label">Simulasi Selesai</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">Aktif</div>
            <div class="kpi-label">Status Ekosistem</div>
          </div>
        </div>

        <form data-profile-form style="display:flex;flex-direction:column;gap:12px;">
          <h2 style="font-size:16px;font-weight:700;">Profil Peserta</h2>
          <div class="form-grid">
            <div class="field-group">
              <label for="prof-nama" class="field-label">Nama Lengkap</label>
              <input id="prof-nama" name="nama" type="text" class="input-control" value="${escapeAttr(profile.nama)}" required />
            </div>
            <div class="field-group">
              <label for="prof-email" class="field-label">Email</label>
              <input id="prof-email" name="email" type="email" class="input-control" value="${escapeAttr(profile.email)}" required />
            </div>
            <div class="field-group">
              <label for="prof-wa" class="field-label">Nomor WhatsApp</label>
              <input id="prof-wa" name="whatsapp" type="tel" class="input-control tabular-nums" value="${escapeAttr(profile.whatsapp)}" required />
            </div>
            <div class="field-group">
              <label for="prof-instansi" class="field-label">Instansi / Kampus</label>
              <input id="prof-instansi" name="instansi" type="text" class="input-control" value="${escapeAttr(profile.instansi)}" required />
            </div>
          </div>
          <div>
            <button type="submit" class="btn btn-outline">Simpan Perubahan Profil</button>
          </div>
        </form>
      </section>

      <section class="surface-card">
        <div class="status-banner-head" style="margin-bottom:14px;">
          <span class="status-icon-box" style="background-color:var(--success-bg);color:var(--success);">
            ${iconCheck()}
          </span>
          <div>
            <h2 class="section-title">Legalitas PSE Komdigi</h2>
            <p class="meta-line" style="margin-top:4px;">${LEGAL_INFO.company} · ${LEGAL_INFO.brand}</p>
          </div>
        </div>

        <div class="detail-list">
          <div class="detail-row"><span class="detail-key">Status Regulasi</span><span class="detail-val">${LEGAL_INFO.pseStatus}</span></div>
          <div class="detail-row"><span class="detail-key">Instansi Pembina</span><span class="detail-val">${LEGAL_INFO.ministry}</span></div>
          <div class="detail-row"><span class="detail-key">Nomor Tanda Daftar PSE</span><span class="detail-val mono">${LEGAL_INFO.pseNumber}</span></div>
          <div class="detail-row"><span class="detail-key">NIB Perusahaan</span><span class="detail-val mono">${LEGAL_INFO.nib}</span></div>
          <div class="detail-row"><span class="detail-key">Sektor Sistem</span><span class="detail-val">${LEGAL_INFO.sector}</span></div>
          <div class="detail-row"><span class="detail-key">Kepatuhan Data</span><span class="detail-val">${LEGAL_INFO.privacyStandard}</span></div>
        </div>
      </section>

      <section class="two-col-split">
        <div class="surface-card">
          <h2 class="section-title" style="margin-bottom:12px;">Kontak Resmi PT MEC Akses Inovasi</h2>
          <div class="detail-list" style="padding-top:0;border-top:none;">
            <div class="detail-row">
              <span class="detail-key">Email Layanan</span>
              <span class="detail-val mono">${LEGAL_INFO.contacts.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">WhatsApp Resmi</span>
              <span class="detail-val mono">${LEGAL_INFO.contacts.whatsapp}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Jam Operasional</span>
              <span class="detail-val">${LEGAL_INFO.contacts.hours}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Alamat Kantor</span>
              <span class="detail-val">${LEGAL_INFO.contacts.office}</span>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;">
            <button type="button" class="btn btn-outline btn-sm" data-copy-text="${LEGAL_INFO.contacts.email}">
              ${iconCopy()} Salin Email
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-copy-text="${LEGAL_INFO.contacts.whatsapp}">
              ${iconCopy()} Salin WhatsApp
            </button>
          </div>
        </div>

        <div class="surface-navy" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
          <div>
            <p class="meta-line meta-line-inverse">Pusat Bantuan Terpadu</p>
            <h2 style="font-size:20px;font-weight:700;margin-top:6px;">Butuh Bantuan? Tanya Asisten MECI</h2>
            <p style="font-size:14px;color:#cbd5e1;margin-top:8px;line-height:1.55;">
              Dapatkan panduan cepat untuk verifikasi sertifikat, pengecekan ID produk MPV, kendala simulasi TOEFL PBT/ESP, atau verifikasi legalitas PT MEC Akses Inovasi.
            </p>
          </div>
          <div>
            <button type="button" class="btn btn-primary btn-full" data-open-meci-btn>
              ${iconChat()} Buka Asisten MECI
            </button>
          </div>
        </div>
      </section>
    `;
  }

  container.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-meci-btn]')) {
      onOpenMeci();
      return;
    }

    const copyBtn = e.target.closest('[data-copy-text]');
    if (copyBtn) {
      const txt = copyBtn.dataset.copyText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => showToast(`Disalin: ${txt}`));
      } else {
        showToast(txt);
      }
    }
  });

  container.addEventListener('submit', (e) => {
    if (e.target.matches('[data-profile-form]')) {
      e.preventDefault();
      const fd = new FormData(e.target);
      saveUserProfile({
        nama: String(fd.get('nama') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        whatsapp: String(fd.get('whatsapp') || '').trim(),
        instansi: String(fd.get('instansi') || '').trim(),
      });
      showToast('Profil peserta berhasil disimpan.');
      render();
    }
  });

  render();
  return container;
}

function escapeAttr(val) {
  return String(val || '').replace(/"/g, '&quot;');
}
