/**
 * Client-Side Semantic RAG Synthesis Engine
 * Provides rich, analytical career consultation even when offline or without API keys.
 */
import { SemanticRAGIndexer } from './semanticRetriever';
import { extractMetadata } from '../parsers/metadataExtractor';
import { calculateATSScore } from '../analysis/atsScorer';
import { matchCareerRoles } from '../analysis/careerMatcher';

export function generateRAGConsultantResponse(prompt, cvText, metadata = {}) {
  const meta = Object.keys(metadata).length > 0 ? metadata : extractMetadata(cvText);
  const indexer = new SemanticRAGIndexer(cvText);
  const relevantChunks = indexer.search(prompt, 2);
  const lowerPrompt = (prompt || '').toLowerCase();
  const atsResult = calculateATSScore(cvText, meta);
  const careerResult = matchCareerRoles(cvText, meta);

  // 1. INTENT: Career / Job Matching
  if (
    lowerPrompt.includes('pekerjaan') || 
    lowerPrompt.includes('cocok') || 
    lowerPrompt.includes('jalur karier') || 
    lowerPrompt.includes('posisi') || 
    lowerPrompt.includes('rekomendasi karier') ||
    lowerPrompt.includes('magang')
  ) {
    return generateJobMatchSection(meta, careerResult);
  }

  // 2. INTENT: CV Critique / ATS Evaluation
  if (
    lowerPrompt.includes('kurang') || 
    lowerPrompt.includes('kelemahan') || 
    lowerPrompt.includes('evaluasi') || 
    lowerPrompt.includes('ats') || 
    lowerPrompt.includes('perbaiki') || 
    lowerPrompt.includes('review')
  ) {
    return generateCVEvaluationSection(meta, atsResult);
  }

  // 3. INTENT: Elevator Pitch / Interview Self-Intro
  if (
    lowerPrompt.includes('perkenalan') || 
    lowerPrompt.includes('pitch') || 
    lowerPrompt.includes('wawancara') || 
    lowerPrompt.includes('interview') ||
    lowerPrompt.includes('star')
  ) {
    return generateElevatorPitchSection(meta);
  }

  // 4. INTENT: Certification & Skills
  if (
    lowerPrompt.includes('sertifikasi') || 
    lowerPrompt.includes('kursus') || 
    lowerPrompt.includes('pelatihan') || 
    lowerPrompt.includes('skill') || 
    lowerPrompt.includes('belajar')
  ) {
    return generateCertificationSection(meta, careerResult);
  }

  // 5. INTENT: Cover Letter
  if (
    lowerPrompt.includes('surat lamaran') || 
    lowerPrompt.includes('cover letter') || 
    lowerPrompt.includes('email lamaran')
  ) {
    return generateCoverLetterSection(meta);
  }

  // Default Diagnostic
  return generateGeneralRAGDiagnostic(meta, relevantChunks, atsResult, careerResult);
}

function generateJobMatchSection(meta, careerResult) {
  const topRole = careerResult.roles[0];
  const secondRole = careerResult.roles[1];
  const thirdRole = careerResult.roles[2];

  return `### Rekomendasi Pemetaan Jalur Karier untuk **${meta.nameCandidate}**

Berdasarkan analisis semantik dokumen terhadap latar belakang **${meta.detectedMajor}** dan ${meta.extractedSkills.length} keahlian yang terdeteksi, berikut rekomendasi posisi yang paling selaras:

---

#### 1. **${topRole.roleName}**
* **Kesesuaian Profil (Match Rate):** **${topRole.matchPercentage}%**
* **Keahlian Selaras di CV:** ${topRole.matchedSkills.join(', ') || 'Keahlian Inti'}
* **Keahlian yang Disarankan untuk Dipelajari:** ${topRole.missingSkills.slice(0, 3).join(', ')}
* **Estimasi Rentang Gaji (Indonesia):** ${topRole.salaryRange}
* **Rasional Analisis:** ${topRole.rationale}

#### 2. **${secondRole.roleName}**
* **Kesesuaian Profil:** **${secondRole.matchPercentage}%**
* **Keahlian Selaras:** ${secondRole.matchedSkills.join(', ') || 'Analisis & Kolaborasi'}
* **Peluang Industri:** ${secondRole.industry}

#### 3. **${thirdRole.roleName}**
* **Kesesuaian Profil:** **${thirdRole.matchPercentage}%**
* **Langkah Akselerasi:** Lengkapi portofolio dengan proyek terukur.

---

**Saran Langkah Aksi:**
1. Cantumkan kata kunci peran utama (*${topRole.roleName}*) pada ringkasan profesional CV Anda.
2. Tambahkan 1 proyek studi kasus yang memperlihatkan penguasaan *${topRole.missingSkills[0] || 'tools industri'}*.`;
}

function generateCVEvaluationSection(meta, atsResult) {
  return `### Evaluasi Kesehatan & Kepatuhan ATS CV: **${meta.nameCandidate}**

**Skor Kepatuhan ATS:** **${atsResult.overallScore}/100** (${atsResult.gradeDescription})

---

#### **Kekuatan Utama CV:**
${atsResult.strengths.map(s => `* **${s.title}:** ${s.detail}`).join('\n')}

---

#### **Poin Rekomendasi Perbaikan Prioritas:**
${atsResult.improvements.map((imp, idx) => `
${idx + 1}. **${imp.area}**
   * *Temuan:* ${imp.issue}
   * *Saran Formula:* **${imp.solution}**
   * *Contoh Implementasi:* \`${imp.example}\`
`).join('')}

---

**Catatan Standar Format ATS:**
* Gunakan tata letak satu kolom bersih tanpa tabel multi-layer.
* Pastikan seluruh tautan (LinkedIn, GitHub, Portofolio) aktif dan dapat diklik.`;
}

function generateElevatorPitchSection(meta) {
  const skill1 = meta.extractedSkills[0] || 'analisis mendalam';
  const skill2 = meta.extractedSkills[1] || 'eksekusi proyek yang terstruktur';

  return `### Naskah Perkenalan Diri (Elevator Pitch) untuk **${meta.nameCandidate}**

Gunakan struktur **STAR (Situation, Task, Action, Result)** yang ringkas saat wawancara:

---

#### **Versi Bahasa Indonesia (~60 Detik):**
> "Selamat pagi/siang Bapak/Ibu. Perkenalkan nama saya **${meta.nameCandidate}**, lulusan dari bidang **${meta.detectedMajor}**${meta.detectedUniversity ? ' di ' + meta.detectedUniversity : ''}.
>
> Selama perkuliahan dan pengalaman praktis, saya mendalami kompetensi dalam **${skill1}** serta **${skill2}**. Saya memiliki pengalaman memimpin inisiatif proyek nyata dan terbiasa bekerja dengan pendekatan terukur.
>
> Saya tertarik melamar posisi ini karena komitmen perusahaan terhadap inovasi dan keunggulan eksekusi, dan saya yakin kesiapan teknis serta kemampuan adaptasi saya dapat memberi nilai tambah langsung bagi tim."

---

#### **Versi Bahasa Inggris:**
> "Good morning/afternoon. My name is **${meta.nameCandidate}**, with a background in **${meta.detectedMajor}**${meta.detectedUniversity ? ' from ' + meta.detectedUniversity : ''}.
>
> Throughout my academic journey and internship projects, I have developed strong hands-on capabilities in **${skill1}** and **${skill2}**, focusing on structured problem-solving and delivering measurable outcomes.
>
> I am very enthusiastic about joining this team to leverage my technical skills and proactive mindset toward achieving your organizational goals."`;
}

function generateCertificationSection(meta, careerResult) {
  const topRole = careerResult.roles[0];
  return `### Rekomendasi Sertifikasi & Program Pengembangan untuk **${meta.nameCandidate}**

Berdasarkan target karier **${topRole.roleName}** dan evaluasi keahlian saat ini, berikut sertifikasi kredibel berskala industri yang disarankan:

1. **Sertifikasi Standar Industri:**
   * **Google Career Certificates** (Coursera) – Validasi komprehensif untuk kesiapan kerja modern.
   * **AWS Certified / Microsoft Certified** – Bukti keahlian komputasi awan dan manajemen infrastruktur digital.

2. **Sertifikasi Spesialisasi Bidang ${meta.detectedMajor}:**
   * Program sertifikasi kompetensi terakreditasi BNSP atau platform global terkemuka.
   * Sertifikasi metodologi manajemen proyek (Scrum Master / Agile Fundamentals).

3. **Standardisasi Kemampuan Bahasa:**
   * **TOEFL ITP / IELTS Official** – Sangat dianjurkan untuk seleksi Program Management Trainee (MT) dan perusahaan multinasional.`;
}

function generateCoverLetterSection(meta) {
  return `### Draf Surat Lamaran Kerja Profesional

\`\`\`
Perihal: Lamaran Pekerjaan - [Nama Posisi yang Dilamar]

Kepada Yth.
Tim Rekrutmen / Human Resources
[Nama Perusahaan]
di Tempat

Dengan hormat,

Sehubungan dengan informasi lowongan pekerjaan untuk posisi [Nama Posisi yang Dilamar] di [Nama Perusahaan], saya yang bertanda tangan di bawah ini:

Nama               : ${meta.nameCandidate}
Pendidikan         : ${meta.detectedMajor} ${meta.detectedUniversity ? '– ' + meta.detectedUniversity : ''}
Email              : ${meta.email || 'email.kandidat@domain.com'}
Nomor Kontak       : ${meta.phone || '+62 8xx-xxxx-xxxx'}

Bermaksud untuk mengajukan diri bergabung dengan tim [Nama Perusahaan]. Melalui latar belakang pendidikan dan pengalaman proyek yang saya miliki di bidang ${meta.extractedSkills.slice(0, 4).join(', ')}, saya terbiasa menyelesaikan tantangan kerja secara sistematis dan berorientasi pada hasil yang terukur.

Saya meyakini kompetensi teknis, kemampuan berpikir kritis, serta etos kerja kolaboratif yang saya miliki dapat mendukung pencapaian target strategis perusahaan. Bersama surat ini, saya lampirkan dokumen Curriculum Vitae dan tautan portofolio untuk bahan pertimbangan Bapak/Ibu.

Besar harapan saya untuk memperoleh kesempatan wawancara agar dapat memaparkan kualifikasi dan motivasi saya secara lebih rinci. Atas perhatian dan kesempatan yang diberikan, saya sampaikan terima kasih.

Hormat saya,


${meta.nameCandidate}
\`\`\``;
}

function generateGeneralRAGDiagnostic(meta, relevantChunks, atsResult, careerResult) {
  let contextSnippet = '';
  if (relevantChunks.length > 0 && relevantChunks[0].similarityPercent > 40) {
    contextSnippet = `\n**Kutipan Dokumen Relevan Terdeteksi:**\n> "${relevantChunks[0].content.slice(0, 180)}..." *(Tingkat Relevansi: ${relevantChunks[0].similarityPercent}%)*\n`;
  }

  return `### Analisis Ringkasan Profil Konsultasi **${meta.nameCandidate}**

Data CV telah dipelajari dengan rincian profil sebagai berikut:

* **Kandidat:** \`${meta.nameCandidate}\`
* **Latar Belakang:** **${meta.detectedMajor}** ${meta.detectedUniversity ? `(${meta.detectedUniversity})` : ''}
* **Skor Kesehatan ATS:** **${atsResult.overallScore}/100**
* **Posisi Paling Sesuai:** **${careerResult.roles[0]?.roleName}** (${careerResult.roles[0]?.matchPercentage}% match)
* **Keahlian Terdata:** ${meta.extractedSkills.slice(0, 7).join(', ')}
${contextSnippet}
---

**Topik Konsultasi yang Dapat Anda Eksplorasi:**
* *"Pekerjaan apa yang paling cocok dengan skill dan pengalaman saya di CV ini?"*
* *"Apa kekurangan di CV saya yang perlu diperbaiki agar lolos sistem ATS?"*
* *"Buatkan teks perkenalan diri (elevator pitch) untuk wawancara kerja."*
* *"Simulasikan pertanyaan interview teknis dan HR berdasarkan CV ini."*`;
}
