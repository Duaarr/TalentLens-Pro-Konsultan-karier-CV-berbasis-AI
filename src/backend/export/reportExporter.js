/**
 * Report Exporter for Career Consultation & ATS Audit
 */

export function exportReportToMarkdown({ cvData, atsScore, careerMatch, messages }) {
  const meta = cvData?.metadata || {};
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let md = `# LAPORAN KONSULTASI KARIER & AUDIT ATS
**Platform:** KarierPath AI  
**Tanggal:** ${dateStr}  
**Kandidat:** ${meta.nameCandidate || 'Mahasiswa'}  
**Latar Belakang:** ${meta.detectedMajor || '-'} (${meta.detectedUniversity || '-'})  

---

## 1. IKHTISAR SKOR KESEHATAN ATS
- **Skor Total ATS:** **${atsScore?.overallScore || 0}/100** (${atsScore?.gradeDescription || '-'})
- **Kelengkapan Kontak:** ${atsScore?.breakdown?.contactInfo || 0}/100
- **Struktur Bagian:** ${atsScore?.breakdown?.sectionCompleteness || 0}/100
- **Dampak Kuantitatif & Kata Kerja Aksi:** ${atsScore?.breakdown?.quantifiableMetrics || 0}/100
- **Kedalaman Keahlian Industri:** ${atsScore?.breakdown?.skillsDepth || 0}/100
- **Kesesuaian Format Dokumen:** ${atsScore?.breakdown?.formattingATS || 0}/100

### Poin Kekuatan CV
${atsScore?.strengths?.map(s => `- **${s.title}:** ${s.detail}`).join('\n') || '- Dokumen terstruktur'}

### Rekomendasi Perbaikan Prioritas
${atsScore?.improvements?.map(i => `- **${i.area}:** ${i.issue} -> *${i.solution}*`).join('\n') || '- Lengkapi portofolio'}

---

## 2. REKOMENDASI PEMETAAN KARIER
${careerMatch?.roles?.slice(0, 3).map((r, idx) => `
### ${idx + 1}. ${r.roleName} (Match: ${r.matchPercentage}%)
- **Estimasi Gaji:** ${r.salaryRange}
- **Keahlian Selaras:** ${r.matchedSkills.join(', ')}
- **Skill yang Perlu Dipelajari:** ${r.missingSkills.join(', ')}
- **Peluang Industri:** ${r.industry}
`).join('') || ''}

---

## 3. CATATAN KONSULTASI AI
`;

  messages.filter(m => !m.isWelcome && !m.isError).forEach(m => {
    const roleLabel = m.role === 'user' ? 'Pertanyaan Mahasiswa' : 'Saran Konsultan AI';
    md += `\n### [${roleLabel}]\n${m.content}\n\n---`;
  });

  return md;
}

export function downloadFile(content, fileName, mimeType = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
