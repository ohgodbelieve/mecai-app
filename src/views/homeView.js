import {ECOSYSTEM_METRICS, ECOSYSTEM_PILLARS} from '../data/ecosystemData.js';
import {
  iconBox,
  iconChat,
  iconChevronRight,
  iconToefl,
  iconVerify,
} from '../utils/icons.js';
import {getSimulationResults, getVerifyHistory} from '../utils/storage.js';

export function renderHomeView({onNavigate, onOpenMeci, onStartVerifyMode}) {
  const verifyHistory = getVerifyHistory();
  const simResults = getSimulationResults();

  const recentItems = [
    ...verifyHistory.slice(0, 2).map((item) => ({
      title: `${item.id}`,
      sub: `${item.type === 'mpv' ? 'Produk MPV' : 'Sertifikat'} · ${item.statusLabel}`,
      action: () => onStartVerifyMode(item.type, item.id),
    })),
    ...simResults.slice(0, 2).map((sim) => ({
      title: `Simulasi ${sim.programLabel}`,
      sub: `Skor ${sim.displayScore} · ${sim.dateLabel}`,
      action: () => onNavigate('toefl'),
    })),
  ].slice(0, 3);

  const section = document.createElement('div');
  section.className = 'page-stack';

  section.innerHTML = `
    <section class="surface-navy">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="meta-line meta-line-inverse">
            <span>PT MEC Akses Inovasi</span>
            <span aria-hidden="true">·</span>
            <span>PSE Komdigi Terdaftar</span>
          </p>
          <h1 class="hero-title">Future-Ready AI Ecosystem untuk Kompetensi & Verifikasi Digital</h1>
          <p class="hero-desc">
            MECAI.ai menyatukan asesmen bahasa berstandar TOEFL PBT & ESP, validasi sertifikat resmi, serta MECAI Product Verification (MPV) dalam satu pengalaman aplikasi mobile yang cepat dan tepercaya.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" data-home-action="verify">
              ${iconVerify(false)} Verifikasi Sekarang
            </button>
            <button type="button" class="btn btn-outline" data-home-action="toefl" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.22);color:#fff;">
              Simulasi TOEFL / ESP
            </button>
          </div>
        </div>
        <div class="hero-media">
          <img
            src="/src/assets/images/mecai_ecosystem_hero_1795591211745.jpg"
            alt="Lingkungan inovasi digital PT MEC Akses Inovasi dan studio asesmen MECAI.ai"
            referrerpolicy="no-referrer"
            onerror="this.style.display='none';this.nextElementSibling.classList.add('is-visible');"
          />
          <div class="media-fallback">
            <strong style="font-family:var(--font-display);font-size:18px;">MECAI.ai Innovation Hub</strong>
            <span style="font-size:13px;color:#cbd5e1;">PT MEC Akses Inovasi · Future-Ready AI Ecosystem</span>
          </div>
        </div>
      </div>
    </section>

    <section aria-label="Metrik Ekosistem MECAI">
      <div class="kpi-strip">
        ${ECOSYSTEM_METRICS.map(
          (m) => `
          <div class="kpi-item">
            <div class="kpi-value tabular-nums">${m.value}</div>
            <div class="kpi-label">${m.label}</div>
          </div>
        `
        ).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2 class="section-title">Akses Cepat Layanan</h2>
          <p class="section-subtitle">Pilih layanan utama ekosistem MECAI.ai dalam satu ketukan.</p>
        </div>
      </div>
      <div class="quick-grid">
        <button type="button" class="quick-tile" data-quick="cert">
          <span class="quick-icon">${iconVerify(false)}</span>
          <span class="quick-title">Cek Sertifikat</span>
          <span class="quick-desc">Validasi nomor sertifikat & keaslian digital.</span>
        </button>
        <button type="button" class="quick-tile" data-quick="mpv">
          <span class="quick-icon">${iconBox()}</span>
          <span class="quick-title">Produk MPV</span>
          <span class="quick-desc">Verifikasi keaslian perangkat & kit MECAI.</span>
        </button>
        <button type="button" class="quick-tile" data-quick="toefl">
          <span class="quick-icon">${iconToefl(false)}</span>
          <span class="quick-title">TOEFL PBT / ESP</span>
          <span class="quick-desc">Daftar program & coba simulasi tes adaptif.</span>
        </button>
        <button type="button" class="quick-tile" data-quick="meci">
          <span class="quick-icon">${iconChat()}</span>
          <span class="quick-title">Asisten MECI</span>
          <span class="quick-desc">Panduan cepat verifikasi & kendala akun.</span>
        </button>
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2 class="section-title">Pilar Ekosistem MECAI.ai</h2>
          <p class="section-subtitle">Dibangun oleh PT MEC Akses Inovasi untuk institusi pendidikan dan industri.</p>
        </div>
      </div>
      <div class="pillars-grid">
        ${ECOSYSTEM_PILLARS.map(
          (p) => `
          <article class="pillar-card">
            <span class="pillar-index">${p.index}</span>
            <h3 style="font-size:16px;font-weight:700;">${p.title}</h3>
            <p style="font-size:13.5px;color:var(--text-secondary);line-height:1.55;">${p.description}</p>
          </article>
        `
        ).join('')}
      </div>
    </section>

    <section class="surface-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">Aktivitas Terbaru Anda</h2>
          <p class="section-subtitle">Riwayat pengecekan verifikasi dan hasil simulasi tersimpan di perangkat ini.</p>
        </div>
      </div>
      ${
        recentItems.length === 0
          ? `<div class="surface-subtle" style="text-align:center;">
               <p style="font-size:13.5px;color:var(--text-secondary);">Belum ada aktivitas verifikasi atau simulasi. Mulai dengan memeriksa contoh sertifikat atau mengikuti simulasi TOEFL/ESP.</p>
               <div style="display:flex;justify-content:center;gap:10px;margin-top:12px;flex-wrap:wrap;">
                 <button type="button" class="btn btn-outline btn-sm" data-quick="cert">Cek Contoh Sertifikat</button>
                 <button type="button" class="btn btn-primary btn-sm" data-quick="toefl">Mulai Simulasi</button>
               </div>
             </div>`
          : `<div class="tap-list" data-recent-list>
               ${recentItems
                 .map(
                   (item, idx) => `
                 <button type="button" class="tap-row" data-recent-idx="${idx}">
                   <span class="tap-row-left">
                     <span class="tap-row-icon">${iconVerify(false)}</span>
                     <span>
                       <span class="tap-row-title mono" style="display:block;">${item.title}</span>
                       <span class="tap-row-sub" style="display:block;">${item.sub}</span>
                     </span>
                   </span>
                   ${iconChevronRight()}
                 </button>
               `
                 )
                 .join('')}
             </div>`
      }
    </section>
  `;

  section.addEventListener('click', (e) => {
    const heroAction = e.target.closest('[data-home-action]');
    if (heroAction) {
      onNavigate(heroAction.dataset.homeAction);
      return;
    }

    const quick = e.target.closest('[data-quick]');
    if (quick) {
      const target = quick.dataset.quick;
      if (target === 'cert') onStartVerifyMode('cert', '');
      else if (target === 'mpv') onStartVerifyMode('mpv', '');
      else if (target === 'toefl') onNavigate('toefl');
      else if (target === 'meci') onOpenMeci();
      return;
    }

    const recentBtn = e.target.closest('[data-recent-idx]');
    if (recentBtn) {
      const idx = Number(recentBtn.dataset.recentIdx);
      if (recentItems[idx]) recentItems[idx].action();
    }
  });

  return section;
}
