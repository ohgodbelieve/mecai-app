import {PROGRAMS, SIMULATION_QUESTIONS} from '../data/ecosystemData.js';
import {iconCheck, iconChevronRight, iconToefl, iconVolume} from '../utils/icons.js';
import {
  addRegistration,
  addSimulationResult,
  getRegistrations,
  getSimulationResults,
  getUserProfile,
  saveDynamicCert,
} from '../utils/storage.js';

export function renderToeflView({onVerifyCert, showToast}) {
  let activeProgram = 'toefl';
  let stage = 'overview'; // 'overview' | 'testing' | 'result'
  let currentQuestionIdx = 0;
  let answers = {};
  let remainingSeconds = 480;
  let timerInterval = null;
  let lastResult = null;
  let formError = '';

  const container = document.createElement('div');
  container.className = 'page-stack';

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function speakAudio(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Fitur suara browser tidak tersedia. Gunakan transkrip dialog di layar.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  }

  function startSimulation() {
    stopTimer();
    const questions = SIMULATION_QUESTIONS[activeProgram];
    currentQuestionIdx = 0;
    answers = {};
    remainingSeconds = activeProgram === 'toefl' ? 600 : 480;
    stage = 'testing';
    render();

    timerInterval = setInterval(() => {
      if (!document.body.contains(container)) {
        stopTimer();
        return;
      }
      remainingSeconds -= 1;
      const timerEl = container.querySelector('[data-sim-timer]');
      if (timerEl) timerEl.textContent = formatTime(Math.max(0, remainingSeconds));
      if (remainingSeconds <= 0) {
        finishSimulation(questions);
      }
    }, 1000);
  }

  function finishSimulation(questions) {
    stopTimer();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correctCount += 1;
    });

    const ratio = correctCount / questions.length;
    const profile = getUserProfile();
    const programMeta = PROGRAMS[activeProgram];

    let displayScore = '';
    if (activeProgram === 'toefl') {
      const pbtScore = Math.round(310 + ratio * (677 - 310));
      const cefr = pbtScore >= 600 ? 'CEFR C1' : pbtScore >= 520 ? 'CEFR B2' : pbtScore >= 450 ? 'CEFR B1' : 'CEFR A2';
      displayScore = `${pbtScore} / 677 (${cefr})`;
    } else {
      const pct = Math.round(ratio * 100);
      const predikat = pct >= 85 ? 'Distinction' : pct >= 65 ? 'Competent' : 'Developing';
      displayScore = `${pct}/100 (${predikat})`;
    }

    const simCertId = `MECAI-SIM-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    saveDynamicCert(simCertId, {
      id: simCertId,
      type: 'cert',
      status: 'valid',
      holderName: profile.nama,
      program: `Simulasi ${programMeta.name}`,
      scoreOrGrade: displayScore,
      issuedDate: new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'}),
      validUntil: 'Berlaku sebagai Bukti Latihan Resmi MECAI',
      issuer: 'PT MEC Akses Inovasi · MECAI Simulator',
      hash: `sha256:sim-${simCertId.slice(-4).toLowerCase()}...mecai`,
    });

    lastResult = {
      program: activeProgram,
      programLabel: activeProgram === 'toefl' ? 'TOEFL PBT' : 'ESP',
      correctCount,
      total: questions.length,
      displayScore,
      simCertId,
      dateLabel: new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}),
      answersSnapshot: {...answers},
    };

    addSimulationResult(lastResult);
    stage = 'result';
    render();
    showToast('Simulasi selesai! Hasil dan ID bukti latihan Anda telah tersimpan.');
  }

  function renderOverview() {
    const program = PROGRAMS[activeProgram];
    const profile = getUserProfile();
    const registrations = getRegistrations();
    const simHistory = getSimulationResults();

    return `
      <section class="surface-card">
        <div class="section-header">
          <div>
            <h1 class="section-title" style="font-size:20px;">Program & Simulasi TOEFL PBT / ESP</h1>
            <p class="section-subtitle">Tingkatkan kesiapan bahasa Inggris akademik dan profesional dengan evaluasi standar MECAI.ai.</p>
          </div>
        </div>

        <div class="segmented-control" role="tablist" aria-label="Pilih program tes" style="margin:14px 0 18px;">
          <button type="button" role="tab" aria-selected="${activeProgram === 'toefl'}" class="segment-btn ${activeProgram === 'toefl' ? 'is-active' : ''}" data-program-tab="toefl">
            TOEFL PBT
          </button>
          <button type="button" role="tab" aria-selected="${activeProgram === 'esp'}" class="segment-btn ${activeProgram === 'esp' ? 'is-active' : ''}" data-program-tab="esp">
            ESP Spesialisasi
          </button>
        </div>

        <div class="two-col-split">
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <p class="meta-line">${program.tagline}</p>
              <h2 style="font-size:19px;font-weight:700;margin-top:4px;">${program.name}</h2>
            </div>

            <div class="detail-list" style="padding-top:10px;">
              <div class="detail-row"><span class="detail-key">Durasi</span><span class="detail-val">${program.duration}</span></div>
              <div class="detail-row"><span class="detail-key">Format</span><span class="detail-val">${program.format}</span></div>
              <div class="detail-row"><span class="detail-key">Biaya</span><span class="detail-val">${program.fee}</span></div>
              <div class="detail-row"><span class="detail-key">Sertifikasi</span><span class="detail-val">${program.certificateNote}</span></div>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;">
              <button type="button" class="btn btn-primary" data-start-sim>
                ${iconToefl(false)} Mulai Simulasi Gratis
              </button>
              <a href="#form-daftar-program" class="btn btn-outline" data-scroll-register>
                Daftar Sesi Resmi
              </a>
            </div>
          </div>

          <div class="program-media">
            <img
              src="/src/assets/images/mecai_toefl_program_1795591211614.jpg"
              alt="Perangkat pembelajaran digital dan sertifikasi TOEFL PBT serta ESP MECAI.ai"
              referrerpolicy="no-referrer"
              onerror="this.style.display='none';this.nextElementSibling.classList.add('is-visible');"
            />
            <div class="media-fallback">
              <strong style="font-family:var(--font-display);font-size:17px;">${program.name}</strong>
              <span style="font-size:13px;color:#cbd5e1;">MECAI Assessment & Language Lab</span>
            </div>
          </div>
        </div>
      </section>

      <section class="surface-card">
        <h2 class="section-title" style="margin-bottom:12px;">Rincian Modul & Materi Uji</h2>
        <div class="pillars-grid">
          ${program.sections
            .map(
              (sec, i) => `
            <div class="surface-subtle">
              <span class="pillar-index">0${i + 1}</span>
              <h3 style="font-size:15px;font-weight:700;margin:4px 0;">${sec.title}</h3>
              <p style="font-size:13.5px;color:var(--text-secondary);">${sec.detail}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <section id="form-daftar-program" class="surface-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Pendaftaran Sesi Resmi</h2>
            <p class="section-subtitle">Dapatkan nomor registrasi instan dan jadwal ujian terverifikasi PT MEC Akses Inovasi.</p>
          </div>
        </div>

        <form data-register-form style="display:flex;flex-direction:column;gap:14px;">
          <div class="form-grid">
            <div class="field-group">
              <label for="reg-nama" class="field-label">Nama Lengkap (Sesuai Sertifikat)</label>
              <input id="reg-nama" name="nama" type="text" class="input-control" value="${escapeAttr(profile.nama)}" required />
            </div>
            <div class="field-group">
              <label for="reg-email" class="field-label">Alamat Email</label>
              <input id="reg-email" name="email" type="email" class="input-control" value="${escapeAttr(profile.email)}" required />
            </div>
            <div class="field-group">
              <label for="reg-wa" class="field-label">Nomor WhatsApp Aktif</label>
              <input id="reg-wa" name="whatsapp" type="tel" class="input-control tabular-nums" value="${escapeAttr(profile.whatsapp)}" required />
            </div>
            <div class="field-group">
              <label for="reg-instansi" class="field-label">Universitas / Perusahaan</label>
              <input id="reg-instansi" name="instansi" type="text" class="input-control" value="${escapeAttr(profile.instansi)}" required />
            </div>
          </div>

          <div class="field-group">
            <label for="reg-schedule" class="field-label">Pilih Gelombang & Jadwal</label>
            <select id="reg-schedule" name="schedule" class="input-control">
              ${program.schedules.map((s) => `<option value="${escapeAttr(s)}">${s}</option>`).join('')}
            </select>
          </div>

          ${formError ? `<p class="input-error">${formError}</p>` : ''}

          <div>
            <button type="submit" class="btn btn-navy btn-full">Kirim Pendaftaran Program</button>
          </div>
        </form>

        ${
          registrations.length > 0
            ? `<div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--border);">
                 <h3 style="font-size:15px;font-weight:700;margin-bottom:10px;">Pendaftaran Aktif Anda</h3>
                 <div class="tap-list">
                   ${registrations
                     .slice(0, 3)
                     .map(
                       (r) => `
                     <div class="tap-row" style="cursor:default;">
                       <div>
                         <div class="tap-row-title mono">${r.regId} · ${r.programLabel}</div>
                         <div class="tap-row-sub">${r.nama} · ${r.schedule}</div>
                       </div>
                       <span style="font-size:12.5px;font-weight:600;color:var(--success);">Terdaftar</span>
                     </div>
                   `
                     )
                     .join('')}
                 </div>
               </div>`
            : ''
        }
      </section>

      ${
        simHistory.length > 0
          ? `<section class="surface-card">
               <h2 class="section-title" style="margin-bottom:10px;">Riwayat Skor Simulasi</h2>
               <div class="tap-list">
                 ${simHistory
                   .slice(0, 4)
                   .map(
                     (item) => `
                   <button type="button" class="tap-row" data-verify-sim-id="${item.simCertId}">
                     <span class="tap-row-left">
                       <span class="tap-row-icon">${iconCheck()}</span>
                       <span>
                         <span class="tap-row-title" style="display:block;">${item.programLabel} — ${item.displayScore}</span>
                         <span class="tap-row-sub mono" style="display:block;">${item.simCertId} · ${item.dateLabel}</span>
                       </span>
                     </span>
                     <span style="font-size:12.5px;font-weight:600;color:var(--accent);">Verifikasi</span>
                   </button>
                 `
                   )
                   .join('')}
               </div>
             </section>`
          : ''
      }
    `;
  }

  function renderTesting() {
    const questions = SIMULATION_QUESTIONS[activeProgram];
    const q = questions[currentQuestionIdx];
    const progressPct = Math.round(((currentQuestionIdx + 1) / questions.length) * 100);
    const letters = ['A', 'B', 'C', 'D'];

    return `
      <section class="surface-card">
        <div class="section-header">
          <div>
            <p class="meta-line">
              <span>Simulasi ${activeProgram === 'toefl' ? 'TOEFL PBT' : 'ESP'}</span>
              <span aria-hidden="true">·</span>
              <span>Soal ${currentQuestionIdx + 1} dari ${questions.length}</span>
            </p>
            <h1 class="section-title" style="margin-top:4px;">${q.section}</h1>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11.5px;color:var(--text-muted);display:block;">Sisa Waktu</span>
            <strong class="mono" data-sim-timer style="font-size:18px;color:var(--bg-navy);">${formatTime(remainingSeconds)}</strong>
          </div>
        </div>

        <div class="quiz-progress-track" style="margin:12px 0 18px;">
          <div class="quiz-progress-fill" style="transform:scaleX(${progressPct / 100});"></div>
        </div>

        ${
          q.audioText
            ? `<div class="surface-subtle" style="margin-bottom:14px;display:flex;flex-direction:column;gap:10px;">
                 <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                   <span style="font-size:13px;font-weight:600;">Audio Listening Prompt</span>
                   <button type="button" class="btn btn-navy btn-sm" data-play-audio>
                     ${iconVolume()} Putar Audio Dialog
                   </button>
                 </div>
                 <details style="font-size:13px;color:var(--text-secondary);">
                   <summary style="cursor:pointer;font-weight:600;">Lihat Transkrip (Jika Perangkat Bisu)</summary>
                   <p style="margin-top:6px;">${q.audioText}</p>
                 </details>
               </div>`
            : ''
        }

        ${
          q.passage
            ? `<div class="surface-subtle" style="margin-bottom:14px;">
                 <p style="font-size:13.5px;line-height:1.6;color:var(--text-primary);">${q.passage}</p>
               </div>`
            : ''
        }

        <p style="font-size:15.5px;font-weight:600;line-height:1.5;margin-bottom:14px;">${q.prompt}</p>

        <div class="quiz-options">
          ${q.options
            .map((opt, idx) => {
              const selected = answers[currentQuestionIdx] === idx;
              return `
              <button type="button" class="quiz-option-btn ${selected ? 'is-selected' : ''}" data-select-option="${idx}">
                <span class="quiz-option-letter">${letters[idx]}</span>
                <span style="font-size:14px;line-height:1.45;">${opt}</span>
              </button>
            `;
            })
            .join('')}
        </div>

        <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:14px;">
          <div class="quiz-nav-grid" aria-label="Navigasi nomor soal">
            ${questions
              .map((_, i) => {
                const isCur = i === currentQuestionIdx;
                const isAns = answers[i] !== undefined;
                return `<button type="button" class="quiz-num-btn ${isCur ? 'is-current' : ''} ${isAns ? 'is-answered' : ''}" data-jump-q="${i}">${i + 1}</button>`;
              })
              .join('')}
          </div>

          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn btn-outline" data-sim-exit>Batal</button>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-outline" data-sim-prev ${currentQuestionIdx === 0 ? 'disabled' : ''}>Sebelumnya</button>
              ${
                currentQuestionIdx < questions.length - 1
                  ? `<button type="button" class="btn btn-primary" data-sim-next>Berikutnya</button>`
                  : `<button type="button" class="btn btn-navy" data-sim-finish>Selesai & Lihat Skor</button>`
              }
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderResult() {
    const questions = SIMULATION_QUESTIONS[lastResult.program];
    return `
      <section class="surface-navy">
        <p class="meta-line meta-line-inverse">Laporan Hasil Simulasi · ${lastResult.programLabel}</p>
        <h1 class="hero-title" style="margin-top:6px;">${lastResult.displayScore}</h1>
        <p class="hero-desc" style="margin-top:8px;">
          Anda menjawab benar ${lastResult.correctCount} dari ${lastResult.total} soal diagnostik. ID bukti simulasi Anda telah diterbitkan dan dapat langsung dicek keasliannya di menu Verify.
        </p>
        <div class="hero-actions" style="margin-top:14px;">
          <button type="button" class="btn btn-primary" data-verify-sim-id="${lastResult.simCertId}">
            Verifikasi ID: ${lastResult.simCertId}
          </button>
          <button type="button" class="btn btn-outline" data-back-overview style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.22);color:#fff;">
            Kembali ke Program
          </button>
        </div>
      </section>

      <section class="surface-card">
        <h2 class="section-title" style="margin-bottom:12px;">Pembahasan Jawaban</h2>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${questions
            .map((q, idx) => {
              const userAns = lastResult.answersSnapshot[idx];
              const isCorrect = userAns === q.correctIndex;
              return `
              <div class="surface-subtle" style="border:1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'};">
                <p class="meta-line">
                  <strong style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'};">${isCorrect ? 'Benar' : 'Perlu Perbaikan'}</strong>
                  <span aria-hidden="true">·</span>
                  <span>Soal ${idx + 1} (${q.section})</span>
                </p>
                <p style="font-weight:600;font-size:14px;margin:6px 0;">${q.prompt}</p>
                <p style="font-size:13px;color:var(--text-secondary);">Jawaban benar: <strong>${q.options[q.correctIndex]}</strong></p>
                <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;">${q.explanation}</p>
              </div>
            `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function render() {
    if (stage === 'testing') container.innerHTML = renderTesting();
    else if (stage === 'result' && lastResult) container.innerHTML = renderResult();
    else container.innerHTML = renderOverview();
  }

  container.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-program-tab]');
    if (tabBtn) {
      activeProgram = tabBtn.dataset.programTab;
      formError = '';
      render();
      return;
    }

    if (e.target.closest('[data-start-sim]')) {
      startSimulation();
      return;
    }

    if (e.target.closest('[data-play-audio]')) {
      const q = SIMULATION_QUESTIONS[activeProgram][currentQuestionIdx];
      if (q && q.audioText) speakAudio(q.audioText);
      return;
    }

    const optBtn = e.target.closest('[data-select-option]');
    if (optBtn) {
      answers[currentQuestionIdx] = Number(optBtn.dataset.selectOption);
      render();
      return;
    }

    const jumpBtn = e.target.closest('[data-jump-q]');
    if (jumpBtn) {
      currentQuestionIdx = Number(jumpBtn.dataset.jumpQ);
      render();
      return;
    }

    if (e.target.closest('[data-sim-prev]') && currentQuestionIdx > 0) {
      currentQuestionIdx -= 1;
      render();
      return;
    }

    if (e.target.closest('[data-sim-next]')) {
      currentQuestionIdx += 1;
      render();
      return;
    }

    if (e.target.closest('[data-sim-finish]')) {
      finishSimulation(SIMULATION_QUESTIONS[activeProgram]);
      return;
    }

    if (e.target.closest('[data-sim-exit]') || e.target.closest('[data-back-overview]')) {
      stopTimer();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stage = 'overview';
      render();
      return;
    }

    const verifySimBtn = e.target.closest('[data-verify-sim-id]');
    if (verifySimBtn) {
      onVerifyCert(verifySimBtn.dataset.verifySimId);
      return;
    }

    const scrollReg = e.target.closest('[data-scroll-register]');
    if (scrollReg) {
      e.preventDefault();
      const el = container.querySelector('#form-daftar-program');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    }
  });

  container.addEventListener('submit', (e) => {
    if (e.target.matches('[data-register-form]')) {
      e.preventDefault();
      const fd = new FormData(e.target);
      const nama = String(fd.get('nama') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const whatsapp = String(fd.get('whatsapp') || '').trim();
      const instansi = String(fd.get('instansi') || '').trim();
      const schedule = String(fd.get('schedule') || '').trim();

      if (nama.length < 3 || !email.includes('@') || whatsapp.length < 9) {
        formError = 'Mohon lengkapi nama, format email yang valid, dan nomor WhatsApp aktif.';
        render();
        return;
      }

      formError = '';
      const regId = `REG-MECAI-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      addRegistration({
        regId,
        program: activeProgram,
        programLabel: activeProgram === 'toefl' ? 'TOEFL PBT' : 'ESP',
        nama,
        email,
        whatsapp,
        instansi,
        schedule,
      });
      render();
      showToast(`Pendaftaran berhasil! Nomor registrasi: ${regId}`);
    }
  });

  render();
  return container;
}

function escapeAttr(val) {
  return String(val || '').replace(/"/g, '&quot;');
}
