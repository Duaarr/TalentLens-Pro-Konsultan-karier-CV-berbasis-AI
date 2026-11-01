/**
 * ATS (Applicant Tracking System) Evaluation & Scoring Engine
 */

export function calculateATSScore(cvText, metadata = {}) {
  const text = (cvText || '').trim();
  const lower = text.toLowerCase();
  const words = text ? text.split(/\s+/).length : 0;
  const major = metadata.detectedMajor || 'Akademik';

  // Breakdown sub-scores (0-100 each)
  const breakdown = {
    contactInfo: 0,
    sectionCompleteness: 0,
    quantifiableMetrics: 0,
    skillsDepth: 0,
    formattingATS: 0,
  };

  const strengths = [];
  const improvements = [];
  const checklist = [];

  // 1. Contact Info check (20% weight)
  let contactScore = 0;
  if (metadata.email) {
    contactScore += 35;
    checklist.push({ item: 'Alamat Email Profesional Terdeteksi', status: 'pass' });
  } else {
    checklist.push({ item: 'Alamat Email Profesional', status: 'fail' });
    improvements.push({
      area: 'Informasi Kontak',
      issue: 'Alamat email tidak ditemukan atau tidak berformat standar.',
      solution: 'Cantumkan email resmi dengan nama lengkap di bagian header.',
      example: 'nama.lengkap@email.com'
    });
  }

  if (metadata.phone) {
    contactScore += 30;
    checklist.push({ item: 'Nomor Telepon / WhatsApp Aktif', status: 'pass' });
  } else {
    checklist.push({ item: 'Nomor Telepon / WhatsApp Aktif', status: 'fail' });
    improvements.push({
      area: 'Nomor Kontak',
      issue: 'Nomor telepon seluler tidak terdeteksi pada header dokumen.',
      solution: 'Sertakan nomor kontak aktif dengan kode negara.',
      example: '+62 812-xxxx-xxxx'
    });
  }

  if (metadata.linkedIn || metadata.github || lower.includes('linkedin.com') || lower.includes('github.com')) {
    contactScore += 35;
    checklist.push({ item: 'Tautan Profil Profesional (LinkedIn / Portofolio)', status: 'pass' });
    strengths.push({
      title: 'Tautan Profil Profesional Lengkap',
      detail: 'Mencantumkan tautan daring yang memudahkan recruiter memverifikasi rekam jejak dan portofolio.'
    });
  } else {
    checklist.push({ item: 'Tautan Profil Profesional (LinkedIn/GitHub/Portofolio)', status: 'warning' });
    improvements.push({
      area: 'Tautan Portofolio Daring',
      issue: 'Belum mencantumkan link profil LinkedIn atau repositori karya daring.',
      solution: 'Sertakan tautan LinkedIn dan link portofolio di bawah identitas diri.',
      example: 'linkedin.com/in/namakandidat | portofolio.dev'
    });
  }
  breakdown.contactInfo = Math.min(100, contactScore);

  // 2. Section Completeness check (25% weight)
  const essentialSections = [
    { name: 'Pendidikan', found: metadata.detectedSections?.includes('Pendidikan') || lower.includes('pendidikan') || lower.includes('education') },
    { name: 'Pengalaman Kerja / Magang', found: metadata.detectedSections?.includes('Pengalaman Kerja & Magang') || lower.includes('pengalaman') || lower.includes('experience') },
    { name: 'Keahlian / Skills', found: metadata.detectedSections?.includes('Keahlian & Tools') || lower.includes('skill') || lower.includes('keahlian') || lower.includes('kemampuan') },
    { name: 'Proyek Unggulan / Portofolio', found: metadata.detectedSections?.includes('Proyek & Karya') || lower.includes('proyek') || lower.includes('project') || lower.includes('karya') },
    { name: 'Sertifikasi / Lisensi', found: metadata.detectedSections?.includes('Sertifikasi') || lower.includes('sertifikasi') || lower.includes('certification') || lower.includes('pelatihan') }
  ];

  const foundCount = essentialSections.filter(s => s.found).length;
  breakdown.sectionCompleteness = Math.round((foundCount / essentialSections.length) * 100);

  essentialSections.forEach(sec => {
    checklist.push({
      item: `Bagian ${sec.name}`,
      status: sec.found ? 'pass' : 'warning'
    });
  });

  if (foundCount >= 4) {
    strengths.push({
      title: 'Struktur Bagian Komprehensif',
      detail: `Memuat ${foundCount} dari 5 struktur bagian standar yang disyaratkan algoritma ATS industri.`
    });
  } else {
    improvements.push({
      area: 'Kelengkapan Bagian Dokumen',
      issue: 'Beberapa bagian penting seperti Proyek atau Sertifikasi belum terpisah secara tegas.',
      solution: 'Gunakan judul bagian standar dengan huruf kapital yang jelas.',
      example: 'PENDIDIKAN, PENGALAMAN KERJA, PROYEK UTAMA, KEAHLIAN & TOOLS'
    });
  }

  // 3. Quantifiable Metrics & Action Verbs (25% weight)
  const actionVerbs = [
    // General & Leadership
    'memimpin', 'mengelola', 'mengarahkan', 'menginisiasi', 'mengoordinasikan', 'led', 'managed', 'coordinated',
    // Tech & Engineering
    'mengembangkan', 'merancang', 'membangun', 'mengimplementasikan', 'mengintegrasikan', 'mendeploy', 'developed', 'designed', 'built', 'engineered',
    // Business & Marketing
    'meningkatkan', 'mengoptimalkan', 'mempromosikan', 'mengakuisisi', 'menegosiasikan', 'meriset', 'increased', 'optimized', 'negotiated', 'promoted',
    // Data & Finance
    'menganalisis', 'mengevaluasi', 'memodelkan', 'mengaudit', 'memproyeksikan', 'analyzed', 'evaluated', 'modeled', 'audited'
  ];

  let actionVerbCount = 0;
  actionVerbs.forEach(v => {
    if (lower.includes(v)) actionVerbCount++;
  });

  const metricMatches = text.match(/\d+(\s*%|\s*user|\s*pengguna|\s*mahasiswa|\s*klien|\s*brand|\s*juta|\s*milyar|\s*kali|\s*rps|\s*idr|\s*responden|\s*merchant|\s*transaksi)/gi) || [];
  let metricScore = 40;
  if (metricMatches.length > 0) metricScore += 30;
  if (metricMatches.length >= 3) metricScore += 25;
  if (actionVerbCount >= 4) metricScore = Math.min(100, metricScore + 10);
  breakdown.quantifiableMetrics = Math.min(100, metricScore);

  if (metricMatches.length >= 2) {
    strengths.push({
      title: 'Dampak Kuantitatif Terukur (STAR/XYZ)',
      detail: `Terdeteksi ${metricMatches.length} metrik berbasis angka/persentase yang membuktikan dampak nyata pekerjaan.`
    });
    checklist.push({ item: 'Metrik Kuantitatif & Dampak Hasil', status: 'pass' });
  } else {
    checklist.push({ item: 'Metrik Kuantitatif & Dampak Hasil', status: 'fail' });
    
    let exampleMetric = 'Meningkatkan konversi kampanye sebesar 22% dan mengelola 30+ kolaborasi mitra.';
    if (lower.includes('informatika') || lower.includes('software') || lower.includes('react')) {
      exampleMetric = 'Meningkatkan kecepatan loading web sebesar 35% dan mendukung 50.000+ pengguna aktif.';
    } else if (lower.includes('data') || lower.includes('statistika')) {
      exampleMetric = 'Mengotomatisasi ETL 2.000.000+ baris data dan membangun model prediksi dengan akurasi 92%.';
    }

    improvements.push({
      area: 'Deskripsi Berorientasi Hasil (Formula Google XYZ)',
      issue: 'Deskripsi pengalaman masih dominan daftar tugas harian tanpa angka pencapaian.',
      solution: 'Terapkan rumus: "Mencapai [X], yang diukur dengan [Y], melalui tindakan [Z]".',
      example: exampleMetric
    });
  }

  // 4. Skills Depth check (20% weight)
  const skillCount = metadata.extractedSkills?.length || 0;
  let skillsScore = Math.min(100, Math.round((skillCount / 7) * 100));
  breakdown.skillsDepth = skillsScore;

  if (skillCount >= 5) {
    strengths.push({
      title: 'Variasi Kata Kunci Industri Teruji',
      detail: `Terdapat ${skillCount} kata kunci industri spesifik (${metadata.extractedSkills.slice(0, 4).join(', ')}) yang cocok dengan pemindaian HR.`
    });
    checklist.push({ item: 'Kepadatan Kata Kunci Keahlian (Keywords)', status: 'pass' });
  } else {
    checklist.push({ item: 'Kepadatan Kata Kunci Keahlian', status: 'warning' });
    improvements.push({
      area: 'Daftar Keahlian Spesifik',
      issue: 'Jumlah kata kunci alat dan keahlian teknis masih terbatas.',
      solution: 'Tambahkan tools industri, perangkat lunak, dan metodologi yang Anda kuasai.',
      example: 'Tools: Google Analytics, Meta Ads, Excel Pivot, SQL, Figma, Git'
    });
  }

  // 5. Formatting & Length (10% weight)
  let formatScore = 80;
  if (words >= 250 && words <= 850) {
    formatScore = 95;
    checklist.push({ item: 'Panjang Dokumen Ideal (1-2 Halaman / 300-800 kata)', status: 'pass' });
  } else if (words < 250) {
    formatScore = 60;
    checklist.push({ item: 'Panjang Dokumen (Terlalu Ringkas)', status: 'warning' });
  } else {
    formatScore = 75;
    checklist.push({ item: 'Panjang Dokumen (>850 kata)', status: 'warning' });
  }
  breakdown.formattingATS = formatScore;

  // Overall Weighted Score calculation
  const overallScore = Math.round(
    breakdown.contactInfo * 0.20 +
    breakdown.sectionCompleteness * 0.25 +
    breakdown.quantifiableMetrics * 0.25 +
    breakdown.skillsDepth * 0.20 +
    breakdown.formattingATS * 0.10
  );

  let gradeDescription = 'Sangat Siap & Kompetitif';
  let badgeColor = 'emerald';
  if (overallScore < 60) {
    gradeDescription = 'Perlu Revisi Signifikan';
    badgeColor = 'rose';
  } else if (overallScore < 75) {
    gradeDescription = 'Cukup Baik - Butuh Optimasi';
    badgeColor = 'amber';
  } else if (overallScore < 88) {
    gradeDescription = 'Baik & Layak Dilamar';
    badgeColor = 'blue';
  }

  return {
    overallScore,
    gradeDescription,
    badgeColor,
    breakdown,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    checklist,
    wordCount: words,
    actionVerbCount,
    metricCount: metricMatches.length
  };
}
