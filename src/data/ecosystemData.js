export const ECOSYSTEM_METRICS = [
  {value: '12.400+', label: 'Sertifikat Terverifikasi'},
  {value: '38+', label: 'Mitra Kampus & Korporasi'},
  {value: '99,9%', label: 'Ketersediaan Verifikasi'},
  {value: 'PSE Komdigi', label: 'Terdaftar Resmi RI'},
];

export const ECOSYSTEM_PILLARS = [
  {
    index: '01',
    title: 'AI Competency & Language Lab',
    description:
      'Asesmen TOEFL PBT dan English for Specific Purposes (ESP) berbasis diagnostik adaptif untuk kesiapan karier dan akademik global.',
  },
  {
    index: '02',
    title: 'MPV & Digital Credential Trust',
    description:
      'Sistem validasi keaslian sertifikat dan produk perangkat keras MECAI Product Verification (MPV) dengan kode unik anti-pemalsuan.',
  },
  {
    index: '03',
    title: 'Enterprise & Campus Integration',
    description:
      'Infrastruktur pembelajaran dan sertifikasi terstandar bagi universitas, lembaga pelatihan, serta korporasi di Indonesia.',
  },
];

export const CERTIFICATE_RECORDS = {
  'MECAI-CERT-2026-0891': {
    id: 'MECAI-CERT-2026-0891',
    type: 'cert',
    status: 'valid',
    holderName: 'Nadia Kusuma Wardhani',
    program: 'TOEFL PBT Prediction & Certification',
    scoreOrGrade: '567 / 677 (CEFR B2+)',
    issuedDate: '14 Oktober 2026',
    validUntil: '14 Oktober 2028',
    issuer: 'PT MEC Akses Inovasi · MECAI Assessment Board',
    hash: 'sha256:9f84b2...e31c7a',
  },
  'MECAI-ESP-2026-0412': {
    id: 'MECAI-ESP-2026-0412',
    type: 'cert',
    status: 'valid',
    holderName: 'Rizky Pratama Putra',
    program: 'ESP — Applied AI & Engineering Communication',
    scoreOrGrade: 'Predikat Distinction (91/100)',
    issuedDate: '02 November 2026',
    validUntil: '02 November 2028',
    issuer: 'PT MEC Akses Inovasi · Divisi ESP',
    hash: 'sha256:4a19d0...82f40b',
  },
  'MECAI-AI-2026-1120': {
    id: 'MECAI-AI-2026-1120',
    type: 'cert',
    status: 'valid',
    holderName: 'Siti Aisyah Rahmawati',
    program: 'Future-Ready AI Practitioner Track',
    scoreOrGrade: 'Kompeten · Level II',
    issuedDate: '19 September 2026',
    validUntil: '19 September 2028',
    issuer: 'PT MEC Akses Inovasi · MECAI Academy',
    hash: 'sha256:7c03e1...15a9d2',
  },
  'MECAI-CERT-2024-0045': {
    id: 'MECAI-CERT-2024-0045',
    type: 'cert',
    status: 'expired',
    holderName: 'Dimas Adi Nugroho',
    program: 'TOEFL PBT Institutional Assessment',
    scoreOrGrade: '510 / 677',
    issuedDate: '10 Agustus 2024',
    validUntil: '10 Agustus 2026',
    issuer: 'PT MEC Akses Inovasi · MECAI Assessment Board',
    hash: 'sha256:2b77c9...04a11e',
  },
};

export const MPV_PRODUCT_RECORDS = {
  'MPV-NODE-AI-7740': {
    id: 'MPV-NODE-AI-7740',
    type: 'mpv',
    status: 'valid',
    productName: 'MECAI Smart Language Lab Terminal Gen-2',
    serialNumber: 'SN-MEC-2026-7740-ID',
    batchCode: 'BATCH-2026-Q3-JKT',
    warrantyStatus: 'Aktif · Garansi Resmi s/d 30 Nov 2028',
    partnerLocation: 'Laboratorium Bahasa Terpadu · Jakarta Selatan',
    licenseTier: 'Enterprise AI Suite + Proctored CBT',
  },
  'MPV-KIT-EDU-2026': {
    id: 'MPV-KIT-EDU-2026',
    type: 'mpv',
    status: 'valid',
    productName: 'MECAI Interactive ESP Learning Kit',
    serialNumber: 'SN-ESP-2026-2026-ID',
    batchCode: 'BATCH-2026-Q4-BDG',
    warrantyStatus: 'Aktif · Lisensi Institusi 24 Bulan',
    partnerLocation: 'Mitra Akademik Resmi · Bandung',
    licenseTier: 'Academic Pro Edition',
  },
  'MPV-LAB-EDGE-309': {
    id: 'MPV-LAB-EDGE-309',
    type: 'mpv',
    status: 'valid',
    productName: 'MECAI Edge Proctoring Appliance',
    serialNumber: 'SN-EDG-2025-0309-ID',
    batchCode: 'BATCH-2025-Q4-SBY',
    warrantyStatus: 'Aktif · Pemeliharaan Berkala',
    partnerLocation: 'Pusat Ujian Regional · Surabaya',
    licenseTier: 'Proctor Core AI',
  },
};

export const QR_SIMULATION_PRESETS = [
  {
    id: 'MECAI-CERT-2026-0891',
    mode: 'cert',
    title: 'QR Sertifikat TOEFL PBT',
    subtitle: 'MECAI-CERT-2026-0891 · Nadia Kusuma Wardhani',
  },
  {
    id: 'MPV-NODE-AI-7740',
    mode: 'mpv',
    title: 'QR Segel Produk MPV Hardware',
    subtitle: 'MPV-NODE-AI-7740 · Smart Language Lab Terminal',
  },
  {
    id: 'MECAI-CERT-2024-0045',
    mode: 'cert',
    title: 'QR Sertifikat Masa Berlaku Habis',
    subtitle: 'MECAI-CERT-2024-0045 · Status Kadaluarsa',
  },
  {
    id: 'MECAI-UNREG-9999',
    mode: 'cert',
    title: 'QR Tidak Terdaftar (Uji Penolakan)',
    subtitle: 'MECAI-UNREG-9999 · Simulasi ID Tidak Valid',
  },
];

export const PROGRAMS = {
  toefl: {
    id: 'toefl',
    name: 'TOEFL PBT & Institutional Prediction',
    tagline: 'Standar Evaluasi Bahasa Inggris Akademik & Profesi',
    duration: '120 Menit (Ujian Resmi) · 10 Menit (Simulasi)',
    format: 'Computer-Based & Proctored AI Supervision',
    fee: 'Rp 175.000 / sesi resmi · Simulasi Gratis',
    certificateNote: 'Sertifikat digital bernomor resmi & tervalidasi melalui MECAI Verify',
    sections: [
      {
        title: 'Section 1 · Listening Comprehension',
        detail: '50 soal (35 menit) — percakapan singkat, dialog akademik, dan kuliah singkat.',
      },
      {
        title: 'Section 2 · Structure & Written Expression',
        detail: '40 soal (25 menit) — pelengkapan kalimat dan identifikasi kesalahan tata bahasa.',
      },
      {
        title: 'Section 3 · Reading Comprehension',
        detail: '50 soal (55 menit) — pemahaman teks ilmiah, gagasan utama, dan inferensi kosakata.',
      },
    ],
    schedules: [
      'Gelombang Reguler · Sabtu, 09.00 WIB (Online Proctored)',
      'Gelombang Intensif · Rabu, 19.00 WIB (Online Proctored)',
      'Gelombang Kampus · Senin, 13.00 WIB (CBT Terjadwal)',
    ],
  },
  esp: {
    id: 'esp',
    name: 'ESP (English for Specific Purposes)',
    tagline: 'Komunikasi Bahasa Inggris Spesifik Teknologi, Bisnis & Industri',
    duration: '90 Menit (Asesmen) · 8 Menit (Simulasi)',
    format: 'Scenario-Based Diagnostic & Practical Portfolio',
    fee: 'Rp 225.000 / program · Simulasi Gratis',
    certificateNote: 'Sertifikat kompetensi CEFR & predikat spesialisasi terverifikasi MPV',
    sections: [
      {
        title: 'Module 1 · Technical & AI Terminology',
        detail: 'Penguasaan istilah rekayasa perangkat lunak, data, dan dokumentasi sistem.',
      },
      {
        title: 'Module 2 · Executive & Client Communication',
        detail: 'Korespondensi profesional, presentasi ringkas, dan negosiasi lintas tim.',
      },
      {
        title: 'Module 3 · Analytical Report Writing',
        detail: 'Penyusunan ringkasan eksekutif, SOP, dan pelaporan berbasis metrik.',
      },
    ],
    schedules: [
      'Cohort Teknologi & AI · Kamis, 19.30 WIB',
      'Cohort Bisnis & Korporasi · Sabtu, 10.00 WIB',
      'Cohort Akademik & Riset · Selasa, 16.00 WIB',
    ],
  },
};

export const SIMULATION_QUESTIONS = {
  toefl: [
    {
      id: 'T1',
      section: 'Listening Comprehension',
      audioText:
        'Woman: Have you checked the verification status for the new laboratory terminals? Man: Yes, all twelve units passed the MPV serial check this morning.',
      prompt: 'What does the man mean about the laboratory terminals?',
      options: [
        'They still need to be delivered tomorrow.',
        'All units have been verified through the MPV check.',
        'Only two terminals passed the morning inspection.',
        'The verification system was offline this morning.',
      ],
      correctIndex: 1,
      explanation:
        'Pria menyatakan "all twelve units passed the MPV serial check this morning", artinya seluruh unit telah lolos verifikasi.',
    },
    {
      id: 'T2',
      section: 'Structure & Written Expression',
      prompt: 'Not only _____ the diagnostic simulation, but she also earned the highest score in her cohort.',
      options: [
        'she completed',
        'did she complete',
        'was she complete',
        'completed she',
      ],
      correctIndex: 1,
      explanation:
        'Struktur inversi negatif "Not only" di awal kalimat mewajibkan kata kerja bantu sebelum subjek: "did she complete".',
    },
    {
      id: 'T3',
      section: 'Structure & Written Expression',
      prompt:
        'The newly deployed assessment platform, along with its automated proctoring modules, _____ high reliability under peak load.',
      options: ['demonstrate', 'demonstrates', 'are demonstrating', 'have demonstrated'],
      correctIndex: 1,
      explanation:
        'Subjek utama adalah bentuk tunggal ("The newly deployed assessment platform"); frasa "along with..." tidak mengubah jumlah subjek.',
    },
    {
      id: 'T4',
      section: 'Structure & Written Expression',
      prompt: 'Identifikasi kata/frasa yang salah: "Every participants in the training program must verify their certificate before Friday."',
      options: ['Every participants', 'in the training', 'must verify', 'before Friday'],
      correctIndex: 0,
      explanation:
        '"Every" selalu diikuti kata benda tunggal ("Every participant"), bukan bentuk jamak.',
    },
    {
      id: 'T5',
      section: 'Reading Comprehension',
      passage:
        'Digital credential verification eliminates manual paperwork by binding each issued certificate to a cryptographic identifier. Institutions can confirm authenticity within seconds rather than waiting days for registrar correspondence.',
      prompt: 'According to the passage, what is the primary advantage of digital credential verification?',
      options: [
        'It replaces university registrars completely.',
        'It accelerates authenticity confirmation from days to seconds.',
        'It increases the amount of physical paperwork required.',
        'It restricts access to institutional records.',
      ],
      correctIndex: 1,
      explanation:
        'Kalimat kedua menegaskan bahwa institusi dapat memastikan keaslian dalam hitungan detik dibandingkan menunggu berhari-hari.',
    },
    {
      id: 'T6',
      section: 'Reading Comprehension',
      passage:
        'In adaptive language testing, item difficulty adjusts dynamically based on prior responses, yielding precise proficiency estimates with fewer total questions.',
      prompt: 'The word "yielding" in the passage is closest in meaning to:',
      options: ['preventing', 'producing', 'delaying', 'questioning'],
      correctIndex: 1,
      explanation:
        '"Yielding" dalam konteks pengukuran berarti menghasilkan ("producing").',
    },
  ],
  esp: [
    {
      id: 'E1',
      section: 'Technical & AI Terminology',
      prompt:
        'In an enterprise software SLA, which phrase best describes "the guaranteed percentage of time a verification service remains operational"?',
      options: ['Latency ceiling', 'Service uptime', 'Batch throughput', 'Cold-start interval'],
      correctIndex: 1,
      explanation:
        '"Service uptime" adalah istilah standar untuk persentase waktu operasional sistem yang dijamin tersedia.',
    },
    {
      id: 'E2',
      section: 'Executive Communication',
      prompt:
        'Choose the most appropriate sentence for a formal client update regarding a delayed deployment:',
      options: [
        'Sorry, we messed up the server and it will be late.',
        'We are delaying launch indefinitely because things broke.',
        'To ensure full compliance, the production release is rescheduled to Monday at 09:00 WIB.',
        'Just wait until next week for the release.',
      ],
      correctIndex: 2,
      explanation:
        'Komunikasi eksekutif bersifat objektif, menyebutkan alasan kepatuhan, dan memberikan jadwal baru secara presisi.',
    },
    {
      id: 'E3',
      section: 'Data & Security Compliance',
      prompt:
        'Under Indonesia personal data protection standards, obtaining explicit consent before processing user records is known as:',
      options: ['Lawful basis of processing', 'Hardware depreciation', 'Load balancing', 'Domain propagation'],
      correctIndex: 0,
      explanation:
        'Dasar pemrosesan yang sah ("lawful basis of processing") mencakup persetujuan eksplisit subjek data.',
    },
    {
      id: 'E4',
      section: 'Analytical Report Writing',
      prompt:
        'Which transition phrase introduces a measurable contrast in an executive summary?',
      options: [
        'In addition to that,',
        'Conversely, operational overhead declined by 22% after automation.',
        'For example, the office opened early.',
        'As mentioned previously,',
      ],
      correctIndex: 1,
      explanation:
        '"Conversely" menandakan kontras yang jelas dan diikuti oleh data terukur (22%).',
    },
    {
      id: 'E5',
      section: 'Product Verification Context',
      prompt:
        'When instructing a partner to authenticate a hardware unit via QR code, which verb is clearest in an SOP?',
      options: ['Glance at', 'Scan the MPV seal using the Verify module', 'Guess the serial', 'Disassemble the casing'],
      correctIndex: 1,
      explanation:
        'Instruksi SOP harus spesifik, langsung, dan menyebutkan alat/modul yang digunakan.',
    },
    {
      id: 'E6',
      section: 'Executive Communication',
      prompt:
        'Select the most concise revision of: "Due to the fact that the audit was completed ahead of schedule, we can proceed now."',
      options: [
        'Because the audit finished early, we can proceed now.',
        'In light of the audit having been done sooner than expected, we proceed.',
        'The audit being early, proceeding is happening now.',
        'Owing to the fact of early audit completion, we go.',
      ],
      correctIndex: 0,
      explanation:
        'Penulisan profesional mengutamakan kejelasan dan keringkasan ("Because the audit finished early...").',
    },
  ],
};

export const LEGAL_INFO = {
  company: 'PT MEC Akses Inovasi',
  brand: 'MECAI.ai',
  pseStatus: 'Terdaftar Resmi — Penyelenggara Sistem Elektronik (PSE) Lingkup Privat',
  ministry: 'Kementerian Komunikasi dan Digital (Komdigi) Republik Indonesia',
  pseNumber: '008412.01/DJAI.PSE/09/2025',
  nib: '1294000837215',
  sector: 'Teknologi Informasi, Asesmen Digital & Pendidikan Berkelanjutan',
  privacyStandard: 'Kepatuhan UU PDP No. 27 Tahun 2022 · Enkripsi TLS 1.3 & Validasi Hash',
  contacts: {
    email: 'support@mecai.ai',
    whatsapp: '+62 811-9024-2026',
    office: 'Gedung MEC Innovation Hub Lt. 4, Jl. Kemang Raya No. 88, Jakarta Selatan 12730',
    hours: 'Senin–Sabtu · 08.30 – 17.30 WIB',
  },
};

export const MECI_TOPICS = [
  {
    key: 'verify',
    label: 'Cara Verifikasi Sertifikat',
    answer:
      'Buka menu Verify, pilih tab Sertifikat, lalu masukkan nomor sertifikat (contoh: MECAI-CERT-2026-0891) atau tekan tombol Simulasi Scan QR. Sistem langsung menampilkan status keaslian, skor, dan masa berlaku.',
    actionLabel: 'Buka Halaman Verify',
    actionTab: 'verify',
  },
  {
    key: 'mpv',
    label: 'Apa itu Produk MPV?',
    answer:
      'MECAI Product Verification (MPV) adalah sistem validasi keaslian perangkat dan kit edukasi resmi PT MEC Akses Inovasi. Gunakan kode berawalan MPV- (misalnya MPV-NODE-AI-7740) pada tab Produk MPV.',
    actionLabel: 'Cek Produk MPV',
    actionTab: 'verify',
  },
  {
    key: 'toefl',
    label: 'Panduan TOEFL PBT & ESP',
    answer:
      'Anda dapat mencoba simulasi gratis TOEFL PBT (6 soal diagnostik dengan konversi skor 310–677) atau ESP langsung dari menu TOEFL/ESP, lalu mendaftar jadwal ujian resmi ber-sertifikat MPV.',
    actionLabel: 'Buka TOEFL / ESP',
    actionTab: 'toefl',
  },
  {
    key: 'pse',
    label: 'Legalitas PSE Komdigi',
    answer:
      'Ekosistem MECAI.ai dikelola oleh PT MEC Akses Inovasi dan terdaftar sebagai PSE Lingkup Privat pada Kementerian Komunikasi dan Digital (Komdigi) RI dengan nomor 008412.01/DJAI.PSE/09/2025.',
    actionLabel: 'Lihat Legalitas',
    actionTab: 'info',
  },
];
