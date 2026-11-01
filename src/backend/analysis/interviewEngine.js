/**
 * AI Mock Interview Simulator Engine
 * Generates tailored interview questions and evaluates candidate answers using the STAR method.
 * Dynamically customizes questions and rubrics based on the candidate's exact academic background and skillset.
 */

export function getInterviewTracksForCandidate(metadata = {}, cvText = '') {
  const majorLower = (metadata.detectedMajor || '').toLowerCase();
  const textLower = (cvText || '').toLowerCase();
  const skills = metadata.extractedSkills || [];

  /**
   * Deteksi nama proyek nyata dari CV (heuristik ringan, tanpa perlu metadataExtractor):
   * cari section "PROYEK"/"PROJECTS", lalu ambil baris pertama sesudahnya yang terlihat
   * seperti judul (pendek, bukan kalimat/bullet) — mis. "HISV3" pada CV berformat umum.
   */
  const extractLikelyProjectName = (text) => {
    if (!text) return null;
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const sectionIdx = lines.findIndex(l => /^(PROYEK( UNGGULAN| UTAMA)?|PROJECTS?)\b/i.test(l));
    if (sectionIdx === -1) return null;

    for (let i = sectionIdx + 1; i < Math.min(sectionIdx + 6, lines.length); i++) {
      const line = lines[i];
      if (/^[-*•\d.]/.test(line)) continue; // lewati bullet/nomor
      const wordCount = line.split(/\s+/).length;
      if (wordCount >= 1 && wordCount <= 6 && !/[.,;:]$/.test(line)) {
        return line;
      }
    }
    return null;
  };

  const likelyProjectName = extractLikelyProjectName(cvText);

  // Determine Candidate Domain
  const isBusinessOrMarketing = 
    majorLower.includes('manajemen') || 
    majorLower.includes('bisnis') || 
    majorLower.includes('marketing') || 
    majorLower.includes('pemasaran') ||
    skills.some(s => ['Google Analytics', 'Google Ads', 'Meta Ads', 'SEO', 'Content Strategy', 'Business Development'].includes(s));

  const isDataOrAnalytics = 
    majorLower.includes('statistika') || 
    majorLower.includes('sains data') || 
    majorLower.includes('data science') || 
    majorLower.includes('actuarial') ||
    skills.some(s => ['Machine Learning', 'BigQuery', 'Tableau', 'Power BI', 'Scikit-Learn', 'PyTorch', 'Pandas'].includes(s));

  const isSoftwareOrTech = 
    majorLower.includes('informatika') || 
    majorLower.includes('komputer') || 
    majorLower.includes('software') || 
    majorLower.includes('rekayasa perangkat lunak') || 
    majorLower.includes('sistem informasi') ||
    skills.some(s => ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Docker', 'RESTful API'].includes(s));

  const isFinanceOrAccounting = 
    majorLower.includes('akuntansi') || 
    majorLower.includes('keuangan') || 
    majorLower.includes('finance') || 
    majorLower.includes('perbankan') ||
    skills.some(s => ['Financial Modeling', 'Financial Analysis', 'Auditing', 'Tax Compliance', 'Budgeting'].includes(s));

  const isDesignOrUX = 
    majorLower.includes('dkv') || 
    majorLower.includes('desain') || 
    majorLower.includes('graphic design') || 
    majorLower.includes('ui/ux') ||
    skills.some(s => ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research'].includes(s));

  const isHROrPsychology = 
    majorLower.includes('psikologi') || 
    majorLower.includes('human resources') || 
    majorLower.includes('sdm') ||
    skills.some(s => ['Talent Acquisition', 'Recruitment', 'Human Resources', 'Employee Engagement'].includes(s));

  // --- Dynamic Technical / Case Study Questions ---
  let domainTitle = 'Wawancara Teknis & Studi Kasus';
  let domainDescription = 'Fokus pada penyelesaian masalah nyata, metodologi kerja industri, dan alat keahlian.';
  let domainQuestions = [];

  if (isBusinessOrMarketing) {
    domainTitle = 'Studi Kasus Pemasaran & Strategi Bisnis';
    domainDescription = 'Fokus pada metrik kampanye (ROAS/CAC/CTR), riset pasar, funnel konversi, dan strategi pertumbuhan bisnis.';
    domainQuestions = [
      {
        id: 'biz-1',
        question: 'Jelaskan bagaimana pendekatan Anda dalam merancang kampanye pemasaran digital baru: Mulai dari riset target audiens, pemilihan channel (Meta/Google Ads/SEO/TikTok), alokasi budget, hingga pengukuran metrik keberhasilan?',
        criteria: 'Pemahaman komprehensif tentang marketing funnel, segmentasi audiens terukur, dan kalkulasi ROI kampanye.'
      },
      {
        id: 'biz-2',
        question: 'Ketika performa engagement atau konversi penjualan online klien mengalami penurunan drastis di luar dugaan, langkah-langkah analitis apa yang Anda lakukan untuk mengidentifikasi akar masalah dan memulihkannya?',
        criteria: 'Kemampuan root-cause analysis dengan data (Google Analytics/Looker), perumusan hipotesis A/B testing, dan tindakan taktis cepat.'
      },
      {
        id: 'biz-3',
        question: 'Bagaimana strategi Anda dalam melakukan negosiasi dan kolaborasi dengan stakeholder lintas divisi atau pihak eksternal (seperti influencer / merchant / partner) agar target proyek tercapai tepat waktu?',
        criteria: 'Komunikasi bisnis persuasif, manajemen ekspektasi partner, dan profesionalitas kemitraan terstruktur.'
      }
    ];
  } else if (isDataOrAnalytics) {
    domainTitle = 'Studi Kasus Sains Data & Analitika';
    domainDescription = 'Fokus pada pipeline data (ETL), optimasi SQL, validasi model machine learning, dan data storytelling bisnis.';
    domainQuestions = [
      {
        id: 'data-1',
        question: 'Pilihlah salah satu proyek data unggulan di CV Anda: Jelaskan alur pipeline datanya dari ekstraksi mentah (ETL), pembersihan missing values, feature engineering, hingga pemilihan metrik evaluasi model?',
        criteria: 'Pemahaman mendalam tentang siklus analitika data, validasi dataset, dan justifikasi algoritma/model.'
      },
      {
        id: 'data-2',
        question: 'Bagaimana cara Anda menerjemahkan temuan data teknis yang kompleks atau grafik dashboard analitik menjadi rekomendasi strategi bisnis yang mudah dipahami oleh manajemen non-teknis?',
        criteria: 'Kemampuan Data Storytelling, visualisasi wawasan bisnis (Tableau/Power BI), dan fokus pada dampak finansial organisasi.'
      },
      {
        id: 'data-3',
        question: 'Jika query SQL database Anda berjalan sangat lambat pada dataset jutaan baris atau model analitik mengalami data drift di produksi, langkah optimasi dan validasi apa yang Anda lakukan?',
        criteria: 'Teknik database indexing, query profiling, monitoring performa model, dan data governance.'
      }
    ];
  } else if (isFinanceOrAccounting) {
    domainTitle = 'Studi Kasus Keuangan & Akuntansi';
    domainDescription = 'Fokus pada pemodelan keuangan (Excel modeling), analisis varians anggaran, audit internal, dan rasio solvabilitas.';
    domainQuestions = [
      {
        id: 'fin-1',
        question: 'Bagaimana metodologi Anda dalam menyusun model proyeksi keuangan (financial model) dan melakukan analisis sensitivitas terhadap asumsi pertumbuhan pendapatan dan beban biaya?',
        criteria: 'Struktur pemodelan tiga laporan (Laba Rugi, Neraca, Arus Kas) yang rapi, pemahaman DCF, dan logika formula Excel.'
      },
      {
        id: 'fin-2',
        question: 'Ketika Anda menemukan ketidaksesuaian (variance) yang signifikan antara realisasi pengeluaran bulanan dengan anggaran yang direncanakan, prosedur audit dan rekonsiliasi apa yang Anda lakukan?',
        criteria: 'Analisis varians sistematis, verifikasi bukti transaksi, dan perumusan langkah efisiensi pengeluaran kas.'
      }
    ];
  } else if (isDesignOrUX) {
    domainTitle = 'Studi Kasus Desain UI/UX & Produk Visual';
    domainDescription = 'Fokus pada metodologi user research, arsitektur informasi, prototyping Figma, dan usability testing.';
    domainQuestions = [
      {
        id: 'ux-1',
        question: 'Pilihlah salah satu proyek desain di CV Anda: Jelaskan bagaimana Anda memvalidasi kebutuhan pengguna (User Research), membuat wireframe, hingga menghasilkan prototipe interaktif di Figma?',
        criteria: 'Penerapan prinsip Design Thinking, empathy mapping, dan alasan desain (design rationale) yang berpusat pada pengguna.'
      },
      {
        id: 'ux-2',
        question: 'Bagaimana cara Anda menyikapi masukan kritis atau usability testing dari pengguna ketika desain yang Anda buat ternyata membingungkan mereka?',
        criteria: 'Keterbukaan terhadap umpan balik objektif, iterasi cepat, dan pengujian A/B testing desain.'
      }
    ];
  } else if (isHROrPsychology) {
    domainTitle = 'Studi Kasus Manajemen SDM & Rekrutmen';
    domainDescription = 'Fokus pada teknik wawancara berbasis kompetensi (BEI), employer branding, dan manajemen hubungan karyawan.';
    domainQuestions = [
      {
        id: 'hrd-1',
        question: 'Bagaimana strategi Anda dalam merancang alur rekrutmen end-to-end untuk posisi kritis dan teknik wawancara apa yang Anda gunakan untuk mengukur integritas serta culture-fit kandidat?',
        criteria: 'Metode Behavioral Event Interview (BEI), pemetaan kompetensi terukur, dan sourcing talenta efektif.'
      },
      {
        id: 'hrd-2',
        question: 'Bagaimana pendekatan Anda dalam menangani konflik interpersonal antar anggota tim atau penurunan kepuasan kerja (employee engagement) di organisasi?',
        criteria: 'Komunikasi empatik, mediasi netral, dan penyusunan inisiatif retensi karyawan berkelanjutan.'
      }
    ];
  } else {
    // Default: Software Engineering & IT
    domainTitle = 'Wawancara Teknis & Rekayasa Sistem (Software & Tech)';
    domainDescription = 'Fokus pada arsitektur perangkat lunak, stack teknologi, skalabilitas, dan penanganan masalah teknis.';
    domainQuestions = [
      {
        id: 'tech-1',
        question: 'Pilihlah salah satu proyek unggulan di CV Anda: Jelaskan arsitektur teknisnya, mengapa Anda memilih stack teknologi tersebut, dan trade-off apa yang Anda hadapi?',
        criteria: 'Pemahaman mendalam tentang stack teknologi, alasan desain (design decisions), state management, dan arsitektur data.'
      },
      {
        id: 'tech-2',
        question: 'Bagaimana strategi Anda dalam memastikan kualitas kode, keandalan sistem (testing/error handling), performa cepat, dan keamanan data sebelum meluncurkan aplikasi?',
        criteria: 'Testing methodology (Unit/Integration test), optimasi waktu muat, keamanan API, dan continuous deployment.'
      },
      {
        id: 'tech-3',
        question: 'Ceritakan pengalaman Anda saat mendiagnosis bug kritis atau penurunan performa sistem, dan bagaimana metodologi debugging Anda secara sistematis?',
        criteria: 'Metode investigasi log/tracing, profiling performa, isolasi masalah, dan implementasi solusi permanen.'
      }
    ];
  }

  // Personalisasi: kalau nama proyek asli terdeteksi dari CV, sisipkan langsung ke
  // pertanyaan teknis pertama supaya benar-benar merujuk proyek nyata kandidat,
  // bukan placeholder generik "salah satu proyek Anda".
  if (likelyProjectName && domainQuestions.length > 0) {
    const firstQ = domainQuestions[0];
    if (/^Pilihlah salah satu/i.test(firstQ.question)) {
      const rest = firstQ.question.replace(/^Pilihlah salah satu[^:]*:\s*/i, '');
      const restLower = rest.charAt(0).toLowerCase() + rest.slice(1);
      domainQuestions = [
        {
          ...firstQ,
          question: `Pada proyek **${likelyProjectName}** yang tercantum di CV Anda, ${restLower}`
        },
        ...domainQuestions.slice(1)
      ];
    }
  }

  return [
    {
      id: 'hr_behavioral',
      title: 'Wawancara HR & Perilaku (Behavioral)',
      description: 'Fokus pada kepribadian, kepemimpinan, manajemen konflik, kerja sama tim, dan adaptabilitas kerja.',
      questions: [
        {
          id: 'hr-1',
          question: 'Ceritakan situasi ketika Anda menghadapi perbedaan pendapat dengan rekan tim atau atasan dalam menyelesaikan target proyek, dan bagaimana cara Anda menyelesaikannya secara profesional?',
          criteria: 'Komunikasi asertif, empati, fokus pada solusi bersama tanpa konflik personal, dan berorientasi pada hasil.'
        },
        {
          id: 'hr-2',
          question: 'Ceritakan kegagalan atau kesalahan terbesar yang pernah Anda alami dalam pekerjaan/organisasi/proyek kampus dan langkah konkret apa yang Anda ambil untuk memperbaikinya?',
          criteria: 'Kejujuran (self-awareness), akuntabilitas, dan tindakan perbaikan nyata (growth mindset).'
        },
        {
          id: 'hr-3',
          question: 'Bagaimana cara Anda memprioritaskan tugas ketika menghadapi beberapa pekerjaan mendesak dengan tenggat waktu bersamaan?',
          criteria: 'Manajemen waktu sistematis (Eisenhower Matrix / Time-blocking), komunikasi proaktif, dan kemampuan delegasi.'
        }
      ]
    },
    {
      id: 'technical_domain',
      title: domainTitle,
      description: domainDescription,
      questions: domainQuestions
    },
    {
      id: 'motivation_culture',
      title: 'Motivasi, Visi Karier & Culture Fit',
      description: 'Fokus pada alasan melamar, nilai personal, motivasi intrinsik, dan rencana kontribusi jangka panjang.',
      questions: [
        {
          id: 'fit-1',
          question: `Mengapa Anda tertarik berkarir di bidang ${metadata.detectedMajor || 'ini'} dan apa nilai unik (unique selling point) yang membedakan Anda dari kandidat lulusan baru lainnya?`,
          criteria: 'Value proposition yang jelas, keunikan keahlian praktis di CV, dan pemahaman terhadap tren lanskap industri.'
        },
        {
          id: 'fit-2',
          question: 'Di mana Anda melihat perkembangan karier profesional Anda dalam 3 hingga 5 tahun ke depan, dan langkah nyata apa yang sedang Anda siapkan saat ini?',
          criteria: 'Ambisi realistis, komitmen terhadap pertumbuhan organisasi, dan rencana peningkatan kompetensi berkelanjutan.'
        }
      ]
    }
  ];
}

// Default export for backward compatibility
export const INTERVIEW_TRACKS = getInterviewTracksForCandidate();

/* ===================================================================
 * STAR Answer Evaluation — direvisi total.
 *
 * Masalah versi lama: base score mulai dari 5.5 (nyaris lulus) SEBELUM
 * jawaban dinilai sama sekali, dan jawaban pendek/ngawur cuma dipaksa
 * `Math.min(score, 5.2)` — bukan benar-benar dihukum. Akibatnya semua
 * jawaban buruk "mendarat" di angka yang sama (5.2) berapa pun kadar
 * ke-ngawurannya, dan jawaban ngawur yang kebetulan memuat kata kunci
 * ("target", "%", "berhasil") bisa lolos dengan skor lumayan tanpa
 * benar-benar menjawab pertanyaan.
 *
 * Perbaikan: skor dimulai dari basis RENDAH dan harus benar-benar
 * "diperjuangkan" lewat elemen STAR yang terdeteksi, ditambah deteksi
 * jawaban ngawur/spam (rasio huruf vokal, keberagaman kata) dan
 * pengecekan relevansi kasar terhadap pertanyaan yang diajukan.
 * =================================================================== */

const ID_STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'adalah', 'ini', 'itu',
  'saya', 'anda', 'akan', 'atau', 'juga', 'bisa', 'dapat', 'tidak', 'ada', 'sebagai',
  'dalam', 'oleh', 'saat', 'ketika', 'karena', 'agar', 'jika', 'maka', 'lebih', 'sangat',
  'sudah', 'belum', 'masih', 'harus', 'saja', 'pun', 'nya', 'kami', 'kita', 'mereka', 'ia', 'dia', 'apa'
]);

function tokenizeWords(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Deteksi jawaban ngawur/spam/asal ketik menggunakan beberapa sinyal murah
 * (tanpa perlu model bahasa): rasio huruf vokal, keberagaman kata, panjang
 * kata rata-rata, dan proporsi kata yang "terlihat seperti kata sungguhan".
 */
function detectGibberish(answer, wordsArr) {
  if (wordsArr.length === 0) return true;

  const letters = answer.toLowerCase().replace(/[^a-z]/g, '');
  const vowels = (letters.match(/[aeiou]/g) || []).length;
  const vowelRatio = letters.length > 0 ? vowels / letters.length : 0;

  const uniqueWords = new Set(wordsArr);
  const diversityRatio = uniqueWords.size / wordsArr.length;

  const avgWordLen = wordsArr.reduce((a, w) => a + w.length, 0) / wordsArr.length;

  const looksLikeRealWord = (w) => /[aeiou]/.test(w) && !/(.)\1{3,}/.test(w);
  const validRatio = wordsArr.filter(looksLikeRealWord).length / wordsArr.length;

  return (
    vowelRatio < 0.25 ||
    diversityRatio < 0.35 ||
    avgWordLen > 14 ||
    validRatio < 0.5
  );
}

/** Perkiraan kasar relevansi jawaban terhadap kata kunci penting di pertanyaan. */
function computeRelevance(questionText, answerWords) {
  const qWords = tokenizeWords(questionText).filter(w => !ID_STOPWORDS.has(w));
  if (qWords.length === 0) return 0.5;
  const qSet = new Set(qWords);
  const overlap = answerWords.filter(w => qSet.has(w)).length;
  return Math.min(1, overlap / Math.max(4, qSet.size * 0.3));
}

function buildPolishedAnswer(metadata, questionText = '') {
  const major = metadata.detectedMajor || 'bidang profesional saya';
  const skillsList = metadata.extractedSkills?.length ? metadata.extractedSkills : ['analisis terstruktur'];
  const skillA = skillsList[0];
  const skillB = skillsList[1] || skillsList[0];

  // Beberapa variasi kalimat untuk tiap elemen STAR. Sebelumnya cuma ada 1 template
  // tetap (cuma ganti nama bidang & 1 skill), sehingga jawaban dari CV manapun terasa
  // identik. Sekarang dipilih dari beberapa opsi berdasarkan konten pertanyaan + profil
  // kandidat, supaya hasilnya benar-benar bervariasi antar kandidat/pertanyaan berbeda.
  const openings = [
    `Dalam pengalaman saya di bidang ${major}, saya pernah menghadapi situasi serupa saat mengerjakan sebuah proyek dengan tenggat yang cukup ketat.`,
    `Saat menjalani peran di bidang ${major}, saya pernah dihadapkan pada tantangan yang menuntut solusi cepat namun tetap terukur.`,
    `Salah satu pengalaman relevan saya adalah ketika terlibat dalam sebuah inisiatif di bidang ${major} yang membutuhkan koordinasi erat dengan tim.`
  ];

  const tasks = [
    `Tugas utama saya saat itu adalah memastikan target kualitas dan waktu tetap tercapai meski sumber daya terbatas.`,
    `Saya bertanggung jawab menuntaskan kendala tersebut sembari menjaga standar kerja yang sudah disepakati tim.`,
    `Peran saya adalah memimpin penyelesaian masalah tersebut, baik dari sisi teknis maupun koordinasi dengan pemangku kepentingan terkait.`
  ];

  const actions = [
    `Saya mengambil inisiatif dengan menerapkan pendekatan ${skillA}, memecah masalah menjadi tahapan-tahapan kecil, dan berkoordinasi rutin dengan tim agar progres tetap sesuai rencana.`,
    `Saya menyusun rencana aksi sistematis dengan memanfaatkan ${skillA} dan ${skillB}, lalu melakukan iterasi cepat berdasarkan masukan dari rekan kerja maupun atasan.`,
    `Saya memanfaatkan keahlian ${skillA} untuk menganalisis akar masalah, kemudian mengimplementasikan solusi secara bertahap sambil terus mengonsolidasikan umpan balik dari tim.`
  ];

  const results = [
    `Hasilnya, target berhasil dicapai tepat waktu dengan peningkatan efisiensi kerja sekitar 20-25%, dan mendapat apresiasi positif dari atasan maupun tim.`,
    `Sebagai hasilnya, masalah terselesaikan lebih cepat dari perkiraan awal, dan pendekatan ini kemudian dijadikan acuan untuk kasus serupa berikutnya.`,
    `Dampaknya terlihat jelas dari peningkatan kualitas output serta bertambahnya kepercayaan tim terhadap proses kerja yang saya usulkan.`
  ];

  // Hash sederhana dari pertanyaan + profil kandidat, supaya pemilihan variasi konsisten
  // untuk kombinasi yang sama tapi berbeda-beda antar pertanyaan/kandidat lain.
  const seedSource = `${questionText}|${major}|${skillA}|${skillB}`;
  let seed = 0;
  for (let i = 0; i < seedSource.length; i++) {
    seed = (seed * 31 + seedSource.charCodeAt(i)) >>> 0;
  }

  const opening = openings[seed % openings.length];
  const task = tasks[Math.floor(seed / 7) % tasks.length];
  const action = actions[Math.floor(seed / 13) % actions.length];
  const result = results[Math.floor(seed / 29) % results.length];

  return `${opening} ${task} ${action} ${result}`;
}

export function evaluateUserAnswer(questionText, userAnswer, metadata = {}) {
  const answer = (userAnswer || '').trim();
  const answerWords = tokenizeWords(answer);
  const wordCount = answer ? answer.split(/\s+/).filter(Boolean).length : 0;
  const lower = answer.toLowerCase();

  const starChecklist = { situation: false, task: false, action: false, result: false };

  // --- Jawaban kosong ---
  if (wordCount === 0) {
    return {
      score: 0,
      wordCount: 0,
      starChecklist,
      feedbackPoints: ['Anda belum menjawab pertanyaan ini. Sampaikan minimal konteks situasi dan tindakan konkret yang Anda ambil.'],
      polishedAnswer: buildPolishedAnswer(metadata, questionText)
    };
  }

  // --- Jawaban ngawur/spam/tidak nyambung: dihukum tegas, tidak lagi "mentok" di satu angka tetap ---
  const isGibberish = detectGibberish(answer, answerWords);
  const relevance = computeRelevance(questionText, answerWords);

  if (isGibberish || (wordCount >= 6 && relevance < 0.08)) {
    const lowScore = Math.round(Math.max(1.0, Math.min(2.4, relevance * 4)) * 10) / 10;
    return {
      score: lowScore,
      wordCount,
      starChecklist,
      feedbackPoints: [
        'Jawaban tidak dapat dinilai secara STAR karena tidak tersusun sebagai kalimat yang bermakna atau tidak relevan dengan pertanyaan yang diajukan.',
        'Coba jelaskan dengan kalimat lengkap: situasi nyata yang dihadapi, tugas/tanggung jawab Anda, tindakan konkret yang diambil, dan hasil yang dicapai.'
      ],
      polishedAnswer: buildPolishedAnswer(metadata, questionText)
    };
  }

  // --- Penilaian sesungguhnya: mulai dari basis rendah, poin harus "diperjuangkan" ---
  let score = 2.2;
  const feedbackPoints = [];

  if (lower.includes('ketika') || lower.includes('saat itu') || lower.includes('situasi') || lower.includes('proyek') || lower.includes('pada saat') || lower.includes('di perusahaan') || lower.includes('di kampus')) {
    starChecklist.situation = true;
    score += 1.4;
  }
  if (lower.includes('tanggung jawab') || lower.includes('tugas saya') || lower.includes('tantangan') || lower.includes('masalah yang dihadapi') || lower.includes('target') || lower.includes('peran saya')) {
    starChecklist.task = true;
    score += 1.4;
  }
  if (lower.includes('saya melakukan') || lower.includes('inisiatif') || lower.includes('mengembangkan') || lower.includes('merancang') || lower.includes('langkah saya') || lower.includes('menganalisis') || lower.includes('mengimplementasikan') || lower.includes('berkoordinasi')) {
    starChecklist.action = true;
    score += 1.6;
  }
  if (lower.includes('hasilnya') || lower.includes('berhasil') || lower.includes('meningkat') || lower.includes('sebesar') || lower.includes('%') || lower.includes('dampak') || lower.includes('mencapai') || lower.includes('efisiensi')) {
    starChecklist.result = true;
    score += 1.7;
  }

  // Relevansi rendah terhadap pertanyaan: turunkan skor sungguhan, bukan cuma di-cap
  if (relevance < 0.15) {
    score -= 2.0;
    feedbackPoints.push('Jawaban terasa kurang menjawab inti pertanyaan yang diajukan — pastikan Anda merespons langsung konteks yang ditanyakan pewawancara.');
  }

  // Panjang jawaban
  if (wordCount < 15) {
    score -= 1.5;
    feedbackPoints.push('Jawaban terlalu ringkas untuk dinilai lengkap. Ceritakan konteks proyek nyata dan tindakan spesifik yang Anda ambil.');
  } else if (wordCount >= 40 && wordCount <= 160) {
    score += 0.4;
    feedbackPoints.push('Panjang jawaban sangat proporsional dan mudah dipahami oleh pewawancara.');
  } else if (wordCount > 220) {
    feedbackPoints.push('Jawaban cukup panjang; upayakan lebih fokus pada inti tindakan (Action) dan hasil akhir (Result).');
  }

  const completedCount = Object.values(starChecklist).filter(Boolean).length;
  if (completedCount === 4) {
    feedbackPoints.push('Struktur STAR lengkap: Anda mencakup Situation, Task, Action, dan Result dengan sangat jelas.');
  } else if (completedCount === 0) {
    feedbackPoints.push('Belum ada elemen STAR (Situation, Task, Action, Result) yang jelas terdeteksi pada jawaban ini.');
  } else if (!starChecklist.result) {
    feedbackPoints.push('Saran Penting: Tambahkan hasil akhir terukur (misal: persentase peningkatan, waktu penghematan, atau feedback tim).');
  }

  score = Math.min(9.6, Math.max(1.0, Math.round(score * 10) / 10));

  return {
    score,
    wordCount,
    starChecklist,
    feedbackPoints,
    polishedAnswer: buildPolishedAnswer(metadata, questionText)
  };
}