const STORAGE_KEYS = {
  profile: 'mecai_user_profile_v1',
  verifyHistory: 'mecai_verify_history_v1',
  registrations: 'mecai_toefl_registrations_v1',
  simulations: 'mecai_simulation_results_v1',
  dynamicCerts: 'mecai_dynamic_certs_v1',
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage restriction errors
  }
}

export function getUserProfile() {
  return safeRead(STORAGE_KEYS.profile, {
    nama: 'Peserta Ekosistem MECAI',
    email: 'peserta@mecai.ai',
    whatsapp: '081234567890',
    instansi: 'Universitas & Mitra Nasional',
  });
}

export function saveUserProfile(profile) {
  safeWrite(STORAGE_KEYS.profile, profile);
  return profile;
}

export function getVerifyHistory() {
  return safeRead(STORAGE_KEYS.verifyHistory, []);
}

export function addVerifyHistory(entry) {
  const list = getVerifyHistory().filter((item) => item.id !== entry.id);
  const updated = [entry, ...list].slice(0, 8);
  safeWrite(STORAGE_KEYS.verifyHistory, updated);
  return updated;
}

export function clearVerifyHistory() {
  safeWrite(STORAGE_KEYS.verifyHistory, []);
  return [];
}

export function getRegistrations() {
  return safeRead(STORAGE_KEYS.registrations, []);
}

export function addRegistration(reg) {
  const list = getRegistrations();
  const updated = [reg, ...list].slice(0, 10);
  safeWrite(STORAGE_KEYS.registrations, updated);
  return updated;
}

export function getSimulationResults() {
  return safeRead(STORAGE_KEYS.simulations, []);
}

export function addSimulationResult(result) {
  const list = getSimulationResults();
  const updated = [result, ...list].slice(0, 10);
  safeWrite(STORAGE_KEYS.simulations, updated);
  return updated;
}

export function getDynamicCerts() {
  return safeRead(STORAGE_KEYS.dynamicCerts, {});
}

export function saveDynamicCert(id, record) {
  const certs = getDynamicCerts();
  certs[id] = record;
  safeWrite(STORAGE_KEYS.dynamicCerts, certs);
}
